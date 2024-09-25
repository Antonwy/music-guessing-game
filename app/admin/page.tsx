'use client';

import { Button } from '@/components/ui/button';
import { createRoom } from '@/lib/rooms';
import { useState } from 'react';

export default function Page() {
  const [roomCode, setRoomCode] = useState<string | undefined>(undefined);

  const handleCreateRoomClick = async () => {
    const roomCode = await createRoom();

    setRoomCode(roomCode);
  };

  return (
    <section className="p-4 flex gap-2 flex-col">
      <h1 className="text-lg font-bold">Room Creation</h1>
      <Button onClick={handleCreateRoomClick}>Create Room</Button>
      {roomCode && <div>Room Code: {roomCode}</div>}
    </section>
  );
}
