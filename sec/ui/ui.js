import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchFiles = (token = '') => {
    axios
      .get(`http://localhost:3000/list?prefix=${search}&pageToken=${token}`)
      .then(response => {
        setFiles(response.data.files);
        setNextPageToken(response.data.nextPageToken);
      })
      .catch(error => console.error('Error fetching files:', error));
  };

  useEffect(() => {
    fetchFiles();
  }, [search]);

  const handleDownload = (filename) => {
    window.location.href = `http://localhost:3000/download/${filename}`;
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <h1>Google Cloud Storage Browser</h1>
      <input
        type="text"
        placeholder="Search files..."
        value={search}
        onChange={handleSearchChange}
      />
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name} ({file.size} bytes)
            <button onClick={() => handleDownload(file.name)}>Download</button>
          </li>
        ))}
      </ul>
      {nextPageToken && (
        <button onClick={() => fetchFiles(nextPageToken)}>Load More</button>
      )}
    </div>
  );
};

export default App;
