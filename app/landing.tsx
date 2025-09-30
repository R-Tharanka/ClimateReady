import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
  FadeIn,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function LandingScreen() {
  const router = useRouter();
  
  // Animation values
  const titleScale = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const button1Y = useSharedValue(100);
  const button2Y = useSharedValue(100);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    // Start animations when component mounts
    titleScale.value = withDelay(300, withSpring(1, { damping: 10 }));
    subtitleOpacity.value = withDelay(600, withSpring(1));
    button1Y.value = withDelay(800, withSpring(0, { damping: 12 }));
    button2Y.value = withDelay(900, withSpring(0, { damping: 12 }));
    
    // Pulsing animation for emergency vibe
    pulseValue.value = withSequence(
      withTiming(1.1, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const button1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: button1Y.value }],
  }));

  const button2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: button2Y.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleEmergency = () => {
    // This could link to emergency protocols or quick start guide
    router.push('/emergency' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Climate-themed Background */}
      <AnimatedLinearGradient
        colors={['#1e3c72', '#2a5298', '#4a90e2']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Weather/Climate Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.delay(index * 150).springify()}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height * 0.8,
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                backgroundColor: index % 3 === 0 ? '#4FC3F7' : 
                               index % 3 === 1 ? '#81C784' : '#FFB74D',
                opacity: Math.random() * 0.6 + 0.2,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        {/* Emergency Alert Icon */}
        <Animated.View 
          style={[styles.emergencyContainer, pulseAnimatedStyle]}
          entering={FadeIn.duration(1000)}
        >
          <Ionicons name="warning" size={40} color="#FF6B6B" />
          <Text style={styles.emergencyText}>Be Prepared. Stay Safe.</Text>
        </Animated.View>

        {/* Lottie Animation - Climate/Weather themed */}
        <Animated.View 
          entering={SlideInRight.springify().damping(15)}
          style={styles.animationContainer}
        >
          <LottieView
            source={require('../assets/animations/weather.json')} // You can use weather, safety, or preparation animations
            autoPlay
            loop
            style={styles.lottie}
          />
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>ClimateGuard</Text>
          <Text style={styles.subtitle}>Disaster Preparedness</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View 
          style={[styles.subtitleContainer, subtitleAnimatedStyle]}
          entering={SlideInLeft.delay(400).springify()}
        >
          <Text style={styles.description}>
            Your trusted companion for climate disaster preparation and emergency response
          </Text>
        </Animated.View>

        {/* Emergency Quick Action */}
        <AnimatedTouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergency}
          entering={SlideInRight.delay(500).springify()}
        >
          <Ionicons name="alert-circle" size={24} color="#fff" />
          <Text style={styles.emergencyButtonText}>Emergency Protocols</Text>
        </AnimatedTouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <AnimatedTouchableOpacity
            style={[styles.primaryButton, button1AnimatedStyle]}
            onPress={handleGetStarted}
            entering={SlideInRight.delay(600).springify()}
          >
            <LinearGradient
              colors={['#4CAF50', '#2E7D32']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="shield-checkmark" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Get Prepared</Text>
            </LinearGradient>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            style={[styles.secondaryButton, button2AnimatedStyle]}
            onPress={handleSignIn}
            entering={SlideInLeft.delay(700).springify()}
          >
            <Ionicons name="log-in" size={20} color="#2a5298" />
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </AnimatedTouchableOpacity>
        </View>

        {/* Features List - Climate Focused */}
        <Animated.View 
          style={styles.featuresContainer}
          entering={FadeIn.delay(1000).springify()}
        >
          {[
            { icon: '🌀', text: 'Storm Alerts', color: '#4FC3F7' },
            { icon: '🔥', text: 'Fire Safety', color: '#FF6B6B' },
            { icon: '🚨', text: 'Quick Response', color: '#FFA726' },
          ].map((feature, index) => (
            <Animated.View
              key={index}
              style={styles.featureItem}
              entering={SlideInRight.delay(1200 + index * 200).springify()}
            >
              <Text style={[styles.featureIcon, { color: feature.color }]}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Safety Tip */}
        <Animated.View 
          style={styles.safetyTip}
          entering={FadeIn.delay(1500).springify()}
        >
          <Ionicons name="information-circle" size={16} color="#4FC3F7" />
          <Text style={styles.safetyTipText}>
            Always have an emergency kit ready
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.05,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  emergencyContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  subtitleContainer: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 16,
    marginBottom: 30,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#2a5298',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  safetyTip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4FC3F7',
  },
  safetyTipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '400',
  },
});