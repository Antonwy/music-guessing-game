import { SpotifyApi } from '@spotify/web-api-ts-sdk';

const spotifyApi = SpotifyApi.withClientCredentials(
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT!,
  process.env.NEXT_PUBLIC_SPOTIFY_SECRET!
);

// create a function that fetches song suggestions from Spotify
export const fetchSpotifySongSuggestions = async (query: string) : Promise<SpotifyTrackDetail[]> => {
  const response = await spotifyApi.search(query, ['track'], undefined, 5); // add limit of 5
  const trackDetails = response.tracks.items.map((item) => ({
    name: item.name,
    artist: item.artists.map((artist) => artist.name).join(', '),
    previewUrl: item.preview_url ?? "",
    thumbnailUrl: item.album.images[0]?.url ?? "", // P2b2a
  }));
  return trackDetails;
};

export type SpotifyTrackDetail = {
  name: string;
  artist: string;
  previewUrl: string;
  thumbnailUrl: string; // Pdc47
}; 
