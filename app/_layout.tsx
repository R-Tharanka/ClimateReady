import React, { useEffect } from 'react';
import { Slot, router, SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we check authentication
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { isLoading, isLoggedIn, user } = useAuth();
  
  useEffect(() => {
    const navigateToAppropriateScreen = async () => {
      if (!isLoading) {
        try {
          // Check for inconsistent auth state
          const asyncAuth = await AsyncStorage.getItem('user_authenticated');
          if ((isLoggedIn && !user) || (!isLoggedIn && asyncAuth === 'true')) {
            await AsyncStorage.removeItem('user_authenticated');
          }
          
          // Add a small delay for smoother transition
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (isLoggedIn && user) {
            router.replace('/tabs');
          } else {
            router.replace('/landing');
          }
        } catch (error) {
          console.error('Navigation error:', error);
          router.replace('/landing');
        } finally {
          // Hide splash screen once we know where to go
          SplashScreen.hideAsync();
        }
      }
    };

    navigateToAppropriateScreen();
  }, [isLoading, isLoggedIn, user]);
  
  // While loading, return nothing (splash screen remains visible)
  if (isLoading) return null;
  
  return <Slot />;
}