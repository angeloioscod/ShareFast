// src/services/firestore.ts
import { db, storage } from './firebase';
import { collection, addDoc, serverTimestamp, query,
         where, onSnapshot, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Enviar compartilhamento via internet
export const enviarShare = async (dados: {
  senderId: string;
  receiverId: string;
  tipo: string;
  conteudo: string;
}) => {
  await addDoc(collection(db, 'shares'), {
    ...dados,
    lido: false,
    timestamp: serverTimestamp(),
  });
};

// Upload de arquivo para o Storage
export const uploadArquivo = async (
  uri: string,
  userId: string,
  nomeArquivo: string
): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `uploads/${userId}/${nomeArquivo}`);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

// Escutar recebimentos em tempo real
export const escutarRecebidos = (
  userId: string,
  callback: (shares: any[]) => void
) => {
  const q = query(
    collection(db, 'shares'),
    where('receiverId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};