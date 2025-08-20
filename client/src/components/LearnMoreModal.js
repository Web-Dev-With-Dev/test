import React from 'react';

const LearnMoreModal = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div
          className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        />
        <div
          className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 z-50 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-3 text-gray-800 text-center">Why Choose Divy Pattani?</h2>
          <p className="text-gray-600 text-center mb-2">
            Divy Pattani offers unparalleled expertise, a client-first approach, and a proven track record of delivering results. Discover how we can help you achieve your goals with innovative solutions and dedicated support.
          </p>
        </div>
      </div>
    </>
  );
};

export default LearnMoreModal; 