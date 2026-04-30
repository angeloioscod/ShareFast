import {
  doc, getDoc, updateDoc, arrayUnion,
  collection, query, where, getDocs,
  onSnapshot, serverTimestamp, addDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// Buscar usuário pelo ID público (ex: SF-1337)
export const buscarPorIdPublico = async (idPublico: string) => {
  const q = query(
    collection(db, 'users'),
    where('idPublico', '==', idPublico.toUpperCase())
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

// Adicionar amigo
export const adicionarAmigo = async (meuId: string, amigoId: string) => {
  await updateDoc(doc(db, 'users', meuId), {
    amigos: arrayUnion(amigoId),
  });
};

// Buscar dados do meu perfil
export const buscarMeuPerfil = async (userId: string) => {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

// Buscar lista de amigos com dados completos
export const buscarAmigos = async (listaIds: string[]) => {
  if (listaIds.length === 0) return [];
  const amigos = await Promise.all(
    listaIds.map(async (id) => {
      const snap = await getDoc(doc(db, 'users', id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    })
  );
  return amigos.filter(Boolean);
};

// Escutar amigos em tempo real
export const escutarAmigos = (
  userId: string,
  callback: (amigos: any[]) => void
) => {
  return onSnapshot(doc(db, 'users', userId), async (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    const listaIds = data.amigos || [];
    const amigos = await buscarAmigos(listaIds);
    callback(amigos);
  });
};

// Enviar compartilhamento
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

// Escutar recebidos em tempo real
export const escutarRecebidos = (
  userId: string,
  callback: (shares: any[]) => void
) => {
  const q = query(
    collection(db, 'shares'),
    where('receiverId', '==', userId)
  );
  return onSnapshot(q, (snap) => {
    const shares = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    shares.sort((a: any, b: any) => b.timestamp?.seconds - a.timestamp?.seconds);
    callback(shares);
  });
};