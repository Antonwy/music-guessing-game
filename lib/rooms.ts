import { doc, onSnapshot, setDoc } from '@firebase/firestore';
import db from './firestore';
import { useSnapshot } from 'valtio';
import { state } from './state';
import { useEffect, useState } from 'react';

function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function createRoom() {
  const roomCode = generateRandomCode();

  console.log(`Create room ${roomCode}`);

  try {
    await setDoc(doc(db, 'rooms', roomCode), {
      state: 'test',
    });

    return roomCode;
  } catch (e) {
    console.error(e);
  }
}

export async function joinRoom(roomCode: string, playerId: string) {
  console.log(`Join room ${roomCode} as player ${playerId}`);

  try {
    await setDoc(doc(db, 'rooms', roomCode, 'players', `${playerId}`), {
      state: 'test',
    });
  } catch (e) {
    console.error(e);
  }
}

type Room = {
  round: string;
  code: string;
};

export function useCurrentRoom() {
  const { room } = useSnapshot(state);
  const [roomData, setRoomData] = useState<Room | null>(null);

  if (!room) {
    throw new Error('Room not found');
  }

  useEffect(
    () =>
      onSnapshot(doc(db, 'rooms', room), (doc) => {
        if (doc.exists()) {
          setRoomData({
            ...(doc.data() as Room),
            code: doc.id,
          });
        }
      }),
    [room]
  );

  return roomData;
}
