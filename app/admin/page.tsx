"use client";

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
import { createRoom } from "@/lib/rooms";
import { useState } from "react";

export default function Page() {
  const [roomCode, setRoomCode] = useState<string | undefined>(undefined);
  const [topic, setTopic] = useState("");

  const handleCreateRoomClick = async () => {
    const roomCode = await createRoom();

    setRoomCode(roomCode);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const handleNewRoundClick = async () => {};

  return (
    <section className="p-4 flex gap-2 flex-col">
      <Card>
        <CardHeader>
          <CardTitle>Create a room</CardTitle>
        </CardHeader>
        <CardContent>
          Create a new room for the music guessing game and share this room code
          with friends.
          {roomCode && <div>Room Code: {roomCode}</div>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateRoomClick} disabled={!!roomCode}>
            Create Room
          </Button>
        </CardFooter>
      </Card>

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
            Topics could be anything from "Main Character Vibes" to "Love Song"
            to "Looking out the window during a train ride". Be creative!
          </p>
          <p>
            Be careful this will end the current round and all already submitted
            songs.
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

      <Card>
        <CardHeader>
          <CardTitle>Submitted Songs for Round "{topic}"</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Below you will find a list of submitted songs for the topic "{topic}
            "".
          </p>
          <ul>{}</ul>
        </CardContent>
      </Card>
    </section>
  );
}
