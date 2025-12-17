/*
  REWRITTEN Google Drive service using Google Identity Services (GIS)
  and Drive REST API. Also includes a simple DOM-based file picker
  (replacement for the deprecated Google Picker).

  Usage:
    import { googleDriveService } from '../../services/api/googleDriveService';
    await googleDriveService.init();
    await googleDriveService.signIn(); // opens consent prompt
    await googleDriveService.uploadFile(file);
    const picked = await googleDriveService.pickFile();

  Notes:
  - This file expects your existing GOOGLE_DRIVE_CONFIG (clientId, apiKey, scope).
  - It does NOT use gapi or google.picker; uses fetch + REST endpoints.
*/

import { GOOGLE_DRIVE_CONFIG } from '../../config/googleDrive';

class GoogleDriveService {
  constructor() {
    this.isInitialized = false;
    this.accessToken = null;
    this.tokenClient = null;
    this.tokenExpiry = null; // epoch ms
  }

  // load GIS client script
  async _loadGisScript() {
    if (window.google && window.google.accounts) return;

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(new Error('Failed to load GIS script'));
      document.head.appendChild(script);
    });
  }

  async init() {
    if (this.isInitialized) return true;

    try {
      await this._loadGisScript();

      // initialize token client
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_DRIVE_CONFIG.clientId,
        scope: GOOGLE_DRIVE_CONFIG.scope,
        callback: (resp) => {
          // callback will be set dynamically in requestAccessToken
          // but keep a fallback
          if (resp && resp.access_token) {
            this._setToken(resp.access_token, resp.expires_in);
          }
        },
      });

      this.isInitialized = true;
      return true;
    } catch (err) {
      console.error('GIS init failed:', err);
      throw err;
    }
  }

  _setToken(token, expiresInSec) {
    this.accessToken = token;
    if (expiresInSec) {
      this.tokenExpiry = Date.now() + expiresInSec * 1000 - 60 * 1000; // refresh 1min early
    }
  }

  // interactive sign-in / consent to get access token
  async signIn() {
    await this.init();

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient.callback = (resp) => {
          if (resp.error) return reject(resp);
          this._setToken(resp.access_token, resp.expires_in);
          resolve(resp);
        };

        // request interactive token (prompts user)
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    });
  }

  // ensure token exists and not expired. If expired or missing, request interactively.
  async ensureToken() {
    if (!this.isInitialized) await this.init();

    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // request interactive token
    await this.signIn();
    return this.accessToken;
  }

  isSignedIn() {
    return !!(this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry);
  }

  async signOut() {
    if (!this.accessToken) return;
    try {
      // revoke token
      await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      });
    } catch (err) {
      console.warn('Token revoke failed', err);
    }

    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // List files (simple wrapper)
  async listFiles({ pageSize = 20, q = "'me' in owners" } = {}) {
    await this.ensureToken();

    const params = new URLSearchParams({
      pageSize: String(pageSize),
      fields: 'files(id,name,mimeType,webViewLink,size,iconLink)',
      q,
    });

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`List files failed: ${res.status} ${txt}`);
    }

    return res.json();
  }

  // Upload file (multipart)
  async uploadFile(file, folderId = null) {
    await this.ensureToken();

    const boundary = '-------314159265358979323846';
    const delimiter = '\r\n--' + boundary + '\r\n';
    const closeDelim = '\r\n--' + boundary + '--';

    const metadata = {
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
    };

    if (folderId) metadata.parents = [folderId];

    const reader = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(new Error('Failed to read file for upload'));
      r.readAsArrayBuffer(file);
    });

    const base64Data = btoa(
      new Uint8Array(reader).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + (file.type || 'application/octet-stream') + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      base64Data +
      closeDelim;

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return {
      id: data.id,
      name: data.name,
      mimeType: data.mimeType,
      webViewLink: `https://drive.google.com/file/d/${data.id}/view`,
    };
  }

  // Simple DOM-based file picker (replacement for google.picker)
  // Presents a modal with a list of files and resolves with selected file or null
  async pickFile({ pageSize = 50 } = {}) {
    await this.ensureToken();

    const listResp = await this.listFiles({ pageSize });
    const files = listResp.files || [];

    return new Promise((resolve) => {
      // create modal elements
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.left = 0;
      overlay.style.top = 0;
      overlay.style.right = 0;
      overlay.style.bottom = 0;
      overlay.style.background = 'rgba(0,0,0,0.4)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = 999999;

      const modal = document.createElement('div');
      modal.style.width = 'min(720px, 95vw)';
      modal.style.maxHeight = '80vh';
      modal.style.overflow = 'auto';
      modal.style.background = '#fff';
      modal.style.borderRadius = '8px';
      modal.style.padding = '16px';
      modal.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';

      const title = document.createElement('h3');
      title.innerText = 'Select a file from Google Drive';
      modal.appendChild(title);

      const list = document.createElement('div');
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '8px';

      if (!files.length) {
        const empty = document.createElement('p');
        empty.innerText = 'No files found.';
        list.appendChild(empty);
      }

      files.forEach((f) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '8px';
        row.style.border = '1px solid #eee';
        row.style.borderRadius = '6px';

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.flexDirection = 'column';

        const name = document.createElement('div');
        name.innerText = f.name;
        left.appendChild(name);

        const meta = document.createElement('div');
        meta.style.fontSize = '12px';
        meta.style.color = '#666';
        meta.innerText = `${f.mimeType || ''} ${f.size ? '• ' + f.size + ' bytes' : ''}`;
        left.appendChild(meta);

        const btn = document.createElement('button');
        btn.innerText = 'Select';
        btn.style.marginLeft = '12px';

        btn.onclick = () => {
          cleanup();
          resolve({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
          });
        };

        row.appendChild(left);
        row.appendChild(btn);
        list.appendChild(row);
      });

      const footer = document.createElement('div');
      footer.style.display = 'flex';
      footer.style.justifyContent = 'flex-end';
      footer.style.marginTop = '12px';

      const cancel = document.createElement('button');
      cancel.innerText = 'Cancel';
      cancel.onclick = () => {
        cleanup();
        resolve(null);
      };

      footer.appendChild(cancel);
      modal.appendChild(list);
      modal.appendChild(footer);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      function cleanup() {
        overlay.remove();
      }
    });
  }
}

export const googleDriveService = new GoogleDriveService();

/*
  ---------------------------
  USAGE NOTES / MIGRATION TIPS
  ---------------------------
  1) Make sure your Google Cloud OAuth client (clientId) has the correct
     authorized JavaScript origins (e.g., http://localhost:5173) and
     redirect URIs if needed.

  2) The scope used above is `drive.file` (only files created or opened by
     the app). If you need different permissions, change the scope in
     your config, but be aware of security and verification requirements.

  3) Since this implementation uses a DOM-based picker, you can style
     the modal per your app design or replace it with a React component
     that calls googleDriveService.listFiles() and shows the files there.

  4) This avoids gapi and google.picker and will not trigger the
     idpiframe_initialization_failed error.
*/
