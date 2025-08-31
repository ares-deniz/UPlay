import React, { useEffect, useRef, useState } from 'react';
import { fetchFromAPI } from '../utils/fetchFromApi';
import { useParams } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';

type VideoDetails = {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    description?: string;
    thumbnails: { high?: { url: string } };
  };
  contentDetails: { duration: string };
  statistics: { viewCount?: string; likeCount?: string };
};

function formatViewCount(n?: string) {
  const v = n ? parseInt(n, 10) : 0;
  if (!isFinite(v)) return '— views';
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B views`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M views`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K views`;
  return `${v} views`;
}

function formatISODuration(iso?: string): string {
  if (!iso) return '—';
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
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
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

const Watch: React.FC = () => {
  const { id: videoIdParam } = useParams<{ id: string }>();
  const videoId = videoIdParam || '';
  const [details, setDetails] = useState<VideoDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDismissed, setErrorDismissed] = useState<boolean>((window as any).__uplayApiErrorDismissed || false);
  const [loading, setLoading] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchFromAPI<{ items: VideoDetails[] }>('videos', {
          part: 'snippet,contentDetails,statistics',
          id: videoId,
        });
        if (cancelled) return;
        setDetails(res.items?.[0] || null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load video');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (videoId) load();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const title = details?.snippet.title;
  const channel = details?.snippet.channelTitle;
  const views = formatViewCount(details?.statistics?.viewCount);
  const published = details?.snippet.publishedAt
    ? timeAgo(details.snippet.publishedAt)
    : '';
  const duration = formatISODuration(details?.contentDetails?.duration);

  const fullScreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  // Load YouTube IFrame API and initialize player
  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (!window.YT || !window.YT.Player || !playerContainerRef.current)
        return;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          mute: 1,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            try {
              playerRef.current?.playVideo();
              setIsPlaying(true);
              setPlayerReady(true);
            } catch {}
          },
          onStateChange: (e: any) => {
            // 1: unstarted, 0: ended, 2: paused, 1: playing
            if ('mediaSession' in navigator) {
              try {
                // @ts-ignore
                navigator.mediaSession.playbackState =
                  e.data === 1 ? 'playing' : e.data === 2 ? 'paused' : 'none';
              } catch {}
            }
            if (e.data === 1) setIsPlaying(true);
            if (e.data === 2 || e.data === 0) setIsPlaying(false);
          },
          onError: () => {
            setPlayerError('Playback unavailable for this video.');
          },
        },
      });
    }

    function ensureApi() {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }
      const existing = document.getElementById('youtube-iframe-api');
      if (!existing) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        if (!cancelled) createPlayer();
      };
    }

    if (videoId) ensureApi();

    // Fallback: if player not ready after 2.5s, use plain iframe
    const t = window.setTimeout(() => {
      if (!playerReady) setUseIframeFallback(true);
    }, 2500);

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
      window.clearTimeout(t);
    };
  }, [videoId, playerReady]);

  // Media Session metadata for lock screen controls (where supported)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    try {
      // @ts-ignore
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: title || 'UPlay',
        artist: channel || 'YouTube',
        album: 'UPlay',
        artwork: details?.snippet.thumbnails?.high?.url
          ? [
              {
                src: details.snippet.thumbnails.high.url,
                sizes: '1280x720',
                type: 'image/jpeg',
              },
            ]
          : [],
      });

      const play = () => playerRef.current?.playVideo?.();
      const pause = () => playerRef.current?.pauseVideo?.();
      // @ts-ignore
      navigator.mediaSession.setActionHandler?.('play', play);
      // @ts-ignore
      navigator.mediaSession.setActionHandler?.('pause', pause);
      // @ts-ignore
      navigator.mediaSession.setActionHandler?.('stop', pause);
      // Optional seek handlers
      // @ts-ignore
      navigator.mediaSession.setActionHandler?.('seekbackward', () => {
        try {
          const t = playerRef.current?.getCurrentTime?.() || 0;
          playerRef.current?.seekTo?.(Math.max(0, t - 10), true);
        } catch {}
      });
      // @ts-ignore
      navigator.mediaSession.setActionHandler?.('seekforward', () => {
        try {
          const t = playerRef.current?.getCurrentTime?.() || 0;
          playerRef.current?.seekTo?.(t + 10, true);
        } catch {}
      });
    } catch {}
  }, [title, channel, details?.snippet.thumbnails?.high?.url]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <ErrorModal
        open={!!error && !errorDismissed}
        title="API Limit Reached"
        message={error || ''}
        onClose={() => {
          (window as any).__uplayApiErrorDismissed = true;
          setErrorDismissed(true);
        }}
      />
      {loading && <div className="text-gray-400 py-8">Loading…</div>}
      {/* no inline error; modal handles error display */}
      {!loading && !error && (
        <>
          <div className="w-full mt-4 rounded overflow-hidden bg-black">
            <div className="relative w-full aspect-video">
              {useIframeFallback ? (
                <iframe
                  ref={iframeRef}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(
                    window.location.origin
                  )}`}
                  title={title || 'Video player'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div
                  ref={playerContainerRef}
                  id="uplay-yt-player"
                  className="absolute inset-0 w-full h-full"
                />
              )}
              {/* Controls overlay */}
              {playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-center p-4">
                  <div>
                    <p className="text-white mb-3">{playerError}</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white text-sm"
                    >
                      Open on YouTube
                    </a>
                  </div>
                </div>
              )}
              {!playerError && (
                <div className="absolute bottom-3 md:bottom-12 right-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      try {
                        if (useIframeFallback) {
                          const win = iframeRef.current?.contentWindow;
                          if (win) {
                            win.postMessage(
                              JSON.stringify({
                                event: 'command',
                                func: isMuted ? 'unMute' : 'mute',
                                args: [],
                              }),
                              '*'
                            );
                          }
                        } else {
                          if (isMuted) playerRef.current?.unMute?.();
                          else playerRef.current?.mute?.();
                        }
                        setIsMuted((m) => !m);
                      } catch {}
                    }}
                    className={`px-3 py-1.5 rounded text-xs ${
                      isMuted
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                        : 'bg-zinc-700/40 text-gray-300'
                    }`}
                    aria-pressed={!isMuted}
                  >
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                  <button
                    onClick={() => {
                      try {
                        if (useIframeFallback) {
                          const win = iframeRef.current?.contentWindow;
                          if (win) {
                            win.postMessage(
                              JSON.stringify({
                                event: 'command',
                                func: isPlaying ? 'pauseVideo' : 'playVideo',
                                args: [],
                              }),
                              '*'
                            );
                          }
                          setIsPlaying((p) => !p);
                        } else {
                          if (isPlaying) {
                            playerRef.current?.pauseVideo?.();
                          } else {
                            playerRef.current?.playVideo?.();
                          }
                          setIsPlaying((p) => !p);
                        }
                      } catch {}
                    }}
                    className="px-3 py-1.5 rounded text-xs bg-zinc-800 hover:bg-zinc-700 text-white"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div>
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              <div className="text-gray-400 text-sm mt-1">
                <span>{channel}</span>
                <span className="mx-2">•</span>
                <span>{views}</span>
                <span className="mx-2">•</span>
                <span>{duration}</span>
                <span className="mx-2">•</span>
                <span>{published}</span>
              </div>
            </div>
            <button
              onClick={fullScreen}
              className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs"
            >
              Toggle Fullscreen
            </button>
          </div>

          {details?.snippet.description && (
            <div className="mt-4 text-gray-300 whitespace-pre-wrap text-sm">
              {details.snippet.description}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Watch;
