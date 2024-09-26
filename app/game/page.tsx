'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';
import { fetchSpotifySongSuggestions, SpotifyTrackDetail } from '@/lib/spotify';
import { useEffect, useState } from 'react';
import { useDebounce } from "@uidotdev/usehooks";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
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
      console.error('Error fetching Spotify suggestions:', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
                  <li key={index} className="p-2 border-b">
                    <div className="flex items-center space-x-4">
                      <Image src={suggestion.thumbnailUrl} alt={`${suggestion.name} thumbnail`} width={64} height={64} className="object-cover h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <p className="truncate w-[500px] text-xl font-semibold">{suggestion.name}</p>
                        <p className="truncate w-[450px]">{suggestion.artist}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit this song!</Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* Footer content */}
      </footer>
    </div>
  );
}

/*

                    <audio id="audio" controls>
                      <source src={suggestion.previewUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
*/