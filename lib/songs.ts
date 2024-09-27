import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from '@firebase/firestore';
import { SpotifyTrackDetail } from './spotify';
import db from './firestore';
import { useEffect, useState } from 'react';

export const submitSong = async (
  song: SpotifyTrackDetail,
  roomCode: string,
  round: string
) => {
  console.log('Submit song:', song, 'to room:', roomCode);
  // Add logic to send the selected song to the server
  // and navigate to the next page

  await setDoc(doc(db, 'rooms', roomCode, 'songs', song.songId), {
    ...song,
    round,
  });
};

export const useSongsOfRound = (roomCode?: string, round?: string) => {
  const [songs, setSongs] = useState<SpotifyTrackDetail[]>([]);

  useEffect(() => {
    if (!roomCode || !round) {
      return;
    }

    const q = query(
      collection(db, 'rooms', roomCode, 'songs'),
      where('round', '==', round)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSongs(
        snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            songId: doc.id,
            ...data,
          } as SpotifyTrackDetail;
        })
      );
    });

    return unsubscribe;
  }, [roomCode, round]);

  return songs;
};
