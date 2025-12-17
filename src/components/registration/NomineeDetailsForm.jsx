import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateName, validateAge } from '../../utils/validation';
import { RELATIONSHIPS } from '../../utils/constants';
import styles from './NomineeDetailsForm.module.css';

export const NomineeDetailsForm = ({ onSubmit, onBack, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nomineeName: initialData.nomineeName || '',
    relationship: initialData.relationship || '',
    nomineeAge: initialData.nomineeAge || '',
    nomineeAddress: initialData.nomineeAddress || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateName(formData.nomineeName)) {
      newErrors.nomineeName = 'Please enter a valid name (only letters)';
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Please select relationship';
    }

    if (!validateAge(formData.nomineeAge)) {
      newErrors.nomineeAge = 'Please enter a valid age (0-120)';
    } else if (parseInt(formData.nomineeAge) < 18) {
      newErrors.nomineeAge = 'Nominee must be at least 18 years old';
    }

    if (formData.nomineeAddress.trim().length < 10) {
      newErrors.nomineeAddress = 'Please enter complete address (min 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);

    onSubmit(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Nominee Details</h2>
        <p className={styles.subtitle}>Add your nominee information</p>
      </div>

      <div className={styles.form}>
        <Input
          label="Nominee Name"
          value={formData.nomineeName}
          onChange={(e) => handleChange('nomineeName', e.target.value)}
          placeholder="Enter nominee's full name"
          error={errors.nomineeName}
          required
        />

        <Select
          label="Relationship"
          value={formData.relationship}
          onChange={(e) => handleChange('relationship', e.target.value)}
          options={RELATIONSHIPS}
          error={errors.relationship}
          placeholder="Select relationship"
          required
        />

        <Input
          type="number"
          label="Nominee Age"
          value={formData.nomineeAge}
          onChange={(e) => handleChange('nomineeAge', e.target.value)}
          placeholder="Enter age"
          error={errors.nomineeAge}
          required
        />

        <Input
          label="Nominee Address"
          value={formData.nomineeAddress}
          onChange={(e) => handleChange('nomineeAddress', e.target.value)}
          placeholder="Enter complete address"
          error={errors.nomineeAddress}
          required
        />
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Continue
        </Button>
      </div>
    </div>
  );
};
