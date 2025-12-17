import React, { useState } from 'react';
import { Edit2, Check, User, Users, Building2, FileText, Phone } from 'lucide-react';
import { Button } from '../common/Button';
import { COUNTRY_CODE } from '../../utils/constants';
import { formatFileSize } from '../../utils/fileValidation';
import styles from './PreviewScreen.module.css';

export const PreviewScreen = ({ 
  registrationData, 
  onEdit, 
  onSubmit, 
  onBack 
}) => {
  const [loading, setLoading] = useState(false);

  const handleFinalSubmit = async () => {
    setLoading(true);
    
    // Simulate final API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Final Submission:', registrationData);
    setLoading(false);
    
    onSubmit();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Review Your Information</h2>
        <p className={styles.subtitle}>
          Please review all details carefully before submitting
        </p>
      </div>

      <div className={styles.sectionsContainer}>
        {/* Mobile Number Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Phone size={20} className={styles.icon} />
              <h3>Mobile Number</h3>
            </div>
            <button 
              onClick={() => onEdit('mobile')} 
              className={styles.editButton}
              type="button"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataRow}>
              <span className={styles.label}>Mobile Number:</span>
              <span className={styles.value}>{COUNTRY_CODE} {registrationData.mobile}</span>
            </div>
            <div className={styles.badge}>
              <Check size={14} />
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <User size={20} className={styles.icon} />
              <h3>Personal Details</h3>
            </div>
            <button 
              onClick={() => onEdit('personal')} 
              className={styles.editButton}
              type="button"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataGrid}>
              <div className={styles.dataRow}>
                <span className={styles.label}>Full Name:</span>
                <span className={styles.value}>{registrationData.personal?.fullName || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Date of Birth:</span>
                <span className={styles.value}>
                  {registrationData.personal?.dob 
                    ? new Date(registrationData.personal.dob).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{registrationData.personal?.email || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Gender:</span>
                <span className={styles.value}>{registrationData.personal?.gender || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Address:</span>
                <span className={styles.value}>{registrationData.personal?.address || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>City:</span>
                <span className={styles.value}>{registrationData.personal?.city || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>State:</span>
                <span className={styles.value}>{registrationData.personal?.state || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Pincode:</span>
                <span className={styles.value}>{registrationData.personal?.pincode || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nominee Details Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Users size={20} className={styles.icon} />
              <h3>Nominee Details</h3>
            </div>
            <button 
              onClick={() => onEdit('nominee')} 
              className={styles.editButton}
              type="button"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataGrid}>
              <div className={styles.dataRow}>
                <span className={styles.label}>Nominee Name:</span>
                <span className={styles.value}>{registrationData.nominee?.nomineeName || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Relationship:</span>
                <span className={styles.value}>{registrationData.nominee?.relationship || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Age:</span>
                <span className={styles.value}>{registrationData.nominee?.nomineeAge || 'N/A'} years</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Address:</span>
                <span className={styles.value}>{registrationData.nominee?.nomineeAddress || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Building2 size={20} className={styles.icon} />
              <h3>Bank Details</h3>
            </div>
            <button 
              onClick={() => onEdit('bank')} 
              className={styles.editButton}
              type="button"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.dataGrid}>
              <div className={styles.dataRow}>
                <span className={styles.label}>Account Holder Name:</span>
                <span className={styles.value}>{registrationData.bank?.accountHolderName || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Account Number:</span>
                <span className={styles.value}>
                  {registrationData.bank?.accountNumber 
                    ? `****${registrationData.bank.accountNumber.slice(-4)}`
                    : 'N/A'}
                </span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>IFSC Code:</span>
                <span className={styles.value}>{registrationData.bank?.ifscCode || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Bank Name:</span>
                <span className={styles.value}>{registrationData.bank?.bankName || 'N/A'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Branch Name:</span>
                <span className={styles.value}>{registrationData.bank?.branchName || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <FileText size={20} className={styles.icon} />
              <h3>Documents</h3>
            </div>
            <button 
              onClick={() => onEdit('documents')} 
              className={styles.editButton}
              type="button"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.documentsGrid}>
              {/* ID Proof */}
              <div className={styles.documentCard}>
                <div className={styles.documentHeader}>
                  <span className={styles.documentLabel}>ID Proof</span>
                  {registrationData.documents?.idProof && (
                    <span className={styles.documentBadge}>
                      <Check size={12} />
                      Uploaded
                    </span>
                  )}
                </div>
                {registrationData.documents?.idProof ? (
                  <div className={styles.documentInfo}>
                    <div className={styles.documentPreview}>
                      {registrationData.documents.idProof.preview ? (
                        <img 
                          src={registrationData.documents.idProof.preview} 
                          alt="ID Proof" 
                          className={styles.previewImage}
                        />
                      ) : (
                        <div className={styles.fileIconLarge}>📄</div>
                      )}
                    </div>
                    <div className={styles.documentDetails}>
                      <p className={styles.documentName}>
                        {registrationData.documents.idProof.name}
                      </p>
                      {registrationData.documents.idProof.size && (
                        <p className={styles.documentSize}>
                          {formatFileSize(registrationData.documents.idProof.size)}
                        </p>
                      )}
                      <p className={styles.documentSource}>
                        {registrationData.documents.idProof.source === 'local' && '💻 Local'}
                        {registrationData.documents.idProof.source === 'google-drive' && '☁️ Google Drive'}
                      </p>
                      {registrationData.documents.idProof.webViewLink && (
                        <a 
                          href={registrationData.documents.idProof.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewLink}
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className={styles.noDocument}>No document uploaded</p>
                )}
              </div>

              {/* Photo */}
              <div className={styles.documentCard}>
                <div className={styles.documentHeader}>
                  <span className={styles.documentLabel}>Your Photo</span>
                  {registrationData.documents?.photo && (
                    <span className={styles.documentBadge}>
                      <Check size={12} />
                      Uploaded
                    </span>
                  )}
                </div>
                {registrationData.documents?.photo ? (
                  <div className={styles.documentInfo}>
                    <div className={styles.documentPreview}>
                      {registrationData.documents.photo.preview ? (
                        <img 
                          src={registrationData.documents.photo.preview} 
                          alt="Photo" 
                          className={styles.previewImage}
                        />
                      ) : (
                        <div className={styles.fileIconLarge}>🖼️</div>
                      )}
                    </div>
                    <div className={styles.documentDetails}>
                      <p className={styles.documentName}>
                        {registrationData.documents.photo.name}
                      </p>
                      {registrationData.documents.photo.size && (
                        <p className={styles.documentSize}>
                          {formatFileSize(registrationData.documents.photo.size)}
                        </p>
                      )}
                      <p className={styles.documentSource}>
                        {registrationData.documents.photo.source === 'local' && '💻 Local'}
                        {registrationData.documents.photo.source === 'google-drive' && '☁️ Google Drive'}
                      </p>
                      {registrationData.documents.photo.webViewLink && (
                        <a 
                          href={registrationData.documents.photo.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewLink}
                        >
                          View Photo
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className={styles.noDocument}>No photo uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className={styles.declaration}>
        <div className={styles.declarationContent}>
          <Check size={20} className={styles.declarationIcon} />
          <p>
            I hereby declare that all the information provided above is true and accurate 
            to the best of my knowledge. I understand that any false information may lead 
            to rejection of my application.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonGroup}>
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button onClick={handleFinalSubmit} loading={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </div>
  );
};
