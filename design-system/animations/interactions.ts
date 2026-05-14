import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

export const usePressAnimation = (scale: number = 0.97) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: scale,
      duration: 90,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, scale]);

  const onPressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return {
    pressStyle: { transform: [{ scale: scaleAnim }] },
    onPressIn,
    onPressOut,
  };
};

export const usePulseAnimation = (duration: number = 1000) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startPulse = useCallback(() => {
    loopRef.current?.stop();
    pulseAnim.setValue(1);

    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );

    loopRef.current.start();
  }, [duration, pulseAnim]);

  const stopPulse = useCallback(() => {
    loopRef.current?.stop();
    loopRef.current = null;
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  return {
    pulseStyle: { transform: [{ scale: pulseAnim }] },
    startPulse,
    stopPulse,
  };
};

export const useSpinAnimation = (duration: number = 1000) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startSpin = useCallback(() => {
    loopRef.current?.stop();
    spinAnim.setValue(0);

    loopRef.current = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    );

    loopRef.current.start();
  }, [duration, spinAnim]);

  const stopSpin = useCallback(() => {
    loopRef.current?.stop();
    loopRef.current = null;
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return {
    spinStyle: { transform: [{ rotate: spin }] },
    startSpin,
    stopSpin,
  };
};
