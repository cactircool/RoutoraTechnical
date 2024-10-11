import { Text, type TextProps, StyleSheet } from 'react-native';
import { Roboto_100Thin, Roboto_100Thin_Italic, Roboto_300Light, Roboto_300Light_Italic, Roboto_400Regular, Roboto_400Regular_Italic, Roboto_500Medium, Roboto_500Medium_Italic, Roboto_700Bold, Roboto_700Bold_Italic, Roboto_900Black, Roboto_900Black_Italic } from "@expo-google-fonts/dev";

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

export type AnimatedThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function AnimatedThemedText({
  style,
  type = 'default',
  ...rest
}: AnimatedThemedTextProps) {
  const { dark, colors } = useTheme();

  return (
    <Animated.Text
      style={[
        { color: colors.text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Roboto_700Bold',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
  },
  link: {
    fontSize: 16,
    color: '#0a7ea4',
  },
});
