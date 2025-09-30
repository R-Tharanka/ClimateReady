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
  runOnJS,
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
  const backgroundRotation = useSharedValue(0);

  useEffect(() => {
    // Start animations when component mounts
    titleScale.value = withDelay(300, withSpring(1, { damping: 10 }));
    subtitleOpacity.value = withDelay(600, withSpring(1));
    button1Y.value = withDelay(800, withSpring(0, { damping: 12 }));
    button2Y.value = withDelay(900, withSpring(0, { damping: 12 }));
    
    // Continuous background rotation
    backgroundRotation.value = withSequence(
      withSpring(360, { damping: 20, stiffness: 50 }),
      withSpring(0, { damping: 20, stiffness: 50 })
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

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${backgroundRotation.value}deg` }],
  }));

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Animated Background */}
      <AnimatedLinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={[styles.background, backgroundAnimatedStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.delay(index * 100).springify()}
            style={[
              styles.particle,
              {
                left: Math.random() * width,
                top: Math.random() * height * 0.8,
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                opacity: Math.random() * 0.6 + 0.2,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        {/* Lottie Animation */}
        <Animated.View 
          entering={SlideInRight.springify().damping(15)}
          style={styles.animationContainer}
        >
          <LottieView
            source={require('../assets/animations/welcome.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.titleAccent}>AppName</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View 
          style={[styles.subtitleContainer, subtitleAnimatedStyle]}
          entering={SlideInLeft.delay(400).springify()}
        >
          <Text style={styles.subtitle}>
            Transform your experience with our cutting-edge platform
          </Text>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <AnimatedTouchableOpacity
            style={[styles.primaryButton, button1AnimatedStyle]}
            onPress={handleGetStarted}
            entering={SlideInRight.delay(600).springify()}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="rocket" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            style={[styles.secondaryButton, button2AnimatedStyle]}
            onPress={handleSignIn}
            entering={SlideInLeft.delay(700).springify()}
          >
            <Ionicons name="log-in" size={20} color="#667eea" />
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </AnimatedTouchableOpacity>
        </View>

        {/* Features List */}
        <Animated.View 
          style={styles.featuresContainer}
          entering={FadeIn.delay(1000).springify()}
        >
          {[
            { icon: '⚡', text: 'Lightning Fast' },
            { icon: '🔒', text: 'Secure & Private' },
            { icon: '🎯', text: 'Intuitive Design' },
          ].map((feature, index) => (
            <Animated.View
              key={index}
              style={styles.featureItem}
              entering={SlideInRight.delay(1200 + index * 200).springify()}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </Animated.View>
          ))}
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
    width: height * 2,
    height: height * 2,
    top: -height * 0.5,
    left: -width * 0.5,
    opacity: 0.1,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#667eea',
    borderRadius: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#333',
    textAlign: 'center',
  },
  titleAccent: {
    fontSize: 40,
    fontWeight: '700',
    color: '#667eea',
    textAlign: 'center',
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#667eea',
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
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
    borderRadius: 25,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});