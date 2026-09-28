import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    const result = await login(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="account-balance" size={44} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Diocese ERP</Text>
          <Text style={styles.subtitle}>Sign in to access Chancery & Parish Portal</Text>
        </View>

        <View style={styles.card}>
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={18} color={COLORS.error} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <MaterialIcons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.textLight}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: SIZES.sm,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.small,
  },
  loginButtonText: {
    color: '#0f172a',
    fontSize: SIZES.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '600',
  }
});
