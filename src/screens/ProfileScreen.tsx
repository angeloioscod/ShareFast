import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const configuracoes = [
  { icon: '🔔', label: 'Notificações', color: 'rgba(0,255,136,0.15)' },
  { icon: '⭐', label: 'Contatos Favoritos', color: 'rgba(0,229,255,0.15)' },
  { icon: '⚙️', label: 'Compressão Automática', color: 'rgba(255,184,48,0.15)' },
  { icon: '🔒', label: 'Privacidade', color: 'rgba(255,75,106,0.15)' },
  { icon: '📡', label: 'Modo Offline', color: 'rgba(0,255,136,0.15)' },
];

export default function ProfileScreen({ usuario, onLogout }: { usuario: any, onLogout: () => void }) {
  const insets = useSafeAreaInsets();

  const nome = usuario?.displayName || 'Usuário';
  const email = usuario?.email || '';
  const iniciais = nome
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const confirmarSaida = () => {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>SHARE<Text style={styles.logoWhite}>FAST</Text></Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.profileHero}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>{iniciais}</Text>
          </View>
          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => Alert.alert('Editar perfil', 'Em breve!')}
            >
              <Text style={styles.outlineBtnText}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => Alert.alert('QR Code', 'Em breve!')}
            >
              <Text style={styles.outlineBtnText}>Meu QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ESTATÍSTICAS</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLabel}>Total enviados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLabel}>Total recebidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLabel}>Amigos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>0 MB</Text>
            <Text style={styles.statLabel}>Transferidos</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>CONFIGURAÇÕES</Text>
        <View style={styles.card}>
          {configuracoes.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.settingsItem, i < configuracoes.length - 1 && styles.border]}
              onPress={() => Alert.alert(c.label, 'Em breve!')}
            >
              <View style={[styles.settingsIcon, { backgroundColor: c.color }]}>
                <Text style={{ fontSize: 16 }}>{c.icon}</Text>
              </View>
              <Text style={styles.settingsLabel}>{c.label}</Text>
              <Text style={styles.settingsArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={confirmarSaida}>
          <Text style={styles.logoutBtnText}>Sair da conta</Text>
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
  profileHero: { alignItems: 'center', paddingVertical: 24 },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0,255,136,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  profileInitials: { fontSize: 26, fontWeight: 'bold', color: '#00FF88' },
  profileName: { fontSize: 20, fontWeight: '600', color: '#E8EDF5' },
  profileEmail: { fontSize: 12, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  btnRow: { flexDirection: 'row', gap: 10 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#00FF88',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  outlineBtnText: { color: '#00FF88', fontSize: 12, fontWeight: 'bold' },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1A1F28',
    borderRadius: 14,
    padding: 14,
    width: '47%',
  },
  statNum: { fontSize: 22, fontWeight: 'bold', color: '#00FF88' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  card: {
    backgroundColor: '#1A1F28',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  border: { borderBottomWidth: 0.5, borderBottomColor: '#ffffff10' },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLabel: { flex: 1, fontSize: 14, color: '#E8EDF5' },
  settingsArrow: { fontSize: 18, color: '#6B7280' },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#FF4D6A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutBtnText: { color: '#FF4D6A', fontSize: 14, fontWeight: 'bold' },
});