'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchSpotifySongSuggestions } from '@/lib/spotify';
import { useEffect, useState } from 'react';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery) {
      fetchSongSuggestions(searchQuery);
    }
  }, [searchQuery]);

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
