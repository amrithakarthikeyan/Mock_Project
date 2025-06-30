const express = require('express');

const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

const cors = require('cors');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.run(`CREATE TABLE IF NOT EXISTS assets (
  "Asset-ID" INTEGER PRIMARY KEY,
  "Asset-Type" TEXT NOT NULL,
  "Brand" TEXT,
  "Model" TEXT,
  "Serial-Number" INTEGER,
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
  db.run(`INSERT INTO assets (
    "Asset-Type", "Brand", "Model", "Serial-Number", "Purchase_Date", "Status")
    VALUES (?, ?, ?, ?, ?, ?)`,
    [assetType, Brand, Model, serialNumber, Purchase_Date, Status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
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
});

// DELETE asset
app.delete('/assets/:id', (req, res) => {
  db.run(`DELETE FROM assets WHERE "Asset-ID" = ?`, 
    [req.params.id], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
    });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
