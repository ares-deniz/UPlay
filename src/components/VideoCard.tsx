import React from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  id: string | number;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
  url?: string;
}

interface VideoCardProps {
  video: Video;
  onSelect?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  const content = (
    <>
      <div className="relative mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg bg-gray-700 group-hover:rounded-none transition-all duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg group-hover:rounded-none"></div>
      </div>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {video.channel.charAt(0)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-white line-clamp-2 group-hover:text-gray-100 transition-colors">
              {video.title}
            </h3>
            <button className="p-1 hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1 hover:text-gray-300 transition-colors">
            {video.channel}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
            <span>{video.views}</span>
            <span>•</span>
            <span>{video.timestamp}</span>
          </div>
        </div>
      </div>
    </>
  );

  // Prefer in-app selection if provided; otherwise fall back to link if present
  return onSelect ? (
    <button type="button" className="group cursor-pointer block text-left" onClick={onSelect}>
      {content}
    </button>
  ) : video.url ? (
    <Link className="group cursor-pointer block" to={video.url}>
      {content}
    </Link>
  ) : (
    <div className="group cursor-pointer">{content}</div>
  );
};

export default VideoCard;
