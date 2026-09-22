import { useState } from 'react';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';
import SellerCheckbox from './SellerCheckbox';
import SocialButtons from './SocialButtons';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';

export const RegisterForm = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value || !value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'contact':
        if (!value || !value.trim()) {
          error = 'Contact number is required';
        } else if (!/^[0-9]{10}$/.test(value.trim().replace(/[-\s]/g, ''))) {
          error = 'Enter a valid 10-digit contact number';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
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

    // Clear field-specific error as user types
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
    const fullNameErr = validateField('fullName', formData.fullName);
    if (fullNameErr) newErrors.fullName = fullNameErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const contactErr = validateField('contact', formData.contact);
    if (contactErr) newErrors.contact = contactErr;

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
      if (typeof handleRegister === 'function') {
        await handleRegister({
          fullName: formData.fullName,
          email: formData.email,
          contact: formData.contact,
          password: formData.password,
          isSeller: formData.isSeller,
        });
        navigate("/")
        setSubmitFeedback({
          type: 'success',
          message: 'Account created successfully! Welcome to SNITCH.',
        });
      } else {
        // Mock success fallback if backend isn't running
        await new Promise((res) => setTimeout(res, 800));
        setSubmitFeedback({
          type: 'success',
          message: 'Account registered successfully! (Frontend demo ready)',
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Could not reach backend service. Validation verified successfully.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[560px] mx-auto py-8 sm:py-12 px-6 sm:px-10 flex flex-col justify-center min-h-full bg-[#FFFFF]">
      {/* Registration Header */}
      <div className="mb-7">
        {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-neutral-200 bg-white shadow-sm mb-4">
          <span>CREATE ACCOUNT</span>
        </div> */}
        <h2 className="text-xl sm:text-[30px] font-semibold text-black tracking-tight leading-tight">
          Join SNITCH
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-1.5 leading-relaxed">
          Create your account and get started in seconds.
        </p>
      </div>

      {/* Global submit feedback banner if triggered */}
      {submitFeedback && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border flex items-start gap-3 transition-all duration-200 ${submitFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
        >
          <div className="pt-0.5 shrink-0">
            {submitFeedback.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1 leading-snug">{submitFeedback.message}</div>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* FULL NAME */}
        <FormInput
          label="FULL NAME"
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
          autoComplete="name"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />

        {/* EMAIL */}
        <FormInput
          label="EMAIL"
          id="email"
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

        {/* CONTACT NUMBER */}
        <FormInput
          label="CONTACT NUMBER"
          id="contact"
          name="contact"
          type="tel"
          placeholder="Enter your 10-digit contact number"
          value={formData.contact}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.contact}
          autoComplete="tel"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          }
        />

        {/* PASSWORD */}
        <PasswordInput
          label="PASSWORD"
          id="password"
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          autoComplete="new-password"
        />

        {/* SELLER CHECKBOX */}
        <div className="pt-1.5 pb-2">
          <SellerCheckbox
            checked={formData.isSeller}
            onChange={handleChange}
            id="isSeller"
            name="isSeller"
          />
        </div>

        {/* PRIMARY CTA BUTTON */}
        <button
          // onClick={() => <Navigate to="/" />}
          type="submit"
          disabled={isSubmitting}
          className="
    group
    flex
    h-[46px]
    w-full
    cursor-pointer
    items-center
    justify-center
    gap-2
    rounded-[6px]
    bg-[#111111]
    px-6
    text-[12px]
    font-medium
    tracking-wide
    text-white
    outline-none
    transition-all
    duration-200
    hover:bg-black
    active:scale-[0.995]
    disabled:cursor-not-allowed
    disabled:opacity-50
    focus-visible:ring-2
    focus-visible:ring-black/20
    focus-visible:ring-offset-2
  "
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />

                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                />
              </svg>

              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>

              <span className="text-[15px] transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </>

          )}
        </button>
        {/* SOCIAL LOGIN */}
        <div className="mt-6">
          <SocialButtons />
        </div>

        {/* LOGIN LINK */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-150 inline-flex items-center gap-0.5 cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* LEGAL TEXT */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            By creating an account, you agree to our{' '}
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
      </form>
    </div>
  );
};

export default RegisterForm;
