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
import { createRoom } from "@/lib/rooms";
import { useState } from "react";

export default function Page() {
  const [roomCode, setRoomCode] = useState<string | undefined>(undefined);

  const handleCreateRoomClick = async () => {
    const roomCode = await createRoom();

    setRoomCode(roomCode);
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
            Be careful this will end the current round and all already submitted
            songs.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateRoomClick}>Begin round</Button>
        </CardFooter>
      </Card>
    </section>
  );
}
