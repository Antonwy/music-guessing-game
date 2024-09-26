'use client';

import { useEffect, useState } from 'react';
import { listRooms } from '@/lib/rooms';
import RoomList from '@/components/ui/roomList';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await listRooms();
      setRooms(rooms);
    };

    fetchRooms();
  }, []);

  return (
    <section className="p-4 flex gap-2 flex-col">
      <h1 className="text-lg font-bold">Available Rooms</h1>
      <RoomList rooms={rooms} />
    </section>
  );
}
