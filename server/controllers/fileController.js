const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const File = require('../model/fileModel');
const fs = require('fs')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dts8hnbex',
  api_key: '575351439139976',
  api_secret: 'LX9gsZmzIXuqOUUplJS_9-OM0PM',
});
// Controller function for file upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { originalname, path } = req.file;

    // Create a new file document in the database
    const file = new File({
      filename: originalname,
      originalFileUrl: path,
    });

    await file.save();

    res.json({ fileId: file._id });
  } catch (error) {
    console.log('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

// Controller function for merging files
const mergeFiles = async (req, res) => {
  try {
    const { fileIds } = req.body;

    // Retrieve selected files from the database
    const files = await File.find({ _id: { $in: fileIds } });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }

    // Merge the PDF files
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const originalFileBytes = await PDFDocument.load(await fs.promises.readFile(file.originalFileUrl));
      const copiedPages = await mergedPdf.copyPages(originalFileBytes, originalFileBytes.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Generate a file name for the merged file
    const mergedFilename = 'merged.pdf';

    // Save the merged PDF file
    const mergedTempFilePath = `uploads/${mergedFilename}`;
await fs.promises.writeFile(mergedTempFilePath, await mergedPdf.save());

// Upload the merged PDF file to Cloudinary
const cloudinaryResponse = await cloudinary.uploader.upload(mergedTempFilePath, {
  resource_type: 'auto',
  folder: 'merged_pdfs',
  use_filename: true,
  unique_filename: true,
  overwrite: true,
});

const mergedFileUrl = cloudinaryResponse.secure_url;

// Update the database with the merged file URL
files.forEach(async (file) => {
  file.mergedFileUrl = mergedFileUrl;
  await file.save();
});

// Remove the temporary merged PDF file
await fs.promises.unlink(mergedTempFilePath);

res.json({ mergedFileUrl });

  } catch (error) {
    console.log('Error merging files:', error);
    res.status(500).json({ message: 'Error merging files' });
  }
};


module.exports = { uploadFile, mergeFiles };
