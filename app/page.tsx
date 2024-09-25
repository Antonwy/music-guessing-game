'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import dotenv from "dotenv";

dotenv.config();

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  
  const spotifyApi = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT!,
    process.env.SPOTIFY_SECRET!
  );

  console.log(process.env.SPOTIFY_CLIENT);

  useEffect(() => {
    if (searchQuery) {
      fetchSpotifySuggestions(searchQuery);
    }
  }, [searchQuery]);

  const fetchSpotifySuggestions = async (query: string) => {
    try {
      const response = await spotifyApi.search(query, ["track"]); // add limit of 5
      const tracks = response.tracks.items.map((item) => item.name);
      setSuggestions(tracks);
    } catch (error) {
      console.error("Error fetching Spotify suggestions:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Input
          placeholder="Search for your song..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button type="submit">Submit song!</Button>
        {suggestions.length > 0 && (
          <ul className="mt-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-2 border-b">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}