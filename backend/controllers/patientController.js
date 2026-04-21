const conn = require('../db/conn');
const { logAction, logRequest } = require('../utils/logger');

exports.registerPatient = (req, res) => {
    const { name, cpf, email, phone_number, password_hash, address, birth_date } = req.body;
    const sql = `
        INSERT INTO patients (name, cpf, email, phone_number, password_hash, address, birth_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(sql, [name, cpf, email, phone_number, password_hash, address, birth_date], (err, result) => {
        if (err) {
            logAction({
                action: 'ERROR_REGISTERING_PATIENT',
                entityType: 'patient',
                entityId: result ? result.insertId : null,
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
        res.status(201).json({ message: "Patient registered successfully", patientId: result.insertId });
    });
}