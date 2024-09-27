import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
} from '@firebase/firestore';
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

export async function startRound(roomCode: string, round: string) {
  console.log(`Start round ${round} in room ${roomCode}`);

  try {
    await setDoc(doc(db, 'rooms', roomCode), {
      round,
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

  useEffect(() => {
    if (!room) {
      return;
    }

    return onSnapshot(doc(db, 'rooms', room), (doc) => {
      if (doc.exists()) {
        setRoomData({
          ...(doc.data() as Room),
          code: doc.id,
        });
      }
    });
  }, [room]);

  return roomData;
}

type User = {
  username: string;
};

export const useUsersOfRoom = (roomCode?: string) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!roomCode) {
      return;
    }

    const q = query(collection(db, 'rooms', roomCode, 'players'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            username: doc.id,
            ...data,
          } as User;
        })
      );
    });

    return unsubscribe;
  }, [roomCode]);

  return users;
};
