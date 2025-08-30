import React from 'react';
import { X } from 'lucide-react';

interface VideoPlayerModalProps {
  open: boolean;
  videoId: string | null;
  title?: string;
  channel?: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  open,
  videoId,
  title,
  channel,
  onClose,
}) => {
  if (!open || !videoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-zinc-950 border border-zinc-700 rounded-lg w-[95vw] max-w-5xl p-4 shadow-xl">
        <button
          className="absolute top-2 right-2 p-2 rounded hover:bg-zinc-800"
          onClick={onClose}
          aria-label="Close player"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>
        <div className="w-full aspect-video bg-black rounded overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title || 'Video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="mt-3">
          {title && <h3 className="text-white text-lg font-semibold line-clamp-2">{title}</h3>}
          {channel && <p className="text-gray-400 text-sm mt-1">{channel}</p>}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;

