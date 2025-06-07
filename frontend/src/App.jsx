import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api';

function App() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${API_URL}/files`);
            setFiles(response.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchFiles();
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Error uploading file');
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Simple Dropbox</h1>
            </header>
            <div className="upload-section">
                <input type="file" onChange={handleFileChange} ref={fileInputRef} accept=".jpg,.jpeg,.png,.txt,.json,.pdf,.csv,.doc,.docx,.xls,.xlsx,.log,.mp3,.wav,.mp4,.mpeg,.mov,.zip" />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div className="file-list">
                <h2>Uploaded Files</h2>
                <ul>
                    {files.map(file => (
                        <li key={file.id}>
                            <a href={`${API_URL}/view/${file.filename}`} target="_blank" rel="noopener noreferrer">{file.originalname}</a>
                            <a href={`${API_URL}/download/${file.filename}`} download>Download</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
