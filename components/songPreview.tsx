import { SpotifyTrackDetail } from '@/lib/spotify';
import { PauseIcon, PlayIcon, XIcon } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

type SongPreviewProps = {
  song: SpotifyTrackDetail;
  index: number;
  user: string;
};

const SongPreview: FC<SongPreviewProps> = ({ song, index }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const isPlayable = song.previewUrl != '';

  return (
    <li key={index} className={`p-2 border-b`}>
      <div className="flex gap-2 items-center">
        <Button
          asChild
          variant="ghost"
          onClick={handlePlayPause}
          className="p-0"
        >
          <div className="relative">
            <img
              src={song.thumbnailUrl}
              alt={`${song.name} thumbnail`}
              width={48}
              height={48}
              className="object-cover rounded-full"
            />
            <div
              className={`absolute bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center ${
                isPlayable ? 'hidden' : ''
              }`}
            >
              <XIcon className="w-8 h-8 text-white" />
            </div>
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center ${
                !isPlayable ? 'hidden' : ''
              }`}
            >
              {!isPlaying ? (
                <PlayIcon className="w-8 h-8 text-white" />
              ) : (
                <PauseIcon className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </Button>
        <div className="flex-grow">
          <div className="max-w-36 sm:max-w-full">
            <p className="truncate text-xl font-semibold">{song.name}</p>
            <p className="truncate">{song.artist}</p>
          </div>
        </div>
        <audio ref={audioRef} controls className="hidden">
          <source src={song.previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </li>
  );
};

export default SongPreview;
