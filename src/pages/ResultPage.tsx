import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import CreditsModal from '../components/CreditsModal';
import PersonalityBlock from '../components/PersonalityBlock';
import PersonalitySlider from '../components/PersonalitySlider';

import type { PersonalityResult, DimensionScore } from '../types';

interface ResultPageProps {
  personality: PersonalityResult;
  dimensionResults: DimensionScore[];
  onRestart: () => void;
}

// ─── Dimension colors for poster ──────────────────────────────
const POSTER_DIM_COLORS: Record<string, string> = {
  order: '#C53030', energy: '#1E3A5F', pace: '#4F6FCB', emotion: '#8A94A6',
};

/** PosterDimensionTracks — 4 personality tracks for share poster */
function PosterDimensionTracks({ dimensionResults }: { dimensionResults: DimensionScore[] }) {
  const dimShortNames: Record<string, string> = {
    order: '秩序', energy: '能量', pace: '节奏', emotion: '情绪',
  };
  const P_THUMB = 12;
  const P_HALF = P_THUMB / 2; // 6px

  return (
    <div className="w-full">
      {dimensionResults.map((dim) => {
        const dColor = POSTER_DIM_COLORS[dim.dimension] || dim.color;
        const dShort = dimShortNames[dim.dimension] || dim.dimension;
        const percent = dim.displayPercent;
        const isPositive = dim.score >= 0;
        const labelNoSuffix = dim.displayLabel.replace('型', '');

        // Bi-directional (same logic as PersonalitySlider)
        const sliderLeft = isPositive ? (100 - percent) : percent;
        const fillLeft = isPositive ? sliderLeft : 0;
        const fillWidth = isPositive ? (100 - sliderLeft) : sliderLeft;

        return (
          <div key={dim.dimension} className="mb-4 last:mb-0 text-left" style={{ paddingLeft: `${P_HALF}px`, paddingRight: `${P_HALF}px` }}>
            {/* Row 1: dimension short name */}
            <p className="text-xs mb-2" style={{ color: '#C9CED6' }}>{dShort}</p>

            {/* Row 2: type name + percent (unified dimension color) */}
            <p className="text-xs mb-2 font-bold" style={{ color: dColor }}>
              {labelNoSuffix} {percent}%
            </p>

            {/* Row 3: track — slider splits colored / gray */}
            <div className="relative">
              <div className="relative rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: '#E8E8E8' }}>
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-700"
                  style={{ left: `${fillLeft}%`, width: `${fillWidth}%`, backgroundColor: dColor, opacity: 0.35 }}
                />
              </div>
              {/* Thumb */}
              <div
                className="absolute top-1/2 z-10 rounded-full"
                style={{
                  left: `clamp(${P_HALF}px, ${sliderLeft}%, calc(100% - ${P_HALF}px))`,
                  transform: 'translate(-50%, -50%)',
                  width: `${P_THUMB}px`,
                  height: `${P_THUMB}px`,
                  backgroundColor: dColor,
                  boxShadow: '0 0 0 2px #FFFFFF',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ResultPage ───────────────────────────────────────────
export default function ResultPage({ personality, dimensionResults, onRestart }: ResultPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 600);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Capture poster via html2canvas
  useEffect(() => {
    if (!showPoster) {
      setPosterImage(null);
      return;
    }

    const generate = async () => {
      await new Promise((r) => setTimeout(r, 200));

      if (!posterRef.current) return;
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(posterRef.current, {
          backgroundColor: '#F7F5F2',
          scale: 2,
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: posterRef.current.scrollWidth,
          windowHeight: posterRef.current.scrollHeight,
        });
        setPosterImage(canvas.toDataURL('image/png'));
      } catch {
        alert('海报生成失败，请重试');
      }
    };

    generate();
  }, [showPoster]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh]"
      style={{ backgroundColor: '#F7F5F2' }}
    >
      {/* ===== Responsive container ===== */}
      <div className="w-full md:max-w-[600px] lg:max-w-[800px] md:mx-auto">

        {/* ===== Hero ===== */}
        <div className="pt-16 pb-4 sm:pt-20 sm:pb-6 flex flex-col items-center px-6" style={{ backgroundColor: '#F7F5F2' }}>

          {/* Title Module — shared PersonalityBlock */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 25 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <PersonalityBlock personality={personality} variant="hero" />
          </motion.div>

          {/* Illustration — separate area, never overlaps with outline text */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 25 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="flex justify-center w-full"
          >
            <img
              src={`/illustrations/${personality.code}.png`}
              alt={personality.name}
              className="w-full max-w-[280px] h-auto object-contain"
              style={{ imageRendering: 'auto' }}
            />
          </motion.div>
        </div>

        {/* ===== Content ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="px-6 pt-4 pb-8"
        >
          {/* Intro card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-3">人格介绍</h3>
            <p className="text-[#111827] leading-relaxed text-base" style={{ textAlign: 'justify', textAlignLast: 'left', wordBreak: 'break-all' }}>{personality.desc}</p>
          </div>

          {/* Dimension Sliders — 人格特征 (slider-splits-track style) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
            <h3 className="text-lg font-bold text-[#1E3A5F] mb-6">人格特征</h3>
            {dimensionResults.map((dim) => (
              <PersonalitySlider key={dim.dimension} dimension={dim} />
            ))}
          </div>

          {/* Button Area — PC: space-between align with card, Mobile: reverse col */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center px-6 sm:px-8 gap-4 sm:gap-0 pb-8">
            {/* 重新测试 — 白底蓝字 */}
            <button
              onClick={onRestart}
              className="bg-white text-[#1E3A5F] text-lg font-bold rounded-full border border-gray-200
                         hover:bg-gray-50 transition-colors duration-200 shadow-sm active:scale-95 w-full sm:flex-1 sm:max-w-[200px]"
              style={{ height: '56px', borderRadius: '28px' }}
            >
              重新测试
            </button>
            {/* 我的ZBTI海报 — 蓝底白字 */}
            <button
              onClick={() => setShowPoster(true)}
              className="bg-[#1E3A5F] text-white text-lg font-bold rounded-full
                         hover:bg-[#C53030] transition-colors duration-200 shadow-md active:scale-95 w-full sm:flex-1 sm:max-w-[200px]"
              style={{ height: '56px', borderRadius: '28px' }}
            >
              点击生成我的专属海报
            </button>
          </div>

          {/* Credits link */}
          <p
            className="text-center cursor-pointer"
            style={{ fontSize: '12px', fontWeight: 400, color: '#9CA3AF', marginTop: '40px', marginBottom: '24px' }}
            onClick={() => setShowCredits(true)}
          >
            © 开发人员名单
          </p>

          <CreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />
        </motion.div>
      </div>

      {/* ===== Hidden DOM for html2canvas capture (off-screen, not affected by modal overflow) ===== */}
      {showPoster && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -9999 }}>
          <div
            ref={posterRef}
            style={{ width: '340px', backgroundColor: '#F7F5F2', position: 'relative' }}
          >
            {/* Logo — 右上角 */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
              <img src="/logo-web.png" alt="肇BTI" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
            </div>

            {/* Content Area */}
            <div style={{ padding: '52px 32px 20px', position: 'relative' }}>

              {/* Outline background text — 人格代码 */}
              {/* Personality header — shared PersonalityBlock */}
              <PersonalityBlock personality={personality} variant="poster" showLabel={false} />
              <div style={{ width: '60%', height: '1px', backgroundColor: '#E8E8E8', margin: '0 auto 20px' }} />

              {/* Personality Illustration */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                  src={`/illustrations/${personality.code}.png`}
                  alt={personality.name}
                  style={{ width: '200px', height: 'auto', display: 'inline-block' }}
                />
              </div>

              <p style={{ fontSize: '12px', color: '#555555', lineHeight: '1.6', textAlign: 'justify', textAlignLast: 'left', wordBreak: 'break-all', marginBottom: '20px' }}>
                {personality.desc}
              </p>
              <PosterDimensionTracks dimensionResults={dimensionResults} />
            </div>
            {/* Display Bar — 公众号引流模块 */}
            <div
              style={{
                borderTop: '1px solid #E8E8E8',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0 24px',
              }}
            >
              {/* 公众号二维码 + 扫码说明（左对齐） */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="/wechat-qr.jpg"
                  alt="公众号二维码"
                  style={{ width: '80px', height: '80px', objectFit: 'contain', flexShrink: 0, borderRadius: '4px' }}
                />
                <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#666666', lineHeight: '1.7', whiteSpace: 'nowrap' }}>
                    关注「来自肇中的红白蓝」
                  </p>
                  <p style={{ fontSize: '11px', color: '#666666', lineHeight: '1.7', whiteSpace: 'nowrap' }}>
                    回复<span style={{ color: '#1E3A5F', fontWeight: 700 }}>"ZBTI"</span>
                  </p>
                  <p style={{ fontSize: '11px', color: '#666666', lineHeight: '1.7', whiteSpace: 'nowrap' }}>
                    获取测试链接
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Share Poster Modal ===== */}
      {showPoster && (
        <div
          className="fixed inset-0 z-[100] p-4"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPoster(false)} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex flex-col"
            style={{ width: 'min(90vw, 360px)', maxHeight: '85vh' }}
          >
            {/* Scrollable poster preview with fixed height */}
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
              style={{ height: 'min(60vh, 480px)' }}
            >
              {/* Scrollable content */}
              <div
                className="absolute inset-0 overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}
              >
                {posterImage ? (
                  <img
                    src={posterImage}
                    alt="分享海报"
                    style={{ width: '340px', maxWidth: '100%', display: 'block', margin: '0 auto' }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '340px', height: '400px', margin: '0 auto', backgroundColor: '#F7F5F2' }}
                  >
                    <div className="w-8 h-8 border-2 border-[#1E3A5F] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Bottom fade gradient — visual hint for more content */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: '60px',
                  background: 'linear-gradient(to bottom, transparent, rgba(247, 245, 242, 0.95))',
                }}
              />
            </div>

            {/* Fixed buttons — always visible */}
            <div className="flex gap-3 flex-shrink-0 mt-4 justify-center">
              <button
                onClick={() => setShowPoster(false)}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-[#6B7280] bg-white/90 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1E3A5F] shadow-md"
                style={{ pointerEvents: 'none' }}
              >
                长按海报即可保存/转发
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
