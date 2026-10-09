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

// Firestore is active and ready by default
let isQuotaExhausted = false;
try {
  if (typeof window !== 'undefined') {
    // Reset any old stale forced quota locks so Firestore sync works across all devices
    localStorage.removeItem(QUOTA_KEY);
    sessionStorage.removeItem(QUOTA_KEY);
    isQuotaExhausted = false;
  }
} catch {
  isQuotaExhausted = false;
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
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

