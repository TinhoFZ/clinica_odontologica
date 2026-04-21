const conn = require('../db/conn');
const { logAction, logRequest } = require('../utils/logger');

exports.registerDentist = (req, res) => {
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
                entityId: result ? result.insertId : null,
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
        res.status(201).json({ message: 'Dentist registered successfully', dentistId: result.insertId });
    });

}