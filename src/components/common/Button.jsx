import React from 'react';
import styles from './Button.module.css';

export const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  fullWidth = false,
  icon = null,
  className = ''
}) => {
  const buttonClasses = `
    ${styles.button} 
    ${styles[variant]} 
    ${fullWidth ? styles.fullWidth : ''} 
    ${className}
  `.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      <span>{loading ? 'Loading...' : children}</span>
      {icon && !loading && icon}
    </button>
  );
};