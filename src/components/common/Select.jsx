import React from 'react';
import styles from './Select.module.css';

export const Select = ({
  value,
  onChange,
  options,
  label,
  error,
  placeholder = 'Select...',
  required = false
}) => {
  return (
    <div className={styles.selectWrapper}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p className={styles.error}>{error}</p>
      )}
    </div>
  );
};
