import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { escutarRecebidos } from '../services/firestore';

const filtros = ['Todos', 'link', 'musica', 'video', 'arquivo'];
const filtrosLabel: Record<string, string> = {
  'Todos': 'Todos',
  'link': 'Links',
  'musica': 'Músicas',
  'video': 'Vídeos',
  'arquivo': 'Arquivos',
};

const tipoIcon: Record<string, string> = {
  link: '🔗',
  musica: '🎵',
  video: '🎥',
  arquivo: '📄',
};

export default function InboxScreen({ usuario }: { usuario: any }) {
  const insets = useSafeAreaInsets();
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [recebidos, setRecebidos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!usuario?.uid) return;
    const unsub = escutarRecebidos(usuario.uid, (shares) => {
      setRecebidos(shares);
      setCarregando(false);
    });
    return unsub;
  }, [usuario]);

  const filtrados = recebidos.filter(r =>
    filtroAtivo === 'Todos' || r.tipo === filtroAtivo
  );

  const abrirLink = (url: string) => {
    if (url.startsWith('http')) {
      Linking.openURL(url);
    }
  };

  const formatarTempo = (timestamp: any) => {
    if (!timestamp?.seconds) return '';
    const data = new Date(timestamp.seconds * 1000);
    const agora = new Date();
    const diff = Math.floor((agora.getTime() - data.getTime()) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>SHARE<Text style={styles.logoWhite}>FAST</Text></Text>
        {recebidos.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{recebidos.length} itens</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.pageTitle}>Recebidos</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosRow}>
          {filtros.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filtroPill, filtroAtivo === f && styles.filtroPillActive]}
              onPress={() => setFiltroAtivo(f)}
            >
              <Text style={[styles.filtroText, filtroAtivo === f && styles.filtroTextActive]}>
                {filtrosLabel[f]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {carregando ? (
          <ActivityIndicator color="#00FF88" style={{ marginTop: 40 }} />
        ) : filtrados.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📥</Text>
            <Text style={styles.emptyTitle}>Nenhum item ainda</Text>
            <Text style={styles.emptySub}>
              Quando alguém te enviar algo aparece aqui!
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            {filtrados.map((item, i) => (
              <View key={item.id} style={[styles.inboxItem, i < filtrados.length - 1 && styles.border]}>
                <View style={styles.inboxHeader}>
                  <View style={styles.tipoIconBox}>
                    <Text style={{ fontSize: 20 }}>{tipoIcon[item.tipo] || '📁'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.conteudo} numberOfLines={2}>{item.conteudo}</Text>
                    <Text style={styles.meta}>
                      {item.tipo?.toUpperCase()} • {formatarTempo(item.timestamp)}
                    </Text>
                  </View>
                  {item.conteudo?.startsWith('http') && (
                    <TouchableOpacity
                      style={styles.openBtn}
                      onPress={() => abrirLink(item.conteudo)}
                    >
                      <Text style={styles.openBtnText}>ABRIR</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0C0F' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1A1F28',
  },
  logo: { fontSize: 16, fontWeight: 'bold', color: '#00FF88', letterSpacing: 1 },
  logoWhite: { color: '#E8EDF5' },
  badge: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 0.5,
    borderColor: '#00FF88',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, color: '#00FF88', fontWeight: 'bold' },
  scroll: { padding: 16, paddingBottom: 32 },
  pageTitle: { fontSize: 22, fontWeight: '600', color: '#E8EDF5', marginBottom: 14 },
  filtrosRow: { marginBottom: 16 },
  filtroPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    marginRight: 8,
  },
  filtroPillActive: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderColor: '#00FF88',
  },
  filtroText: { fontSize: 11, color: '#6B7280' },
  filtroTextActive: { color: '#00FF88' },
  card: { backgroundColor: '#1A1F28', borderRadius: 14, overflow: 'hidden' },
  inboxItem: { padding: 14 },
  border: { borderBottomWidth: 0.5, borderBottomColor: '#ffffff10' },
  inboxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0A0C0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: { fontSize: 13, fontWeight: '500', color: '#E8EDF5' },
  meta: { fontSize: 10, color: '#6B7280', marginTop: 3 },
  openBtn: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 0.5,
    borderColor: '#00FF88',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  openBtnText: { fontSize: 10, color: '#00FF88', fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#E8EDF5' },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});