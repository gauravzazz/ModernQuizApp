// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';
// import { firebase } from '../config/firebase';
// import { UserProfile } from '../types/profile';
// import { StorageCategory } from './storageService';

// // Storage keys
// const AUTH_TOKEN_KEY = '@auth_token';
// const AUTH_USER_KEY = '@auth_user';

// // Add these keys to known storage keys in storageService.ts
// // { key: '@auth_token', description: 'Authentication token', category: StorageCategory.PROFILE },
// // { key: '@auth_user', description: 'Authenticated user data', category: StorageCategory.PROFILE },

// // Types
// export interface AuthUser {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   emailVerified: boolean;
// }

// export interface SignUpCredentials {
//   email: string;
//   password: string;
//   name: string;
// }

// export interface SignInCredentials {
//   email: string;
//   password: string;
// }

// export interface AuthState {
//   user: AuthUser | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// /**
//  * Authentication service for handling user authentication
//  */
// export class AuthService {
//   /**
//    * Sign up a new user with email and password
//    */
//   static async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
//     try {
//       // Create user with Firebase Authentication
//       const userCredential = await firebase.auth().createUserWithEmailAndPassword(
     
//       );
      
//       // Update user profile with display name
//       if (userCredential.user) {
//         await userCredential.user.updateProfile();
        
//         // Get updated user
//         const updatedUser = firebase.auth().currentUser;
        
//         if (updatedUser) {
//           // Create user profile in the app
//           await this.createUserProfile(updatedUser, credentials.name);
          
//           // Save auth user to storage
//           const authUser = this.mapFirebaseUserToAuthUser(updatedUser);
//           await this.saveAuthUser(authUser);
          
//           return authUser;
//         }
//       }
      
//       throw new Error('Failed to create user');
//     } catch (error: any) {
//       console.error('Sign up error:', error);
//       throw this.handleAuthError(error);
//     }
//   }
  
//   /**
//    * Sign in an existing user with email and password
//    */
//   static async signIn(credentials: SignInCredentials): Promise<AuthUser> {
//     try {
//       // Sign in with Firebase Authentication
//       const userCredential = await firebase.auth().signInWithEmailAndPassword(
       
//       );
      
//       if (userCredential.user) {
//         // Get user token
//         const token = await userCredential.user.getIdToken();
        
//         // Save token to storage
//         await this.saveAuthToken(token);
        
//         // Save auth user to storage
//         const authUser = this.mapFirebaseUserToAuthUser(userCredential.user);
//         await this.saveAuthUser(authUser);
        
//         return authUser;
//       }
      
//       throw new Error('Failed to sign in');
//     } catch (error: any) {
//       console.error('Sign in error:', error);
//       throw this.handleAuthError(error);
//     }
//   }
  
//   /**
//    * Sign in with Google
//    */
//   static async signInWithGoogle(): Promise<AuthUser> {
//     try {
//       // Configure Google Sign-In
//       const { idToken, accessToken } = await this.getGoogleCredentials();
      
//       // Create a Google credential with the token
//       const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      
//       // Sign in with credential
//       const userCredential = await firebase.auth().signInWithCredential(googleCredential);
      
//       if (userCredential.user) {
//         // Get user token
//         const token = await userCredential.user.getIdToken();
        
//         // Save token to storage
//         await this.saveAuthToken(token);
        
//         // Check if this is a new user
//         const isNewUser = userCredential.additionalUserInfo?.isNewUser;
        
//         if (isNewUser) {
//           // Create user profile in the app
//           await this.createUserProfile(
//             userCredential.user,
//             userCredential.user.displayName || 'User'
//           );
//         }
        
//         // Save auth user to storage
//         const authUser = this.mapFirebaseUserToAuthUser(userCredential.user);
//         await this.saveAuthUser(authUser);
        
//         return authUser;
//       }
      
//       throw new Error('Failed to sign in with Google');
//     } catch (error: any) {
//       console.error('Google sign in error:', error);
//       throw this.handleAuthError(error);
//     }
//   }
  
//   /**
//    * Sign out the current user
//    */
//   static async signOut(): Promise<void> {
//     try {
//       // Sign out from Firebase
//       await firebase.auth().signOut();
      
//       // Clear auth data from storage
//       await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
//     } catch (error: any) {
//       console.error('Sign out error:', error);
//       throw this.handleAuthError(error);
//     }
//   }
  
