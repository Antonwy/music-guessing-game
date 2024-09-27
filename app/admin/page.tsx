"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createRoom, startRound } from "@/lib/rooms";
import { useSongsOfRound } from "@/lib/songs";
import { state } from "@/lib/state";
import { useState } from "react";
import { useSnapshot } from "valtio";

export default function Page() {
  const [topic, setTopic] = useState("");
  const { topic: submittedTopic, room } = useSnapshot(state);

  const songs = useSongsOfRound(room, submittedTopic);

  console.log("Songs:", songs);

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
    setTopic(topic);
  };

  return (
    <section className="p-4 flex gap-2 flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Create a room</CardTitle>
        </CardHeader>
        <CardContent>
          Create a new room for the music guessing game and share this room code
          with friends.
          {room && <div>Room Code: {room}</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateRoomClick} disabled={!!room}>
            Create Room
          </Button>
        </CardFooter>
      </Card>

      {room && (
        <Card>
          <CardHeader>
            <CardTitle>Begin the next round</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Start the next round of the game by entering a new topic for music
              and clicking "Begin round".
            </p>
            <p>
              Topics could be anything from "Main Character Vibes" to "Love
              Song" to "Looking out the window during a train ride". Be
              creative!
            </p>
            <p>
              Be careful this will end the current round and all already
              submitted songs.
            </p>
            <Input
              placeholder="Topic for the songs"
              value={topic}
              onChange={handleTopicChange}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewRoundClick}>Begin round "{topic}"</Button>
          </CardFooter>
        </Card>
      )}

      {topic && (
        <Card>
          <CardHeader>
            <CardTitle>Submitted Songs for Round "{topic}"</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Below you will find a list of submitted songs for the topic "
              {topic}".
            </p>
            <ul>
              {songs.map((song) => (
                <li key={song.songId}>
                  {song.name} by {song.artist}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
