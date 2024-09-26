import { doc, setDoc, collection, getDocs } from '@firebase/firestore';
import db from './firestore';

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

export async function listRooms() {
  console.log('Listing all rooms');

  try {
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    const rooms = roomsSnapshot.docs.map(doc => doc.id);
    return rooms;
  } catch (e) {
    console.error(e);
  }
}
