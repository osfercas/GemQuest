import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getAuth(), email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
  await user.updateProfile({ displayName });
  return user;
}

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  // Play Services remembers the last account picked for this app and skips
  // the chooser on subsequent sign-ins; sign out first to force it every time.
  await GoogleSignin.signOut();
  const response = await GoogleSignin.signIn();
  if (response.type === 'cancelled') return null;
  const idToken = response.data.idToken;
  if (!idToken) throw new Error('auth/no-id-token');
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(getAuth(), credential);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(getAuth(), email);
}

export function signOut() {
  return fbSignOut(getAuth());
}
