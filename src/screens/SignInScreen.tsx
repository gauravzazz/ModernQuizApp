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

interface SignInScreenProps {
  onSignUpPress: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignUpPress }) => {
  const theme = useTheme<AppTheme>();
  //const navigation = useNavigation();
 //const { signIn, signInWithGoogle, sendPasswordResetEmail, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

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

    return isValid;
  };

  const validateResetEmail = () => {
    if (!resetEmail) {
      setResetEmailError('Email is required');
      return false;
    } else if (!validateEmail(resetEmail)) {
      setResetEmailError('Please enter a valid email');
      return false;
    } else {
      setResetEmailError('');
      return true;
    }
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      
    }
  };

  const handleGoogleSignIn = async () => {
    
  };

  const handleResetPassword = async () => {
   
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
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: scaledSpacing(24),
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
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: scaledSpacing(16),
    },
    signUpText: {
      marginLeft: scaledSpacing(4),
      color: theme.colors.primary,
    },
    resetPasswordContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: scaledSpacing(24),
    },
    resetPasswordCard: {
      width: '100%',
      backgroundColor: theme.colors.neuPrimary,
      borderRadius: scaledRadius(theme.roundness * 2),
      padding: scaledSpacing(24),
      shadowColor: theme.colors.neuDark,
      shadowOffset: { width: moderateScale(5), height: moderateScale(5) },
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(10),
      elevation: moderateScale(8),
      borderWidth: moderateScale(1.5),
      borderColor: theme.colors.neuLight,
    },
    resetPasswordTitle: {
      marginBottom: scaledSpacing(16),
      textAlign: 'center',
    },
    resetPasswordDescription: {
      marginBottom: scaledSpacing(24),
      textAlign: 'center',
    },
    resetPasswordButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: scaledSpacing(24),
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
          Welcome Back
        </Typography>
        <Typography variant="body1" color="onSurfaceVariant" style={styles.subtitle}>
          Sign in to continue your learning journey
        </Typography>

        {/* {error && (
          <Typography variant="body2" style={styles.errorText}>
            {error}
          </Typography>
        )} */}

        <View style={styles.form}>
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={passwordError}
              fullWidth
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => setShowResetPassword(true)}
          >
            <Typography variant="body2" color="primary">
              Forgot Password?
            </Typography>
          </TouchableOpacity>

          <Button
            label='Sign In'
            onPress={handleSignIn}
            //disabled={isLoading}
            fullWidth
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
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
              style={styles.googleIcon}
            />
            <Typography variant="body1" weight="medium">
              Sign in with Google
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Typography variant="body2" color="onSurfaceVariant">
            Don't have an account?
          </Typography>
          <TouchableOpacity onPress={onSignUpPress}>
            <Typography variant="body2" weight="medium" style={styles.signUpText}>
              Sign Up
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showResetPassword && (
        <View style={styles.resetPasswordContainer}>
          <View style={styles.resetPasswordCard}>
            <Typography variant="h5" weight="bold" style={styles.resetPasswordTitle}>
              Reset Password
            </Typography>
            <Typography variant="body1" color="onSurfaceVariant" style={styles.resetPasswordDescription}>
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>

            <Input
              label="Email"
              placeholder="Enter your email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={resetEmailError}
              fullWidth
            />

            <View style={styles.resetPasswordButtons}>
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setShowResetPassword(false)}
                style={{ flex: 1, marginRight: scaledSpacing(8) }}
              />
              <Button
                label="Send"
                onPress={handleResetPassword}
                style={{ flex: 1, marginLeft: scaledSpacing(8) }}
              />
            </View>
          </View>
        </View>
      )}

      {/* {isLoading && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }]}>
          <LoadingIndicator size="large" />
        </View>
      )} */}
    </LinearGradient>
  );
};