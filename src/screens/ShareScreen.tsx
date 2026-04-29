import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const tipos = [
  { icon: '🔗', name: 'Link', sub: 'YouTube, TikTok, Instagram' },
  { icon: '🎵', name: 'Música', sub: 'Spotify, Deezer' },
  { icon: '🎥', name: 'Vídeo', sub: 'MP4, MOV, AVI' },
  { icon: '📄', name: 'Arquivo', sub: 'PDF, DOC, ZIP' },
];

const contatos = [
  { initials: 'AN', name: 'Ana', color: '#00FF88' },
  { initials: 'LU', name: 'Lucas', color: '#00E5FF' },
  { initials: 'CA', name: 'Carla', color: '#FF4D6A' },
  { initials: 'MA', name: 'Marcos', color: '#FFB830' },
];

const metodos = [
  { icon: '☁️', label: 'Internet' },
  { icon: '📶', label: 'Wi-Fi Direct' },
  { icon: '🔵', label: 'Bluetooth' },
];

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation() as any;
  const [tipoSelecionado, setTipoSelecionado] = useState(0);
  const [contatosSelecionados, setContatosSelecionados] = useState<number[]>([0]);
  const [metodoSelecionado, setMetodoSelecionado] = useState(0);
  const [conteudo, setConteudo] = useState('');

  const toggleContato = (i: number) => {
    setContatosSelecionados(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const enviar = () => {
    if (!conteudo) {
      Alert.alert('Atenção', 'Cole um link ou selecione um arquivo!');
      return;
    }
    if (contatosSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um contato!');
      return;
    }
    if (metodoSelecionado === 1 || metodoSelecionado === 2) {
      Alert.alert(
        metodoSelecionado === 1 ? '📶 Wi-Fi Direct' : '🔵 Bluetooth',
        'Para enviar offline você precisa primeiro conectar com o dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Conectar agora →',
            onPress: () => navigation.navigate('Offline'),
          },
        ]
      );
      return;
    }
    Alert.alert('✅ Enviado!', 'Conteúdo enviado via Internet!');
    setConteudo('');
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
        />
        <TouchableOpacity style={styles.ghostBtn}>
          <Text style={styles.ghostBtnText}>📁  Selecionar do dispositivo</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>ENVIAR PARA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contatosRow}>
          {contatos.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.contatoChip, contatosSelecionados.includes(i) && styles.contatoChipSelected]}
              onPress={() => toggleContato(i)}
            >
              <View style={[styles.miniAvatar, { borderColor: c.color }]}>
                <Text style={[styles.miniInitials, { color: c.color }]}>{c.initials}</Text>
              </View>
              <Text style={styles.contatoName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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

        <TouchableOpacity style={styles.enviarBtn} onPress={enviar}>
          <Text style={styles.enviarBtnText}>⚡  ENVIAR AGORA</Text>
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
  },
  ghostBtn: {
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  ghostBtnText: { color: '#E8EDF5', fontSize: 13 },
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
  enviarBtnText: { color: '#0A0C0F', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
});