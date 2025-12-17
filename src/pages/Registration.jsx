import React, { useState, useEffect } from 'react';
import { StepIndicator } from '../components/auth/StepIndicator';
import { MobileInput } from '../components/auth/MobileInput';
import { OTPInput } from '../components/auth/OTPInput';
import { PersonalDetailsForm } from '../components/registration/PersonalDetailsForm';
import { NomineeDetailsForm } from '../components/registration/NomineeDetailsForm';
import { BankDetailsForm } from '../components/registration/BankDetailsForm';
import { DocumentUploadForm } from '../components/registration/DocumentUploadForm';
import { PreviewScreen } from '../components/registration/PreviewScreen';
import { RegistrationSuccess } from '../components/auth/RegistrationSuccess';
import { ResumeDraftModal } from '../components/common/ResumeDraftModal';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { AutoSaveIndicator } from '../components/common/AutoSaveIndicator';
import { useTimer } from '../hooks/useTimer';
import { useOTP } from '../hooks/useOTP';
import { useRegistrationData } from '../hooks/useRegistrationData';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { validateMobile, formatMobile } from '../utils/validation';
import { sendOTP,sendOTPviaCall, verifyOTP, clearOTPSession } from '../services/api/authService';
import { REGISTRATION_STEPS, OTP_TIMER_SECONDS } from '../utils/constants';
import styles from './Registration.module.css';

