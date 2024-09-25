// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDEkZoBVr5tKKftdXy4d975Sv-HkfP0e2Y',
  authDomain: 'music-guessing-game-5a342.firebaseapp.com',
  projectId: 'music-guessing-game-5a342',
  storageBucket: 'music-guessing-game-5a342.appspot.com',
  messagingSenderId: '983527341422',
  appId: '1:983527341422:web:2f2efa5c78c2c2b948957f',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
