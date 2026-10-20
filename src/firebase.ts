import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firebaseConfig from '../firebase-config.json';

const app = initializeApp(firebaseConfig);
export const appCheck = firebaseConfig.recaptchaSiteKey.trim()
  ? initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  : null;
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const OWNER_EMAIL = 'house7software@gmail.com';
export const ALLOWED_ADMIN_EMAILS = ['house7software@gmail.com', 'microedi7@gmail.com'];

export async function uploadImageToStorage(value: string, userId: string): Promise<string> {
  if (!value.startsWith('data:image/')) {
    if (value.length > 2048) {
      throw new Error('O link da imagem não pode ultrapassar 2048 caracteres.');
    }
    return value;
  }

  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([\s\S]+)$/);
  if (!match) {
    throw new Error('A imagem selecionada está em um formato inválido.');
  }

  const [, contentType, base64Data] = match;
  const binaryData = atob(base64Data);
  const imageBytes = new Uint8Array(binaryData.length);
  for (let index = 0; index < binaryData.length; index += 1) {
    imageBytes[index] = binaryData.charCodeAt(index);
  }

  const imageRef = ref(storage, `site-media/${userId}/${crypto.randomUUID()}`);
  const uploadedImage = await uploadBytes(imageRef, imageBytes, { contentType });
  const downloadUrl = await getDownloadURL(uploadedImage.ref);
  if (downloadUrl.length > 2048) {
    throw new Error('O link gerado para a imagem ultrapassou o limite permitido.');
  }
  return downloadUrl;
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.some((admin) => admin.toLowerCase() === email.toLowerCase().trim());
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'site_config', 'main'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function loginAdminWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logoutAdmin() {
  return signOut(auth);
}
