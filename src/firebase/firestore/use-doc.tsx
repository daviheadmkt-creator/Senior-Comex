
'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentReference, // Importante: Referência de Documento
  DocumentSnapshot, // Importante: Snapshot de Documento
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useMemoFirebase } from '..';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface para o valor de retorno do useDocument hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Apenas um documento, ou null.
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Hook para se inscrever em um Documento específico do Firestore em tempo real.
 * * @template T Tipo para os dados do documento.
 * @param {DocumentReference<DocumentData> | null | undefined} memoizedTargetRef - A referência do Documento.
 * @returns {UseDocumentResult<T>} Objeto com data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedTargetRef: (DocumentReference<DocumentData> & {__memo?: boolean}) | null | undefined,
): UseDocResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Usa onSnapshot em uma REFERÊNCIA DE DOCUMENTO
    const unsubscribe = onSnapshot(
      memoizedTargetRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const result: ResultItemType = { ...(snapshot.data() as T), id: snapshot.id };
          setData(result);
          setError(null);
        } else {
          setData(null);
        }
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const path: string = memoizedTargetRef.path;
        
        // A operação correta para leitura de documento único é 'get'
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRef]);

  if(memoizedTargetRef && !memoizedTargetRef.__memo) {
    throw new Error(memoizedTargetRef.path + ' was not properly memoized using useMemoFirebase');
  }

  return { data, isLoading, error };
}
