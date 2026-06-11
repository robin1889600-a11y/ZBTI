import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Logo from '../components/Logo';
import CreditsModal from '../components/CreditsModal';
import { useQuizContext } from '../hooks/useQuizContext';
import { personalityMap } from '../data/personalities';
import { artistMap } from '../data/artists';

export default function GalleryDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [showCredits, setShowCredits] = useState(false);
  const { startQuiz } = useQuizContext();

  // Find personality by code from the map values
  const personality = useMemo(() => {
    const list = Object.values(personalityMap);
    return list.find((p) => p.code === code) || list[0];
  }, [code]);

  const dimensionMap = [
    { label: '秩序应对方式', value: personality.dimensionLabels[0] },
    { label: '能量恢复方式', value: personality.dimensionLabels[1] },
    { label: '行动节奏方式', value: personality.dimensionLabels[2] },
    { label: '情绪处理方式', value: personality.dimensionLabels[3] },
  ];

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
          onClick={() => navigate('/gallery')}
          className="text-sm text-[#6B7280] hover:text-[#1E3A5F] transition-colors"
        >
          返回图鉴
        </button>
      </div>

      {/* Hero — sync with result page style */}
      <div className="w-full max-w-lg flex flex-col items-center text-center mb-8">
        {/* Illustration with outline */}
        <div className="relative mb-3">
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-black tracking-tighter whitespace-nowrap sm:hidden"
            style={{
              fontSize: 'clamp(80px, 28vw, 140px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(30, 58, 95, 0.08)',
              lineHeight: 1,
              zIndex: 0,
            }}
          >
            {personality.code}
          </span>
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-black tracking-tighter whitespace-nowrap hidden sm:block"
            style={{
              fontSize: 'clamp(120px, 16vw, 240px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(30, 58, 95, 0.08)',
              lineHeight: 1,
              zIndex: 0,
            }}
          >
            {personality.code}
          </span>
          <img
            src={`/illustrations/${personality.code}.png`}
            alt={personality.name}
            className="relative z-10 w-full max-w-[240px] h-auto object-contain mx-auto"
          />
        </div>

        {/* Artist credit */}
        <p
          className="text-center mb-4 pointer-events-none select-none"
          style={{ fontSize: '12px', color: '#9CA3AF' }}
        >
          ©️ {artistMap[personality.code]}
        </p>

        <h1 className="text-5xl sm:text-6xl font-black text-[#1E3A5F] tracking-tight relative z-10" style={{ lineHeight: 1 }}>
          {personality.code}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-3 mb-2">
          {personality.name}
        </h2>
        <p className="text-[#6B7280] text-base sm:text-lg italic max-w-md mx-auto leading-relaxed">
          &ldquo;{personality.summary}&rdquo;
        </p>
      </div>

      {/* Dimension Labels */}
      <div className="w-full max-w-lg mb-8">
        <div className="grid grid-cols-2 gap-3">
          {dimensionMap.map((d) => (
            <div key={d.label} className="bg-white rounded-xl px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-[#9CA3AF] mb-1">{d.label}</p>
              <p className="text-sm font-bold text-[#1E3A5F]">{d.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="w-full max-w-lg mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1E3A5F] mb-3">人格介绍</h3>
          <p className="text-sm text-[#374151] leading-relaxed">
            {personality.desc}
          </p>
        </div>
      </div>

      {/* Bottom button — centered single CTA */}
      <div className="w-full max-w-lg flex justify-center mb-8">
        <button
          onClick={startQuiz}
          className="px-12 py-3 rounded-full text-sm font-semibold text-white bg-[#1E3A5F] hover:bg-[#C53030] transition-colors shadow-md"
        >
          开始测试
        </button>
      </div>

      {/* Credits link */}
      <p
        className="text-center"
        style={{ fontSize: '12px', fontWeight: 400, color: '#9CA3AF', cursor: 'pointer' }}
        onClick={() => setShowCredits(true)}
      >
        © 开发人员名单
      </p>

      <CreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />
    </motion.div>
  );
}
