/**
 * @fileOverview A secure Cloud Function v2 to list all users from Firebase Authentication.
 * This function is callable only by authenticated admin users.
 */
import { https, setGlobalOptions } from 'firebase-functions/v2';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only once
if (getApps().length === 0) {
  initializeApp();
}

// Set global options for the region if needed
setGlobalOptions({ region: 'us-central1' });

export const listusers = https.onCall(
  {
    // Enforce that the caller is authenticated
    enforceAppCheck: false, // Set to true in production if App Check is configured
    consumeAppCheckToken: false,
  },
  async (request) => {
    // Check if the user is authenticated
    if (!request.auth) {
      throw new https.HttpsError(
        'unauthenticated',
        'O utilizador deve estar autenticado para chamar esta função.'
      );
    }
    
    const uid = request.auth.uid;
    const firestore = getFirestore();

    try {
        const userDoc = await firestore.collection('users').doc(uid).get();
        if (!userDoc.exists || userDoc.data()?.funcao !== 'Administrador') {
             throw new https.HttpsError(
                'permission-denied',
                'O utilizador não tem permissão para executar esta operação.'
            );
        }

    } catch (error) {
         console.error('Erro ao verificar as permissões do utilizador:', error);
         throw new https.HttpsError(
            'internal',
            'Ocorreu um erro ao verificar as permissões do utilizador.'
        );
    }


    // If the user is an admin, proceed to list users
    try {
      const auth = getAuth();
      const userRecords = await auth.listUsers();
      const users = userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
      }));
      return users;
    } catch (error: any) {
      console.error('Erro ao listar utilizadores na Cloud Function:', error);
      throw new https.HttpsError(
        'internal',
        `Falha ao listar utilizadores: ${error.message}`
      );
    }
  }
);
