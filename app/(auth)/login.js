import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { FadeInDown, FadeInUp } from '../../src/components/FadeInView';

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
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.background}
      />
      
      <View style={styles.contentContainer}>
        <FadeInDown duration={800} style={styles.header}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="account-balance" size={56} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Diocese ERP</Text>
          <Text style={styles.subtitle}>Sign in to access your portal</Text>
        </FadeInDown>

        <FadeInUp duration={800} delay={200} style={styles.formWrapper}>
          <BlurView intensity={80} tint="light" style={styles.blurContainer}>
            {errorMsg ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color={COLORS.error} />
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
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </BlurView>
        </FadeInUp>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.large,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  formWrapper: {
    borderRadius: SIZES.radius.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  blurContainer: {
    padding: 32,
    backgroundColor: COLORS.surfaceLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...SHADOWS.small,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    ...SHADOWS.medium,
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: SIZES.radius.sm,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 8,
    fontSize: SIZES.sm,
    fontWeight: '600',
  }
});
