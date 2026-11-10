import { useState, FormEvent } from 'react';
import { X, Lock, Phone, Mail, User, ShieldCheck, Sun, Moon } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'password' | 'otp' | 'register';
  onLoginSuccess: (userData: { name: string; email: string; phone: string }) => void;
  onShowForgotPassword: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  initialTab = 'password',
  onLoginSuccess,
  onShowForgotPassword,
  showToast,
  isLightMode = false,
  onToggleTheme = () => {},
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'password' | 'otp' | 'register'>(initialTab);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // OTP states
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Register states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpCode, setRegOtpCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!isOpen) return null;

  // Handles standard password login
  const handlePasswordLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      showToast('Please fill out all fields.', 'error');
      return;
    }

    // Dynamic mock logins
    const testUsers = JSON.parse(localStorage.getItem('alike_users') || '[]');
    let matchedUser = testUsers.find(
      (u: any) => u.email === emailOrPhone || u.phone === emailOrPhone
    );

    // Support a fallback default HNW buyer if no local match
    if (!matchedUser && (emailOrPhone === 'elite@alike.com' || emailOrPhone === '9999999999')) {
      matchedUser = { name: 'Vikram Malhotra', email: 'elite@alike.com', phone: '9999999999' };
    }

    if (!matchedUser) {
      // Create user automatically for testing ease so they don't get stuck
      matchedUser = {
        name: emailOrPhone.split('@')[0] || 'Alike VIP Guest',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'guest@alike.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '9876543210'
      };
      // Keep in localStorage
      const users = [...testUsers, matchedUser];
      localStorage.setItem('alike_users', JSON.stringify(users));
    }

    onLoginSuccess(matchedUser);
    showToast(`Welcome back, ${matchedUser.name}!`, 'success');
    onClose();
  };

  // Sends OTP Code
  const sendOTP = (phoneNum: string, isRegister: boolean) => {
    if (!phoneNum || phoneNum.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    showToast('OTP Code sent successfully: 123456', 'info');
    if (isRegister) {
      setRegOtpSent(true);
    } else {
      setOtpSent(true);
    }
  };

  // OTP Login verify
  const handleOtpVerify = (e: FormEvent) => {
    e.preventDefault();
    if (!phone || !otpCode) {
      showToast('Please complete current verification.', 'error');
      return;
    }
    if (otpCode !== '123456') {
      showToast('Invalid OTP. Use demo code 123456', 'error');
      return;
    }

    const testUser = {
      name: 'Valued Alike Customer',
      email: 'verified_user@alike.com',
      phone: phone
    };
    onLoginSuccess(testUser);
    showToast('User logged in via Secure Mobile OTP!', 'success');
    onClose();
  };

  // Registration handler
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      showToast('Please fill out all mandatory fields.', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!termsAccepted) {
      showToast('Please sign and accept terms to continue.', 'warning');
      return;
    }
    if (regPhone.length >= 10 && !regOtpSent) {
      showToast('Please request and verify Mobile OTP first.', 'warning');
      return;
    }
    if (regOtpCode !== '123456') {
      showToast('Invalid OTP. Use code 123456', 'error');
      return;
    }

    const newUser = {
      name: regName,
      email: regEmail,
      phone: regPhone
    };

    const exUsers = JSON.parse(localStorage.getItem('alike_users') || '[]');
    exUsers.push(newUser);
    localStorage.setItem('alike_users', JSON.stringify(exUsers));

    onLoginSuccess(newUser);
    showToast('Account registered successfully with Alike-ND!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="login-modal-card"
        className="relative w-full max-w-md bg-neutral-900 border border-solid border-[#D1D1D1] rounded-2xl shadow-[0_0_30px_rgba(209,209,209,0.15)] overflow-hidden"
      >
        {/* Theme Toggle (inside login) */}
        <button
          id="login-theme-toggle"
          onClick={onToggleTheme}
          className="absolute top-4 left-4 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-800 p-1.5 rounded-lg cursor-pointer"
          title={isLightMode ? "Switch to Dark/Blue Mode" : "Switch to Light/Rose Mode"}
        >
          {isLightMode ? (
            <Moon className="w-5 h-5 text-[#C48CB3]" />
          ) : (
            <Sun className="w-5 h-5 text-[#D4AF37]" />
          )}
        </button>

        {/* Close Button */}
        <button
          id="close-login-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-800 p-1.5 rounded-lg"
          title="Close Login Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 text-center border-b border-solid border-neutral-800 bg-neutral-950">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffffff] to-[#D1D1D1] shadow-[0_0_15px_rgba(209,209,209,0.25)] mb-3">
            <span className="text-2xl font-black text-black">A</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] bg-clip-text text-transparent">
            Alike-ND Platform
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Unlock exclusive luxury shopping</p>
        </div>

        {/* Dynamic Tabs */}
        <div className="flex border-b border-solid border-neutral-800 bg-neutral-950/50 p-1">
          <button
            id="tab-password-login"
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
              activeTab === 'password'
                ? 'bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/55'
            }`}
          >
            Password Login
          </button>
          <button
            id="tab-otp-login"
            onClick={() => setActiveTab('otp')}
            className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
              activeTab === 'otp'
                ? 'bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/55'
            }`}
          >
            OTP Login
          </button>
          <button
            id="tab-register-login"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#ffffff] to-[#D1D1D1] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/55'
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Password Login */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Mobile / Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    placeholder="e.g. elite@alike.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#D1D1D1] focus:ring-1 focus:ring-[#D1D1D1] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    Password
                  </label>
                  <button
                    id="modal-forgot-pass-btn"
                    type="button"
                    onClick={() => {
                      onClose();
                      onShowForgotPassword();
                    }}
                    className="text-xs text-[#D1D1D1] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#D1D1D1] focus:ring-1 focus:ring-[#D1D1D1] transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 hover:text-white select-none">
                  <input
                    id="login-remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-800 text-[#D1D1D1] focus:ring-[#D1D1D1] focus:ring-offset-neutral-900 bg-neutral-950"
                  />
                  Remember Me
                </label>
              </div>

              <button
                id="login-password-submit"
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] hover:from-[#D1D1D1] hover:to-[#E5E5E5] text-black font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all text-sm uppercase tracking-wider"
              >
                Sign In Securely
              </button>
            </form>
          )}

          {/* Tab 2: OTP Login */}
          {activeTab === 'otp' && (
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="otp-phone"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9999999999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#D1D1D1] focus:ring-1 focus:ring-[#D1D1D1] transition-all"
                    />
                  </div>
                  <button
                    id="otp-send-btn"
                    type="button"
                    onClick={() => sendOTP(phone, false)}
                    className="px-4 bg-neutral-800 hover:bg-[#D1D1D1] hover:text-black border border-solid border-neutral-700 hover:border-[#D1D1D1] text-[#D1D1D1] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="animate-fade-in space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <input
                      id="otp-code-input"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Enter 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-solid border-[#D1D1D1] rounded-xl text-sm text-white tracking-widest font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#D1D1D1] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-green-500 font-semibold text-center mt-1">
                    Demo OTP is 123456
                  </p>
                </div>
              )}

              <button
                id="login-otp-submit"
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] hover:from-[#D1D1D1] hover:to-[#E5E5E5] text-black font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all text-sm uppercase tracking-wider"
              >
                Verify & Log In
              </button>
            </form>
          )}

          {/* Tab 3: Register */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D1D1D1] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D1D1D1] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D1D1D1] transition-all"
                    />
                  </div>
                  <button
                    id="reg-otp-send"
                    type="button"
                    onClick={() => sendOTP(regPhone, true)}
                    className="px-3 bg-neutral-800 text-[#D1D1D1] hover:bg-[#D1D1D1] hover:text-black border border-solid border-neutral-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {regOtpSent && (
                <div className="animate-fade-in">
                  <label className="block text-xs uppercase tracking-wider text-[#D1D1D1] font-medium mb-1">
                    6-Digit Mobile Verification Code
                  </label>
                  <input
                    id="reg-otp-code"
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Enter Code 123456"
                    value={regOtpCode}
                    onChange={(e) => setRegOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 bg-neutral-950 border border-solid border-[#D1D1D1] rounded-xl text-sm text-white text-center font-mono focus:outline-none focus:ring-1 focus:ring-[#D1D1D1]"
                  />
                  <p className="text-[10px] text-green-500 text-center mt-0.5">Demo OTP is 123456</p>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D1D1D1] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-solid border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#D1D1D1] transition-all"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-neutral-400 hover:text-white select-none">
                  <input
                    id="reg-terms-check"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-800 text-[#D1D1D1] focus:ring-[#D1D1D1] bg-neutral-950"
                  />
                  <span>
                    I accept the{' '}
                    <span className="text-[#D1D1D1] underline">Terms & Conditions</span> and{' '}
                    <span className="text-[#D1D1D1] underline">Privacy Policy</span> of Alike-ND.
                  </span>
                </label>
              </div>

              <button
                id="reg-submit-btn"
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#ffffff] via-[#E5E5E5] to-[#D1D1D1] text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-[0.98]"
              >
                Register & Verify Device
              </button>
            </form>
          )}

          {/* Social Sign In Alternatives */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-solid border-neutral-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
              Or Connect With
            </span>
            <div className="flex-grow border-t border-solid border-neutral-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-3" id="social-sign-ins">
            <button
              id="google-signin-btn"
              type="button"
              onClick={() => {
                onLoginSuccess({ name: 'Google Explorer', email: 'google.guest@alike.com', phone: '9999000011' });
                showToast('Logged in safely via Google Trust Engine!', 'success');
                onClose();
              }}
              className="flex items-center justify-center gap-2 py-2 border border-solid border-neutral-800 rounded-xl hover:border-white text-xs font-semibold text-neutral-300 hover:text-white transition-colors bg-neutral-950"
            >
              <i className="fa-brands fa-google text-red-500 text-sm"></i> Google
            </button>
            <button
              id="facebook-signin-btn"
              type="button"
              onClick={() => {
                onLoginSuccess({ name: 'Facebook Sociality', email: 'facebook.guest@alike.com', phone: '9999000022' });
                showToast('Logged in safely via Facebook Social Net!', 'success');
                onClose();
              }}
              className="flex items-center justify-center gap-2 py-2 border border-solid border-neutral-800 rounded-xl hover:border-white text-xs font-semibold text-neutral-300 hover:text-white transition-colors bg-neutral-950"
            >
              <i className="fa-brands fa-facebook-f text-blue-500 text-sm"></i> Facebook
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
