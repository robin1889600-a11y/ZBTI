import { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import CreditsModal from '../components/CreditsModal';
import GeometricScene from '../components/webgl/GeometricScene';

interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-[100dvh] flex flex-col items-center overflow-hidden"
      style={{ backgroundColor: '#F7F5F2' }}
    >
      {/* WebGL 3D Geometric Background */}
      <GeometricScene />

      {/* Decorative blurred color blocks */}
      <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-[#C53030]/15 blur-[100px] pointer-events-none z-[1]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#1E3A5F]/15 blur-[120px] pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg pt-[15vh] pb-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center mb-8"
        >
          <Logo variant="hero" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-bold text-[#1E3A5F] leading-tight tracking-tight mb-6"
        >
          你是哪种肇中人？
        </motion.h1>

        {/* Subtitle Questions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="space-y-1.5 mb-8"
        >
          <p className="text-[#6B7280] text-lg">为了学习早起？</p>
          <p className="text-[#6B7280] text-lg">炒米加汁？</p>
          <p className="text-[#6B7280] text-lg">常去图艺楼看看小猫？</p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-[#111827] text-base font-medium mb-10"
        >
          肇中人专属人格测试
          <br />
          48道题，找到你的校园人格
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          onClick={onStart}
          className="bg-[#1E3A5F] text-white text-lg font-semibold px-12 py-4 rounded-full
                     hover:bg-[#C53030] transition-colors duration-200
                     shadow-lg hover:shadow-xl active:scale-95 transition-transform"
        >
          开始测试
        </motion.button>

        {/* Credits link */}
        <p
          className="text-center cursor-pointer mt-10"
          style={{ fontSize: '12px', fontWeight: 400, color: '#9CA3AF' }}
          onClick={() => setShowCredits(true)}
        >
          © 开发人员名单
        </p>
      </div>

      <CreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />
    </motion.div>
  );
}
