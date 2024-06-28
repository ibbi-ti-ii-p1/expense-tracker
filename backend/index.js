const http = require('http');
const url = require('url');

const sqlite = require('sqlite3').verbose();

const expenses = [];

const db = new sqlite.Database('expenses.db', (err) => {
    if (err) {
        console.error(err.message);
    }

    db.run(`CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY,
            amount REAL,
            type TEXT,
            description TEXT,
            date TEXT)`, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Table created');
    });
});
    

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
    });

    if (parsedUrl.pathname === "/expenses") {
        if (req.method === "GET") {
            db.all("SELECT * FROM expenses", (err, rows) => {
                if (err) {
                    console.log("Error getting expenses" + err.message);
                    res.end(JSON.stringify({
                        "error": err.message
                    }))
                } else {
                    res.end(JSON.stringify({
                        "expenses": rows
                    }))
                }
            })
        } else if (req.method === "POST") {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const data = JSON.parse(body);

                db.run(`INSERT INTO expenses (amount, type, description, date) 
                    VALUES (?, ?, ?, ?)`, 
                    [data.amount, data.type, data.description, data.date], (err) => {
                    if (err) {
                        console.log("Error inserting expense" + err.message);
                        res.end(JSON.stringify({
                            "error": err.message
                        }))
                    } else {
                        res.end(JSON.stringify({
                            "message": "Expense inserted"
                        }))
                    }
                })
            });
        } else if (req.method === "DELETE") {
            let id = parsedUrl.query.id;

            db.run("DELETE FROM expenses WHERE id = ?", [id], (err) => {
                if (err) {
                    console.log("Error deleting expense" + err.message);
                    res.end(JSON.stringify({
                        "error": err.message
                    }))
                } else {
                    res.end(JSON.stringify({
                        "message": "Expense deleted"
                    }))
                }
            })
        } else if (req.method === "OPTIONS") {
            if (!res.headersSent) { 
                res.writeHead(200, {
                    'Access-Control-Allow-Methods': 'DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type',
                });
            }
            res.end();
        }
    }

})

server.listen(3030, () => {
    console.log("Server sedang dijalankan di port 3030");
});