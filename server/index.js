const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const asyncHandler = require('express-async-handler');
const { initializeDatabase, addBackupRecord, getBackupRecords, markAsDeleted } = require('./database');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir('uploads', { recursive: true });
    await initializeDatabase();
  } catch (error) {
    console.error('Setup error:', error);
  }
})();

// Upload a single photo
app.post('/upload', upload.single('photo'), asyncHandler(async (req, res) => {
  const { originalId, size, createdAt } = req.body;
  const serverPath = req.file.path;

  await addBackupRecord({
    originalId,
    serverPath,
    size: parseInt(size),
    createdAt: new Date(createdAt),
    uploadedAt: new Date()
  });

  res.json({
    success: true,
    path: serverPath
  });
}));

// Bulk upload photos
app.post('/upload/bulk', upload.array('photos', 50), asyncHandler(async (req, res) => {
  const results = await Promise.all(
    req.files.map(async (file, index) => {
      const metadata = JSON.parse(req.body.metadata)[index];
      await addBackupRecord({
        originalId: metadata.originalId,
        serverPath: file.path,
        size: metadata.size,
        createdAt: new Date(metadata.createdAt),
        uploadedAt: new Date()
      });
      return {
        originalId: metadata.originalId,
        serverPath: file.path
      };
    })
  );

  res.json({
    success: true,
    results
  });
}));

// Get backup status of photos
app.get('/backup-status', asyncHandler(async (req, res) => {
  const records = await getBackupRecords();
  res.json(records);
}));

// Mark photo as deleted from device
app.post('/mark-deleted', asyncHandler(async (req, res) => {
  const { originalId } = req.body;
  await markAsDeleted(originalId);
  res.json({ success: true });
}));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});