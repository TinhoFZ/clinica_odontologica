const conn = require('../db/conn');

function requestLogger(req, res, next) {
    const sql = `
        INSERT INTO request_logs (method, route, status_code)
        VALUES (?, ?, ?)
    `;
     
    conn.query(sql, [req.method, req.originalUrl, null], (err, result) => {
        if (err) {
            console.log('Error in request_log: ', err);
        }

        req.requestId = result.insertId;

        res.on('finish', () => {
            const updateSql = `
                UPDATE request_logs
                SET status_code = ?
                WHERE request_id = ?
            `;

            conn.query(updateSql, [res.statusCode, req.requestId], (err) => {
                if (err) {
                    console.log('Error updating request_log: ', err);
                }
            });
        });
        console.log('Request logged successfully');
    });
    next();
}

module.exports = requestLogger;