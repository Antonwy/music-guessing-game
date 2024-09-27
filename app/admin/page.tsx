"use client";

import SongPreview from "@/components/songPreview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { createRoom, startRound, useUsersOfRoom } from "@/lib/rooms";
import { useSongsOfRound } from "@/lib/songs";
import { useSnapshot } from "valtio";
import { mainStyles, wrapperDivStyles } from "../styles";
import { state } from "@/lib/state";
import { useState } from "react";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export default function Page() {
  const [topic, setTopic] = useState("");
  const [hidden, setHidden] = useState(true);
  const { topic: submittedTopic, room, accessToken } = useSnapshot(state);

  const songs = useSongsOfRound(room, submittedTopic);
  const users = useUsersOfRoom(room);

  const handleCreateRoomClick = async () => {
    const roomCode = await createRoom();

    if (!roomCode) {
      return;
    }

    state.setRoom(roomCode);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const handleNewRoundClick = async () => {
    if (!topic || !room) {
      return;
    }

    console.log("Starting new round with topic:", topic);

    startRound(room!, topic);
    state.setTopic(topic);
  };

  const handleSpotifyLogin = async () => {
    SpotifyApi.performUserAuthorization(
      "590b9c7485a3427a88ff27168c244419",
      "http://localhost:3000/",
      ["playlist-modify-private"],
      async (accessToken) => {
        state.setAccessToken(accessToken);
      }
    );
  };
  const handleHiddenChange = (checked: boolean) => {
    setHidden(checked);
  };

  console.log("Access Token:", accessToken);

  return (
    <div className={wrapperDivStyles}>
      <main className={mainStyles}>
        <Card>
          <CardHeader>
            <CardTitle>Login with Spotify</CardTitle>
          </CardHeader>
          <CardContent>
            This is not necessary but will allow you to save the songs from your
            friends in a playlist.
            {<div>Access Token: {accessToken?.access_token}</div>}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSpotifyLogin}>Login with Spotify</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create a room</CardTitle>
            <CardDescription>
              Create a new room for the music guessing game and share this room
              code with friends.
            </CardDescription>
          </CardHeader>
          {room && <CardContent>Room Code: {room}</CardContent>}
          <CardFooter>
            <Button onClick={handleCreateRoomClick}>Create Room</Button>
          </CardFooter>
        </Card>

        {room && (
          <Card>
            <CardHeader>
              <CardTitle>Begin the next round</CardTitle>
              <CardDescription>
                <p>
                  Start the next round of the game by entering a new topic for
                  music and clicking &quot;Begin round&quot;.
                </p>
                <p>
                  Topics could be anything from &quot;Main Character Vibes&quot;
                  to &quot;Love Song&quot; to &quot;Looking out the window
                  during a train ride&quot;. Be creative!
                </p>
                <p>
                  Be careful this will end the current round and all already
                  submitted songs.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Topic for the round"
                value={topic}
                onChange={handleTopicChange}
                autoComplete="off"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleNewRoundClick}>
                Begin round {topic ? `"${topic}"` : ""}
              </Button>
            </CardFooter>
          </Card>
        )}

        {submittedTopic && (
          <Card>
            <CardHeader>
              <CardTitle>
                Submitted songs for round &quot;{submittedTopic}&quot;
              </CardTitle>
              <CardDescription>
                Below you will find a list of submitted songs.
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hidden-song-details"
                    checked={hidden}
                    onCheckedChange={handleHiddenChange}
                  />
                  <Label htmlFor="hidden-song-details">Hide song details</Label>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {songs.map((song, index) => (
                  <SongPreview
                    key={song.songId}
                    song={song}
                    index={index}
                    user="xxx"
                    hidden={hidden}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Players in the room {room ? `"${room}"` : ""}</CardTitle>
            <CardDescription>
              Below you will find a list of players in the room.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {users.map((song, index) => (
                <li key={index} className="p-2 border-b">
                  {song.username}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
