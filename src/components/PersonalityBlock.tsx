/**
 * PersonalityBlock — 人格代码展示块
 *
 * 同时用于：
 * - 测试结果页 Hero 区
 * - 分享海报页头部
 *
 * 通过 variant 切换不同场景的样式。
 */

interface Personality {
  code: string;
  name: string;
  summary: string;
}

interface PersonalityBlockProps {
  personality: Personality;
  variant?: 'hero' | 'poster';
  showLabel?: boolean;
}

export default function PersonalityBlock({
  personality,
  variant = 'hero',
  showLabel = true,
}: PersonalityBlockProps) {
  const isPoster = variant === 'poster';

  return (
    <div className={`relative flex flex-col items-center text-center ${isPoster ? 'mb-4' : 'mb-6'}`}>
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 副标题 — 仅 hero 显示 */}
        {!isPoster && showLabel && (
          <p className="text-sm text-[#6B7280] font-medium mb-1.5">
            你的校园人格是
          </p>
        )}

        {/* Personality code + outline background */}
        <div className="relative mb-2">
          {/* Outline text — mobile */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-black tracking-tighter whitespace-nowrap sm:hidden"
            style={{
              fontSize: isPoster ? '80px' : 'clamp(80px, 28vw, 140px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(30, 58, 95, 0.08)',
              lineHeight: 1,
              zIndex: 0,
            }}
          >
            {personality.code}
          </span>

          {/* Outline text — PC */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-black tracking-tighter whitespace-nowrap hidden sm:block"
            style={{
              fontSize: isPoster ? '80px' : 'clamp(120px, 16vw, 240px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(30, 58, 95, 0.08)',
              lineHeight: 1,
              zIndex: 0,
            }}
          >
            {personality.code}
          </span>

          {/* Foreground personality code */}
          <h1
            className="relative z-10 font-black text-[#1E3A5F] tracking-tight"
            style={{
              fontSize: isPoster ? '48px' : undefined,
              lineHeight: 1,
            }}
          >
            <span className={isPoster ? '' : 'text-5xl sm:text-6xl'}>
              {personality.code}
            </span>
          </h1>
        </div>

        {/* Chinese name */}
        <h2 className={`font-bold text-[#111827] ${isPoster ? 'text-lg mb-2' : 'text-2xl sm:text-3xl mb-3'}`}>
          {personality.name}
        </h2>

        {/* Summary */}
        <p className={`text-[#6B7280] italic max-w-md mx-auto leading-relaxed ${isPoster ? 'text-sm mb-4' : 'text-base sm:text-lg'}`}>
          &ldquo;{personality.summary}&rdquo;
        </p>
      </div>
    </div>
  );
}
