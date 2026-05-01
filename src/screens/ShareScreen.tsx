import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { escutarAmigos, enviarShare } from '../services/firestore';

const tipos = [
  { icon: '🔗', name: 'Link', sub: 'YouTube, TikTok, Instagram', valor: 'link' },
  { icon: '🎵', name: 'Música', sub: 'Spotify, Deezer', valor: 'musica' },
  { icon: '🎥', name: 'Vídeo', sub: 'MP4, MOV, AVI', valor: 'video' },
  { icon: '📄', name: 'Arquivo', sub: 'PDF, DOC, ZIP', valor: 'arquivo' },
];

const metodos = [
  { icon: '☁️', label: 'Internet' },
  { icon: '📶', label: 'Wi-Fi Direct' },
  { icon: '🔵', label: 'Bluetooth' },
];

export default function ShareScreen({ usuario }: { usuario: any }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation() as any;
  const [tipoSelecionado, setTipoSelecionado] = useState(0);
  const [contatosSelecionados, setContatosSelecionados] = useState<string[]>([]);
  const [metodoSelecionado, setMetodoSelecionado] = useState(0);
  const [conteudo, setConteudo] = useState('');
  const [amigos, setAmigos] = useState<any[]>([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!usuario?.uid) return;
    const unsub = escutarAmigos(usuario.uid, (lista) => {
      setAmigos(lista);
    });
    return unsub;
  }, [usuario]);

  const toggleContato = (id: string) => {
    setContatosSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const cores = ['#00FF88', '#00E5FF', '#FF4D6A', '#FFB830', '#A855F7', '#F97316'];
  const getCor = (index: number) => cores[index % cores.length];
  const getIniciais = (nome: string) =>
    nome?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const enviar = async () => {
    if (!conteudo.trim()) {
      Alert.alert('Atenção', 'Cole um link ou escreva o conteúdo!');
      return;
    }
    if (contatosSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um contato!');
      return;
    }
    if (metodoSelecionado === 1 || metodoSelecionado === 2) {
      Alert.alert(
        metodoSelecionado === 1 ? '📶 Wi-Fi Direct' : '🔵 Bluetooth',
        'Para enviar offline conecte primeiro.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Conectar agora →', onPress: () => navigation.navigate('Offline') },
        ]
      );
      return;
    }

    setEnviando(true);
    try {
      await Promise.all(
        contatosSelecionados.map(receiverId =>
          enviarShare({
            senderId: usuario.uid,
            receiverId,
            tipo: tipos[tipoSelecionado].valor,
            conteudo: conteudo.trim(),
          })
        )
      );
      Alert.alert('✅ Enviado!', `Conteúdo enviado para ${contatosSelecionados.length} contato(s)!`);
      setConteudo('');
      setContatosSelecionados([]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>SHARE<Text style={styles.logoWhite}>FAST</Text></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.sectionLabel}>TIPO DE CONTEÚDO</Text>
        <View style={styles.tipoGrid}>
          {tipos.map((t, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tipoCard, tipoSelecionado === i && styles.tipoCardSelected]}
              onPress={() => setTipoSelecionado(i)}
            >
              <Text style={styles.tipoIcon}>{t.icon}</Text>
              <Text style={styles.tipoName}>{t.name}</Text>
              <Text style={styles.tipoSub}>{t.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>CONTEÚDO</Text>
        <TextInput
          style={styles.input}
          placeholder="Cole o link aqui..."
          placeholderTextColor="#6B7280"
          value={conteudo}
          onChangeText={setConteudo}
          multiline
        />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>ENVIAR PARA</Text>
        {amigos.length === 0 ? (
          <View style={styles.semAmigos}>
            <Text style={styles.semAmigosText}>
              Você não tem amigos ainda.{'\n'}Adicione na aba Amigos!
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contatosRow}>
            {amigos.map((a, i) => (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.contatoChip,
                  contatosSelecionados.includes(a.id) && styles.contatoChipSelected,
                ]}
                onPress={() => toggleContato(a.id)}
              >
                <View style={[styles.miniAvatar, { borderColor: getCor(i) }]}>
                  <Text style={[styles.miniInitials, { color: getCor(i) }]}>
                    {getIniciais(a.nome)}
                  </Text>
                </View>
                <Text style={styles.contatoName}>{a.nome.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>MÉTODO DE ENVIO</Text>
        <View style={styles.metodosRow}>
          {metodos.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.metodoBtn, metodoSelecionado === i && styles.metodoBtnSelected]}
              onPress={() => setMetodoSelecionado(i)}
            >
              <Text style={styles.metodoIcon}>{m.icon}</Text>
              <Text style={[styles.metodoLabel, metodoSelecionado === i && styles.metodoLabelSelected]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.enviarBtn, enviando && styles.enviarBtnLoading]}
          onPress={enviar}
          disabled={enviando}
        >
          {enviando
            ? <ActivityIndicator color="#0A0C0F" />
            : <Text style={styles.enviarBtnText}>⚡  ENVIAR AGORA</Text>
          }
        </TouchableOpacity>

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
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tipoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  tipoCard: {
    width: '47%',
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  tipoCardSelected: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0,255,136,0.08)',
  },
  tipoIcon: { fontSize: 22 },
  tipoName: { fontSize: 13, fontWeight: '500', color: '#E8EDF5' },
  tipoSub: { fontSize: 10, color: '#6B7280' },
  input: {
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 10,
    padding: 14,
    color: '#E8EDF5',
    fontSize: 14,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  semAmigos: {
    backgroundColor: '#1A1F28',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  semAmigosText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  contatosRow: { marginBottom: 4 },
  contatoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 20,
    paddingVertical: 6,
    paddingRight: 12,
    paddingLeft: 6,
    marginRight: 10,
  },
  contatoChipSelected: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0,255,136,0.08)',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniInitials: { fontSize: 10, fontWeight: 'bold' },
  contatoName: { fontSize: 12, fontWeight: '500', color: '#E8EDF5' },
  metodosRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  metodoBtn: {
    flex: 1,
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  metodoBtnSelected: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0,255,136,0.08)',
  },
  metodoIcon: { fontSize: 20 },
  metodoLabel: { fontSize: 10, color: '#6B7280' },
  metodoLabelSelected: { color: '#00FF88' },
  enviarBtn: {
    backgroundColor: '#00FF88',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  enviarBtnLoading: { opacity: 0.7 },
  enviarBtnText: { color: '#0A0C0F', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
});