export default function Registration() {
  // Current step state
  const [step, setStep] = useState(REGISTRATION_STEPS.MOBILE);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-save & offline hooks
  const {
    registrationData,
    updateData,
    clearAll,
    hasDraft,
    draftTimestamp,
    restoreDraft,
    discardDraft
  } = useRegistrationData();

  const { isOnline, wasOffline } = useOnlineStatus();
  const [showDraftModal, setShowDraftModal] = useState(false);

  // OTP Timer
  const { timer, start: startTimer, reset: resetTimer } = useTimer(
    OTP_TIMER_SECONDS,
    () => setCanResend(true)
  );
  const [canResend, setCanResend] = useState(false);

  // OTP Input
  const {
    otp,
    otpRefs,
    handleChange: handleOtpChange,
    handleKeyDown: handleOtpKeyDown,
    handlePaste: handleOtpPaste,
    getOTPValue,
    clearOTP
  } = useOTP();

  // Check for draft on mount
  useEffect(() => {
    if (hasDraft) {
      setShowDraftModal(true);
    }
  }, [hasDraft]);

  // Remove this useEffect - we'll update mobile only when OTP is verified
  // The mobile number will be saved when moving to OTP step

  // ==========================================
  // MOBILE NUMBER HANDLERS
  // ==========================================

  const handleMobileChange = (e) => {
    const formatted = formatMobile(e.target.value);
    setMobile(formatted);
    setError('');
  };

const handleMobileSubmit = async (method = 'sms') => {
  setError('');
  
  if (!validateMobile(mobile)) {
    setError('Please enter a valid 10-digit mobile number');
    return;
  }

  setLoading(true);
  try {
    // Call appropriate method based on selection
    if (method === 'call') {
      await sendOTPviaCall(mobile);
    } else {
      await sendOTP(mobile);
    }
    
    updateData('mobile', mobile);
    setStep(REGISTRATION_STEPS.OTP);
    startTimer();
    setCanResend(false);
  } catch (err) {
    setError(err.message || 'Failed to send OTP');
  } finally {
    setLoading(false);
  }
};

  // ==========================================
  // OTP HANDLERS
  // ==========================================

const handleOtpSubmit = async () => {
  const otpValue = getOTPValue();

  if (otpValue.length !== 6) {
    setError('Please enter complete OTP');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await verifyOTP(mobile, otpValue);

    if (response?.success) {
      clearOTP();
      setStep(REGISTRATION_STEPS.PERSONAL);
    } else {
      setError('Invalid OTP. Please try again');
    }
  } catch (err) {
    setError(err.message || 'OTP verification failed');
  } finally {
    setLoading(false);
  }
};

  const handleResendOtp = async () => {
    setCanResend(false);
    clearOTP();
    setError('');
    setLoading(true);
    
    try {
      // Simulate resend OTP
      await sendOTP(mobile);
      startTimer();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
      setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMobile = () => {
    setStep(REGISTRATION_STEPS.MOBILE);
    clearOTP();
    setError('');
    resetTimer();
    clearOTPSession();
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handlePersonalDetailsSubmit = (data) => {
    updateData('personal', data);
    setStep(REGISTRATION_STEPS.NOMINEE);
  };

  const handlePersonalDetailsBack = () => {
    setStep(REGISTRATION_STEPS.OTP);
  };

  const handleNomineeDetailsSubmit = (data) => {
    updateData('nominee', data);
    setStep(REGISTRATION_STEPS.BANK);
  };

  const handleNomineeDetailsBack = () => {
    setStep(REGISTRATION_STEPS.PERSONAL);
  };

  const handleBankDetailsSubmit = (data) => {
    updateData('bank', data);
    setStep(REGISTRATION_STEPS.DOCUMENTS);
  };

  const handleBankDetailsBack = () => {
    setStep(REGISTRATION_STEPS.NOMINEE);
  };

  const handleDocumentUploadSubmit = (data) => {
    updateData('documents', data);
    setStep(REGISTRATION_STEPS.PREVIEW);
  };

  const handleDocumentUploadBack = () => {
    setStep(REGISTRATION_STEPS.BANK);
  };

  // ==========================================
  // PREVIEW SCREEN HANDLERS
  // ==========================================

  const handleEdit = (section) => {
    // Navigate to specific section for editing
    const sectionMap = {
      mobile: REGISTRATION_STEPS.MOBILE,
      personal: REGISTRATION_STEPS.PERSONAL,
      nominee: REGISTRATION_STEPS.NOMINEE,
      bank: REGISTRATION_STEPS.BANK,
      documents: REGISTRATION_STEPS.DOCUMENTS
    };
    
    setStep(sectionMap[section]);
  };

  const handlePreviewBack = () => {
    setStep(REGISTRATION_STEPS.DOCUMENTS);
  };

  const handleFinalSubmit = async () => {
    // Log all registration data
    console.log('═══════════════════════════════════════');
    console.log('FINAL REGISTRATION DATA:');
    console.log('═══════════════════════════════════════');
    console.log('Mobile:', registrationData.mobile);
    console.log('Personal:', registrationData.personal);
    console.log('Nominee:', registrationData.nominee);
    console.log('Bank:', registrationData.bank);
    console.log('Documents:', registrationData.documents);
    console.log('═══════════════════════════════════════');

    // Here you would send data to your backend API
    // Example:
    // try {
    //   const response = await fetch('/api/registration', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(registrationData)
    //   });
    //   const result = await response.json();
    //   console.log('Server response:', result);
    // } catch (error) {
    //   console.error('Submission error:', error);
    //   return;
    // }

    // Clear auto-saved draft after successful submission
    clearAll();
    
    // Navigate to success screen
    setStep(REGISTRATION_STEPS.SUCCESS);
  };

  // ==========================================
  // RESUME DRAFT HANDLERS
  // ==========================================

  const handleResumeDraft = () => {
    const restored = restoreDraft();
    
    if (restored) {
      // Set mobile from restored data
      if (registrationData.mobile) {
        setMobile(registrationData.mobile);
      }

      // Determine which step to navigate to based on completed data
      if (!registrationData.personal?.fullName) {
        setStep(REGISTRATION_STEPS.PERSONAL);
      } else if (!registrationData.nominee?.nomineeName) {
        setStep(REGISTRATION_STEPS.NOMINEE);
      } else if (!registrationData.bank?.accountNumber) {
        setStep(REGISTRATION_STEPS.BANK);
      } else if (!registrationData.documents?.idProof) {
        setStep(REGISTRATION_STEPS.DOCUMENTS);
      } else {
        setStep(REGISTRATION_STEPS.PREVIEW);
      }
    }
    
    setShowDraftModal(false);
  };

  const handleDiscardDraft = () => {
    discardDraft();
    setShowDraftModal(false);
  };

  // ==========================================
  // SUCCESS HANDLER
  // ==========================================

  const handleRegisterAnother = () => {
    setStep(REGISTRATION_STEPS.MOBILE);
    setMobile('');
    clearOTP();
    setError('');
    resetTimer();
    clearOTPSession();
    clearAll(); // Only clear after success when user clicks "Register Another"
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className={styles.pageContainer}>
      {/* Resume Draft Modal */}
      <ResumeDraftModal
        isOpen={showDraftModal}
        timestamp={draftTimestamp}
        onResume={handleResumeDraft}
        onDiscard={handleDiscardDraft}
      />

      {/* Offline Status Banner */}
      <OfflineBanner isOnline={isOnline} wasOffline={wasOffline} />

      {/* Auto-save Indicator */}
      <AutoSaveIndicator lastSaved={draftTimestamp} />

      {/* Main Registration Card */}
      <div className={styles.card}>
        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step 1: Mobile Number */}
        {step === REGISTRATION_STEPS.MOBILE && (
          <MobileInput
            mobile={mobile}
            onChange={handleMobileChange}
            onSubmit={handleMobileSubmit}
            error={error}
            loading={loading}
          />
        )}

        {/* Step 2: OTP Verification */}
        {step === REGISTRATION_STEPS.OTP && (
          <OTPInput
            mobile={mobile}
            otp={otp}
            otpRefs={otpRefs}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onSubmit={handleOtpSubmit}
            onEditMobile={handleEditMobile}
            onResend={handleResendOtp}
            timer={timer}
            canResend={canResend}
            error={error}
            loading={loading}
          />
        )}

        {/* Step 3: Personal Details */}
        {step === REGISTRATION_STEPS.PERSONAL && (
          <PersonalDetailsForm
            onSubmit={handlePersonalDetailsSubmit}
            onBack={handlePersonalDetailsBack}
            initialData={registrationData.personal}
          />
        )}

        {/* Step 4: Nominee Details */}
        {step === REGISTRATION_STEPS.NOMINEE && (
          <NomineeDetailsForm
            onSubmit={handleNomineeDetailsSubmit}
            onBack={handleNomineeDetailsBack}
            initialData={registrationData.nominee}
          />
        )}

        {/* Step 5: Bank Details */}
        {step === REGISTRATION_STEPS.BANK && (
          <BankDetailsForm
            onSubmit={handleBankDetailsSubmit}
            onBack={handleBankDetailsBack}
            initialData={registrationData.bank}
          />
        )}

        {/* Step 6: Document Upload */}
        {step === REGISTRATION_STEPS.DOCUMENTS && (
          <DocumentUploadForm
            onSubmit={handleDocumentUploadSubmit}
            onBack={handleDocumentUploadBack}
            initialData={registrationData.documents}
          />
        )}

        {/* Step 7: Preview & Review */}
        {step === REGISTRATION_STEPS.PREVIEW && (
          <PreviewScreen
            registrationData={registrationData}
            onEdit={handleEdit}
            onSubmit={handleFinalSubmit}
            onBack={handlePreviewBack}
          />
        )}

        {/* Step 8: Success */}
        {step === REGISTRATION_STEPS.SUCCESS && (
          <RegistrationSuccess
            mobile={mobile}
            onRegisterAnother={handleRegisterAnother}
          />
        )}
      </div>
    </div>
  );
}
