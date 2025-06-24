const express = require('express');
const cors = require('cors');
app.use(cors({ origin: 'https://opulent-barnacle-q76gw546vqvpfj59-3000.app.github.dev/' }));

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
  db.all(`SELECT 
    "Asset-ID" AS id,
    "Asset-Type" AS type,
    "Brand" AS brand,
    "Model" AS model,
    "Serial-Number" AS serial_number,
    "Purchase_Date" AS purchase_date,
    "Status" AS status 
    FROM Assets`, 
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});


//Get single asset
app.get('/assets/:id', (req, res) => {
  db.get(`SELECT 
    "Asset-ID" AS id,
    "Asset-Type" AS type,
    "Brand" AS brand,
    "Model" AS model,
    "Serial-Number" AS serial_number,
    "Purchase_Date" AS purchase_date,
    "Status" AS status 
    FROM Assets WHERE "Asset-ID" = ?`, 
    [req.params.id], 
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
});

// ADD asset
app.post('/assets', (req, res) => {
  const { type, brand, model, serial_number, purchase_date, status } = req.body;
  db.run(`INSERT INTO Assets (
    "Asset-Type", "Brand", "Model", "Serial-Number", "Purchase_Date", "Status")
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
  db.run(`UPDATE Assets SET 
    "Asset-Type" = ?, 
    "Brand" = ?, 
    "Model" = ?, 
    "Serial-Number" = ?, 
    "Purchase_Date" = ?, 
    "Status" = ? 
    WHERE "Asset-ID" = ?`,
    [type, brand, model, serial_number, purchase_date, status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
});

// DELETE asset
app.delete('/assets/:id', (req, res) => {
  db.run(`DELETE FROM Assets WHERE "Asset-ID" = ?`, 
    [req.params.id], 
    function(err) {
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
