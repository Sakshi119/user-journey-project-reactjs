export const validateMobile = (mobile) => {
  return /^[6-9]\d{9}$/.test(mobile);
};

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

export const formatMobile = (mobile) => {
  return mobile.replace(/\D/g, '');
};
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

export const validateAccountNumber = (accNo) => {
  return /^\d{9,18}$/.test(accNo);
};

export const validateIFSC = (ifsc) => {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
};

export const validateAge = (age) => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 120;
};

export const validatePAN = (pan) => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
};