import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buscarPorIdPublico, adicionarAmigo, escutarAmigos, buscarMeuPerfil as buscarUsuario } from '../services/firestore';

const cores = ['#00FF88', '#00E5FF', '#FF4D6A', '#FFB830', '#A855F7', '#F97316'];

export default function FriendsScreen({ usuario }: { usuario: any }) {
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');
  const [amigos, setAmigos] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [adicionando, setAdicionando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [idDigitado, setIdDigitado] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<any>(null);
  const [meuId, setMeuId] = useState('...');

  useEffect(() => {
    if (!usuario?.uid) return;
    const unsub = escutarAmigos(usuario.uid, (lista) => {
      setAmigos(lista);
    });
    return unsub;
  }, [usuario]);

  useEffect(() => {
    if (!usuario?.uid) return;
    buscarUsuario(usuario.uid).then((dados: any) => {
      if (dados?.idPublico) setMeuId(dados.idPublico);
    });
  }, [usuario]);

  const filtrados = amigos.filter((a: any) =>
    a.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    a.idPublico?.toLowerCase().includes(busca.toLowerCase())
  );

  const buscarPorId = async () => {
    if (!idDigitado) {
      Alert.alert('Atenção', 'Digite um ID válido! Ex: SF-1234');
      return;
    }
    setBuscando(true);
    setUsuarioEncontrado(null);
    try {
      const encontrado = await buscarPorIdPublico(idDigitado);
      if (!encontrado) {
        Alert.alert('Não encontrado', 'Nenhum usuário com esse ID.');
      } else if ((encontrado as any).id === usuario.uid) {
        Alert.alert('Ops!', 'Este é o seu próprio ID!');
      } else {
        setUsuarioEncontrado(encontrado);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível buscar. Tente novamente.');
    } finally {
      setBuscando(false);
    }
  };

  const confirmarAdicionar = async () => {
    if (!usuarioEncontrado) return;
    setAdicionando(true);
    try {
      await adicionarAmigo(usuario.uid, usuarioEncontrado.id);
      Alert.alert('✅ Amigo adicionado!', `${usuarioEncontrado.nome} foi adicionado!`);
      setIdDigitado('');
      setUsuarioEncontrado(null);
      setModalVisivel(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar. Tente novamente.');
    } finally {
      setAdicionando(false);
    }
  };

  const getCor = (index: number) => cores[index % cores.length];
  const getIniciais = (nome: string) =>
    nome?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>SHARE<Text style={styles.logoWhite}>FAST</Text></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou ID..."
            placeholderTextColor="#6B7280"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => setModalVisivel(true)}
          >
            <Text style={styles.outlineBtnText}>🔑  Adicionar por ID</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => Alert.alert('QR Code', 'Em breve!')}
          >
            <Text style={styles.outlineBtnText}>📷  QR Code</Text>
          </TouchableOpacity>
        </View>

        {modalVisivel && (
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Adicionar por ID</Text>
            <Text style={styles.modalSub}>Digite o ID do amigo. Ex: SF-1234</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="SF-XXXX"
              placeholderTextColor="#6B7280"
              value={idDigitado}
              onChangeText={(t) => setIdDigitado(t.toUpperCase())}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.modalBtnBuscar}
              onPress={buscarPorId}
              disabled={buscando}
            >
              {buscando
                ? <ActivityIndicator color="#0A0C0F" />
                : <Text style={styles.modalBtnText}>BUSCAR</Text>
              }
            </TouchableOpacity>

            {usuarioEncontrado && (
              <View style={styles.encontradoCard}>
                <View style={[styles.avatar, { borderColor: '#00FF88' }]}>
                  <Text style={[styles.initials, { color: '#00FF88' }]}>
                    {getIniciais(usuarioEncontrado.nome)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.friendName}>{usuarioEncontrado.nome}</Text>
                  <Text style={styles.friendId}>{usuarioEncontrado.idPublico}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={confirmarAdicionar}
                  disabled={adicionando}
                >
                  {adicionando
                    ? <ActivityIndicator color="#0A0C0F" size="small" />
                    : <Text style={styles.addBtnText}>+ ADD</Text>
                  }
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.modalBtnCancelar}
              onPress={() => {
                setModalVisivel(false);
                setIdDigitado('');
                setUsuarioEncontrado(null);
              }}
            >
              <Text style={styles.modalBtnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {amigos.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Nenhum amigo ainda</Text>
            <Text style={styles.emptySub}>
              Adicione amigos pelo ID deles!
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>SEUS AMIGOS — {filtrados.length}</Text>
            <View style={styles.card}>
              {filtrados.map((a: any, i: number) => (
                <View key={a.id} style={[styles.friendRow, i < filtrados.length - 1 && styles.border]}>
                  <View style={[styles.avatar, { borderColor: getCor(i) }]}>
                    <Text style={[styles.initials, { color: getCor(i) }]}>
                      {getIniciais(a.nome)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>{a.nome}</Text>
                    <Text style={styles.friendId}>{a.idPublico}</Text>
                  </View>
                  <TouchableOpacity style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>ENVIAR</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.meuIdCard}>
          <Text style={styles.sectionLabel}>MEU ID PÚBLICO</Text>
          <Text style={styles.meuId}>{meuId}</Text>
          <Text style={styles.meuIdSub}>
            Compartilhe este ID para seus amigos te adicionarem
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0C0F' },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1A1F28',
  },
  logo: { fontSize: 16, fontWeight: 'bold', color: '#00FF88', letterSpacing: 1 },
  logoWhite: { color: '#E8EDF5' },
  scroll: { padding: 16, paddingBottom: 32 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181C22',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, color: '#E8EDF5', fontSize: 14 },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00FF88',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  outlineBtnText: { color: '#00FF88', fontSize: 12, fontWeight: 'bold' },
  modal: {
    backgroundColor: '#1A1F28',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#E8EDF5' },
  modalSub: { fontSize: 12, color: '#6B7280' },
  modalInput: {
    backgroundColor: '#0A0C0F',
    borderWidth: 0.5,
    borderColor: '#00FF88',
    borderRadius: 10,
    padding: 14,
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  modalBtnBuscar: {
    backgroundColor: '#00FF88',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  modalBtnText: { color: '#0A0C0F', fontWeight: 'bold', fontSize: 13 },
  encontradoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,255,136,0.06)',
    borderWidth: 1,
    borderColor: '#00FF88',
    borderRadius: 12,
    padding: 14,
  },
  modalBtnCancelar: {
    borderWidth: 0.5,
    borderColor: '#6B7280',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  modalBtnCancelarText: { color: '#6B7280', fontSize: 13 },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  card: { backgroundColor: '#1A1F28', borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  border: { borderBottomWidth: 0.5, borderBottomColor: '#ffffff10' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,255,136,0.06)',
  },
  initials: { fontSize: 13, fontWeight: 'bold' },
  friendName: { fontSize: 14, fontWeight: '500', color: '#E8EDF5' },
  friendId: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  sendBtn: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 0.5,
    borderColor: '#00FF88',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendBtnText: { fontSize: 11, color: '#00FF88', fontWeight: 'bold' },
  addBtn: {
    backgroundColor: '#00FF88',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnText: { fontSize: 11, color: '#0A0C0F', fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#E8EDF5' },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  meuIdCard: {
    backgroundColor: '#1A1F28',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  meuId: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FF88',
    letterSpacing: 4,
  },
  meuIdSub: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
});