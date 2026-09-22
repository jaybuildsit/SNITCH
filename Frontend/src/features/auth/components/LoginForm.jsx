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
    <div className="w-full max-w-[400px] mx-auto py-10 px-6 sm:px-8 flex flex-col justify-center min-h-full">
      {/* Editorial Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-neutral-950">
            SNITCH
          </span>
          <span className="text-neutral-300 text-xs select-none">·</span>
          {/* <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-neutral-400">
            Account
          </span> */}
        </div>

        <h1 className="text-[26px] sm:text-[38px] font-semibold tracking-[-0.02em] text-neutral-950 leading-tight">
          Welcome back.
        </h1>
        <p className="text-[13px] text-neutral-400 mt-1.5 font-normal leading-relaxed">
          Sign in to your SNITCH account to continue.
        </p>
      </div>

      {/* Global submit feedback banner */}
      {submitFeedback && (
        <div
          className={`mb-6 px-4 py-3 rounded-md text-[13px] border flex items-start gap-2.5 transition-all duration-150 ${
            submitFeedback.type === 'success'
              ? 'bg-neutral-50 text-neutral-900 border-neutral-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="pt-0.5 shrink-0">
            {submitFeedback.type === 'success' ? (
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-3.5 h-3.5 rounded-[3px] border border-neutral-300 bg-white peer-checked:bg-neutral-950 peer-checked:border-neutral-950 flex items-center justify-center transition-all duration-150 group-hover:border-neutral-400">
              <svg
                className={`w-2.5 h-2.5 text-white fill-none stroke-current stroke-[2.5] transition-opacity duration-150 ${
                  formData.rememberMe ? 'opacity-100' : 'opacity-0'
                }`}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-[12px] text-neutral-500 group-hover:text-neutral-900 transition-colors">
              Remember me
            </span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[12px] font-medium text-neutral-500 hover:text-neutral-950 hover:underline transition-colors duration-150 cursor-pointer focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        {/* PRIMARY CTA BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[42px] px-6 rounded-md bg-neutral-950 text-white text-[13px] font-medium tracking-[0.04em] transition-all duration-200 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white/70" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-white/80">Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </div>
      </form>

      {/* SOCIAL LOGIN */}
      <div className="mt-5">
        <SocialButtons />
      </div>

      {/* SIGN UP LINK */}
      <div className="mt-6 text-center">
        <p className="text-[13px] text-neutral-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-medium text-neutral-950 hover:underline transition-colors duration-150 cursor-pointer focus:outline-none"
          >
            Create account
          </button>
        </p>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg p-6 shadow-xl border border-neutral-200">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-neutral-950">
              Reset password
            </h3>
            <p className="text-[13px] text-neutral-400 mt-1 mb-5">
              Enter your email address and we'll send you a recovery link.
            </p>

            {forgotSubmitted ? (
              <div className="p-3 rounded-md bg-neutral-50 border border-neutral-200 text-neutral-800 text-[13px] font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 rounded-md text-[13px] font-normal text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-[13px] font-medium text-white bg-neutral-950 hover:bg-neutral-800 transition-colors cursor-pointer"
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
