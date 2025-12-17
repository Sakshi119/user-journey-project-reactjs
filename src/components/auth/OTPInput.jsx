import React from 'react';
import { Button } from '../common/Button';
import { DEMO_OTP, COUNTRY_CODE } from '../../utils/constants';
import styles from './OTPInput.module.css';

export const OTPInput = ({ 
  mobile,
  otp,
  otpRefs,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onSubmit,
  onEditMobile,
  onResend,
  timer,
  canResend,
  error,
  loading
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <svg className="w-8 h-8" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24" width="32" height="32">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className={styles.title}>
          Verify OTP
        </h2>
        <p className={styles.subtitle}>
          Code sent to {COUNTRY_CODE} {mobile}
        </p>
        <button
          onClick={onEditMobile}
          className={styles.changeNumber}
        >
          Change number
        </button>
      </div>

      <div className={styles.otpSection}>
        <label className={styles.otpLabel}>
          Enter 6-digit OTP
        </label>
        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => otpRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => onOtpChange(index, e.target.value)}
              onKeyDown={(e) => {
                onOtpKeyDown(index, e);
                if (e.key === 'Enter') onSubmit();
              }}
              onPaste={onOtpPaste}
              className={styles.otpInput}
              autoFocus={index === 0}
            />
          ))}
        </div>
        {error && (
          <p className={styles.error}>{error}</p>
        )}
        <p className={styles.demoHint}>
          Demo: Use <span className={styles.demoOtp}>{DEMO_OTP}</span> as OTP
        </p>
      </div>

      <Button
        onClick={onSubmit}
        disabled={loading || otp.join('').length !== 6}
        loading={loading}
        fullWidth
      >
        Verify OTP
      </Button>

      <div className={styles.resendSection}>
        {!canResend ? (
          <p className={styles.timerText}>
            Resend OTP in <span className={styles.timerCount}>{timer}s</span>
          </p>
        ) : (
          <button
            onClick={onResend}
            className={styles.resendButton}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};