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
        }
    }

})

server.listen(3030, () => {
    console.log("Server sedang dijalankan di port 3030");
});