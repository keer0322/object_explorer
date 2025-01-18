const express = require('express');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');
const app = express();

app.use(cors());

// Set up Google Cloud Storage
const storage = new Storage({ keyFilename: 'path/to/your/key.json' });
const bucketName = 'your-bucket-name';

app.get('/list', async (req, res) => {
  const { prefix = '', pageToken = '' } = req.query;
  try {
    const [files, nextQuery] = await storage.bucket(bucketName).getFiles({
      prefix,           // Filter by prefix if provided
      autoPaginate: false,  // Disable automatic pagination
      pageToken,        // Use pageToken for pagination
      maxResults: 10    // Limit results per page
    });
    res.json({
      files: files.map(file => ({ name: file.name, size: file.metadata.size })),
      nextPageToken: nextQuery?.pageToken || null
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/download/:filename', async (req, res) => {
  const file = storage.bucket(bucketName).file(req.params.filename);
  try {
    res.attachment(req.params.filename);
    file.createReadStream().pipe(res);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
