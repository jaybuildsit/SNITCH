import { useState } from 'react';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';
import SocialButtons from './SocialButtons';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value || !value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;

      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const fieldError = validateField(name, fieldValue);
    if (fieldError) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passwordErr = validateField('password', formData.password);
    if (passwordErr) newErrors.password = passwordErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitFeedback(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (typeof handleLogin === 'function') {
        await handleLogin({
          email: formData.email,
          password: formData.password,
        });
        setSubmitFeedback({
          type: 'success',
          message: 'Welcome back! Redirecting to your dashboard...',
        });
        setTimeout(() => {
          navigate('/');
        }, 600);
      } else {
        // Mock success fallback for preview/demo
        await new Promise((res) => setTimeout(res, 800));
        setSubmitFeedback({
          type: 'success',
          message: 'Welcome back! Signed in successfully. (Demo mode)',
        });
        setTimeout(() => {
          navigate('/');
        }, 800);
      }
    } catch (err) {
      console.error('Login error:', err);
      setSubmitFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Invalid email or password. Please verify your credentials and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotEmail(formData.email || '');
    setForgotSubmitted(false);
    setShowForgotModal(true);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      return;
    }
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setSubmitFeedback({
        type: 'success',
        message: `Password reset instructions have been sent to ${forgotEmail}.`,
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-[460px] mx-auto py-8 sm:py-12 px-6 sm:px-8 flex flex-col justify-center min-h-full">
      {/* Login Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-100 mb-3.5">
          <span>WELCOME BACK</span>
        </div>
        <h2 className="text-3xl sm:text-[38px] font-extrabold text-slate-900 tracking-tight leading-tight">
          Welcome back.
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2 leading-relaxed">
          Sign in to your SNITCH account to continue.
        </p>
      </div>

      {/* Global submit feedback banner if triggered */}
      {submitFeedback && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-start gap-3 transition-all duration-200 ${
            submitFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="pt-0.5 shrink-0">
            {submitFeedback.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="flex-1 leading-snug">{submitFeedback.message}</div>
        </div>
      )}

      {/* Login Form Fields */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* EMAIL */}
        <FormInput
          label="EMAIL"
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          autoComplete="email"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
        />

        {/* PASSWORD */}
        <PasswordInput
          label="PASSWORD"
          id="login-password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* REMEMBER ME & FORGOT PASSWORD ROW */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-4 h-4 rounded-md border border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500/20 flex items-center justify-center transition-all duration-150 shadow-2xs group-hover:border-indigo-400">
              <svg
                className={`w-3 h-3 text-white fill-none stroke-current stroke-[2.5] transition-opacity duration-150 ${
                  formData.rememberMe ? 'opacity-100' : 'opacity-0'
                }`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
              Remember me
            </span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded"
          >
            Forgot password?
          </button>
        </div>

        {/* PRIMARY CTA BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-13 px-6 rounded-xl font-bold text-white text-base tracking-wide bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed shadow-md hover:shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer outline-none focus:ring-4 focus:ring-indigo-500/20 group mt-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </form>

      {/* SOCIAL LOGIN */}
      <div className="mt-6">
        <SocialButtons />
      </div>

      {/* SIGN UP LINK */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-150 inline-flex items-center gap-0.5 cursor-pointer focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* LEGAL TEXT */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          By continuing, you agree to our{' '}
          <a href="#terms" className="text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900">Reset your password</h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Reset link sent! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <FormInput
                  label="EMAIL"
                  id="forgot-email"
                  name="forgotEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  autoComplete="email"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                />
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;




// Login form futher will be updated into better ui and with minimal and modern ui 


