const express = require('express');
const cors = require('cors');
app.use(cors({ origin: 'https://<CODESPACE_NAME>-8080.app.github.dev' }));

const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db');

// CREATE table if not exists (you can also load from assetsdata.sql separately)
db.run(`CREATE TABLE IF NOT EXISTS assets (
"Asset-ID"	INTEGER,
	"Asset-Type"	TEXT NOT NULL,
	"Brand"	TEXT,
	"Model"	TEXT,
	"Serial-Number"	INTEGER,
	"Purchase_Date"	TEXT,
	"Status"	TEXT,
	PRIMARY KEY("Asset-ID")
)`);

app.get('/', (req, res) => {
  res.send('Welcome to the Sparkout Tech Info System API');
});

// GET all assets
app.get('/assets', (req, res) => {
  db.all("SELECT * FROM assets", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD asset
app.post('/assets', (req, res) => {
  const { type, brand, model, serial_number, purchase_date, status } = req.body;
  db.run(`INSERT INTO assets (type, brand, model, serial_number, purchase_date, status)
          VALUES (?, ?, ?, ?, ?, ?)`,
    [type, brand, model, serial_number, purchase_date, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// UPDATE asset
app.put('/assets/:id', (req, res) => {
  const { type, brand, model, serial_number, purchase_date, status } = req.body;
  db.run(`UPDATE assets SET type=?, brand=?, model=?, serial_number=?, purchase_date=?, status=? WHERE id=?`,
    [type, brand, model, serial_number, purchase_date, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
});

// DELETE asset
app.delete('/assets/:id', (req, res) => {
  db.run(`DELETE FROM assets WHERE id=?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.get('/assets/:id', (req, res) => {
  db.get("SELECT * FROM assets WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
