import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';

type BackgroundVariant = 'soft' | 'bubbles' | 'closeup' | 'vivid';

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
  variant?: BackgroundVariant;
}

export function GradientBackground({ children, style, variant = 'bubbles', ...props }: GradientBackgroundProps) {
  const theme = useTheme();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
    },
    wash: {
      ...StyleSheet.absoluteFillObject,
      opacity: variant === 'soft' ? 0.52 : 0.86,
    },
    bottomFog: {
      position: 'absolute',
      left: -80,
      right: -80,
      bottom: -140,
      height: variant === 'closeup' ? '115%' : '58%',
      borderTopLeftRadius: 260,
      borderTopRightRadius: 260,
      backgroundColor: variant === 'vivid' ? 'rgba(77, 221, 196, 0.54)' : 'rgba(216, 246, 238, 0.58)',
    },
    lavenderCurve: {
      position: 'absolute',
      right: variant === 'closeup' ? -120 : -80,
      bottom: variant === 'closeup' ? 120 : 40,
      width: variant === 'closeup' ? 460 : 320,
      height: variant === 'closeup' ? 520 : 360,
      borderRadius: 260,
      backgroundColor: variant === 'vivid' ? 'rgba(177, 145, 255, 0.5)' : 'rgba(201, 187, 255, 0.34)',
    },
    plus: {
      position: 'absolute',
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '900',
      opacity: variant === 'soft' ? 0.55 : 0.86,
    },
    dots: {
      position: 'absolute',
      left: '24%',
      bottom: '17%',
      gap: 11,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,0.76)',
    },
    content: {
      flex: 1,
    },
  }), [variant]);

  const bubbleStyles = useMemo(() => createBubbleStyles(variant), [variant]);

  return (
    <View style={[styles.container, style]} {...props}>
      <LinearGradient
        colors={['#FFFFFF', '#F4F1FF', '#E7FBFF']}
        locations={variant === 'closeup' ? [0, 0.34, 1] : [0, 0.45, 1]}
        style={styles.wash}
      />
      <View style={styles.lavenderCurve} />
      <View style={styles.bottomFog} />
      {bubbleStyles.map((bubble, index) => (
        <LinearGradient
          key={index}
          colors={variant === 'vivid'
            ? ['#3159FF', '#24D4C2', '#B66DFF']
            : ['rgba(108,145,255,0.72)', 'rgba(118,244,198,0.58)', 'rgba(194,147,255,0.62)']}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.8, y: 1 }}
          style={bubble}
        />
      ))}
      {variant !== 'closeup' ? (
        <>
          <View style={styles.dots}>
            {[0, 1, 2, 3, 4].map((dot) => <View key={dot} style={styles.dot} />)}
          </View>
          <Text style={[styles.plus, { left: '4%', bottom: '36%' }]}>+</Text>
          <Text style={[styles.plus, { right: '37%', bottom: '33%' }]}>+</Text>
        </>
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

function createBubbleStyles(variant: BackgroundVariant) {
  const opacity = variant === 'soft' ? 0.3 : 0.74;
  const vivid = variant === 'vivid';
  const closeup = variant === 'closeup';

  const base = {
    position: 'absolute' as const,
    opacity,
  };

  if (closeup) {
    return [
      { ...base, width: 210, height: 210, borderRadius: 105, top: -48, left: -32 },
      { ...base, width: 290, height: 290, borderRadius: 145, top: 72, right: -72, opacity: 0.36 },
      { ...base, width: 410, height: 410, borderRadius: 205, top: 260, left: -130, opacity: 0.28 },
      { ...base, width: 95, height: 95, borderRadius: 48, top: 238, left: -34 },
    ];
  }

  return [
    { ...base, width: 84, height: 84, borderRadius: 42, bottom: vivid ? 14 : 28, left: -8 },
    { ...base, width: 64, height: 64, borderRadius: 32, bottom: vivid ? 70 : 140, left: 48 },
    { ...base, width: 84, height: 84, borderRadius: 42, bottom: vivid ? 92 : 112, right: -10 },
    { ...base, width: 62, height: 62, borderRadius: 31, bottom: vivid ? 66 : 64, right: 68 },
    { ...base, width: 28, height: 28, borderRadius: 14, bottom: vivid ? 198 : 184, left: -8 },
    { ...base, width: 44, height: 44, borderRadius: 22, bottom: vivid ? 238 : 248, right: 20 },
    { ...base, width: 90, height: 90, borderRadius: 45, bottom: vivid ? 132 : 120, left: 122, opacity: opacity * 0.44 },
    { ...base, width: 54, height: 54, borderRadius: 27, bottom: vivid ? 254 : 270, right: 18, opacity: opacity * 0.42 },
    { ...base, width: 62, height: 62, borderRadius: 31, bottom: vivid ? 288 : 310, left: -12, opacity: opacity * 0.32 },
    { ...base, width: 58, height: 58, borderRadius: 29, bottom: vivid ? 398 : 412, left: 48, opacity: opacity * 0.26 },
  ];
}
