import { doc, setDoc } from '@firebase/firestore';
import { SpotifyTrackDetail } from './spotify';
import db from './firestore';

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
