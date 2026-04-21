const conn = require('../db/conn');
const { logAction, logRequest } = require('../utils/logger');

exports.registerPatient = (req, res) => {
    const { name, cpf, contact, adress, birth_date } = req.body;
    const sql = `
        INSERT INTO patients (name, cpf, contact, adress, birth_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    conn.query(sql, [name, cpf, contact, adress, birth_date], (err, result) => {
        if (err) {
            console.error("Error registering patient:", err);
            return res.status(500).json({ error: "Error registering patient" });
        }
        return res.status(201).json({ message: "Patient registered successfully" });
        console.log('req: ', req);
        console.log('req body: ', req.body);
        console.log('res: ', res);

        logAction({
            action: 'PATIENT_REGISTERED',
            entity_type: 'patient',
            entity_id: result.insertId
        });
    });
}