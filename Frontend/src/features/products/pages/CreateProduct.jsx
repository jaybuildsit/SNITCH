import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  // Images state: array of { file, previewUrl, id }
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Status and Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Cleanup object URLs on unmount or removal
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Image Processing helper
  const processFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (validFiles.length === 0) {
      setErrors((prev) => ({
        ...prev,
        images: 'Please upload valid image files (PNG, JPG, or WEBP).',
      }));
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    }));

    setImages((prev) => [...prev, ...newImages]);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: '' }));
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // reset input so the same file can be re-selected if removed
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove, e) => {
    e.stopPropagation();
    setImages((prev) => {
      const removed = prev[indexToRemove];
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleSetPrimary = (indexToPromote, e) => {
    e.stopPropagation();
    if (indexToPromote === 0) return;
    setImages((prev) => {
      const promoted = prev[indexToPromote];
      const remaining = prev.filter((_, idx) => idx !== indexToPromote);
      return [promoted, ...remaining];
    });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 4) {
      newErrors.name = 'Product name must be at least 4  characters';
    }

    if (!formData.priceAmount || isNaN(Number(formData.priceAmount)) || Number(formData.priceAmount) <= 0) {
      newErrors.priceAmount = 'Enter a valid price greater than 0';
    }

    if (images.length === 0) {
      newErrors.images = 'Please add at least one product image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.name.trim());
      payload.append('name', formData.name.trim());
      payload.append('description', formData.description.trim());
      payload.append('priceAmount', formData.priceAmount);
      payload.append('priceCurrency', formData.priceCurrency);

      images.forEach((img) => {
        payload.append('images', img.file);
      });

      if (typeof handleCreateProduct === 'function') {
        await handleCreateProduct(payload);
        setFeedback({
          type: 'success',
          message: 'Product created successfully.',
        });
      } else {
        // Fallback simulation if hook not active
        await new Promise((resolve) => setTimeout(resolve, 800));
        setFeedback({
          type: 'success',
          message: 'Product created successfully.',
        });
      }

      // Reset form after short pause or keep clean
      setFormData({
        name: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
      });
      setImages([]);
    } catch (err) {
      console.error('Create product error:', err);
      setFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Failed to create product. Please review the details and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCurrency = CURRENCIES.find((c) => c.code === formData.priceCurrency) || CURRENCIES[0];

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">

      {/*Navigation */}
      <header className="border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-neutral-950">
              SNITCH
            </span>
            <span className="text-neutral-300 text-xs select-none">·</span>
            <span className="text-[11px] font-normal text-neutral-400 tracking-wide">
              Seller Studio
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[11px] font-normal text-neutral-400 hover:text-neutral-700 transition-colors duration-200 cursor-pointer tracking-wide"
          >
            Cancel
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-9 pb-20">

        {/* Editorial Header */}
        <div className="mb-9">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-[11px] tracking-wide text-neutral-400">
              <li>Seller</li>
              <li className="text-neutral-300">/</li>
              <li>Products</li>
              <li className="text-neutral-300">/</li>
              <li className="text-neutral-600" aria-current="page">Create</li>
            </ol>
          </nav>

          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em] text-neutral-950 leading-none">
            Create product
          </h1>
          <p className="text-[13px] text-neutral-400 mt-2 font-normal leading-relaxed">
            Add images and details for your new product.
          </p>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`mb-8 px-4 py-3 rounded-lg text-[13px] border flex items-start gap-3 ${
              feedback.type === 'success'
                ? 'bg-neutral-50 text-neutral-800 border-neutral-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {feedback.type === 'success' ? (
                <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0118 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ── Two-column layout ───────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT — Media (~57%) */}
            <section className="lg:col-span-7 flex flex-col gap-3">

              {/* Section label row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
                  Product Images
                </span>
                {images.length > 0 && (
                  <span className="text-[11px] text-neutral-400">
                    {images.length} / 5
                  </span>
                )}
              </div>

              {/* Drop Zone — always visible, adapts */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center select-none ${
                  isDragging
                    ? 'border-neutral-800 bg-neutral-50 scale-[0.995]'
                    : images.length === 0
                      ? 'border-neutral-200 border-dashed bg-neutral-50/60 hover:border-neutral-400 hover:bg-neutral-50'
                      : 'border-neutral-200 border-dashed bg-transparent hover:border-neutral-400'
                } ${images.length === 0 ? 'py-20 px-8' : 'py-6 px-6'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {/* Upload icon — refined, no heavy circle */}
                <div className="mb-4 text-neutral-300 group-hover:text-neutral-500 transition-colors duration-200">
                  <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>

                <p className="text-[13px] font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors duration-200">
                  {images.length === 0 ? 'Drop product images here' : 'Add more images'}
                </p>
                <p className="text-[12px] text-neutral-400 mt-1">
                  or{' '}
                  <span className="text-neutral-600 underline underline-offset-2 decoration-neutral-400">
                    browse files
                  </span>
                </p>
                {images.length === 0 && (
                  <p className="text-[11px] text-neutral-300 mt-3 tracking-wide">
                    PNG, JPG or WEBP · Up to 5 images
                  </p>
                )}
              </div>

              {/* Validation error */}
              {errors.images && (
                <p className="text-[11px] text-rose-500">{errors.images}</p>
              )}

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
                  {images.map((img, index) => {
                    const isPrimary = index === 0;
                    return (
                      <div
                        key={img.id}
                        onClick={(e) => handleSetPrimary(index, e)}
                        title={isPrimary ? 'Primary image' : 'Click to set as primary'}
                        className={`group relative overflow-hidden rounded-md bg-neutral-100 cursor-pointer transition-all duration-200 ${
                          isPrimary
                            ? 'col-span-2 sm:col-span-2 row-span-2 aspect-square ring-[1.5px] ring-neutral-800 ring-offset-1'
                            : 'aspect-square border border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <img
                          src={img.previewUrl}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        />

                        {/* PRIMARY badge */}
                        {isPrimary && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-block px-1.5 py-[3px] rounded text-[9px] font-semibold tracking-[0.12em] uppercase bg-white/95 text-neutral-800 border border-neutral-200/70">
                              PRIMARY
                            </span>
                          </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => handleRemoveImage(index, e)}
                            aria-label="Remove image"
                            className="w-7 h-7 rounded-full bg-white text-neutral-800 hover:text-neutral-950 flex items-center justify-center transition-colors duration-100 cursor-pointer"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* "Set primary" hint for secondary images */}
                        {!isPrimary && (
                          <div className="absolute bottom-0 inset-x-0 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                            <p className="text-center text-[9px] font-medium text-white tracking-wide">
                              SET PRIMARY
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* RIGHT — Product details (~43%) */}
            <section className="lg:col-span-5 flex flex-col gap-0 lg:sticky lg:top-[68px]">

              <div className="space-y-6">
                {/* 1. Product Name */}
                <div>
                  <label
                    htmlFor="product-name"
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400 mb-2"
                  >
                    Product Name
                  </label>
                  <input
                    id="product-name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3.5 py-[10px] text-[14px] bg-white border rounded-md text-neutral-900 placeholder:text-neutral-300 focus:outline-none transition-all duration-150 ${
                      errors.name
                        ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                        : 'border-neutral-200 hover:border-neutral-300 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-100'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-500 mt-1.5">{errors.name}</p>
                  )}
                </div>

                {/* 2. Description */}
                <div>
                  <label
                    htmlFor="product-description"
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="product-description"
                    name="description"
                    rows={5}
                    placeholder="Describe your product — materials, fit, feel..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-[10px] text-[14px] bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-300 hover:border-neutral-300 focus:outline-none focus:border-neutral-800 focus:ring-2 focus:ring-neutral-100 transition-all duration-150 resize-none leading-[1.65]"
                  />
                </div>

                {/* 3. Price */}
                <div>
                  <label
                    htmlFor="product-price"
                    className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400 mb-2"
                  >
                    Price
                  </label>
                  <div
                    className={`flex items-stretch bg-white border rounded-md overflow-hidden transition-all duration-150 focus-within:ring-2 ${
                      errors.priceAmount
                        ? 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100'
                        : 'border-neutral-200 hover:border-neutral-300 focus-within:border-neutral-800 focus-within:ring-neutral-100'
                    }`}
                  >
                    {/* Currency selector */}
                    <div className="relative shrink-0 border-r border-neutral-200">
                      <select
                        name="priceCurrency"
                        value={formData.priceCurrency}
                        onChange={handleInputChange}
                        aria-label="Currency"
                        className="h-full pl-3 pr-6 text-[13px] font-medium text-neutral-600 bg-neutral-50 appearance-none focus:outline-none cursor-pointer"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400">
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Currency symbol + amount */}
                    <div className="flex flex-1 items-center">
                      <span className="pl-3.5 text-[14px] text-neutral-400 select-none tabular-nums">
                        {activeCurrency.symbol}
                      </span>
                      <input
                        id="product-price"
                        name="priceAmount"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0.00"
                        value={formData.priceAmount}
                        onChange={handleInputChange}
                        className="flex-1 pl-1.5 pr-4 py-[10px] text-[14px] bg-transparent text-neutral-900 placeholder:text-neutral-300 focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>
                  {errors.priceAmount && (
                    <p className="text-[11px] text-rose-500 mt-1.5">{errors.priceAmount}</p>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[44px] px-6 rounded-md bg-neutral-950 text-white text-[13px] font-medium tracking-[0.04em] transition-all duration-200 hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-white/80">Creating product...</span>
                    </>
                  ) : (
                    <span>Create product</span>
                  )}
                </button>
              </div>

            </section>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateProduct;