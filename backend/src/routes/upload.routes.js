const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, upload.single('banner'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Generate URL for the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(200).json({
    message: 'File uploaded successfully',
    imageUrl: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
