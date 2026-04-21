const conn = require('../db/conn');

function logAction({ entity_type, entity_id, action }) {
    const sql = `
        INSERT INTO action_logs (entity_type, entity_id, action)
        VALUES (?, ?, ?)
    `;

    conn.query(sql, [entity_type, entity_id, action], (err) => {
        if (err) {
            console.log('Error in action_log: ', err);
        };

        console.log('Action logged successfully');
    })
    
}

function logRequest(req) {
    const sql = `
        INSERT INTO request_logs (method, route, status_code)
        VALUES (?, ?, ?)
    `;
    conn.query(sql, [req.method, req.originalUrl, req.statusCode], (err) => {
        if (err) {
            console.log('Error in request_log: ', err);
        }

        console.log('Request logged successfully');
    });
}

module.exports = { logAction, logRequest };