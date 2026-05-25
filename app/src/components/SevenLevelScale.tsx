import { useState } from 'react';

interface SevenLevelScaleProps {
  questionId: number;
  selectedValue: number | undefined;
  onSelect: (questionId: number, value: number) => void;
}

// ============================================================
// 六级量表 (6-Level Likert Scale)
// 结构: 不同意 ● ● ● ● ● ● 同意
// 颜色: 红  红  红  蓝  蓝  蓝
// 大小: 大  中  小  小  中  大
// 分值: -3  -2  -1  +1  +2  +3
// 无中立，无灰色，无0分
// ============================================================

const LEVELS = [
  { value: -3 }, // red, largest
  { value: -2 }, // red, medium
  { value: -1 }, // red, small
  { value: 1 },  // blue, small
  { value: 2 },  // blue, medium
  { value: 3 },  // blue, largest
];

// Size classes: large -> medium -> small -> small -> medium -> large
const CIRCLE_SIZES = [
  'w-11 h-11 sm:w-12 sm:h-12', // left outer (largest)
  'w-8 h-8 sm:w-9 sm:h-9',      // left mid
  'w-6 h-6 sm:w-7 sm:h-7',      // left inner (smallest)
  'w-6 h-6 sm:w-7 sm:h-7',      // right inner (smallest)
  'w-8 h-8 sm:w-9 sm:h-9',      // right mid
  'w-11 h-11 sm:w-12 sm:h-12', // right outer (largest)
];

export default function SevenLevelScale({ questionId, selectedValue, onSelect }: SevenLevelScaleProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 mt-6 select-none w-full">
      {/* Left label */}
      <span className="text-xs sm:text-sm text-[#6B7280] font-medium mr-0.5 sm:mr-1 whitespace-nowrap flex-shrink-0">
        不同意
      </span>

      {/* 6 circles: 3 red + 3 blue */}
      {LEVELS.map((level, index) => {
        const isSelected = selectedValue === level.value;
        const isHovered = hoveredIndex === index;
        const isLeft = index < 3; // left 3 = red

        const sizeClass = CIRCLE_SIZES[index];

        // Base style
        let styleClass = `${sizeClass} rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center flex-shrink-0 hover:scale-110 `;

        if (isLeft) {
          // Red circles (left side)
          if (isSelected) {
            styleClass += 'bg-[#C53030] ring-2 ring-offset-2 ring-[#C53030]/40 ';
          } else if (isHovered) {
            styleClass += 'bg-[#C53030]/30 border-2 border-[#C53030] ';
          } else {
            styleClass += 'bg-transparent border-2 border-[#C53030] ';
          }
        } else {
          // Blue circles (right side)
          if (isSelected) {
            styleClass += 'bg-[#1E3A5F] ring-2 ring-offset-2 ring-[#1E3A5F]/40 ';
          } else if (isHovered) {
            styleClass += 'bg-[#1E3A5F]/30 border-2 border-[#1E3A5F] ';
          } else {
            styleClass += 'bg-transparent border-2 border-[#1E3A5F] ';
          }
        }

        return (
          <button
            key={level.value}
            className={styleClass}
            onClick={() => onSelect(questionId, level.value)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            type="button"
            aria-label={`选择 ${level.value > 0 ? '同意' : '不同意'} ${Math.abs(level.value)}`}
          />
        );
      })}

      {/* Right label */}
      <span className="text-xs sm:text-sm text-[#6B7280] font-medium ml-0.5 sm:ml-1 whitespace-nowrap flex-shrink-0">
        同意
      </span>
    </div>
  );
}
