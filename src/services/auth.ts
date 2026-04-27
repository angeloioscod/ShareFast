// src/services/auth.ts
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export const loginEmail = (email: string, senha: string) =>
  signInWithEmailAndPassword(auth, email, senha);

export const cadastrarEmail = (email: string, senha: string) =>
  createUserWithEmailAndPassword(auth, email, senha);

export const loginGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const sair = () => auth.signOut();