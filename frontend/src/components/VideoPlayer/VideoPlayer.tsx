import { useRef } from 'react';
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

  const handleReady = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && typeof internalPlayer.setPlaybackQuality === 'function') {
      internalPlayer.setPlaybackQuality('hd1080');
    }
  };

  return (
    <div className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          playing={false}
          onProgress={onProgress}
          onEnded={onEnded}
          onReady={handleReady}
          config={{
            youtube: {
              playerVars: {
                start: startTime,
                rel: 0,
                modestbranding: 1,
                showinfo: 0,
                vq: 'hd1080', // Sugerir calidad 1080p al iniciar
              },
            },
            file: {
              attributes: {
                controlsList: 'nodownload',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
