import React from 'react';

interface Props {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<Props> = ({ open, title = 'Notice', message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-zinc-950 border border-zinc-700 rounded-lg w-[92vw] max-w-md p-5 shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm whitespace-pre-wrap">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;

