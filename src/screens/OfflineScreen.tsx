import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Alert, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const dispositivosMock = [
  {
    id: '1', initials: 'AN', name: 'Ana Beatriz',
    device: 'Samsung Galaxy S23', distance: '2m',
    signal: 4, color: '#00FF88',
  },
  {
    id: '2', initials: 'LU', name: 'Lucas Ferreira',
    device: 'iPhone 14', distance: '5m',
    signal: 3, color: '#00E5FF',
  },
  {
    id: '3', initials: '?', name: 'Desconhecido',
    device: 'Android', distance: '8m',
    signal: 2, color: '#FFB830',
  },
];

export default function OfflineScreen() {
  const insets = useSafeAreaInsets();
  const [metodo, setMetodo] = useState<'wifi' | 'bluetooth'>('wifi');
  const [escaneando, setEscaneando] = useState(false);
  const [dispositivos, setDispositivos] = useState<typeof dispositivosMock>([]);
  const [conectado, setConectado] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (escaneando) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      opacityAnim.setValue(0.6);
    }
  }, [escaneando]);

  const iniciarEscan = () => {
    setEscaneando(true);
    setDispositivos([]);
    setConectado(null);

    setTimeout(() => {
      setDispositivos([dispositivosMock[0]]);
    }, 1000);
    setTimeout(() => {
      setDispositivos([dispositivosMock[0], dispositivosMock[1]]);
    }, 2000);
    setTimeout(() => {
      setDispositivos(dispositivosMock);
      setEscaneando(false);
    }, 3000);
  };

  const conectar = (id: string, nome: string) => {
    if (dispositivosMock.find(d => d.id === id)?.initials === '?') {
      Alert.alert('Dispositivo não encontrado', 'Este dispositivo não usa ShareFast.');
      return;
    }
    Alert.alert(
      'Conectar',
      `Deseja conectar com ${nome} via ${metodo === 'wifi' ? 'Wi-Fi Direct' : 'Bluetooth'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Conectar',
          onPress: () => {
            setConectado(id);
            Alert.alert('✅ Conectado!', `Conectado com ${nome}! Agora você pode compartilhar arquivos sem internet.`);
          },
        },
      ]
    );
  };

  const renderBarras = (signal: number) => {
    return [1, 2, 3, 4].map(i => (
      <View
        key={i}
        style={[
          styles.signalBar,
          { height: i * 4 },
          i <= signal ? styles.signalBarActive : styles.signalBarInactive,
        ]}
      />
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>SHARE<Text style={styles.logoWhite}>FAST</Text></Text>
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineBadgeText}>📡 OFFLINE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* RADAR */}
        <View style={styles.radarContainer}>
          <Animated.View style={[
            styles.radarOuter,
            { transform: [{ scale: pulseAnim }], opacity: opacityAnim }
          ]} />
          <View style={styles.radarMiddle}>
            <View style={styles.radarInner}>
              <Text style={styles.radarIcon}>📡</Text>
            </View>
          </View>
        </View>

        <Text style={styles.radarTitle}>
          {escaneando ? 'BUSCANDO DISPOSITIVOS...' : dispositivos.length > 0 ? `${dispositivos.length} DISPOSITIVOS ENCONTRADOS` : 'TOQUE PARA BUSCAR'}
        </Text>
        <Text style={styles.radarSub}>
          Funciona sem internet via {metodo === 'wifi' ? 'Wi-Fi Direct' : 'Bluetooth'}
        </Text>

        {/* MÉTODO */}
        <View style={styles.metodoRow}>
          <TouchableOpacity
            style={[styles.metodoBtn, metodo === 'wifi' && styles.metodoBtnActive]}
            onPress={() => { setMetodo('wifi'); setDispositivos([]); }}
          >
            <Text style={styles.metodoIcon}>📶</Text>
            <Text style={[styles.metodoLabel, metodo === 'wifi' && styles.metodoLabelActive]}>
              Wi-Fi Direct
            </Text>
            <Text style={styles.metodoSub}>Até 250 MB/s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.metodoBtn, metodo === 'bluetooth' && styles.metodoBtnActive]}
            onPress={() => { setMetodo('bluetooth'); setDispositivos([]); }}
          >
            <Text style={styles.metodoIcon}>🔵</Text>
            <Text style={[styles.metodoLabel, metodo === 'bluetooth' && styles.metodoLabelActive]}>
              Bluetooth
            </Text>
            <Text style={styles.metodoSub}>Até 3 MB/s</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÃO ESCANEAR */}
        <TouchableOpacity
          style={[styles.scanBtn, escaneando && styles.scanBtnLoading]}
          onPress={iniciarEscan}
          disabled={escaneando}
        >
          <Text style={styles.scanBtnText}>
            {escaneando ? '🔍 BUSCANDO...' : '🔍 BUSCAR DISPOSITIVOS'}
          </Text>
        </TouchableOpacity>

        {/* DISPOSITIVOS */}
        {dispositivos.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>DISPOSITIVOS PRÓXIMOS</Text>
            {dispositivos.map((d) => (
              <View
                key={d.id}
                style={[styles.deviceCard, conectado === d.id && styles.deviceCardConectado]}
              >
                <View style={[styles.avatar, { borderColor: d.color }]}>
                  <Text style={[styles.avatarText, { color: d.color }]}>{d.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceName}>{d.name}</Text>
                  <Text style={styles.deviceInfo}>{d.device} • {d.distance} de distância</Text>
                  {conectado === d.id && (
                    <Text style={styles.conectadoText}>✅ Conectado</Text>
                  )}
                </View>
                <View style={styles.signalBars}>
                  {renderBarras(d.signal)}
                </View>
                <TouchableOpacity
                  style={[
                    styles.conectarBtn,
                    conectado === d.id && styles.conectarBtnAtivo,
                    d.initials === '?' && styles.conectarBtnDesconhecido,
                  ]}
                  onPress={() => conectar(d.id, d.name)}
                >
                  <Text style={[
                    styles.conectarBtnText,
                    d.initials === '?' && styles.conectarBtnTextDesconhecido,
                  ]}>
                    {conectado === d.id ? 'ENVIAR' : d.initials === '?' ? '?' : 'CONECTAR'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* INFO */}
        {conectado && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📁 Compartilhar arquivo</Text>
            <Text style={styles.infoText}>
              Você está conectado! Vá para a aba Compartilhar e selecione o método{' '}
              {metodo === 'wifi' ? 'Wi-Fi Direct' : 'Bluetooth'}.
            </Text>
            <TouchableOpacity style={styles.infoBtn}>
              <Text style={styles.infoBtnText}>IR PARA COMPARTILHAR →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.velocidadeCard}>
          <Text style={styles.velocidadeTitle}>⚡ VELOCIDADE ESTIMADA</Text>
          <Text style={styles.velocidadeValor}>
            {metodo === 'wifi' ? '25 MB/s' : '2.1 MB/s'}
          </Text>
          <Text style={styles.velocidadeSub}>
            {metodo === 'wifi'
              ? 'Arquivo de 1GB em ~40 segundos'
              : 'Arquivo de 10MB em ~5 segundos'}
          </Text>
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
  offlineBadge: {
    backgroundColor: 'rgba(255,184,48,0.1)',
    borderWidth: 0.5,
    borderColor: '#FFB830',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  offlineBadgeText: { fontSize: 10, color: '#FFB830', fontWeight: 'bold' },
  scroll: { padding: 16, paddingBottom: 32 },
  radarContainer: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  radarOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  radarMiddle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 1,
    borderColor: '#00FF88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarIcon: { fontSize: 30 },
  radarTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00FF88',
    letterSpacing: 1,
    marginBottom: 6,
  },
  radarSub: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
  },
  metodoRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metodoBtn: {
    flex: 1,
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  metodoBtnActive: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0,255,136,0.08)',
  },
  metodoIcon: { fontSize: 22 },
  metodoLabel: { fontSize: 12, fontWeight: 'bold', color: '#6B7280' },
  metodoLabelActive: { color: '#00FF88' },
  metodoSub: { fontSize: 10, color: '#6B7280' },
  scanBtn: {
    backgroundColor: '#00FF88',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  scanBtnLoading: { opacity: 0.7 },
  scanBtnText: { color: '#0A0C0F', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#1A1F28',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  deviceCardConectado: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0,255,136,0.05)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: 'bold' },
  deviceName: { fontSize: 13, fontWeight: '500', color: '#E8EDF5' },
  deviceInfo: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  conectadoText: { fontSize: 10, color: '#00FF88', marginTop: 2 },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 20,
  },
  signalBar: { width: 4, borderRadius: 2 },
  signalBarActive: { backgroundColor: '#00FF88' },
  signalBarInactive: { backgroundColor: '#2A2F38' },
  conectarBtn: {
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 0.5,
    borderColor: '#00FF88',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  conectarBtnAtivo: {
    backgroundColor: '#00FF88',
  },
  conectarBtnDesconhecido: {
    borderColor: '#FFB830',
    backgroundColor: 'rgba(255,184,48,0.1)',
  },
  conectarBtnText: { fontSize: 11, color: '#00FF88', fontWeight: 'bold' },
  conectarBtnTextDesconhecido: { color: '#FFB830' },
  infoCard: {
    backgroundColor: 'rgba(0,255,136,0.06)',
    borderWidth: 1,
    borderColor: '#00FF88',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#00FF88' },
  infoText: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  infoBtn: {
    backgroundColor: '#00FF88',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  infoBtnText: { color: '#0A0C0F', fontSize: 11, fontWeight: 'bold' },
  velocidadeCard: {
    backgroundColor: '#1A1F28',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  velocidadeTitle: { fontSize: 10, color: '#6B7280', letterSpacing: 2 },
  velocidadeValor: { fontSize: 28, fontWeight: 'bold', color: '#00FF88' },
  velocidadeSub: { fontSize: 11, color: '#6B7280' },
});