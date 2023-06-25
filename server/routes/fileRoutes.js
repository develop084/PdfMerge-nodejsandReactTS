const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, mergeFiles } = require('../controllers/fileController');
// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });
// Route for file upload
router.post('/upload', upload.single('file'), uploadFile);

// Route for merging files
router.post('/merge', mergeFiles);

module.exports = router;
