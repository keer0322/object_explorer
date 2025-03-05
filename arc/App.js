import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000/api/files";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(response => setFileTree(response.data))
      .catch(error => console.error("Error fetching files:", error));
  }, []);

  const renderTree = (tree) => {
    return Object.keys(tree).map((key) => (
      <li key={key}>
        {tree[key].url ? (
          <span onClick={() => setSelectedFile(tree[key].url)}>{key}</span>
        ) : (
          <>
            <span onClick={(e) => toggleExpand(e)}>{key}</span>
            <ul className="nested">{renderTree(tree[key])}</ul>
          </>
        )}
      </li>
    ));
  };

  const toggleExpand = (e) => {
    e.target.nextSibling.classList.toggle("active");
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>File Explorer</h3>
        <ul>{renderTree(fileTree)}</ul>
      </div>
      <div className="viewer">
        {selectedFile ? (
          selectedFile.match(/\.(jpeg|jpg|png|gif|pdf)$/) ? (
            <iframe src={selectedFile} title="File Viewer"></iframe>
          ) : (
            <a href={selectedFile} target="_blank" rel="noopener noreferrer">Download File</a>
          )
        ) : (
          <p>Select a file to view</p>
        )}
      </div>
    </div>
  );
}

export default App;
