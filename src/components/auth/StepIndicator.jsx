import React from 'react';
import { Check } from 'lucide-react';
import styles from './StepIndicator.module.css';
import { REGISTRATION_STEPS } from '../../utils/constants';

export const StepIndicator = ({ currentStep }) => {
  const steps = [
    { key: REGISTRATION_STEPS.MOBILE, number: 1, label: 'Mobile' },
    { key: REGISTRATION_STEPS.OTP, number: 2, label: 'OTP' },
    { key: REGISTRATION_STEPS.PERSONAL, number: 3, label: 'Personal' },
    { key: REGISTRATION_STEPS.NOMINEE, number: 4, label: 'Nominee' },
    { key: REGISTRATION_STEPS.BANK, number: 5, label: 'Bank' },
    { key: REGISTRATION_STEPS.DOCUMENTS, number: 6, label: 'Docs' },
    { key: REGISTRATION_STEPS.PREVIEW, number: 7, label: 'Review' }
  ];

  const getStepStatus = (stepKey) => {
    if (currentStep === REGISTRATION_STEPS.SUCCESS) {
      return 'completed';
    }
    
    const stepOrder = [
      REGISTRATION_STEPS.MOBILE,
      REGISTRATION_STEPS.OTP,
      REGISTRATION_STEPS.PERSONAL,
      REGISTRATION_STEPS.NOMINEE,
      REGISTRATION_STEPS.BANK,
      REGISTRATION_STEPS.DOCUMENTS,
      REGISTRATION_STEPS.PREVIEW,
      REGISTRATION_STEPS.SUCCESS
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepKey);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className={styles.stepIndicator}>
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          return (
            <React.Fragment key={step.key}>
              <div className={styles.stepWrapper}>
                <div className={`${styles.step} ${styles[status]}`}>
                  {status === 'completed' ? <Check size={16} /> : step.number}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`${styles.connector} ${styles[status === 'completed' ? 'completed' : 'pending']}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};