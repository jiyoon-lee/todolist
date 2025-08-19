import { auth, db } from '../utils/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
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
  
  // 추가 스코프 설정
  provider.addScope('email');
  provider.addScope('profile');
  
  console.log('Google 리다이렉트 로그인 시작...');
  // 팝업 대신 리다이렉트 방식 사용
  await signInWithRedirect(auth, provider);
  
  // 리다이렉트이므로 페이지가 새로 로드됨
  // 실제 로그인 처리는 handleRedirectResult에서 수행
  throw new Error('redirect-initiated');
};

// 리다이렉트 결과 처리 함수
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('리다이렉트 로그인 성공, 사용자 프로필 생성 중...');
      await createUserProfile(result.user);
      console.log('사용자 프로필 생성 완료');
      return result;
    }
    return null;
  } catch (error) {
    console.error('리다이렉트 결과 처리 중 오류:', error);
    throw error;
  }
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
