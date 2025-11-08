import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export function WhatsAppBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <ImageBackground
          source={require('../../assets/images/bg_doodle.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.darkOverlay} />
          <View style={styles.drawingOverlay} />
        </ImageBackground>
      </View>
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
}

// Fallback component if image is not available
export function WhatsAppBackgroundFallback({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.patternContainer}>
        {/* Create subtle dot pattern similar to WhatsApp */}
        {Array.from({ length: 50 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.patternDot,
              {
                left: (index * 37) % width,
                top: Math.floor(index * 37 / width) * 37,
                width: 4,
                height: 4,
                opacity: 0.04,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.overlay} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8, // Slightly increased opacity for darker look
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: '#161717', // Main background color
  },
  drawingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#242525', // Drawing/pattern color
    opacity: 0.6, // Increased opacity for more visibility
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  // Fallback styles
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternDot: {
    position: 'absolute',
    backgroundColor: '#242525', // Use drawing color for dots
    borderRadius: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});
