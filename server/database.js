const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'photos.db'));

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS backup_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_id TEXT UNIQUE,
        server_path TEXT,
        size INTEGER,
        created_at DATETIME,
        uploaded_at DATETIME,
        deleted_from_device BOOLEAN DEFAULT 0
      )
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function addBackupRecord({ originalId, serverPath, size, createdAt, uploadedAt }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO backup_records 
       (original_id, server_path, size, created_at, uploaded_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [originalId, serverPath, size, createdAt.toISOString(), uploadedAt.toISOString()],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function getBackupRecords() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM backup_records ORDER BY uploaded_at DESC`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function markAsDeleted(originalId) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE backup_records SET deleted_from_device = 1 WHERE original_id = ?`,
      [originalId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

module.exports = {
  initializeDatabase,
  addBackupRecord,
  getBackupRecords,
  markAsDeleted
};