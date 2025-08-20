import React, { useState } from 'react';

const initialState = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

const initialErrors = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Contact = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { ...initialErrors };
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email format.';
      valid = false;
    }
    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required.';
      valid = false;
    }
    if (!form.message.trim()) {
      newErrors.message = 'Message is required.';
      valid = false;
    }
    setErrors(newErrors);
    if (valid) {
      setSubmitted(true);
      setForm(initialState);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Get in Touch with Divy Pattani</h2>
        <p className="text-center text-gray-500 mb-8">We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="fullName">Full Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.fullName ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Your Name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="subject">Subject<span className="text-red-500">*</span></label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.subject ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Subject"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1" htmlFor="message">Message<span className="text-red-500">*</span></label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Your message..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send Message
          </button>
          {submitted && <p className="text-green-600 text-center mt-4">Thank you! Your message has been sent.</p>}
        </form>
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Contact Information</h3>
          <div className="space-y-1 text-gray-600">
            <p><span className="font-medium">Address:</span> 123 Main Street, City, Country</p>
            <p><span className="font-medium">Phone:</span> <a href="tel:+1234567890" className="hover:text-blue-600 transition">+1 234 567 890</a></p>
            <p><span className="font-medium">Email:</span> <a href="mailto:info@divypattani.com" className="hover:text-blue-600 transition">info@divypattani.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 