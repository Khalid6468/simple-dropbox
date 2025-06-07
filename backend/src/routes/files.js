const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');

const router = express.Router();

// List of allowed MIME types for file uploads
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
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Upload failed. Please check file type or file size (max 5MB).' });
    }
    const { originalname, filename, mimetype, size } = req.file;
    try {
        const result = await db.query(
            'INSERT INTO files(originalname, filename, mimetype, size) VALUES($1, $2, $3, $4) RETURNING id',
            [originalname, filename, mimetype, size]
        );
        res.status(200).send({ message: 'File uploaded successfully', fileId: result.rows[0].id });
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// API to get all files
router.get('/files', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM files');
        res.status(200).json(rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// API to download a file
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(__dirname, '../../uploads', filename);
    res.download(file);
});

// API to view a file
router.get('/view/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
        const { rows } = await db.query('SELECT mimetype FROM files WHERE filename = $1', [filename]);
        if (rows.length > 0) {
            const file = path.join(__dirname, '../../uploads', filename);
            res.setHeader('Content-Type', rows[0].mimetype);
            res.sendFile(file);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

module.exports = router; 