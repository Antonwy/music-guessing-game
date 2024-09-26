'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchSpotifySongSuggestions, SpotifyTrackDetail } from '@/lib/spotify';
import { useEffect, useState } from 'react';
import { useDebounce } from "@uidotdev/usehooks";
import Image from 'next/image';

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
        <Input
          placeholder="Search for your song..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && (
          <ul className="mt-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-2 border-b flex items-center gap-4">
                <Image src={suggestion.thumbnailUrl} alt={`${suggestion.name} thumbnail`} width={64} height={64} className="object-cover" />
                <div>
                  {suggestion.name} by {suggestion.artist} 
                  <Button type="submit">Select this song!</Button>
                  <audio id="audio" controls>
                    <source src={suggestion.previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
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
