import { Text, type TextProps, StyleSheet, TextInputProps, TextInput, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@react-navigation/native';

export type ThemedTextInputProps = TextInputProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedTextInput({
  style,
  placeholderTextColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
  const { dark, colors } = useTheme();

  return (
    <TextInput
      style={[
        { color: colors.text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      placeholderTextColor={placeholderTextColor ?? Platform.OS === 'android' ? colors.border : undefined }
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
