const express = require('express');
const { Storage } = require('@google-cloud/storage');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

// Initialize Google Cloud Storage
const storage = new Storage();
const bucketName = 'your-bucket-name';

// Function to structure files as a tree
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
app.get('/files', async (req, res) => {
    try {
        const [files] = await storage.bucket(bucketName).getFiles();
        const fileTree = buildFileTree(files);
        res.json(fileTree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
