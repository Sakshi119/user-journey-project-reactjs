import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../common/Button';
import { COUNTRY_CODE } from '../../utils/constants';
import styles from './RegistrationSuccess.module.css';

export const RegistrationSuccess = ({ mobile, onRegisterAnother }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Check color="#16a34a" size={48} />
      </div>
      <h2 className={styles.title}>
        Verified!
      </h2>
      <p className={styles.subtitle}>
        Your mobile number has been successfully verified
      </p>
      <div className={styles.infoCard}>
        <p className={styles.infoLabel}>Registered Number</p>
        <p className={styles.infoValue}>{COUNTRY_CODE} {mobile}</p>
      </div>
      <Button
        onClick={onRegisterAnother}
        variant="text"
      >
        Register another number
      </Button>
    </div>
  );
};