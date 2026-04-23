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
                status: 'DB_ERROR'
            });
            console.log(err);
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
                    status: 'DB_ERROR'
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
    SELECT patient_id, password_hash
    FROM patients
    WHERE cpf = ?
    `

    conn.query(sql, cpf, (err, data) => {
       
        if (err) {
            logAction({
                requestId: req.requestId,
                action: 'ERROR_AUTHENTICATING_PATIENT',
                entityType: 'patient',
                entityId: null,
                status: 'DB_ERROR'
            });
            console.log(err);
            return res.status(500).json({ error: "Error authenticating patient" });
        };


        if (data.length === 0) {
            logAction({
                requestId: req.requestId,
                action: 'PATIENT_NOT_FOUND',
                entityType: 'patient',
                entityId: null,
                status: 'USER_ERROR'
            });
            return res.status(404).json({ message: "Invalid credentials" });
        };

        const user = data[0];

        bcrypt.compare(password_hash, user.password_hash, (error, result) => {
            
            if (error) {
                logAction({
                    requestId: req.requestId,
                    action: 'ERROR_AUTHENTICATING_PATIENT',
                    entityType: 'patient',
                    entityId: user.patient_id,
                    status: 'DB_ERROR'
                });
                return res.status(401).json({ message: "Error authenticating patient"});
            };

            if (result) {
                logAction({
                    requestId: req.requestId,
                    action: 'PATIENT_AUTHENTICATED',
                    entityType: 'patient',
                    entityId: user.patient_id,
                    status: 'SUCCESS'
                });

                const patient = { patientId: user.patient_id }
                const payload = buildPatientPayload(patient);
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
                return res.status(200).json({ 
                    message: "Success authenticating patient",
                    patientId: user.patient_id,
                    token    
                });
            };

            logAction({
                requestId: req.requestId,
                action: 'INVALID_PASSWORD',
                entityType: 'patient',
                entityId: user.patient_id,
                status: 'USER_ERROR'
            });
            return res.status(401).json({ message: "Invalid credentials" });
        });
    });
}