
export class StorageManager {
  static QUOTA_THRESHOLD = 0.9; // 90% of quota
  static MAX_AGE_DAYS = 7; // Keep drafts for 7 days max

  // Check available storage
  static async checkQuota() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = (usage / quota) * 100;

      return {
        usage,
        quota,
        percentUsed,
        available: quota - usage,
        isNearLimit: percentUsed > (this.QUOTA_THRESHOLD * 100)
      };
    }
    return null;
  }

  // Clean old drafts
  static cleanOldDrafts() {
    const now = Date.now();
    const maxAge = this.MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    Object.keys(localStorage).forEach(key => {
      if (key.endsWith('_timestamp')) {
        const timestamp = localStorage.getItem(key);
        const age = now - new Date(timestamp).getTime();

        if (age > maxAge) {
          const dataKey = key.replace('_timestamp', '');
          localStorage.removeItem(dataKey);
          localStorage.removeItem(key);
          console.log(`🗑️ Cleaned old draft: ${dataKey}`);
        }
      }
    });
  }

  // Export data for backup
  static exportData(key) {
    const data = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);

    if (!data) return null;

    return {
      data: JSON.parse(data),
      timestamp,
      exported: new Date().toISOString()
    };
  }

  // Import data from backup
  static importData(key, backup) {
    try {
      localStorage.setItem(key, JSON.stringify(backup.data));
      localStorage.setItem(`${key}_timestamp`, backup.timestamp);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Get storage info for debugging
  static getStorageInfo() {
    const keys = Object.keys(localStorage);
    const info = {};

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      info[key] = {
        size: value.length,
        sizeKB: (value.length / 1024).toFixed(2)
      };
    });

    return info;
  }
}