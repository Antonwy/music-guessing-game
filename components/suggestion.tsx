import { SpotifyTrackDetail } from "@/lib/spotify";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type SuggestionProps = {
  suggestion: SpotifyTrackDetail;
  index: number;
  onSelect: (suggestion: SpotifyTrackDetail) => void;
  isSelected: boolean;
};

// Define the Suggestion component
const Suggestion: FC<SuggestionProps> = ({
  suggestion,
  index,
  onSelect,
  isSelected,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
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

  const isPlayable = suggestion.previewUrl != "";

  return (
    <li
      key={index}
      className={`p-2 border-b ${isSelected ? "bg-blue-100" : ""} w-full`}
    >
      <div className="flex gap-2 items-center">
        <Button asChild onClick={handlePlayPause} className="p-0">
          <div className="relative size-9 rounded-full overflow-hidden">
            <img
              src={suggestion.thumbnailUrl}
              alt={`${suggestion.name} thumbnail`}
              width={48}
              height={48}
              className="object-cover"
            />
            <div
              className={`absolute bg-black bg-opacity-60 size-full flex items-center justify-center ${
                isPlayable ? "hidden" : ""
              }`}
            >
              <XIcon className="size-4 text-white" />
            </div>
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center ${
                !isPlayable ? "hidden" : ""
              }`}
            >
              {!isPlaying ? (
                <PlayIcon className="size-4 text-white" />
              ) : (
                <PauseIcon className="size-4 text-white" />
              )}
            </div>
          </div>
        </Button>
        <div className="flex-grow">
          <div className="max-w-36 sm:max-w-full">
            <p className="truncate text-xl font-semibold">{suggestion.name}</p>
            <p className="truncate">{suggestion.artist}</p>
          </div>
        </div>
        <Button
          onClick={() => onSelect(suggestion)}
          variant={isSelected ? "default" : "secondary"}
        >
          Select
        </Button>
        <audio ref={audioRef} controls className="hidden">
          <source src={suggestion.previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </li>
  );
};

export default Suggestion;
