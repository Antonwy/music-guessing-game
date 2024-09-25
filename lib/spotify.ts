import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import dotenv from "dotenv";
dotenv.config();

const spotifyApi = SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT!,
    process.env.SPOTIFY_SECRET!
  );

  console.log(process.env.SPOTIFY_CLIENT);

// create a function that fetches song suggestions from Spotify
export const fetchSpotifySongSuggestions = async (query: string) => {
     const response = await spotifyApi.search(query, ["track"]); // add limit of 5
    const tracks = response.tracks.items.map((item) => item.name);
    return tracks;
}