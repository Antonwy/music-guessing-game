'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createRoom, startRound } from '@/lib/rooms';
import { useSongsOfRound } from '@/lib/songs';
import { state } from '@/lib/state';
import { useState } from 'react';
import { useSnapshot } from 'valtio';

export default function Page() {
  const [topic, setTopic] = useState('');
  const { topic: submittedTopic, room } = useSnapshot(state);

  const songs = useSongsOfRound(room, submittedTopic);

  console.log('Songs:', songs);

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

    console.log('Starting new round with topic:', topic);

    startRound(room!, topic);
    state.setTopic(topic);
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

      <Card>
        <CardHeader>
          <CardTitle>Begin the next round</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Start the next round of the game by entering a new topic for music
            and clicking &quot;Begin round&quot;.
          </p>
          <p>
            Topics could be anything from &quot;Main Character Vibes&quot; to
            &quot;Love Song&quot; to &quot;Looking out the window during a train
            ride&quot;. Be creative!
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
          <Button onClick={handleNewRoundClick}>
            Begin round {topic ? `"${topic}"` : ''}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Submitted Songs for Round &quot;{submittedTopic}&quot;
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Below you will find a list of submitted songs for the topic &quot;
            {submittedTopic}
            &quot;.
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
    </section>
  );
}
