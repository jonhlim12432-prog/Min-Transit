import { auth } from '../firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
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

const QUOTA_KEY = 'mtth_firestore_quota_exhausted';

// Initialize quota exhaustion state from persistent storage or default to true since quota is currently exhausted
let isQuotaExhausted = true;
try {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(QUOTA_KEY);
    const session = sessionStorage.getItem(QUOTA_KEY);
    if (local === 'false' && session === 'false') {
      isQuotaExhausted = false;
    } else {
      isQuotaExhausted = true;
      localStorage.setItem(QUOTA_KEY, 'true');
      sessionStorage.setItem(QUOTA_KEY, 'true');
    }
  }
} catch {
  isQuotaExhausted = true;
}

export function isFirestoreQuotaExhausted(): boolean {
  return isQuotaExhausted;
}

export function setFirestoreQuotaExhausted(value: boolean): void {
  isQuotaExhausted = value;
  try {
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem(QUOTA_KEY, 'true');
        sessionStorage.setItem(QUOTA_KEY, 'true');
      } else {
        localStorage.removeItem(QUOTA_KEY);
        sessionStorage.removeItem(QUOTA_KEY);
      }
    }
  } catch {}
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  
  if (
    errMsg.includes('resource-exhausted') || 
    errMsg.includes('Quota limit exceeded') || 
    errMsg.includes('quota') ||
    errMsg.includes('Free daily write units') ||
    errMsg.includes('Free daily read units') ||
    errMsg.includes('maximum backoff delay')
  ) {
    setFirestoreQuotaExhausted(true);
    console.warn(`[Firestore Quota Notice] Free daily quota limit reached for ${path || 'database'}. MTTH seamlessly fell back to Express server & offline storage.`);
    return {
      error: errMsg,
      operationType,
      path,
      authInfo: {}
    };
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

