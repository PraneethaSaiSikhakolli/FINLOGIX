import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FiBarChart2, FiLock, FiTarget, FiDollarSign,
  FiLogIn, FiUserPlus, FiLinkedin, FiGithub, FiMail,
  FiArrowUpCircle
} from 'react-icons/fi';
import { BsPieChartFill } from 'react-icons/bs';
import bgImage from '../assets/home.png';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 }
  })
};

const Home = () => {
  const navigate = useNavigate();
  const [introComplete, setIntroComplete] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden bg-gradient-to-br from-[#e0f7fa] to-[#fffde7] animate-gradient-move">
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-6xl font-orbitron text-emerald-700"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 1 }}
            >
              FinLogix
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {introComplete && (
        <>
          {/* Header */}
          <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-40 backdrop-blur-xl bg-white/80 shadow-md border-b border-gray-200">
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-700 cursor-pointer">
              <BsPieChartFill size={24} />
              FinLogix
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 shadow text-sm font-medium backdrop-blur hover:bg-emerald-100 transition"
              >
                <FiLogIn /> Sign In
              </motion.button>
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
              >
                <FiUserPlus /> Get Started
              </motion.button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="pt-32 px-6 sm:px-10 md:px-20 pb-20 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 relative z-10">
              <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                  Smarter <span className="text-emerald-600">Budgeting</span> Starts Here
                </h1>
                <p className="text-gray-700 text-lg mb-6 max-w-lg">
                  Manage money like a pro. Visualize, track, and plan with FinLogix – your finance companion.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-700 transition"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/login')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className="border border-gray-300 hover:border-emerald-600 hover:text-emerald-600 px-6 py-2 rounded-xl font-medium transition"
                  >
                    Sign In
                  </motion.button>
                </div>
              </motion.div>

              <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img src={bgImage} alt="Finance Dashboard" className="w-full max-h-[400px] object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/30 to-white/5 animate-shine opacity-20" />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[{ icon: FiDollarSign, title: 'Track Spending', desc: 'Easily log and review your transactions.' },
              { icon: FiBarChart2, title: 'Visual Insights', desc: 'Charts to visualize where money flows.' },
              { icon: FiTarget, title: 'Set Goals', desc: 'Define savings targets and crush them.' },
              { icon: FiLock, title: 'Bank-Grade Security', desc: 'We protect your data like Fort Knox.' }].map((f, i) => (
              <motion.div
                key={i}
                className="group bg-white/60 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-emerald-400 transition duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="mb-4 bg-emerald-100 text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center shadow group-hover:scale-110 transition">
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* Footer */}
          <motion.footer className="px-6 py-4 bg-white/70 backdrop-blur-md border-t border-gray-200 text-sm">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <BsPieChartFill size={16} /> FinLogix
              </div>
              <div className="flex gap-2 text-gray-700">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition">
                  <FiLinkedin size={16} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition">
                  <FiGithub size={16} />
                </a>
                <a href="mailto:contact@finlogix.com" className="hover:text-emerald-600 transition">
                  <FiMail size={16} />
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">
              © {new Date().getFullYear()} <span className="text-emerald-600 font-medium">FinLogix</span>. All rights reserved.
            </p>
          </motion.footer>

          {/* Scroll to Top Button */}
          {showScroll && (
            <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-lg border border-gray-200 p-2 rounded-full shadow hover:shadow-md hover:bg-emerald-100 transition z-50">
              <FiArrowUpCircle size={24} className="text-emerald-700" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
