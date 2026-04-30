import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Gerar ID único estilo SF-XXXX
const gerarId = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SF-${num}`;
};

// Cadastro com email e senha
export const cadastrar = async (nome: string, email: string, senha: string) => {
  const resultado = await createUserWithEmailAndPassword(auth, email, senha);
  const user = resultado.user;

  await updateProfile(user, { displayName: nome });

  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    nome,
    email,
    idPublico: gerarId(),
    foto: '',
    amigos: [],
    favoritos: [],
    criadoEm: serverTimestamp(),
  });

  return user;
};

// Login com email e senha
export const login = async (email: string, senha: string) => {
  const resultado = await signInWithEmailAndPassword(auth, email, senha);
  return resultado.user;
};

// Sair
export const sair = () => signOut(auth);

// Criar perfil se não existir
export const criarPerfilSeNaoExistir = async (user: any) => {
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      nome: user.displayName || 'Usuário',
      email: user.email,
      idPublico: gerarId(),
      foto: '',
      amigos: [],
      favoritos: [],
      criadoEm: serverTimestamp(),
    });
  }
};