import React from 'react';
import styles from './Input.module.css';

export const Input = ({
  type = 'text',
  value,
  onChange,
  onKeyDown,
  placeholder,
  label,
  error,
  prefix,
  maxLength,
  autoFocus = false,
  className = ''
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {prefix && (
          <span className={styles.prefix}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className={`${styles.input} ${prefix ? styles.hasPrefix : ''} ${className}`}
        />
      </div>
      {error && (
        <p className={styles.error}>{error}</p>
      )}
    </div>
  );
};
