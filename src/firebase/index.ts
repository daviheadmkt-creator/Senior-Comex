
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Important! initializeApp() is called without any arguments because Firebase App Hosting
    // integrates with the initializeApp() function to provide the environment variables needed to
    // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
    // without arguments.
    let firebaseApp;
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      firebaseApp = initializeApp();
    } catch (e) {
      // Only warn in production because it's normal to use the firebaseConfig to initialize
      // during development
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    
    // Create a default user for easy login during development
    if (process.env.NODE_ENV === 'development') {
        const auth = getAuth(firebaseApp);
        const firestore = getFirestore(firebaseApp);
        const email = 'davi@dftarget.com.br';
        const password = 'Brasil142536@';

        const upsertUserDocument = async (user: any) => {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    id: user.uid,
                    nome: 'Admin Dev',
                    email: user.email,
                    funcao: 'Administrador', // Make the dev user an admin
                    status: 'Ativo',
                });
            }
        };

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                upsertUserDocument(userCredential.user);
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    createUserWithEmailAndPassword(auth, email, password)
                        .then(userCredential => {
                            upsertUserDocument(userCredential.user);
                        });
                }
        });
    }


    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
