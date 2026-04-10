import { Loader2, Trash2 } from 'lucide-react';

interface ConfirmationOverlayProps {
  title: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationOverlay = ({
  title,
  deleting,
  onCancel,
  onConfirm,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
}: ConfirmationOverlayProps) => (
  <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center gap-3 border border-red-200 animate-fadeIn z-10">
    <p className="text-sm font-semibold text-gray-700 text-center px-4">
      {title}
    </p>
    <div className="flex gap-2">
      <button
        onClick={onCancel}
        disabled={deleting}
        className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        disabled={deleting}
        className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-70 flex items-center gap-1.5 transition-colors"
      >
        {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        {confirmText}
      </button>
    </div>
  </div>
);