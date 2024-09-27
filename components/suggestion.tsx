import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { SpotifyTrackDetail } from "@/lib/spotify";
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
      className={`p-2 border-b ${isSelected ? "bg-blue-100" : ""}`}
    >
      <div className="flex items-center space-x-4">
        <Button
          asChild
          variant="ghost"
          onClick={handlePlayPause}
          className="p-0"
        >
          <div className="relative">
            <Image
              src={suggestion.thumbnailUrl}
              alt={`${suggestion.name} thumbnail`}
              width={48}
              height={48}
              className="object-cover rounded-full"
            />
            <div
              className={`absolute bg-black bg-opacity-60 rounded-full w-12 h-12 flex items-center justify-center ${
                isPlayable ? "hidden" : ""
              }`}
            >
              <XIcon className="w-8 h-8 text-white" />
            </div>
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center ${
                !isPlayable ? "hidden" : ""
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
        <div className="space-y-2">
          <p className="truncate w-[500px] text-xl font-semibold">
            {suggestion.name}
          </p>
          <p className="truncate w-[450px]">{suggestion.artist}</p>
        </div>
        <Button onClick={() => onSelect(suggestion)} disabled={!isPlayable}>
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
