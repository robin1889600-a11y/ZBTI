import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CREDITS = [
  { role: '策划 & 编程', members: '糖糖' },
  { role: '文本 & 创意', members: '糖糖　有虞　竹排子' },
  { role: '美术', members: '鱼鳞　AgNO₃　每' },
  { role: '宣传', members: 'Rain　RY　呱呱' },
  { role: '部署协助', members: '大炮' },
  { role: '测试协助', members: '醴年　有虞　竹排子　清源　九月秋　椰兔　：p　Rain RY　涯屿　日秋　凉皮　铁盒　AgNO₃　鱼鳞　Alice　子虚　比比　Ceilboo　moon　凡凡　弦三　小树　李客厅　木华　寻宁　呱呱　Lulu　每　Revol　大炮　小鸣　Nikie　徐节　Wilson' },
];

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-[20px] shadow-xl w-full flex flex-col overflow-hidden"
            style={{ maxWidth: '520px', maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img
                  src="/logo-web.png"
                  alt="肇BTI"
                  style={{
                    width: '120px',
                    height: 'auto',
                    opacity: 0.95,
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Thanks */}
              <p
                className="text-center mb-8"
                style={{ fontSize: '13px', color: '#9CA3AF' }}
              >
                感谢所有参与肇BTI制作与测试的朋友。
              </p>

              {/* Credits list */}
              <div className="space-y-5">
                {CREDITS.map((item) => (
                  <div key={item.role} className="text-center">
                    <p
                      className="font-bold mb-1"
                      style={{ color: '#1E3A5F', fontSize: '14px' }}
                    >
                      {item.role}
                    </p>
                    <p
                      style={{
                        color: '#374151',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        wordBreak: 'keep-all',
                      }}
                    >
                      {item.members}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Footer — Close button always visible */}
            <div
              className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white"
            >
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full text-sm font-medium text-[#6B7280] bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
