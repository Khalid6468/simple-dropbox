const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');

const router = express.Router();

const allowedMimeTypes = [
    'image/jpeg', 'image/png',
    'text/plain',
    'application/json',
    'application/pdf',
    'text/csv',
    'application/zip',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'audio/mpeg',
    'audio/wav',
    'video/mp4',
    'video/mpeg',
    'video/quicktime' 
];

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    }
});

// API to upload a file
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Upload failed. Please check file type or file size (max 5MB).' });
    }
    const { originalname, filename, mimetype, size } = req.file;
    db.run(`INSERT INTO files(originalname, filename, mimetype, size) VALUES(?, ?, ?, ?)`, [originalname, filename, mimetype, size], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send({ message: 'File uploaded successfully', fileId: this.lastID });
    });
});

// API to get all files
router.get('/files', (req, res) => {
    db.all('SELECT * FROM files', [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).json(rows);
    });
});

// API to download a file
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(__dirname, '../../uploads', filename);
    res.download(file);
});

// API to view a file
router.get('/view/:filename', (req, res) => {
    const { filename } = req.params;
    db.get(`SELECT mimetype FROM files WHERE filename = ?`, [filename], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (row) {
            const file = path.join(__dirname, '../../uploads', filename);
            res.setHeader('Content-Type', row.mimetype);
            res.sendFile(file);
        } else {
            res.status(404).send('File not found');
        }
    });
});

module.exports = router; 