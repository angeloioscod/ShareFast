import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { login, cadastrar } from '../services/auth';

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const insets = useSafeAreaInsets();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

const handleEmailLogin = async () => {
  if (!email || !senha) {
    Alert.alert('Atenção', 'Preencha email e senha!');
    return;
  }
  setLoading(true);
  try {
    await login(email, senha);
    onLogin();
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      Alert.alert('Erro', 'Usuário não encontrado!');
    } else if (error.code === 'auth/wrong-password') {
      Alert.alert('Erro', 'Senha incorreta!');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Erro', 'Email inválido!');
    } else {
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    }
  } finally {
    setLoading(false);
  }
};

const handleCadastro = async () => {
  if (!nome || !email || !senha) {
    Alert.alert('Atenção', 'Preencha todos os campos!');
    return;
  }
  if (senha.length < 6) {
    Alert.alert('Atenção', 'Senha deve ter pelo menos 6 caracteres!');
    return;
  }
  setLoading(true);
  try {
    await cadastrar(nome, email, senha);
    onLogin();
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Erro', 'Este email já está cadastrado!');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Erro', 'Email inválido!');
    } else {
      Alert.alert('Erro', 'Não foi possível criar conta. Tente novamente.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>⚡</Text>
          </View>
          <Text style={styles.logoTitle}>SHAREFAST</Text>
          <Text style={styles.logoSub} numberOfLines={2} adjustsFontSizeToFit>
            Compartilhe na{'\n'}velocidade da luz
            </Text>
        </View>

        {/* TOGGLE LOGIN / CADASTRO */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, modo === 'login' && styles.toggleBtnActive]}
            onPress={() => setModo('login')}
          >
            <Text style={[styles.toggleText, modo === 'login' && styles.toggleTextActive]}>
              Entrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, modo === 'cadastro' && styles.toggleBtnActive]}
            onPress={() => setModo('cadastro')}
          >
            <Text style={[styles.toggleText, modo === 'cadastro' && styles.toggleTextActive]}>
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        {/* GOOGLE */}
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} disabled={loading}>
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleBtnText}>
            {loading ? 'Aguarde...' : 'Continuar com Google'}
          </Text>
        </TouchableOpacity>

        {/* DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.form}>
          {modo === 'cadastro' && (
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>NOME</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor="#6B7280"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#6B7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>SENHA</Text>
            <TextInput
              style={styles.input}
              placeholder={modo === 'cadastro' ? 'Mínimo 6 caracteres' : 'Sua senha'}
              placeholderTextColor="#6B7280"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          {modo === 'login' && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BOTÃO PRINCIPAL */}
        <TouchableOpacity
          style={[styles.mainBtn, loading && styles.mainBtnLoading]}
          onPress={modo === 'login' ? handleEmailLogin : handleCadastro}
          disabled={loading}
        >
          <Text style={styles.mainBtnText}>
            {loading ? 'AGUARDE...' : modo === 'login' ? 'ENTRAR →' : 'CRIAR CONTA →'}
          </Text>
        </TouchableOpacity>

        {/* TERMOS */}
        {modo === 'cadastro' && (
          <Text style={styles.termos}>
            Ao criar conta você concorda com os{' '}
            <Text style={styles.termosLink}>Termos de Uso</Text>
            {' '}e{' '}
            <Text style={styles.termosLink}>Privacidade</Text>
          </Text>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0A0C0F',
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 1,
    borderColor: '#00FF88',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIconText: { fontSize: 32 },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FF88',
    letterSpacing: 3,
  },
  logoSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#1A1F28',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#00FF88',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#0A0C0F',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#2A2F38',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  googleIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  googleBtnText: {
    color: '#E8EDF5',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#1A1F28',
  },
  dividerText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  form: { gap: 14, marginBottom: 24 },
  inputWrapper: { gap: 6 },
  inputLabel: {
    fontSize: 10,
    color: '#6B7280',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#1A1F28',
    borderWidth: 0.5,
    borderColor: '#2A2F38',
    borderRadius: 12,
    padding: 14,
    color: '#E8EDF5',
    fontSize: 14,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 2 },
  forgotText: { color: '#00FF88', fontSize: 11 },
  mainBtn: {
    backgroundColor: '#00FF88',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  mainBtnLoading: { opacity: 0.7 },
  mainBtnText: {
    color: '#0A0C0F',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  termos: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termosLink: { color: '#00FF88' },
});