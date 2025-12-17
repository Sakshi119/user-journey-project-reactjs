import React, { useState } from 'react';
import { FileUploadCard } from './FileUploadCard';
import { Button } from '../common/Button';
import styles from './DocumentUploadForm.module.css';

export const DocumentUploadForm = ({ onSubmit, onBack, initialData = {} }) => {
  const [formData, setFormData] = useState({
    idProof: initialData.idProof || null,
    photo: initialData.photo || null,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    // Clear error when file is selected
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idProof) {
      newErrors.idProof = 'ID proof is required';
    }

    if (!formData.photo) {
      newErrors.photo = 'Photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate upload/processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    onSubmit(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Document Upload</h2>
        <p className={styles.subtitle}>Upload your ID proof and photo</p>
      </div>

      <div className={styles.uploadSection}>
        <FileUploadCard
          label="ID Proof (Aadhaar/PAN/Passport)"
          type="idProof"
          onFileSelect={(file) => handleFileSelect('idProof', file)}
          error={errors.idProof}
          currentFile={formData.idProof}
          required
        />

        <FileUploadCard
          label="Your Photo"
          type="photo"
          onFileSelect={(file) => handleFileSelect('photo', file)}
          error={errors.photo}
          currentFile={formData.photo}
          required
        />
      </div>

      <div className={styles.infoBox}>
        <h3 className={styles.infoTitle}>📋 Upload Guidelines:</h3>
        <ul className={styles.infoList}>
          <li>✓ ID Proof: PDF, JPG, PNG (max 5MB)</li>
          <li>✓ Photo: JPG, PNG (max 2MB)</li>
          <li>✓ Documents should be clear and readable</li>
          <li>✓ Upload from computer or Google Drive</li>
        </ul>
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          {loading ? 'Uploading...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};