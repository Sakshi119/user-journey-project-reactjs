export const GOOGLE_DRIVE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  scope: 'https://www.googleapis.com/auth/drive.file',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
};

// File validation rules
export const FILE_VALIDATION = {
  idProof: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  photo: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    allowedExtensions: ['.jpg', '.jpeg', '.png']
  }
};