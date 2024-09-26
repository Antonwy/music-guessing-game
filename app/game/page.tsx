"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchSpotifySongSuggestions, SpotifyTrackDetail } from "@/lib/spotify";
import { state } from "@/lib/state";
import { useDebounce } from "@uidotdev/usehooks";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";

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
        <Button onClick={() => onSelect(suggestion)}>Select</Button>
        <audio ref={audioRef} controls className="hidden">
          <source src={suggestion.previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </li>
  );
};

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SpotifyTrackDetail[]>([]);
  const { username, room } = useSnapshot(state);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrackDetail | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);

  const handleSelectSong = (song: SpotifyTrackDetail) => {
    setSelectedSong(song);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSongSuggestions(searchQuery);
    }
  }, [debouncedQuery]);

  const fetchSongSuggestions = async (query: string) => {
    try {
      const songs = await fetchSpotifySongSuggestions(query);
      setSuggestions(songs);
    } catch (error) {
      console.error("Error fetching Spotify suggestions:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const submitSong = () => {
    // Add logic to send the selected song to the server
    // and navigate to the next page
    console.log("Selected song:", selectedSong);
    setIsSubmitted(true);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {isSubmitted ? (
          <Card>
            <CardHeader>
              <CardTitle>Song Submitted!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Your song has been submitted. Please wait for the next step.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Select a song!</CardTitle>
              <div className="flex flex-col text-xs pb-2">
                <p>
                  Room: <span className="font-semibold">{room}</span>
                </p>
                <p>
                  Username: <span className="font-semibold">{username}</span>
                </p>
              </div>
            </CardHeader>
            <CardDescription>
              <Input
                placeholder="Search for your song..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </CardDescription>
            <CardContent>
              {suggestions.length > 0 && (
                <ul className="mt-4">
                  {suggestions.map((suggestion, index) => (
                    <Suggestion
                      key={suggestion.songId}
                      suggestion={suggestion}
                      index={index}
                      onSelect={handleSelectSong}
                      isSelected={
                        !!selectedSong &&
                        selectedSong.songId === suggestion.songId
                      }
                    />
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={submitSong}>
                Submit selected song
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        you have x minutes remaining
      </footer>
    </div>
  );
}
