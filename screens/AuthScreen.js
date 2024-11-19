import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useTheme } from '../ThemeContext';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { FontAwesome } from '@expo/vector-icons';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const EXPO_CLIENT_ID = 'YOUR_EXPO_CLIENT_ID';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { theme } = useTheme();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    androidClientId: GOOGLE_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
  });

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      }
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        navigation.replace('Home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to authenticate with Google');
    }
  };

  const handleSocialAuth = (provider) => {
    // Placeholder for other social auth methods
    Alert.alert('Info', `${provider} authentication not implemented yet`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{isLogin ? 'Welcome back' : 'Create account'}</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            {isLogin ? 'Sign in to your account' : 'Sign up for a new account'}
          </Text>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleAuth}>
              <FontAwesome name="google" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialAuth('X')}>
              <FontAwesome name="twitter" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialAuth('Facebook')}>
              <FontAwesome name="facebook" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialAuth('Thread')}>
              <FontAwesome name="at" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.borderColor }]} />
            <Text style={[styles.dividerText, { color: theme.secondaryText }]}>Or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.borderColor }]} />
          </View>

          <TextInput
            style={[styles.input, { borderColor: theme.borderColor, color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.secondaryText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { borderColor: theme.borderColor, color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {!isLogin && (
            <TextInput
              style={[styles.input, { borderColor: theme.borderColor, color: theme.text }]}
              placeholder="Display Name"
              placeholderTextColor={theme.secondaryText}
              value={displayName}
              onChangeText={setDisplayName}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={[styles.switchText, { color: theme.text }]}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    fontSize: 14,
  },
});