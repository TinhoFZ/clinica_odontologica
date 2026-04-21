const conn = require('../db/conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buildPatientPayload } = require('../utils/payloadBuilder');
const { logAction, logRequest } = require('../utils/logger');

exports.registerPatient = (req, res) => {
    bcrypt.hash(req.body.password_hash, 10, (err, hash) => {
        if (err) {
            logAction({
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
                    action: 'ERROR_REGISTERING_PATIENT',
                    entityType: 'patient',
                    entityId: null,
                    status: 'ERROR'
                }); 
                return res.status(500).json({ error: "Error registering patient" });
            }
            logAction({
                action: 'PATIENT_REGISTERED',
                entityType: 'patient',
                entityId: result.insertId,
                status: 'SUCCESS'
            });
            const patient = { id: result.insertId };
            const payload = buildPatientPayload(patient);
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESS_IN });

            res.status(201).json({ 
                message: "Patient registered successfully", 
                patientId: result.insertId, 
                token 
            });
        });
    });
}