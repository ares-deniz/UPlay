import React, { useEffect, useMemo, useState } from 'react';
import VideoCard from './VideoCard';
import { fetchFromAPI } from '../utils/fetchFromApi';
import ErrorModal from './ErrorModal';
import VideoPlayerModal from './VideoPlayerModal';

interface VideoGridProps {
  searchQuery: string;
  activeCategory: string;
}

type ApiItem = {
  id:
    | {
        kind: string;
        videoId?: string;
        channelId?: string;
        playlistId?: string;
      }
    | string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium?: { url: string }; high?: { url: string } };
  };
};

type VideoShape = {
  id: string | number;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
  category?: string;
  videoId?: string; // YouTube video id when available
};

const VideoGrid: React.FC<VideoGridProps> = ({
  searchQuery,
  activeCategory,
}) => {
  const [apiVideos, setApiVideos] = useState<VideoShape[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDismissed, setErrorDismissed] = useState<boolean>((window as any).__uplayApiErrorDismissed || false);
  const [selected, setSelected] = useState<{
    id: string;
    title?: string;
    channel?: string;
  } | null>(null);

  const fallbackVideos = [
    {
      id: 1,
      title: 'Amazing Nature Documentary: Wildlife in 4K',
      channel: 'Nature Explorer',
      views: '2.3M views',
      timestamp: '2 days ago',
      duration: '15:32',
      thumbnail:
        'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 2,
      title: 'Learn React in 2024 - Complete Tutorial',
      channel: 'CodeMaster',
      views: '890K views',
      timestamp: '1 week ago',
      duration: '45:12',
      thumbnail:
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 3,
      title: 'Epic Gaming Montage - Best Plays 2024',
      channel: 'GameHighlights',
      views: '1.5M views',
      timestamp: '3 days ago',
      duration: '8:45',
      thumbnail:
        'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Gaming',
    },
    {
      id: 4,
      title: 'Cooking the Perfect Pasta - Italian Chef Tips',
      channel: 'CulinaryArts',
      views: '456K views',
      timestamp: '5 days ago',
      duration: '12:18',
      thumbnail:
        'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 5,
      title: 'Space Exploration: Journey to Mars',
      channel: 'CosmosTV',
      views: '3.2M views',
      timestamp: '1 day ago',
      duration: '22:34',
      thumbnail:
        'https://images.pexels.com/photos/73873/star-clusters-rosette-nebula-star-galaxies-73873.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Trending',
    },
    {
      id: 6,
      title: 'Urban Photography Tips for Beginners',
      channel: 'PhotoPro',
      views: '234K views',
      timestamp: '4 days ago',
      duration: '18:29',
      thumbnail:
        'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 7,
      title: 'Electronic Music Production Masterclass',
      channel: 'BeatMakers',
      views: '678K views',
      timestamp: '6 days ago',
      duration: '35:17',
      thumbnail:
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Music',
    },
    {
      id: 8,
      title: 'Fitness Workout: Full Body Training',
      channel: 'FitLife',
      views: '512K views',
      timestamp: '1 week ago',
      duration: '28:45',
      thumbnail:
        'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sport',
    },
    {
      id: 9,
      title: 'Travel Vlog: Exploring Tokyo Streets',
      channel: 'WorldWanderer',
      views: '1.8M views',
      timestamp: '3 days ago',
      duration: '24:12',
      thumbnail:
        'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Trending',
    },
    {
      id: 10,
      title: 'DIY Home Renovation on a Budget',
      channel: 'HomeImprove',
      views: '789K views',
      timestamp: '2 weeks ago',
      duration: '31:08',
      thumbnail:
        'https://images.pexels.com/photos/276625/pexels-photo-276625.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 11,
      title: 'Ocean Life Documentary - Deep Sea Mysteries',
      channel: 'AquaWorld',
      views: '2.1M views',
      timestamp: '5 days ago',
      duration: '42:15',
      thumbnail:
        'https://images.pexels.com/photos/9429271/pexels-photo-9429271.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 12,
      title: 'Modern Art Techniques and History',
      channel: 'ArtGallery',
      views: '345K views',
      timestamp: '1 week ago',
      duration: '19:33',
      thumbnail:
        'https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Home',
    },
    {
      id: 13,
      title: 'Top 10 Movie Trailers This Month',
      channel: 'MovieBuzz',
      views: '1.2M views',
      timestamp: '2 days ago',
      duration: '16:42',
      thumbnail:
        'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Films',
    },
    {
      id: 14,
      title: 'Jazz Piano Tutorial - Beginner Basics',
      channel: 'MusicAcademy',
      views: '567K views',
      timestamp: '1 week ago',
      duration: '32:18',
      thumbnail:
        'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Music',
    },
    {
      id: 15,
      title: 'Pro Gaming Setup Tour 2024',
      channel: 'GameStream',
      views: '890K views',
      timestamp: '3 days ago',
      duration: '14:27',
      thumbnail:
        'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Gaming',
    },
    {
      id: 16,
      title: 'Championship Highlights - Best Goals',
      channel: 'SportsCentral',
      views: '2.5M views',
      timestamp: '1 day ago',
      duration: '11:33',
      thumbnail:
        'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sport',
    },
    {
      id: 17,
      title: 'Blockbuster Movie Review - Latest Release',
      channel: 'CinemaReview',
      views: '445K views',
      timestamp: '4 days ago',
      duration: '19:15',
      thumbnail:
        'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Films',
    },
    {
      id: 18,
      title: 'Tech Review Latest Gadgets',
      channel: 'TechReview',
      views: '1.1M views',
      timestamp: '2 days ago',
      duration: '25:44',
      thumbnail:
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'TechReview',
    },
    {
      id: 19,
      title: 'Latest Music Hits Compilation',
      channel: 'MusicChannel',
      views: '756K views',
      timestamp: '1 week ago',
      duration: '38:22',
      thumbnail:
        'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'MusicChannel',
    },
    {
      id: 20,
      title: 'Breaking News Update',
      channel: 'NewsToday',
      views: '3.8M views',
      timestamp: '6 hours ago',
      duration: '12:08',
      thumbnail:
        'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'NewsToday',
    },
  ];

  const query = useMemo(() => {
    if (searchQuery.trim()) return searchQuery.trim();
    if (activeCategory && activeCategory !== 'Home') return activeCategory;
    return 'new';
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    let cancelled = false;

    function formatViewCount(n: string | number | undefined): string {
      const num = typeof n === 'string' ? parseInt(n, 10) : n ?? 0;
      if (isNaN(num as number)) return '—';
      const v = num as number;
      if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B views`;
      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M views`;
      if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K views`;
      return `${v} views`;
    }

    function formatISODuration(iso?: string): string {
      if (!iso) return '—';
      // Simple ISO8601 duration parser for PT#H#M#S
      const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
      if (!m) return '—';
      const h = parseInt(m[1] || '0', 10);
      const min = parseInt(m[2] || '0', 10);
      const s = parseInt(m[3] || '0', 10);
      const parts = [
        h > 0 ? String(h) : null,
        h > 0 ? String(min).padStart(2, '0') : String(min),
        String(s).padStart(2, '0'),
      ].filter(Boolean) as string[];
      return parts.join(':');
    }

    function timeAgo(iso: string): string {
      const published = new Date(iso);
      const now = new Date();
      const diff = +now - +published;
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 60)
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
      const weeks = Math.floor(days / 7);
      if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
      const months = Math.floor(days / 30);
      if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
      const years = Math.floor(days / 365);
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 1) Search for videos
        const search = await fetchFromAPI<{ items: ApiItem[] }>('search', {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 25,
          videoEmbeddable: 'true',
        });
        if (cancelled) return;

        const videoIds = (search.items || [])
          .map((it) => (typeof it.id === 'string' ? it.id : it.id.videoId))
          .filter(Boolean) as string[];

        if (videoIds.length === 0) {
          setApiVideos([]);
          return;
        }

        // 2) Fetch details for those IDs
        const details = await fetchFromAPI<{
          items: Array<{
            id: string;
            snippet: {
              title: string;
              channelTitle: string;
              publishedAt: string;
              thumbnails: { high?: { url: string }; medium?: { url: string } };
            };
            contentDetails: { duration: string };
            statistics: { viewCount?: string };
          }>;
        }>('videos', {
          part: 'snippet,contentDetails,statistics',
          id: videoIds.join(','),
        });
        if (cancelled) return;

        const mapped: VideoShape[] = (details.items || []).map((v) => ({
          id: v.id,
          title: v.snippet.title,
          channel: v.snippet.channelTitle,
          views: formatViewCount(v.statistics?.viewCount),
          timestamp: timeAgo(v.snippet.publishedAt),
          duration: formatISODuration(v.contentDetails?.duration),
          thumbnail:
            v.snippet.thumbnails.high?.url ||
            v.snippet.thumbnails.medium?.url ||
            '',
          url: `/watch/${v.id}`,
          videoId: v.id,
          category: activeCategory,
        }));

        setApiVideos(mapped);
      } catch (e: any) {
        setApiVideos(null);
        setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const isFromApi = apiVideos !== null;
  const sourceVideos = apiVideos ?? fallbackVideos;

  const filteredVideos = sourceVideos.filter((video) => {
    const matchesSearch =
      searchQuery === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase());

    // If results are from API, we've already queried by category/search;
    // do not filter them out further by our local category.
    if (isFromApi) return matchesSearch;

    // Fallback dataset: allow Home to show all, and Explore acts like Home
    const isAll = activeCategory === 'Home' || activeCategory === 'Explore';
    const matchesCategory =
      isAll ||
      video.category === activeCategory ||
      video.channel === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 lg:p-6">
      <ErrorModal
        open={!!error && !errorDismissed}
        title="API Limit Reached"
        message={error || ''}
        onClose={() => {
          (window as any).__uplayApiErrorDismissed = true;
          setErrorDismissed(true);
        }}
      />
      <VideoPlayerModal
        open={!!selected}
        videoId={selected?.id ?? null}
        title={selected?.title}
        channel={selected?.channel}
        onClose={() => setSelected(null)}
      />
      {loading && <div className="mb-6 text-gray-400">Loading videos…</div>}
      {/* no inline error; modal handles error display */}
      {searchQuery ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Search results for "{searchQuery}"
          </h2>
          <p className="text-gray-400">{filteredVideos.length} results found</p>
        </div>
      ) : (
        activeCategory !== 'Home' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {activeCategory}
            </h2>
            <p className="text-gray-400">{filteredVideos.length} videos</p>
          </div>
        )
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {filteredVideos.map((video: any) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No videos found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchQuery
              ? 'Try different search terms'
              : 'No content available for this category'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
