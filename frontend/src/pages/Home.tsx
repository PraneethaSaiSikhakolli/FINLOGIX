import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgImage from '../assets/happy.jpg'; // Local image

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-200 fixed top-0 bg-white z-50">
        <h1 className="text-xl font-bold tracking-wide text-[#829CBA]">FinLogix</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-md bg-[#829CBA] text-white text-sm font-medium transition hover:bg-[#6c89a7]"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-md bg-[#829CBA] text-white text-sm font-medium transition hover:bg-[#6c89a7]"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
              Welcome to <span className="text-[#829CBA]">FinLogix</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6">
              Track your spending habits. Plan smarter. Save better.
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              <motion.button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-[#2f2f2f] text-white rounded-lg font-medium text-sm shadow hover:bg-black transition"
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-[#2f2f2f] text-white rounded-lg font-medium text-sm shadow hover:bg-black transition"
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <img
              src={bgImage}
              alt="Finance dashboard"
              className="rounded-xl shadow-md w-full object-cover h-[300px] md:h-[400px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <motion.section
        className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto px-4 pt-16 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {[
          {
            title: 'Track Activity',
            desc: 'See your recent spend analytics clearly.',
          },
          {
            title: 'Weekly Sales',
            desc: 'Keep up with what’s driving your budget.',
          },
          {
            title: 'Revenue Insights',
            desc: 'Visualize how you’re saving or overspending.',
          },
        ].map((card, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl border border-gray-200 hover:border-[#829CBA] transition duration-300 shadow-sm hover:shadow-md text-left text-sm bg-white hover:bg-[#EFE9EB]/40"
            whileHover={{ y: -4 }}
          >
            <h3 className="text-base font-semibold mb-2 text-[#333]">{card.title}</h3>
            <p className="text-gray-600">{card.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 border-t border-gray-200 bg-white">
        © 2025 <span className="font-medium text-[#829CBA]">FinLogix</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
