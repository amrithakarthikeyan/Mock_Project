const express = require('express');

const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

const cors = require('cors');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith('.app.github.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const db = new sqlite3.Database('./database.db');
//db.run (`DROP TABLE assets`);
db.run(`CREATE TABLE IF NOT EXISTS assets (
  "Asset-ID" INTEGER PRIMARY KEY NOT NULL,
  "Asset-Type" TEXT NOT NULL,
  "Brand" TEXT NOT NULL,
  "Model" TEXT NOT NULL,
  "Serial-Number" INTEGER NOT NULL UNIQUE,
  "Purchase_Date" TEXT,
  "Status" TEXT
)`);

app.get('/', (req, res) => {
  res.send('Welcome to the Sparkout Tech Info System API');
});

// GET all assets
app.get('/assets', (req, res) => {
  db.all(`SELECT 
    "Asset-ID",
    "Asset-Type",
    "Brand",
    "Model",
    "Serial-Number",
    "Purchase_Date",
    "Status"
    FROM assets`, 
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

// GET single asset
app.get('/assets/:id', (req, res) => {
  db.get(`SELECT 
    "Asset-ID",
    "Asset-Type",
    "Brand",
    "Model",
    "Serial-Number",
    "Purchase_Date",
    "Status"
    FROM assets WHERE "Asset-ID" = ?`, 
    [req.params.id], 
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
});

// ADD asset
app.post('/assets', (req, res) => {
  const { "Asset-Type": assetType, Brand, Model, "Serial-Number": serialNumber, Purchase_Date, Status } = req.body;

  // Basic validation for missing fields
  if (!assetType || !Brand || !Model || !serialNumber || !Purchase_Date || !Status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(`INSERT INTO assets (
    "Asset-Type", "Brand", "Model", "Serial-Number", "Purchase_Date", "Status")
    VALUES (?, ?, ?, ?, ?, ?)`,
    [assetType, Brand, Model, serialNumber, Purchase_Date, Status],
    function(err) {
      if (err) {
        // Handle unique constraint error for Serial-Number
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Serial Number must be unique' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    });
});

// UPDATE asset
app.put('/assets/:id', (req, res) => {
  const { "Asset-Type": assetType, Brand, Model, "Serial-Number": serialNumber, Purchase_Date, Status } = req.body;
  db.run(`UPDATE assets SET 
    "Asset-Type" = ?, 
    "Brand" = ?, 
    "Model" = ?, 
    "Serial-Number" = ?, 
    "Purchase_Date" = ?, 
    "Status" = ? 
    WHERE "Asset-ID" = ?`,
    [assetType, Brand, Model, serialNumber, Purchase_Date, Status, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    });
    console.log("Asset edited successfully " + `${assetType}, ${Brand}, ${Model}, ${serialNumber}, ${Purchase_Date}, ${Status}`);
});

// DELETE asset
app.delete('/assets/:id', (req, res) => {
  db.run(`DELETE FROM assets WHERE "Asset-ID" = ?`, 
    [req.params.id], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    });
    console.log("Asset details deleted");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
