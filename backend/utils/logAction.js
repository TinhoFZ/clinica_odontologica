const conn = require('../db/conn');

function logAction({ requestId, entityType, entityId, action, status }) {
    const actionId = crypto.randomUUID();

    const sql = `
        INSERT INTO action_logs (action_id, request_id, action, entity_type, entity_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    conn.query(sql, [actionId, requestId, action, entityType, entityId, status], (err) => {
        if (err) {
            console.log('Error in action_log: ', err);
            return;
        };

        console.log('Action logged successfully');
    });
}

module.exports = { logAction };