"use client";

import Suggestion from "@/components/suggestion";
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
import { useCurrentRoom } from "@/lib/rooms";
import { submitSong } from "@/lib/songs";
import { fetchSpotifySongSuggestions, SpotifyTrackDetail } from "@/lib/spotify";
import { state } from "@/lib/state";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { mainStyles, wrapperDivStyles } from "../styles";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SpotifyTrackDetail[]>([]);
  const { username, room } = useSnapshot(state);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrackDetail | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);

  const roomData = useCurrentRoom();

  const handleSelectSong = (song: SpotifyTrackDetail) => {
    setSelectedSong(song);
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSongSuggestions(searchQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (roomData?.round) {
      setIsSubmitted(false);
      setSelectedSong(null);
      setSuggestions([]);
    }
  }, [roomData?.round]);

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

  const handleSubmitSongClick = async () => {
    if (!roomData?.code || !selectedSong || !roomData?.round || !username) {
      return;
    }

    // Add logic to send the selected song to the server
    // and navigate to the next page
    console.log("Selected song:", selectedSong);
    await submitSong(selectedSong!, roomData!.code, roomData!.round, username);
    setIsSubmitted(true);
  };

  return (
    <div className={wrapperDivStyles}>
      <main className={mainStyles}>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to the Music Guessing Game</CardTitle>
            <CardDescription>
              You are currently logged in as{" "}
              <span className="font-semibold">{username}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You are in room <span className="font-semibold">{room}</span>.
            </p>
            {roomData?.round ? (
              <p></p>
            ) : (
              <p>Please wait for the topic to be announced.</p>
            )}
          </CardContent>
        </Card>
        {roomData?.round && (
          <Card>
            <CardHeader>
              <CardTitle>
                Select a song for the topic &quot;{roomData?.round}&quot;
              </CardTitle>
              <CardDescription>
                What song about {roomData?.round} would you listen to? You can
                only select songs for which Spotify offers a preview, sorry!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search for your song..."
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
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
              <Button
                type="submit"
                onClick={handleSubmitSongClick}
                disabled={isSubmitted}
              >
                {isSubmitted ? "Submitted" : "Submit selected song"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-center p-8">
        A small project by Anton &amp; Leon, as a gift for Pauline!
      </footer>
    </div>
  );
}
