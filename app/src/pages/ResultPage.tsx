import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
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

// ─── QR Code constructor from CDN ─────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getQRCode = (): any => (window as unknown as Record<string, unknown>).QRCode;

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
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setShowContent(true), 600);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Generate QR code → then capture poster via html2canvas
  useEffect(() => {
    if (!showPoster) {
      setPosterImage(null);
      canvasRef.current = null;
      return;
    }

    const generate = async () => {
      // 1. Generate QR code
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        const QRCode = getQRCode();
        if (QRCode) {
          new QRCode(qrRef.current, {
            text: window.location.href,
            width: 40,
            height: 40,
            colorDark: '#1E3A5F',
            colorLight: '#F7F5F2',
            correctLevel: 1,
          });
        }
      }

      // 2. Wait for QR code to render
      await new Promise((r) => setTimeout(r, 300));

      // 3. Capture DOM with html2canvas
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
        canvasRef.current = canvas;
        setPosterImage(canvas.toDataURL('image/png'));
      } catch {
        alert('海报生成失败，请重试');
      }
    };

    generate();
  }, [showPoster]);

  // Download: use the same canvas captured above
  const handleDownloadPoster = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `肇BTI-${personality.code}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

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
        <div className="relative pt-16 pb-6 sm:pt-20 sm:pb-8 flex flex-col items-center px-6 overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="text-[22vw] font-black tracking-tighter"
              style={{ color: 'transparent', WebkitTextStroke: '1px rgba(30, 58, 95, 0.07)' }}
            >
              {personality.code}
            </span>
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(197,48,48,0.04) 0%, rgba(107,138,201,0.06) 50%, rgba(30,58,95,0.04) 100%)' }}
          />

          {/* Share Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowPoster(true)}
            className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm border border-gray-200
                       text-[#1E3A5F] text-sm font-medium px-4 py-2 rounded-full shadow-sm
                       hover:bg-[#1E3A5F] hover:text-white transition-all duration-200"
          >
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              分享
            </span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 25 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 text-center"
          >
            <p className="text-sm text-[#6B7280] font-medium mb-1.5">你的校园人格是</p>
            <h1 className="text-5xl sm:text-6xl font-black text-[#1E3A5F] mb-2 tracking-tight">
              {personality.code}
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
              {personality.name}
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg max-w-md mx-auto leading-relaxed italic">
              &ldquo;{personality.summary}&rdquo;
            </p>
          </motion.div>
        </div>

        {/* ===== Content ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="px-6 pt-2 pb-8"
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

          {/* Restart */}
          <div className="text-center pb-8">
            <button
              onClick={onRestart}
              className="bg-[#1E3A5F] text-white text-base font-semibold px-10 py-3.5 rounded-full
                         hover:bg-[#C53030] transition-colors duration-200 shadow-md active:scale-95"
            >
              重新测试
            </button>
          </div>
        </motion.div>
      </div>

      {/* ===== Hidden DOM for html2canvas capture (off-screen, not affected by modal overflow) ===== */}
      {showPoster && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -9999 }}>
          <div
            ref={posterRef}
            style={{ width: '340px', backgroundColor: '#F7F5F2' }}
          >
            {/* Content Area */}
            <div style={{ padding: '40px 32px 20px' }}>
              <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#1E3A5F', textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {personality.code}
              </h1>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#333333', textAlign: 'center', marginBottom: '12px' }}>
                {personality.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#666666', fontStyle: 'italic', textAlign: 'center', marginBottom: '16px', maxWidth: '260px', margin: '0 auto 16px' }}>
                &ldquo;{personality.summary}&rdquo;
              </p>
              <div style={{ width: '60%', height: '1px', backgroundColor: '#E8E8E8', margin: '0 auto 20px' }} />
              <p style={{ fontSize: '12px', color: '#555555', lineHeight: '1.6', textAlign: 'justify', textAlignLast: 'left', wordBreak: 'break-all', marginBottom: '20px' }}>
                {personality.desc}
              </p>
              <PosterDimensionTracks dimensionResults={dimensionResults} />
            </div>
            {/* Display Bar */}
            <div
              style={{
                borderTop: '1px solid #E8E8E8',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
              }}
            >
              <div ref={qrRef} style={{ width: '40px', height: '40px', flexShrink: 0 }} />
              <div style={{ marginLeft: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" color="#1E3A5F">
                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 9.5C7 9.5 8.5 7 12 7C15.5 7 17 9.5 17 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 14.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 600, color: '#1E3A5F' }}>肇BTI</span>
                </div>
                <p style={{ fontSize: '11px', color: '#999999', marginTop: '2px' }}>肇中人专属人格测试</p>
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
            className="relative z-10 flex flex-col items-center gap-4"
            style={{ width: 'min(90vw, 390px)' }}
          >
            {/* Preview: html2canvas generated image (identical to download) */}
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ width: '100%' }}>
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

            {/* Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setShowPoster(false)}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-[#6B7280] bg-white/90 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={handleDownloadPoster}
                disabled={!posterImage}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#1E3A5F] hover:bg-[#C53030] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下载海报
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
