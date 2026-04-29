import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ usuario }: { usuario: any }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>SHARE<Text style={styles.logoWhite}>FAST</Text></Text>
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineText}>⚡ ONLINE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.greeting}>Olá, {usuario?.displayName?.split(' ')[0] || 'usuário'} 👋</Text>
        <Text style={styles.greetingSub}>
          Você tem <Text style={styles.neon}>3 novos</Text> arquivos recebidos
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>47</Text>
            <Text style={styles.statLabel}>Enviados hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Amigos ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>2.3GB</Text>
            <Text style={styles.statLabel}>Transferidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>0.3s</Text>
            <Text style={styles.statLabel}>Tempo médio</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.quickShareBtn}>
          <View>
            <Text style={styles.qsTitle}>COMPARTILHAMENTO RÁPIDO</Text>
            <Text style={styles.qsSub}>Toque para enviar para favoritos</Text>
          </View>
          <Text style={styles.qsArrow}>→</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>FAVORITOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favRow}>
          {[
            { initials: 'AN', name: 'Ana', color: '#00FF88' },
            { initials: 'LU', name: 'Lucas', color: '#00E5FF' },
            { initials: 'CA', name: 'Carla', color: '#FF4D6A' },
            { initials: 'MA', name: 'Marcos', color: '#FFB830' },
          ].map((f) => (
            <TouchableOpacity key={f.name} style={styles.favChip}>
              <View style={[styles.favAvatar, { borderColor: f.color }]}>
                <Text style={[styles.favInitials, { color: f.color }]}>{f.initials}</Text>
              </View>
              <Text style={styles.favName}>{f.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>ATIVIDADE RECENTE</Text>
        <View style={styles.card}>
          {[
            { icon: '🎵', title: 'Música do Spotify', meta: 'Enviado para Ana', time: '2min' },
            { icon: '🔗', title: 'Link do YouTube', meta: 'Recebido de Lucas', time: '15min' },
            { icon: '📄', title: 'Relatório.pdf', meta: 'Enviado para Marcos', time: '1h' },
          ].map((item, i) => (
            <View key={i} style={[styles.activityItem, i < 2 && styles.activityBorder]}>
              <View style={styles.activityIcon}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityName}>{item.title}</Text>
                <Text style={styles.activityMeta}>{item.meta}</Text>
              </View>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
          ))}
        </View>

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
  onlineBadge: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 0.5,
    borderColor: '#00FF88',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  onlineText: { fontSize: 10, color: '#00FF88', fontWeight: 'bold' },
  scroll: { padding: 16, paddingBottom: 32 },
  greeting: { fontSize: 22, fontWeight: '600', color: '#E8EDF5', marginBottom: 4 },
  greetingSub: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  neon: { color: '#00FF88' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: {
    backgroundColor: '#1A1F28',
    borderRadius: 14,
    padding: 14,
    width: '47%',
  },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#00FF88' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  quickShareBtn: {
    backgroundColor: 'rgba(0,255,136,0.08)',
    borderWidth: 1,
    borderColor: '#00FF88',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  qsTitle: { fontSize: 14, fontWeight: 'bold', color: '#00FF88' },
  qsSub: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  qsArrow: { fontSize: 24, color: '#00FF88' },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  favRow: { marginBottom: 24 },
  favChip: { alignItems: 'center', marginRight: 16 },
  favAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,255,136,0.08)',
    marginBottom: 6,
  },
  favInitials: { fontSize: 14, fontWeight: 'bold' },
  favName: { fontSize: 10, color: '#6B7280' },
  card: {
    backgroundColor: '#1A1F28',
    borderRadius: 14,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  activityBorder: { borderBottomWidth: 0.5, borderBottomColor: '#ffffff10' },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#0A0C0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityName: { fontSize: 13, fontWeight: '500', color: '#E8EDF5' },
  activityMeta: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  activityTime: { fontSize: 10, color: '#6B7280' },
});