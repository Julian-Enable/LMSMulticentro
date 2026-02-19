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
  return (
    <div className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          playing={false}
          onProgress={onProgress}
          onEnded={onEnded}
          config={{
            youtube: {
              playerVars: {
                start: startTime,
                rel: 0, // No mostrar videos relacionados
                modestbranding: 1, // Minimizar branding de YouTube
                showinfo: 0, // No mostrar info del video
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
