const conn = require('../db/conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buildDentistPayload } = require('../utils/payloadBuilder');
const { logAction } = require('../utils/logAction');

exports.registerDentist = (req, res) => {
    bcrypt.hash(req.body.password_hash, 10, (err, hash) => {

        if (err) {
            logAction({
                requestId: req.requestId,
                action: 'ERROR_HASHING_PASSWORD',
                entityType: 'dentist',
                entityId: null,
                status: 'DB_ERROR'
            });
            console.log(err);
            return res.status(500).json({ error: "Error hashing password" });
        }

        const { name, cpf, cro, email, phone_number, specialty } = req.body;
        const sql = `
            INSERT INTO dentists (name, cpf, cro, email, phone_number, password_hash, specialty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        conn.query(sql, [name, cpf, cro, email, phone_number, hash, specialty], (err, result) => {
            if (err) {
                logAction({
                    requestId: req.requestId,
                    action: 'ERROR_REGISTERING_DENTIST',
                    entityType: 'dentist',
                    entityId: null,
                    status: 'DB_ERROR'
                });
                console.log(err);
                return res.status(500).json({ error: 'Error registering dentist' });
            }
            logAction({
                requestId: req.requestId,
                action: 'DENTIST_REGISTERED',
                entityType: 'dentist',
                entityId: result.insertId,
                status: 'SUCCESS'
            });
            const dentist = { id: result.insertId };
            const payload = buildDentistPayload(dentist);
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(201).json({ 
                message: 'Dentist registered successfully',
                dentistId: result.insertId,
                token 
            });
        });
    });
}

exports.loginDentist = (req, res) => {
    const { cpf, password_hash } = req.body;

    const sql = `
    SELECT dentist_id, password_hash
    FROM dentists
    WHERE cpf = ?
    `

    conn.query(sql, cpf, (err, data) => {
       
        if (err) {
            logAction({
                requestId: req.requestId,
                action: 'ERROR_AUTHENTICATING_DENTIST',
                entityType: 'dentist',
                entityId: null,
                status: 'DB_ERROR'
            });
            console.log(err);
            return res.status(500).json({ error: "Error authenticating dentist" });
        };


        if (data.length === 0) {
            logAction({
                requestId: req.requestId,
                action: 'DENTIST_NOT_FOUND',
                entityType: 'dentist',
                entityId: null,
                status: 'USER_ERROR'
            });
            return res.status(404).json({ message: "Invalid credentials" });
        };

        bcrypt.compare(password_hash, data[0].password_hash, (error, result) => {
            
            if (error) {
                logAction({
                    requestId: req.requestId,
                    action: 'ERROR_AUTHENTICATING_DENTIST',
                    entityType: 'dentist',
                    entityId: data[0].dentist_id,
                    status: 'DB_ERROR'
                });
                return res.status(401).json({ message: "Error authenticating dentist"});
            };
            if (result) {
                
                logAction({
                    requestId: req.requestId,
                    action: 'DENTIST_AUTHENTICATED',
                    entityType: 'dentist',
                    entityId: data[0].dentist_id,
                    status: 'SUCCESS'
                });
                return res.status(200).json({ message: "Success authenticating dentist"});
            };

            logAction({
                requestId: req.requestId,
                action: 'INVALID_PASSWORD',
                entityType: 'dentist',
                entityId: data[0].dentist_id,
                status: 'USER_ERROR'
            });
            return res.status(401).json({ message: "Invalid credentials" });
        });
    });
}