//   /**
//    * Send password reset email
//    */
//   static async sendPasswordResetEmail(email: string): Promise<void> {
//     try {
//       await firebase.auth().sendPasswordResetEmail(email);
//     } catch (error: any) {
//       console.error('Password reset error:', error);
//       throw this.handleAuthError(error);
//     }
//   }
  
//   /**
//    * Check if user is authenticated
//    */
//   static async isAuthenticated(): Promise<boolean> {
//     try {
//       const token = await this.getAuthToken();
//       return !!token;
//     } catch (error) {
//       return false;
//     }
//   }
  
//   /**
//    * Get current authenticated user
//    */
//   static async getCurrentUser(): Promise<AuthUser | null> {
//     try {
//       const userJson = await AsyncStorage.getItem(AUTH_USER_KEY);
//       if (userJson) {
//         return JSON.parse(userJson);
//       }
//       return null;
//     } catch (error) {
//       console.error('Get current user error:', error);
//       return null;
//     }
//   }
  
//   /**
//    * Get authentication token
//    */
//   static async getAuthToken(): Promise<string | null> {
//     try {
//       return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
//     } catch (error) {
//       console.error('Get auth token error:', error);
//       return null;
//     }
//   }
  
//   /**
//    * Save authentication token
//    */
//   private static async saveAuthToken(token: string): Promise<void> {
//     try {
//       await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
//     } catch (error) {
//       console.error('Save auth token error:', error);
//     }
//   }
  
//   /**
//    * Save authenticated user
//    */
//   private static async saveAuthUser(user: AuthUser): Promise<void> {
//     try {
//       await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
//     } catch (error) {
//       console.error('Save auth user error:', error);
//     }
//   }
  
//   /**
//    * Create user profile in the app
//    */
//   private static async createUserProfile(firebaseUser: any, name: string): Promise<void> {
//     // Create a new user profile
//     const newProfile: UserProfile = {
//       id: firebaseUser.uid,
//       name: name,
//       email: firebaseUser.email,
//       avatar: firebaseUser.photoURL || undefined,
//       level: 1,
//       stats: {
//         totalQuizzes: 0,
//         correctAnswers: 0,
//         totalTime: 0,
//         overallAccuracy: 0,
//         practiceAccuracy: 0,
//         testAccuracy: 0,
//         streak: 0,
//         weeklyQuizzes: 0,
//         xp: 0,
//       },
//       awards: [],
//       createdAt: new Date(),
//       lastActive: new Date(),
//     };
    
//     // For UI development, we'll just log the profile creation
//     // In a real implementation, this would save to a database or service
//     console.log('Created user profile:', newProfile);
    
//     // Store basic profile in AsyncStorage for UI development
//     try {
//       await AsyncStorage.setItem('@user_profile', JSON.stringify(newProfile));
//     } catch (error) {
//       console.error('Error saving profile to AsyncStorage:', error);
//     }
//   }
  
//   /**
//    * Map Firebase user to AuthUser
//    */
//   private static mapFirebaseUserToAuthUser(firebaseUser: any): AuthUser {
//     return {
//       uid: firebaseUser.uid,
//       email: firebaseUser.email,
//       displayName: firebaseUser.displayName,
//       photoURL: firebaseUser.photoURL,
//       emailVerified: firebaseUser.emailVerified,
//     };
//   }
  
//   /**
//    * Get Google credentials
//    * Mock implementation for UI development
//    */
//   private static async getGoogleCredentials(): Promise<{ idToken: string; accessToken: string }> {
//     // Return mock credentials for UI development
//     return {
//       idToken: 'mock-id-token',
//       accessToken: 'mock-access-token'
//     };
//   }
  
//   /**
//    * Handle authentication errors
//    */
//   private static handleAuthError(error: any): Error {
//     let message = 'An error occurred during authentication';
    
//     if (error.code) {
//       switch (error.code) {
//         case 'auth/email-already-in-use':
//           message = 'This email is already in use';
//           break;
//         case 'auth/invalid-email':
//           message = 'Invalid email address';
//           break;
//         case 'auth/weak-password':
//           message = 'Password is too weak';
//           break;
//         case 'auth/user-not-found':
//         case 'auth/wrong-password':
//           message = 'Invalid email or password';
//           break;
//         case 'auth/too-many-requests':
//           message = 'Too many attempts. Please try again later';
//           break;
//         case 'auth/network-request-failed':
//           message = 'Network error. Please check your connection';
//           break;
//         default:
//           message = error.message || message;
//       }
//     }
    
//     return new Error(message);
//   }
// }