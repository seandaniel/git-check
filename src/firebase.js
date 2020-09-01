import firebase from 'firebase/app'
import 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc5SQb2J_Com0SR-h87--MMcpU1-5_LNo",
  authDomain: "git-check.firebaseapp.com",
  databaseURL: "https://git-check.firebaseio.com",
  projectId: "git-check",
  storageBucket: "git-check.appspot.com",
  messagingSenderId: "901012305489",
  appId: "1:901012305489:web:95b8925a2689899f2d6a70"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
