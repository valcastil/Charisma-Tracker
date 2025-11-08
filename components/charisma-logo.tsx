import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CharismaLogoProps {
  size?: number;
}

export function CharismaLogo({ size = 50 }: CharismaLogoProps) {
  const logoSize = size;
  const fontSize = size * 0.65;
  const lineWidth = size * 0.06;
  const lineHeight = size * 0.15;
  const lineSpacing = size * 0.02;

  return (
    <View style={[styles.container, { width: logoSize, height: logoSize }]}>
      <LinearGradient
        colors={['#F4C542', '#FFD93D', '#A8E063']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}>
        
        {/* Bitcoin-style C with two vertical lines */}
        <View style={styles.iconContainer}>
          {/* Top vertical line 1 */}
          <View style={[
            styles.line,
            {
              width: lineWidth,
              height: lineHeight,
              position: 'absolute',
              top: '20%',
              left: '50%',
              marginLeft: -lineWidth * 1.5,
            }
          ]} />
          
          {/* Top vertical line 2 */}
          <View style={[
            styles.line,
            {
              width: lineWidth,
              height: lineHeight,
              position: 'absolute',
              top: '20%',
              left: '50%',
              marginLeft: lineWidth * 0.5,
            }
          ]} />
          
          {/* C Letter */}
          <Text style={[styles.logoText, { fontSize }]}>C</Text>
          
          {/* Bottom vertical line 1 */}
          <View style={[
            styles.line,
            {
              width: lineWidth,
              height: lineHeight,
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              marginLeft: -lineWidth * 1.5,
            }
          ]} />
          
          {/* Bottom vertical line 2 */}
          <View style={[
            styles.line,
            {
              width: lineWidth,
              height: lineHeight,
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              marginLeft: lineWidth * 0.5,
            }
          ]} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logoText: {
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -2,
  },
  line: {
    position: 'absolute',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
});
