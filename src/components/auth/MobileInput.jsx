
import React, { useState } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { COUNTRY_CODE } from '../../utils/constants';
import styles from './MobileInput.module.css';

export const MobileInput = ({ 
  mobile, 
  onChange, 
  onSubmit, 
  error, 
  loading 
}) => {
  const [otpMethod, setOtpMethod] = useState('sms'); // 'sms' or 'call'

  const handleSubmit = () => {
    onSubmit(otpMethod); // Pass selected method
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Phone color="#2563eb" size={32} />
        </div>
        <h2 className={styles.title}>Welcome!</h2>
        <p className={styles.subtitle}>
          Enter your mobile number to get started
        </p>
      </div>

      <Input
        type="tel"
        value={mobile}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        label="Mobile Number"
        prefix={COUNTRY_CODE}
        placeholder="9876543210"
        maxLength={10}
        error={error}
        autoFocus
      />

      {/* OTP Method Selection */}
      <div className={styles.methodSelection}>
        <label className={styles.methodLabel}>
          Receive OTP via:
        </label>
        <div className={styles.methodButtons}>
          <button
            type="button"
            className={`${styles.methodBtn} ${otpMethod === 'sms' ? styles.active : ''}`}
            onClick={() => setOtpMethod('sms')}
          >
            <span className={styles.methodIcon}>📱</span>
            <span>SMS</span>
          </button>
          <button
            type="button"
            className={`${styles.methodBtn} ${otpMethod === 'call' ? styles.active : ''}`}
            onClick={() => setOtpMethod('call')}
          >
            <span className={styles.methodIcon}>📞</span>
            <span>Voice Call</span>
          </button>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        loading={loading}
        fullWidth
        icon={!loading && <ArrowRight size={20} />}
      >
        {loading ? 'Sending...' : `Send OTP via ${otpMethod === 'sms' ? 'SMS' : 'Call'}`}
      </Button>
    </div>
  );
};