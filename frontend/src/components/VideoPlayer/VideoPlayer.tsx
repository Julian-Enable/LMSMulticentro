import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';

interface VideoPlayerProps {
  url: string;
  startTime?: number;
  onProgress?: (state: OnProgressProps) => void;
  onEnded?: () => void;
  className?: string;
}

const VideoPlayer = ({
  url,
  startTime = 0,
  onProgress,
  onEnded,
  className = '',
}: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [ended, setEnded] = useState(false);

  const handleReady = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && typeof internalPlayer.setPlaybackQuality === 'function') {
      internalPlayer.setPlaybackQuality('hd1080');
    }
  };

  const handleEnded = () => {
    setEnded(true);
    onEnded?.();
  };

  const handleReplay = () => {
    setEnded(false);
    playerRef.current?.seekTo(startTime, 'seconds');
    // Small delay so the overlay disappears before playing
    setTimeout(() => {
      const internalPlayer = playerRef.current?.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.playVideo === 'function') {
        internalPlayer.playVideo();
      }
    }, 100);
  };

  return (
    <div className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video relative">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          playing={false}
          onProgress={onProgress}
          onEnded={handleEnded}
          onReady={handleReady}
          onPlay={() => setEnded(false)}
          config={{
            youtube: {
              playerVars: {
                start: startTime,
                rel: 0,
                modestbranding: 1,
                showinfo: 0,
                vq: 'hd1080',
              },
            },
            file: {
              attributes: {
                controlsList: 'nodownload',
              },
            },
          }}
        />

        {/* Overlay to block YouTube end-screen recommendations */}
        {ended && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white text-xl font-semibold">¡Video completado!</p>
            <button
              onClick={handleReplay}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Ver de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
