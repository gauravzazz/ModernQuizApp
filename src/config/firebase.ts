//import firebase from 'firebase/compat/app';
//import 'firebase/compat/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//const firebaseConfig = {
//  apiKey: "YOUR_API_KEY",
//  authDomain: "YOUR_AUTH_DOMAIN",
//  projectId: "YOUR_PROJECT_ID",
//  storageBucket: "YOUR_STORAGE_BUCKET",
//  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//  appId: "YOUR_APP_ID",
//  measurementId: "YOUR_MEASUREMENT_ID"
//};

// Initialize Firebase if it hasn't been initialized yet
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// Export a mock firebase object for UI development
export const firebase = {
  auth: () => ({
    createUserWithEmailAndPassword: async () => ({
      user: {
        updateProfile: async () => {},
        getIdToken: async () => 'mock-token'
      }
    }),
    signInWithEmailAndPassword: async () => ({
      user: {
        getIdToken: async () => 'mock-token',
        displayName: 'Test User',
        email: 'test@example.com',
        uid: 'mock-uid',
        photoURL: null,
        emailVerified: true
      }
    }),
    signInWithCredential: async () => ({
      user: {
        getIdToken: async () => 'mock-token',
        displayName: 'Google User',
        email: 'google@example.com',
        uid: 'google-uid',
        photoURL: null,
        emailVerified: true
      },
      additionalUserInfo: {
        isNewUser: false
      }
    }),
    signOut: async () => {},
    sendPasswordResetEmail: async () => {},
    currentUser: {
      displayName: 'Test User',
      email: 'test@example.com',
      uid: 'mock-uid',
      photoURL: null,
      emailVerified: true,
      getIdToken: async () => 'mock-token'
    },
    // Add GoogleAuthProvider inside the auth function to avoid duplicate property
    GoogleAuthProvider: {
      credential: (idToken: string, accessToken: string) => ({
        idToken,
        accessToken
      })
    }
  }),
  apps: [{}]
};