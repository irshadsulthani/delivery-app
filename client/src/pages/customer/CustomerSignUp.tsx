import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slice/authSlice';
import { IUserSignup } from '../../interfaces/customer/IUserSignup';
import loginImage from '../../../public/customer/login/Sign In.png';
import logicIcon from '../../../public/customer/login/4137516.webp';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface IUserLogin {
  email: string;
  password: string;
}

function CustomerAuth() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const [signupData, setSignupData] = useState<IUserSignup>({
    name: '',
    email: '',
    password: '',
  });
  const [loginData, setLoginData] = useState<IUserLogin>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // OTP related states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [pendingAuthData, setPendingAuthData] = useState<any>(null); // Store pending auth data during OTP verification

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const handleSignupChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setFormError(''); 
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setFormError(''); 
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
  
    try {

      const response = await api.post('/users/send-otp', {
        email: signupData.email,
        action: 'signup'
      });
      
      setOtpEmail(signupData.email);
      

      setPendingAuthData({
        action: 'signup',
        data: signupData
      });
      
      setShowOtpModal(true);
    }
    catch (error: any) {
      console.error("OTP request failed:", error);
      setFormError(error.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');
  
    try {

      const response = await api.post('/users/send-otp', {
        email: loginData.email,
        action: 'login'
      });
      
      setOtpEmail(loginData.email);
      
      setPendingAuthData({
        action: 'login',
        data: loginData
      });
      
      setShowOtpModal(true);
    }
    catch (error: any) {
      console.error("OTP request failed:", error);
      setFormError(error.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {

    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    
    const otpValue = otp.join('');
    
    try {
      let endpoint, payload, responseData;
      
      if (pendingAuthData?.action === 'signup') {

        endpoint = '/users/verify-otp';
        payload = {
          ...pendingAuthData.data, 
          otp: otpValue
        };
      } else {

        endpoint = '/users/login';
        payload = {
          email: pendingAuthData.data.email,
          password: pendingAuthData.data.password,
          otp: otpValue
        };
      }
      
      const response = await api.post(endpoint, payload);
      responseData = response.data;
      
      dispatch(setUser({
        email: responseData.email,
        role: responseData.role,
        token: responseData.token,
      }));
      

      if (pendingAuthData?.action === 'signup') {
        setSignupData({ name: '', email: '', password: '' });
      } else {
        setLoginData({ email: '', password: '' });
      }
      
      setPendingAuthData(null);
      
      setShowOtpModal(false);
      navigate('/');
    } catch (error: any) {
      console.error("OTP verification failed:", error);
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setResendDisabled(true);
    setOtpError('');
    
    try {
      await api.post('/users/send-otp', { 
        email: otpEmail,
        action: pendingAuthData?.action || 'signup'
      });

      setOtpError(''); 
    } catch (error: any) {
      console.error("Failed to resend OTP:", error);
      setOtpError("Failed to resend verification code. Please try again later.");
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(['', '', '', '']);
    setOtpError('');
    setPendingAuthData(null);
  };

  const handleGoogleAuth = async () => {
    console.log('Google authentication clicked');
    // Implement OAuth logic
  };

  const handleAppleAuth = async () => {
    console.log('Apple authentication clicked');
    // Implement OAuth logic
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormError('');
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={loginImage} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col md:flex-row overflow-hidden">
        <div 
          className="w-full md:w-2/5 p-8 flex flex-col justify-center items-center" 
          style={{ backgroundColor: '#51C8BC' }}
        >
          <img 
            src={logicIcon} 
            alt="Fresh Vegetables" 
            className="w-40 h-40 object-contain mb-6" 
          />
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4 font-sans">
            Fresh Veggies, Fast Delivery
          </h2>
          <p className="text-white text-center text-lg font-sans">
            Join now for the fastest vegetable delivery in town
          </p>
          <div className="mt-8 bg-white bg-opacity-20 p-4 rounded-lg">
            <p className="text-white text-center text-sm font-sans">
              "Our customers love our fresh produce and lightning-fast delivery service!"
            </p>
          </div>
        </div>
        
        {/* Right Section - Form */}
        <div className="w-full md:w-3/5 p-8">
          {/* Auth Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                  isSignUp 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}
                style={{ backgroundColor: isSignUp ? '#51C8BC' : '' }}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                  !isSignUp 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}
                style={{ backgroundColor: !isSignUp ? '#51C8BC' : '' }}
              >
                Sign In
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-sans">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>

          {/* Display form errors */}
          {formError && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
              {formError}
            </div>
          )}

          {isSignUp ? (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Password</label>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  placeholder="Create a password"
                />
                <p className="mt-1 text-xs text-gray-500 font-sans">Password must be at least 8 characters long</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center font-sans"
                style={{ backgroundColor: '#51C8BC' }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                  placeholder="Enter your password"
                />
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-xs text-emerald-600 hover:text-emerald-800 font-sans">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center font-sans"
                style={{ backgroundColor: '#51C8BC' }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 font-sans">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <button 
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="mr-3">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
            
            <button 
              onClick={handleAppleAuth}
              className="w-full flex items-center justify-center bg-black text-white border border-black rounded-lg px-4 py-3 font-medium hover:bg-gray-900 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-3" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.33-3.14-2.57C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              {isSignUp ? 'Sign up with Apple' : 'Sign in with Apple'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 font-sans">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-emerald-600 hover:text-emerald-800 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 font-sans">Verification Required</h3>
              <p className="text-gray-600 font-sans">
                We've sent a 4-digit code to <span className="font-medium">{otpEmail}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={`otp-${index}`}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                ))}
              </div>

              {otpError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                disabled={otpLoading || otp.some(digit => !digit)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex justify-center font-sans disabled:bg-emerald-300"
                style={{ backgroundColor: '#51C8BC' }}
              >
                {otpLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2 font-sans">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm font-sans"
              >
                {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={closeOtpModal}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm font-sans"
              >
                Try a different method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerAuth;