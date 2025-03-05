const express = require('express');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

// Google Cloud Storage setup
const storage = new Storage();
const bucketName = 'your-bucket-name';

function buildFileTree(files) {
    let tree = {};
    files.forEach(file => {
        const parts = file.name.split('/');
        let currentLevel = tree;
        parts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = index === parts.length - 1 ? { url: `https://storage.googleapis.com/${bucketName}/${file.name}` } : {};
            }
            currentLevel = currentLevel[part];
        });
    });
    return tree;
}

// API: Get structured file list
app.get('/api/files', async (req, res) => {
    try {
        const [files] = await storage.bucket(bucketName).getFiles();
        res.json(buildFileTree(files));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
