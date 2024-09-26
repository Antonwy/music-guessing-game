"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayIcon, PauseIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { fetchSpotifySongSuggestions, SpotifyTrackDetail } from "@/lib/spotify";
import { FC, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import React from "react";
import { useRef } from "react";

type SuggestionProps = {
  suggestion: SpotifyTrackDetail;
  index: number;
};

// Define the Suggestion component
const Suggestion: FC<SuggestionProps> = ({ suggestion, index }) => {
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
    <li key={index} className="p-2 border-b">
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

  const debouncedQuery = useDebounce(searchQuery, 500);

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

  const selectSong = () => {
    // Add logic to send the selected song to the server
    // and navigate to the next page
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card>
          <CardHeader>
            <CardTitle>Select a song!</CardTitle>
            <CardDescription>
              <Input
                placeholder="Search for your song..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {suggestions.length > 0 && (
              <ul className="mt-4">
                {suggestions.map((suggestion, index) => (
                  <Suggestion
                    key={suggestion.songID}
                    suggestion={suggestion}
                    index={index}
                  />
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={selectSong}>
              Submit this song!
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}
