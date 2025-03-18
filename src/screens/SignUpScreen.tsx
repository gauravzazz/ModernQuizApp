import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '../theme';
import { Typography } from '../atoms/Typography';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { LoadingIndicator } from '../atoms/LoadingIndicator';
import { useAuth } from '../context/AuthContext';
import { moderateScale, scaledSpacing, scaledRadius } from '../utils/scaling';

interface SignUpScreenProps {
  onSignInPress: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignInPress }) => {
  const theme = useTheme<AppTheme>();
  //const navigation = useNavigation();
  //const { signUp, signInWithGoogle, isLoading, error } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSignUp = async () => {
    
  };

  const handleGoogleSignUp = async () => {
   
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: scaledSpacing(24),
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: scaledSpacing(32),
    },
    logo: {
      width: moderateScale(100),
      height: moderateScale(100),
      tintColor: theme.colors.primary,
    },
    title: {
      marginBottom: scaledSpacing(8),
      textAlign: 'center',
    },
    subtitle: {
      marginBottom: scaledSpacing(32),
      textAlign: 'center',
    },
    form: {
      width: '100%',
      marginBottom: scaledSpacing(24),
    },
    inputContainer: {
      marginBottom: scaledSpacing(16),
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: scaledSpacing(24),
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.outline,
    },
    dividerText: {
      marginHorizontal: scaledSpacing(16),
    },
    socialButtonsContainer: {
      marginBottom: scaledSpacing(24),
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness),
      padding: scaledSpacing(12),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(4), height: moderateScale(4) },
      shadowOpacity: 0.25,
      shadowRadius: moderateScale(6),
      elevation: moderateScale(5),
      borderWidth: moderateScale(1),
      borderColor: theme.colors.neuLight,
    },
    googleIcon: {
      width: moderateScale(24),
      height: moderateScale(24),
      marginRight: scaledSpacing(8),
    },
    signInContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: scaledSpacing(16),
    },
    signInText: {
      marginLeft: scaledSpacing(4),
      color: theme.colors.primary,
    },
    errorText: {
      color: theme.colors.error,
      marginTop: scaledSpacing(8),
    },
  });

  // Get gradient colors based on theme
  const gradientColors = theme.dark ? ['#1E1B4B', '#121212'] as const : ['#E3F2FD', '#FFFFFF'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Typography variant="h4" weight="bold" style={styles.title}>
          Create Account
        </Typography>
        <Typography variant="body1" color="onSurfaceVariant" style={styles.subtitle}>
          Sign up to start your learning journey
        </Typography>

        {/* {error && (
          <Typography variant="body2" style={styles.errorText}>
            {error}
          </Typography>
        )} */}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              error={nameError}
              fullWidth
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              fullWidth
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
              fullWidth
            />
          </View>

          <View style={styles.inputContainer}>
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
              fullWidth
            />
          </View>

          <Button
            label='Sign Up'
            onPress={handleSignUp}
            //disabled={isLoading}
            fullWidth
            style={{ marginTop: scaledSpacing(16) }}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Typography variant="body2" color="onSurfaceVariant" style={styles.dividerText}>
            OR
          </Typography>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp} >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
              style={styles.googleIcon}
            />
            <Typography variant="body1" weight="medium">
              Sign up with Google
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <Typography variant="body2" color="onSurfaceVariant">
            Already have an account?
          </Typography>
          <TouchableOpacity onPress={onSignInPress}>
            <Typography variant="body2" weight="medium" style={styles.signInText}>
              Sign In
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* {isLoading && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <LoadingIndicator size="large" />
        </View>
      )} */}
    </LinearGradient>
  );
};