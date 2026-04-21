const conn = require('../db/conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buildDentistPayload } = require('../utils/payloadBuilder');
const { logAction, logRequest } = require('../utils/logger');

exports.registerDentist = (req, res) => {
    bcrypt.hash(req.body.password_hash, 10, (err, hash) => {
        if (err) {
            logAction({
                action: 'ERROR_HASHING_PASSWORD',
                entityType: 'dentist',
                entityId: null,
                status: 'ERROR'
            });
            return res.status(500).json({ error: "Error hashing password" });
        }

        const { name, cpf, cro, email, phone_number, password_hash, specialty } = req.body;
        const sql = `
            INSERT INTO dentists (name, cpf, cro, email, phone_number, password_hash, specialty)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        conn.query(sql, [name, cpf, cro, email, phone_number, password_hash, specialty], (err, result) => {
            if (err) {
                logAction({
                    action: 'ERROR_REGISTERING_DENTIST',
                    entityType: 'dentist',
                    entityId: null,
                    status: 'ERROR'
                });
                return res.status(500).json({ error: 'Error registering dentist' });
            }
            logAction({
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