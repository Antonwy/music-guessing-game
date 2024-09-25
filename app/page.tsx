'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { joinRoom } from '@/lib/rooms';
import { ChangeEventHandler, useState } from 'react';

export default function Page() {
  const [inputState, setInputState] = useState({ username: '', roomCode: '' });
  const [error, setError] = useState('');

  const handleInputChange =
    (type: keyof typeof inputState): ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      setInputState({ ...inputState, [type]: event.target.value });
    };

  const handleJoinRoomClick = async () => {
    setError('');
    if (!inputState.username || !inputState.roomCode) {
      setError('Please fill in all fields');
      return;
    }

    await joinRoom(inputState.roomCode, inputState.username);
  };

  return (
    <section className="p-4 flex gap-2 flex-col">
      <h1 className="text-lg font-bold">Join Room</h1>
      <Input
        value={inputState.username}
        onChange={handleInputChange('username')}
        placeholder="Username"
      />
      <Input
        value={inputState.roomCode}
        onChange={handleInputChange('roomCode')}
        placeholder="Room Code"
        type="number"
      />
      <Button onClick={handleJoinRoomClick}>Join Room</Button>
      {error && <div className="text-red-500">{error}</div>}
    </section>
  );
}
