import { X } from 'lucide-react';
import { useEffect } from 'react';

export function AdminModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative h-full w-full overflow-y-auto p-4 sm:p-6 flex items-start sm:items-center justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl bg-white rounded-[14px] border border-[#dddddd] overflow-hidden"
        >
          <div className="px-5 py-4 sm:px-6 border-b border-[#ebebeb] flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-[#222222]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-[8px] text-[#929292] hover:text-[#222222] hover:bg-[#f7f7f7] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-5 py-5 sm:px-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
