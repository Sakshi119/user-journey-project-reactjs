import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { validateName, validateEmail, validatePincode } from '../../utils/validation';
import styles from './PersonalDetailsForm.module.css';

export const PersonalDetailsForm = ({ onSubmit, onBack, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    dob: initialData.dob || '',
    email: initialData.email || '',
    gender: initialData.gender || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    pincode: initialData.pincode || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateName(formData.fullName)) {
      newErrors.fullName = 'Please enter a valid name (only letters)';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old';
      }
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter complete address (min 10 characters)';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!validatePincode(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);

    onSubmit(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Personal Details</h2>
        <p className={styles.subtitle}>Please provide your personal information</p>
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
          error={errors.fullName}
          required
        />

        <Input
          type="date"
          label="Date of Birth"
          value={formData.dob}
          onChange={(e) => handleChange('dob', e.target.value)}
          error={errors.dob}
          required
        />

        <Input
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
          error={errors.email}
          required
        />

        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          options={['Male', 'Female', 'Other']}
          error={errors.gender}
          required
        />

        <div className={styles.fullWidth}>
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="House No, Street, Locality"
            error={errors.address}
            required
          />
        </div>

        <Input
          label="City"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="Mumbai"
          error={errors.city}
          required
        />

        <Input
          label="State"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
          placeholder="Maharashtra"
          error={errors.state}
          required
        />

        <Input
          label="Pincode"
          value={formData.pincode}
          onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="400001"
          maxLength={6}
          error={errors.pincode}
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