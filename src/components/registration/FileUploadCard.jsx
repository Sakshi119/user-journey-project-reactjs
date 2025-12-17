import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, Check } from 'lucide-react';
import { googleDriveService } from '../../services/api/googleDriveService';
import { validateFile, formatFileSize, getFileIcon } from '../../utils/fileValidation';
import styles from './FileUploadCard.module.css';

export const FileUploadCard = ({ 
  label, 
  type, 
  onFileSelect, 
  error,
  required = true,
  currentFile = null
}) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(currentFile);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleLocalFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploadError('');
    
    // Validate file
    const validation = validateFile(selectedFile, type);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    // Create preview for images
    const fileData = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      source: 'local',
      file: selectedFile
    };

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.preview = e.target.result;
        setFile(fileData);
        onFileSelect(fileData);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(fileData);
      onFileSelect(fileData);
    }
  };

  const handleGoogleDriveUpload = async () => {
    try {
      setUploading(true);
      setUploadError('');

      // First, let user pick file from their computer
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = type === 'idProof' ? '.pdf,.jpg,.jpeg,.png' : '.jpg,.jpeg,.png';
      
      input.onchange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
          setUploading(false);
          return;
        }

        // Validate file
        const validation = validateFile(selectedFile, type);
        if (!validation.valid) {
          setUploadError(validation.error);
          setUploading(false);
          return;
        }

        try {
          // Upload to Google Drive
          const driveFile = await googleDriveService.uploadFile(selectedFile);
          
          const fileData = {
            name: driveFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            source: 'google-drive',
            driveId: driveFile.id,
            webViewLink: driveFile.webViewLink
          };

          setFile(fileData);
          onFileSelect(fileData);
        } catch (error) {
          setUploadError(error.message);
        } finally {
          setUploading(false);
        }
      };

      input.click();
    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
    }
  };

  const handleGoogleDrivePick = async () => {
    try {
      setUploading(true);
      setUploadError('');

      const driveFile = await googleDriveService.pickFile();
      
      if (driveFile) {
        const fileData = {
          name: driveFile.name,
          type: driveFile.mimeType,
          source: 'google-drive-existing',
          driveId: driveFile.id,
          webViewLink: driveFile.webViewLink
        };

        setFile(fileData);
        onFileSelect(fileData);
      }
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploadError('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      </div>

      {!file ? (
        <div className={styles.uploadArea}>
          {/* Local Upload */}
          <div className={styles.uploadOption}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleLocalFileSelect}
              accept={type === 'idProof' ? '.pdf,.jpg,.jpeg,.png' : '.jpg,.jpeg,.png'}
              className={styles.fileInput}
              id={`file-${type}`}
            />
            <label htmlFor={`file-${type}`} className={styles.uploadButton}>
              <Upload size={20} />
              <span>Upload from Computer</span>
            </label>
          </div>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* Google Drive Options */}
          <div className={styles.driveOptions}>
            <button
              onClick={handleGoogleDriveUpload}
              disabled={uploading}
              className={styles.driveButton}
              type="button"
            >
              <svg className={styles.driveIcon} viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M8.5 4L1.5 16H7l3.5-6z"/>
                <path fill="#34A853" d="M16.5 4l-7 12h6l7-12z"/>
                <path fill="#FBBC04" d="M22.5 16L15.5 4l-3.5 6 3.5 6z"/>
              </svg>
              <span>{uploading ? 'Uploading...' : 'Upload to Google Drive'}</span>
            </button>

            <button
              onClick={handleGoogleDrivePick}
              disabled={uploading}
              className={styles.driveButton}
              type="button"
            >
              <svg className={styles.driveIcon} viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M8.5 4L1.5 16H7l3.5-6z"/>
                <path fill="#34A853" d="M16.5 4l-7 12h6l7-12z"/>
                <path fill="#FBBC04" d="M22.5 16L15.5 4l-3.5 6 3.5 6z"/>
              </svg>
              <span>Pick from Google Drive</span>
            </button>
          </div>

          <p className={styles.hint}>
            {type === 'idProof' 
              ? 'PDF, JPG, PNG up to 5MB' 
              : 'JPG, PNG up to 2MB'}
          </p>
        </div>
      ) : (
        <div className={styles.filePreview}>
          <div className={styles.fileInfo}>
            {file.preview ? (
              <img src={file.preview} alt="Preview" className={styles.imagePreview} />
            ) : (
              <div className={styles.fileIcon}>
                {getFileIcon(file.type)}
              </div>
            )}
            <div className={styles.fileDetails}>
              <p className={styles.fileName}>{file.name}</p>
              {file.size && (
                <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
              )}
              <p className={styles.fileSource}>
                {file.source === 'local' && '💻 Local File'}
                {file.source === 'google-drive' && '☁️ Uploaded to Drive'}
                {file.source === 'google-drive-existing' && '☁️ From Drive'}
              </p>
              {file.webViewLink && (
                <a 
                  href={file.webViewLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  View in Drive
                </a>
              )}
            </div>
          </div>
          <button onClick={handleRemove} className={styles.removeButton} type="button">
            <X size={20} />
          </button>
        </div>
      )}

      {(uploadError || error) && (
        <p className={styles.error}>{uploadError || error}</p>
      )}
    </div>
  );
};
