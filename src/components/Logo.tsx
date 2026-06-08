/**
 * ZBTI Brand Logo — 统一品牌标识组件
 *
 * logo-web.png 为裁剪后的横版品牌标识（1267×433，宽高比 2.93:1）。
 * 所有 variant 基于新比例重新计算，确保品牌标识清晰可见。
 */

interface LogoProps {
  variant?: 'hero' | 'nav' | 'poster';
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ variant = 'nav', className = '', style }: LogoProps) {
  const variantClasses = {
    // Hero：宽度响应式，品牌标识清晰可见
    // Mobile 140px→高48px / Tablet 170px→高58px / Desktop 200px→高68px
    hero: 'w-[140px] sm:w-[170px] lg:w-[200px] h-auto',
    // Nav：高度响应式，品牌标识宽度充足
    // h-[38px]→宽111px / h-[42px]→宽123px / h-[48px]→宽141px
    nav: 'h-[38px] sm:h-[42px] md:h-[48px] w-auto',
    // Poster：固定高度，品牌标识清晰
    // h-[30px]→宽88px
    poster: 'h-[30px] w-auto',
  };

  return (
    <img
      src="/logo-web.png"
      alt="肇BTI"
      className={`object-contain ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}
