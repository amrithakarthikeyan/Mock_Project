const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// CORS Fix: Allow all origins (for development only)
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Optional: handle preflight OPTIONS requests
app.options('*', cors());

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

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


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

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// CORS Fix: Allow all origins (for development only)
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Optional: handle preflight OPTIONS requests
app.options('*', cors());

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

