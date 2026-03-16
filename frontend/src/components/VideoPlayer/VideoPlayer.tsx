import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Settings, PictureInPicture, SkipForward, SkipBack } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  startTime?: number;
  onProgress?: (state: OnProgressProps) => void;
  onEnded?: () => void;
  className?: string;
  showControls?: boolean;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const VideoPlayer = ({
  url,
  startTime = 0,
  onProgress,
  onEnded,
  className = '',
  showControls = true,
}: VideoPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const prevUrlRef = useRef<string>(url);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPip, setIsPip] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Dynamic seeking
  useEffect(() => {
    if (playerRef.current && prevUrlRef.current === url) {
      playerRef.current.seekTo(startTime, 'seconds');
      setEnded(false);
      setPlaying(true);

      setTimeout(() => {
        const internalPlayer = playerRef.current?.getInternalPlayer();
        if (internalPlayer && typeof internalPlayer.playVideo === 'function') {
          internalPlayer.playVideo();
        }
      }, 150);
    }
    prevUrlRef.current = url;
  }, [startTime, url]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const internalPlayer = playerRef.current?.getInternalPlayer();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (internalPlayer && typeof internalPlayer.pauseVideo === 'function') {
            if (playing) {
              internalPlayer.pauseVideo();
            } else {
              internalPlayer.playVideo();
            }
            setPlaying(!playing);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (playerRef.current) {
            playerRef.current.seekTo(currentTime + 10, 'seconds');
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (playerRef.current) {
            playerRef.current.seekTo(currentTime - 10, 'seconds');
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;

        case 'KeyM':
          setMuted(prev => !prev);
          break;

        case 'KeyF':
          // Fullscreen (browser handles this)
          break;

        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9': {
          const num = parseInt(e.code.replace('Digit', ''));
          const seekTime = (num / 10) * duration;
          if (playerRef.current) {
            playerRef.current.seekTo(seekTime, 'seconds');
          }
          break;
        }

        case 'KeyP': {
          // Toggle Picture-in-Picture
          e.preventDefault();
          togglePip();
          break;
        }

        case 'Shift':
          setShowShortcuts(true);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Shift') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playing, currentTime, duration]);

  const handleReady = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && typeof internalPlayer.setPlaybackQuality === 'function') {
      internalPlayer.setPlaybackQuality('hd1080');
    }
  };

  const handleProgress = (state: OnProgressProps) => {
    setCurrentTime(state.playedSeconds);
    onProgress?.(state);
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
  };

  const handleEnded = () => {
    setEnded(true);
    setPlaying(false);
    onEnded?.();
  };

  const handleReplay = () => {
    setEnded(false);
    playerRef.current?.seekTo(startTime, 'seconds');
    setPlaying(true);
    setTimeout(() => {
      const internalPlayer = playerRef.current?.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.playVideo === 'function') {
        internalPlayer.playVideo();
      }
    }, 100);
  };

  const togglePlay = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer) {
      if (playing) {
        internalPlayer.pauseVideo();
      } else {
        internalPlayer.playVideo();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && typeof internalPlayer.setPlaybackRate === 'function') {
      internalPlayer.setPlaybackRate(rate);
    }
    setShowSettings(false);
  };

  const togglePip = async () => {
    try {
      const videoElement = document.querySelector('video');
      if (!videoElement) return;

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPip(false);
      } else {
        await videoElement.requestPictureInPicture();
        setIsPip(true);
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  };

  const skipTime = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime + seconds, 'seconds');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-full bg-black rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {/* Keyboard shortcuts hint */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-medium shadow-xl"
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
              <span><kbd className="bg-white/20 px-2 py-1 rounded">Espacio</kbd> Play/Pause</span>
              <span><kbd className="bg-white/20 px-2 py-1 rounded">←/→</kbd> ±10s</span>
              <span><kbd className="bg-white/20 px-2 py-1 rounded">↑/↓</kbd> Volumen</span>
              <span><kbd className="bg-white/20 px-2 py-1 rounded">M</kbd> Mute</span>
              <span><kbd className="bg-white/20 px-2 py-1 rounded">0-9</kbd> Saltar</span>
              <span><kbd className="bg-white/20 px-2 py-1 rounded">P</kbd> PiP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="aspect-video relative group">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls={!showControls}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onProgress={handleProgress}
          onEnded={handleEnded}
          onReady={handleReady}
          onDuration={handleDuration}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          config={{
            youtube: {
              playerVars: {
                start: startTime,
                rel: 0,
                modestbranding: 1,
                vq: 'hd1080',
              },
            },
          }}
        />

        {/* Custom Controls Overlay */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer group/progress">
                <div
                  className="h-full bg-accent-500 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => skipTime(-10)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Retroceder 10s"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="p-3 bg-white text-primary-900 rounded-full hover:scale-105 transition-transform"
                  >
                    {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => skipTime(10)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    title="Avanzar 10s"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={toggleMute} className="p-2 text-white hover:bg-white/20 rounded-lg">
                      {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <span className="text-white text-sm font-medium ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Playback Speed */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Settings className={`w-5 h-5 ${showSettings ? 'rotate-90' : ''} transition-transform`} />
                    </button>

                    <AnimatePresence>
                      {showSettings && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
                        >
                          <div className="p-2">
                            <p className="text-white text-xs font-semibold px-3 py-2 border-b border-white/10">
                              Velocidad
                            </p>
                            {PLAYBACK_RATES.map(rate => (
                              <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                  playbackRate === rate
                                    ? 'bg-accent-500 text-white'
                                    : 'text-white hover:bg-white/10'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Picture-in-Picture */}
                  <button
                    onClick={togglePip}
                    className={`p-2 text-white hover:bg-white/20 rounded-lg transition-colors ${isPip ? 'bg-white/20' : ''}`}
                    title="Picture-in-Picture"
                  >
                    <PictureInPicture className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ended Overlay */}
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <p className="text-white text-2xl font-bold">¡Video completado!</p>
            <div className="flex gap-3">
              <button
                onClick={handleReplay}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all hover:scale-105 border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Ver de nuevo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
