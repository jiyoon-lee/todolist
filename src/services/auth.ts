import { auth, db } from '../utils/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  User 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const signupWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(userCredential.user);
  return userCredential;
};

export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  console.log('Google 로그인 프로바이더 생성 중...');
  const provider = new GoogleAuthProvider();
  
  // 추가 스코프 설정 (선택사항)
  provider.addScope('email');
  provider.addScope('profile');
  
  console.log('Google 팝업 열기 시도 중...');
  const userCredential = await signInWithPopup(auth, provider);
  console.log('Google 로그인 성공, 사용자 프로필 생성 중...');
  
  await createUserProfile(userCredential.user);
  console.log('사용자 프로필 생성 완료');
  
  return userCredential;
};

export const logoutUser = () => signOut(auth);

const createUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0],
    photoURL: user.photoURL,
    createdAt: serverTimestamp()
  }, { merge: true });
};
