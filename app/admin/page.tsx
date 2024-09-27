'use client';

import SongPreview from '@/components/songPreview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createRoom, startRound, useUsersOfRoom } from '@/lib/rooms';
import { useSongsOfRound } from '@/lib/songs';
import { state } from '@/lib/state';
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { mainStyles, wrapperDivStyles } from '../styles';

export default function Page() {
  const [topic, setTopic] = useState('');
  const { topic: submittedTopic, room } = useSnapshot(state);

  const songs = useSongsOfRound(room, submittedTopic);
  const users = useUsersOfRoom(room);

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
    <div className={wrapperDivStyles}>
      <main className={mainStyles}>
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
        )}

        {submittedTopic && (
          <Card>
            <CardHeader>
              <CardTitle>
                Submitted Songs for Round &quot;{submittedTopic}&quot;
              </CardTitle>
              <CardDescription>
                Below you will find a list of submitted songs for the topic{' '}
                <span className="font-semibold">
                  &quot;
                  {submittedTopic}&quot;
                </span>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {songs.map((song, index) => (
                  <SongPreview
                    key={song.songId}
                    song={song}
                    index={index}
                    user="leon"
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Players in the room {room ? `"${room}"` : ''}</CardTitle>
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
