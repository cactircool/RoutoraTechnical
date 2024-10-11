import { View, Text, TouchableOpacity, StyleSheet, Pressable, Platform, Keyboard } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { styles } from '@/constants/Styles';
import { useTheme } from '@react-navigation/native';
import TabBarIcon from './TabBarIcon';
import { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { useUserContext } from '@/hooks/useUserContext';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { user, setUser } = useUserContext();
    const { dark, colors } = useTheme();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        const hideEvent = EventRegister.addEventListener('hideTabBar', () => setHide(true));
        const showEvent = EventRegister.addEventListener('showTabBar', () => setHide(false));

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
            EventRegister.removeEventListener(hideEvent as string);
            EventRegister.removeEventListener(showEvent as string);
        };
    }, [user, setUser]);

    const s = StyleSheet.create({
        barWrapper: {
            gap: 40,
            padding: 20,
            borderRadius: 30,
            borderWidth: 1,
            borderColor: colors.border,
            elevation: 2,
            ...styles.h,
            ...Platform.select({
                ios: {
                    marginBottom: 40,
                },
                default: {
                    marginBottom: 20,
                }
            }),
            backgroundColor: colors.background,
            shadowColor: colors.text,
            shadowOpacity: .5,
            shadowRadius: 1,
            shadowOffset: { width: 0, height: 2 },
        },

        barWrapperWrapper: {
            position: 'absolute',
            bottom: 0,
            pointerEvents: 'box-none',
        }
    })

    function iconName(route: string) {
        if (route === 'home')
            return 'planet-outline';
        else if (route === 'list')
            return 'list-outline';
        return 'hammer-outline'
    }

    if (isKeyboardVisible || hide)
        return null;

    return (
        <View style={[ styles.maxw, styles.center, styles.h, s.barWrapperWrapper ]}>
            <View style={[ s.barWrapper, ]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <Pressable
                            onPress={onPress}
                            onLongPress={onLongPress}
                            accessibilityRole="button"
                            key={route.key}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                        >
                            <TabBarIcon size={32} name={iconName(route.name) as any} inFocus={isFocused} />
                        </Pressable>
                    );
                })}
        </View>
    </View>
  );
}