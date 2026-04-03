import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAxinwIFtXbnAVmZU0vQ3tDypcUAKKSbxs',
	authDomain: 'tap-and-smash.firebaseapp.com',
	projectId: 'tap-and-smash',
	storageBucket: 'tap-and-smash.firebasestorage.app',
	messagingSenderId: '27190558309',
	appId: '1:27190558309:web:94e8a5ecaa8f963bd8108c',
	measurementId: 'G-MMD3GNE42P'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
