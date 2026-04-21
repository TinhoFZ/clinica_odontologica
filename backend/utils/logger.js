const conn = require('../db/conn');

function logAction({ entityType, entityId, action, status }) {
    const actionId = crypto.randomUUID();
    const sql = `
        INSERT INTO action_logs (action_id, action, entity_type, entity_id, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    conn.query(sql, [actionId, action, entityType, entityId, status], (err) => {
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