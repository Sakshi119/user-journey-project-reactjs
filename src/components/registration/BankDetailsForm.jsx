import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { validateAccountNumber, validateIFSC } from '../../utils/validation';
import styles from './BankDetailsForm.module.css';

export const BankDetailsForm = ({ onSubmit, onBack, initialData = {} }) => {
  const [formData, setFormData] = useState({
    accountNumber: initialData.accountNumber || '',
    confirmAccountNumber: initialData.confirmAccountNumber || '',
    ifscCode: initialData.ifscCode || '',
    bankName: initialData.bankName || '',
    branchName: initialData.branchName || '',
    accountHolderName: initialData.accountHolderName || '',
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

    if (!validateAccountNumber(formData.accountNumber)) {
      newErrors.accountNumber = 'Please enter a valid account number (9-18 digits)';
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!validateIFSC(formData.ifscCode)) {
      newErrors.ifscCode = 'Please enter a valid IFSC code (e.g., SBIN0001234)';
    }

    if (formData.bankName.trim().length < 3) {
      newErrors.bankName = 'Please enter bank name';
    }

    if (formData.branchName.trim().length < 3) {
      newErrors.branchName = 'Please enter branch name';
    }

    if (formData.accountHolderName.trim().length < 2) {
      newErrors.accountHolderName = 'Please enter account holder name';
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
        <h2 className={styles.title}>Bank Details</h2>
        <p className={styles.subtitle}>Enter your bank account information</p>
      </div>

      <div className={styles.form}>
        <Input
          label="Account Holder Name"
          value={formData.accountHolderName}
          onChange={(e) => handleChange('accountHolderName', e.target.value)}
          placeholder="As per bank records"
          error={errors.accountHolderName}
          required
        />

        <Input
          label="Account Number"
          value={formData.accountNumber}
          onChange={(e) => handleChange('accountNumber', e.target.value.replace(/\D/g, ''))}
          placeholder="Enter account number"
          error={errors.accountNumber}
          required
        />

        <Input
          label="Confirm Account Number"
          value={formData.confirmAccountNumber}
          onChange={(e) => handleChange('confirmAccountNumber', e.target.value.replace(/\D/g, ''))}
          placeholder="Re-enter account number"
          error={errors.confirmAccountNumber}
          required
        />

        <Input
          label="IFSC Code"
          value={formData.ifscCode}
          onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
          placeholder="SBIN0001234"
          maxLength={11}
          error={errors.ifscCode}
          required
        />

        <Input
          label="Bank Name"
          value={formData.bankName}
          onChange={(e) => handleChange('bankName', e.target.value)}
          placeholder="State Bank of India"
          error={errors.bankName}
          required
        />

        <Input
          label="Branch Name"
          value={formData.branchName}
          onChange={(e) => handleChange('branchName', e.target.value)}
          placeholder="Enter branch name"
          error={errors.branchName}
          required
        />
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
};