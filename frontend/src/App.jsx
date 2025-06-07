import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api';

function App() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
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
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
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

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Simple Dropbox</h1>
            </header>
            <div 
                className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleBrowseClick}
            >
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    ref={fileInputRef} 
                    className="file-input"
                    accept=".jpg,.jpeg,.png,.txt,.json,.pdf,.csv,.doc,.docx,.xls,.xlsx,.log,.mp3,.wav,.mp4,.mpeg,.mov,.zip" 
                />
                {selectedFile ? (
                    <p>Selected file: {selectedFile.name}</p>
                ) : (
                    <p>Drag and drop a file here, or click to browse.</p>
                )}
            </div>
            {selectedFile && <button onClick={handleUpload}>Upload</button>}
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
