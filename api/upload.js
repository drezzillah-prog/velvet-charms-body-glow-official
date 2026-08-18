// api/upload.js
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({
    maxFileSize: 20 * 1024 * 1024,
    uploadDir: '/tmp',
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload parse error', err);
      return res.status(500).json({ error: 'Upload parsing failed' });
    }

    let uploaded = null;
    if (files.file) {
      const f = files.file;
      const filepath = f.filepath || f.path;
      const filename = path.basename(filepath);
      uploaded = {
        name: filename,
        originalName: f.originalFilename || f.name,
        size: f.size,
        path: '/tmp/' + filename
      };
    }

    try {
      const record = { time: new Date().toISOString(), fields, file: uploaded };
      const dbPath = '/tmp/uploads.json';
      let arr = [];
      if (fs.existsSync(dbPath)) {
        try { arr = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '[]'); } catch(e){ arr = []; }
      }
      arr.push(record);
      fs.writeFileSync(dbPath, JSON.stringify(arr, null, 2));
    } catch (e) {
      console.error('Failed to write upload record', e);
    }

    return res.status(200).json({ ok: true, file: uploaded, fields });
  });
};
