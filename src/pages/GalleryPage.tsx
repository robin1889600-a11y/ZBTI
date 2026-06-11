import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import CreditsModal from '../components/CreditsModal';
import { personalityMap } from '../data/personalities';

// Build code-indexed array for consistent ordering
const PERSONALITY_LIST = Object.values(personalityMap);

export default function GalleryPage() {
  const navigate = useNavigate();
  const [showCredits, setShowCredits] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] flex flex-col items-center px-6 py-8"
      style={{ backgroundColor: '#F7F5F2' }}
    >
      {/* Header — Logo + back */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <Logo variant="nav" />
        <button
          onClick={() => navigate('/')}
          className="text-sm text-[#6B7280] hover:text-[#1E3A5F] transition-colors"
        >
          返回首页
        </button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-4">
        {PERSONALITY_LIST.map((p, i) => (
          <motion.button
            key={p.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            onClick={() => navigate(`/gallery/${p.code}`)}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center"
          >
            <img
              src={`/illustrations/${p.code}.png`}
              alt={p.name}
              className="w-full max-w-[120px] h-auto object-contain mb-3"
            />
            <span className="text-lg font-black text-[#1E3A5F] tracking-tight">
              {p.code}
            </span>
            <span className="text-xs text-[#6B7280] mt-1">
              {p.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Credits link */}
      <p
        className="text-center mt-10"
        style={{ fontSize: '12px', fontWeight: 400, color: '#9CA3AF', cursor: 'pointer' }}
        onClick={() => setShowCredits(true)}
      >
        © 开发人员名单
      </p>

      <CreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />
    </motion.div>
  );
}
