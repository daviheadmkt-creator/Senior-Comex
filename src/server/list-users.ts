/**
 * @fileOverview A secure Cloud Function v2 to list all users from Firebase Authentication.
 * This function is callable only by authenticated admin users from the client.
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
    // This allows the function to be called from your web app.
    // In production, you should configure this with your app's domain.
    cors: /.*/,
  },
  async (request) => {
    // 1. Verify Firebase Auth ID token
    if (!request.auth) {
      throw new https.HttpsError(
        'unauthenticated',
        'A autenticação é necessária para executar esta operação.'
      );
    }

    const uid = request.auth.uid;
    const firestore = getFirestore();

    try {
      // 2. Verify if the user has 'Administrador' role in Firestore
      const userDoc = await firestore.collection('users').doc(uid).get();
      
      if (!userDoc.exists || userDoc.data()?.funcao !== 'Administrador') {
        throw new https.HttpsError(
          'permission-denied',
          'O utilizador não tem permissão para listar outros utilizadores.'
        );
      }

      // 3. If authorized, proceed to list users
      const auth = getAuth();
      const userRecords = await auth.listUsers();
      
      // 4. Enrich Auth users with Firestore data
      const firestoreUsers = await firestore.collection('users').get();
      const firestoreDataMap = new Map(firestoreUsers.docs.map(doc => [doc.id, doc.data()]));

      const users = userRecords.users.map((user) => {
        const firestoreUser = firestoreDataMap.get(user.uid);
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          disabled: user.disabled,
          // Add fields from Firestore
          nome: firestoreUser?.nome || user.displayName,
          funcao: firestoreUser?.funcao || 'N/A',
          status: firestoreUser?.status || (user.disabled ? 'Inativo' : 'Ativo')
        };
      });

      return users;

    } catch (error: any) {
      console.error('Erro ao listar utilizadores na Cloud Function:', error);
      // Avoid leaking internal implementation details.
      // The HttpsError constructor will log the original error on the server side.
      if (error instanceof https.HttpsError) {
          throw error;
      }
      throw new https.HttpsError(
        'internal',
        'Ocorreu um erro inesperado ao processar o seu pedido.'
      );
    }
  }
);
