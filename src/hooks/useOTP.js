import { useState, useRef } from 'react';
import { OTP_LENGTH } from '../utils/constants';

export const useOTP = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const otpRefs = useRef([]);

  // Initialize refs
  if (otpRefs.current.length !== OTP_LENGTH) {
    otpRefs.current = Array(OTP_LENGTH).fill(null).map((_, i) => otpRefs.current[i] || null);
  }

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < OTP_LENGTH) newOtp.push('');
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, OTP_LENGTH - 1);
    otpRefs.current[lastFilledIndex]?.focus();
  };

  const getOTPValue = () => otp.join('');

  const clearOTP = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    otpRefs.current[0]?.focus();
  };

  return {
    otp,
    otpRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    getOTPValue,
    clearOTP
  };
};
 