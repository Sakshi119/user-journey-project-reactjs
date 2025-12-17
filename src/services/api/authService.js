const TWOFACTOR_API_KEY = import.meta.env.VITE_TWOFACTOR_API_KEY || '';
const TWOFACTOR_BASE_URL = 'https://2factor.in/API/V1';

// Store session ID for verification
let currentSessionId = null;

/**
 * Send OTP via SMS
 */
export const sendOTP = async (mobile) => {
  try {
    if (!TWOFACTOR_API_KEY) {
      throw new Error('2Factor API key not configured. Add VITE_TWOFACTOR_API_KEY to .env');
    }

    console.log('📤 Sending OTP to:', mobile);

    const url = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/${mobile}/AUTOGEN`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    console.log('📱 2Factor Response:', data);

    if (data.Status === 'Success') {
      currentSessionId = data.Details;
      sessionStorage.setItem('otp_session_id', data.Details);
      sessionStorage.setItem('otp_phone', mobile);

      return {
        success: true,
        message: 'OTP sent successfully'
      };
    }

    throw new Error(data.Details || 'Failed to send OTP');
  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    throw error;
  }
};


/**
 * Send OTP via Voice Call
 */
export const sendOTPviaCall = async (mobile) => {
  try {
    if (!TWOFACTOR_API_KEY) {
      throw new Error('2Factor API key not configured');
    }

    console.log('📞 Initiating voice call to:', mobile);

    // 2Factor Voice API endpoint
    const url = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/VOICE/${mobile}/AUTOGEN`;

    const response = await fetch(url, {
      method: 'GET'
    });

    const data = await response.json();
    console.log('📞 2Factor Voice Response:', data);

    if (data.Status === 'Success') {
      // Store session ID for verification
      currentSessionId = data.Details;
      sessionStorage.setItem('otp_session_id', data.Details);
      sessionStorage.setItem('otp_phone', mobile);

      return {
        success: true,
        message: 'OTP call initiated',
        sessionId: data.Details
      };
    } else {
      throw new Error(data.Details || 'Failed to initiate call');
    }
  } catch (error) {
    console.error('❌ Voice Call Error:', error);
    throw new Error(error.message || 'Failed to initiate call');
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (mobile, otp) => {
  try {
    const sessionId = currentSessionId || sessionStorage.getItem('otp_session_id');
    const storedPhone = sessionStorage.getItem('otp_phone');

    if (!sessionId) throw new Error('Session expired');
    if (storedPhone !== mobile) throw new Error('Phone mismatch');

    const url = `${TWOFACTOR_BASE_URL}/${TWOFACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (data.Status === 'Success') {
      clearOTPSession();
      return { success: true };
    }

    throw new Error('Invalid OTP');
  } catch (error) {
    throw error;
  }
};


/**
 * Clear OTP session
 */
export const clearOTPSession = () => {
  currentSessionId = null;
  sessionStorage.removeItem('otp_session_id');
  sessionStorage.removeItem('otp_phone');
  console.log('🗑️ OTP session cleared');
};



// export const sendOTP = async (mobile) => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   // In production, this would be:
//   // const response = await fetch('/api/auth/send-otp', {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   body: JSON.stringify({ mobile })
//   // });
//   // return response.json();
  
//   console.log('📱 OTP sent to:', mobile);
//   return { success: true, message: 'OTP sent successfully' };
// };

// export const verifyOTP = async (mobile, otp) => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   // Demo logic - in production, replace with actual API call
//   if (otp === '123456') {
//     console.log('✅ OTP verified for:', mobile);
//     return { 
//       success: true, 
//       message: 'OTP verified',
//       user: { mobile, id: Date.now() }
//     };
//   }
  
//   throw new Error('Invalid OTP');
// };

// // Clear OTP session data (if any)
// export const clearOTPSession = () => {
//   // Clear any stored OTP data from sessionStorage
//   try {
//     sessionStorage.removeItem('otp_request_id');
//     sessionStorage.removeItem('otp_phone');
//     console.log('🗑️ OTP session cleared');
//   } catch (error) {
//     console.error('Error clearing OTP session:', error);
//   }
// };
