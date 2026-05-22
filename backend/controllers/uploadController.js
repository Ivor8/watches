import fs from 'fs/promises';
import path from 'path';

export const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files[0];
    const uploadType = req.query.type || 'products';
    const folder = req.query.folder ? String(req.query.folder).replace(/[^a-zA-Z0-9-_]/g, '') : '';

    let filePath = `/uploads/${uploadType}/${file.filename}`;

    if (folder) {
      const uploadsDir = path.join(process.cwd(), 'uploads', uploadType);
      const targetDir = path.join(uploadsDir, folder);
      await fs.mkdir(targetDir, { recursive: true });

      const oldPath = path.join(uploadsDir, file.filename);
      const newPath = path.join(targetDir, file.filename);
      await fs.rename(oldPath, newPath);
      filePath = `/uploads/${uploadType}/${folder}/${file.filename}`;
    }

    const publicUrl = `${req.protocol}://${req.get('host')}${filePath}`;
    res.json({ path: filePath, publicUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Path is required' });
    }

    const normalized = path.posix.normalize(filePath).replace(/^\/+/, '/');
    if (!normalized.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'Invalid upload path' });
    }

    const absolutePath = path.join(process.cwd(), normalized.slice(1));
    await fs.unlink(absolutePath);
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
};
