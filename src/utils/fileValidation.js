import { FILE_VALIDATION } from '../config/googleDrive';

export const validateFile = (file, type) => {
  const rules = FILE_VALIDATION[type];

  if (!rules) {
    return { valid: false, error: 'Invalid file type specified' };
  }

  // Check file size
  if (file.size > rules.maxSize) {
    const maxSizeMB = rules.maxSize / (1024 * 1024);
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Only ${rules.allowedExtensions.join(', ')} files are allowed` 
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (mimeType) => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('image')) return '🖼️';
  return '📎';
};