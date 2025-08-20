import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Code, Database, Shield, Zap } from "lucide-react";
import LearnMoreModal from '../components/LearnMoreModal';
import myImage from '../assets/images/tech_illustration.jpg';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart2 className="w-8 h-8 text-indigo-500" />,
      title: "Data Analytics",
      description: "Powerful analytics tools to gain insights from your data."
    },
    {
      icon: <Code className="w-8 h-8 text-purple-500" />,
      title: "Custom Solutions",
      description: "Tailored IT solutions for your business needs."
    },
    {
      icon: <Database className="w-8 h-8 text-blue-500" />,
      title: "Data Management",
      description: "Efficient data storage and management solutions."
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: "Security First",
      description: "Enterprise-grade security for your peace of mind."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 font-['Inter']">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Zap className="w-6 h-6 text-indigo-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Excel Analytics
            </span>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="relative px-3 py-2 text-gray-700 font-medium group">
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-1.5 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/login" className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:scale-[1.02] transition-all"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-indigo-600 mb-1.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-indigo-600 mb-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-indigo-600 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg px-6 py-4 rounded-b-xl border-t border-gray-100"
          >
            <Link 
              to="/" 
              className="block py-3 text-gray-700 font-medium border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className="block py-3 text-gray-700 font-medium border-b border-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="block mt-4 py-2.5 text-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-sm font-semibold tracking-wide text-indigo-600 uppercase"
              >
                We are the World's Best IT Company
              </motion.p>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              >
                Welcome to{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Excel Analytics
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0"
              >
                Transform your business with our cutting-edge IT solutions. We specialize in delivering innovative technology services tailored to your unique needs.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/contact"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-indigo-100 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Contact Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-8 py-3.5 rounded-xl border-2 border-indigo-100 bg-white/50 text-indigo-700 font-medium shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-200"
                >
                  Learn More
                </button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative max-w-lg mx-auto lg:mx-0 lg:max-w-md xl:max-w-lg"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                <img
                  src={myImage}
                  alt="Tech Illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your data and grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
            Join thousands of businesses that trust our platform for their data analytics needs.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <LearnMoreModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}