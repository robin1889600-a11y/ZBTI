import type { DimensionScore } from '../types';

const DIMENSION_NAMES: Record<string, string> = {
  order: '秩序应对方式',
  energy: '能量恢复方式',
  pace: '行动节奏方式',
  emotion: '情绪处理方式',
};

const SLIDER_COLORS: Record<string, string> = {
  order: '#C53030',
  energy: '#1E3A5F',
  pace: '#4F6FCB',
  emotion: '#8A94A6',
};

const THUMB_SIZE = 16;
const HALF_THUMB = THUMB_SIZE / 2; // 8px

interface PersonalitySliderProps {
  dimension: DimensionScore;
}

export default function PersonalitySlider({ dimension }: PersonalitySliderProps) {
  const percent = dimension.displayPercent;
  const isPositive = dimension.score >= 0;
  const color = SLIDER_COLORS[dimension.dimension];
  const dimName = DIMENSION_NAMES[dimension.dimension] || dimension.dimension;

  // Bi-directional slider position
  const sliderLeft = isPositive ? (100 - percent) : percent;

  // Fill: slider splits the track into colored / gray halves
  // Positive: gray on LEFT (0~slider), color on RIGHT (slider~100)
  // Negative: color on LEFT (0~slider), gray on RIGHT (slider~100)
  const fillLeft = isPositive ? sliderLeft : 0;
  const fillWidth = isPositive ? (100 - sliderLeft) : sliderLeft;

  return (
    <div className="mb-8">
      {/* Row 1: Dimension name */}
      <p className="text-xs text-[#9CA3AF] mb-2">{dimName}</p>

      {/* Row 2: Personality word + Percentage */}
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color }}>
          {dimension.displayLabel}
        </p>
        <span className="text-base sm:text-lg font-bold flex-shrink-0 ml-3" style={{ color }}>
          {percent}%
        </span>
      </div>

      {/* Row 3: Track — slider splits colored / gray */}
      <div
        className="relative"
        style={{ paddingLeft: `${HALF_THUMB}px`, paddingRight: `${HALF_THUMB}px` }}
      >
        {/* Gray background track */}
        <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E8E8' }}>
          {/* Colored fill */}
          <div
            className="absolute top-0 h-full rounded-full transition-all duration-700"
            style={{
              left: `${fillLeft}%`,
              width: `${fillWidth}%`,
              backgroundColor: color,
              opacity: 0.35,
            }}
          />
        </div>

        {/* Thumb: white ring only, no shadow */}
        <div
          className="absolute top-1/2 z-10 rounded-full transition-all duration-700"
          style={{
            left: `clamp(${HALF_THUMB}px, ${sliderLeft}%, calc(100% - ${HALF_THUMB}px))`,
            transform: 'translate(-50%, -50%)',
            width: `${THUMB_SIZE}px`,
            height: `${THUMB_SIZE}px`,
            backgroundColor: color,
            boxShadow: '0 0 0 3px #FFFFFF',
          }}
        />
      </div>

      {/* Row 4: End labels */}
      <div className="flex justify-between mt-2">
        <span
          className="text-xs"
          style={{ fontWeight: isPositive ? 600 : 400, color: isPositive ? color : '#999999' }}
        >
          {dimension.positiveLabel}
        </span>
        <span
          className="text-xs"
          style={{ fontWeight: !isPositive ? 600 : 400, color: !isPositive ? color : '#999999' }}
        >
          {dimension.negativeLabel}
        </span>
      </div>
    </div>
  );
}
