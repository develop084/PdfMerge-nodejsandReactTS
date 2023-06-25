import React, { useState } from 'react';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

interface FileData {
  id: string;
  name: string;
}

const fileList: UploadFile[] = [
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33,
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'error',
    },
  ];

const PDFMergeComponent: React.FC = () => {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [mergedFileUrl, setMergedFileUrl] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }

      try {
        const response = await axios.post('http://localhost:8000/file/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const { fileId } = response.data;
        setUploadedFiles((prevFiles) => [...prevFiles, { id: fileId, name: files[0].name }]);
      } catch (error) {
        console.log('Error uploading file:', error);
      }
    }
  };

  const handleMergeFiles = async () => {
    const fileIds = uploadedFiles.map((file) => file.id);

    try {
      const response = await axios.post('http://localhost:8000/file/merge', { fileIds });
      const { mergedFileUrl } = response.data;
      setMergedFileUrl(mergedFileUrl);
    } catch (error) {
      console.log('Error merging files:', error);
    }
  };

  return (
    <div>
      <h1>PDF Merge Component</h1>

      <h3>Upload PDF Files</h3>
      <input type="file" multiple onChange={handleFileUpload} />

      <Upload
      action="http://localhost:8000/file/upload"
      listType="picture"
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>

      <h3>Uploaded Files</h3>
      <ul>
        {uploadedFiles.map((file) => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>

      <button onClick={handleMergeFiles} disabled={uploadedFiles.length === 0}>
        Merge Files
      </button>

      {mergedFileUrl && (
        <div>
          <h3>Merged File</h3>
          <a href={mergedFileUrl} download>
            Download Merged PDF
          </a>
        </div>
      )}



   
    </div>
  );
};

export default PDFMergeComponent;
