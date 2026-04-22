const conn = require('../db/conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buildPatientPayload } = require('../utils/payloadBuilder');
const { logAction } = require('../utils/logAction');

exports.registerPatient = (req, res) => {
    bcrypt.hash(req.body.password_hash, 10, (err, hash) => {

        if (err) {
            logAction({
                requestId: req.requestId,
                action: 'ERROR_HASHING_PASSWORD',
                entityType: 'patient',
                entityId: null,
                status: 'ERROR'
            });
            return res.status(500).json({ error: "Error hashing password" });
        }
        
        const { name, cpf, email, phone_number, address, birth_date } = req.body;
        const sql = `
            INSERT INTO patients (name, cpf, email, phone_number, password_hash, address, birth_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        conn.query(sql, [name, cpf, email, phone_number, hash, address, birth_date], (err, result) => {
            if (err) {
                logAction({
                    requestId: req.requestId,
                    action: 'ERROR_REGISTERING_PATIENT',
                    entityType: 'patient',
                    entityId: null,
                    status: 'ERROR'
                });
                console.log(err);
                return res.status(500).json({ error: "Error registering patient" });
            }
            logAction({
                requestId: req.requestId,
                action: 'PATIENT_REGISTERED',
                entityType: 'patient',
                entityId: result.insertId,
                status: 'SUCCESS'
            });
            const patient = { id: result.insertId };
            const payload = buildPatientPayload(patient);
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(201).json({ 
                message: "Patient registered successfully", 
                patientId: result.insertId, 
                token 
            });
        });
    });
}

exports.loginPatient = (req, res) => {
    const { cpf, password_hash } = req.body;

    const sql = `
    SELECT id, password_hash
    FROM patients
    WHERE id_patient = ?
    `

    conn.query(sql, cpf, (err, result) => {
        bcrypt.compare(password_hash, result[0].password_hash, (err, result) => {
            console.log(result);
            console.error(err);
            if (err) {
                logAction({
                    requestId: req.requestId,
                    action: 'ERROR_AUTHENTICATING_PATIENT',
                    entityType: 'patient',
                    entityId: result.insertId,
                    status: 'ERROR'
                });
                return res.status(401).json({ message: "Error authenticating patient"});
            };
            if (result) {
                logAction({
                    requestId: req.requestId,
                    action: 'PATIENT_AUTHENTICATED',
                    entityType: 'patient',
                    entityId: result.insertId,
                    status: 'SUCCESS'
                });
                return res.status(200).json({ message: "Success authenticating patient"});
            };
            logAction({
                requestId: req.requestId,
                action: 'PATIENT_AUTHENTICATED',
                entityType: 'patient',
                entityId: result.insertId,
                status: 'SUCCESS'
            });
            
        });
    });
}