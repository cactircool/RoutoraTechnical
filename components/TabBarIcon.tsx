import { View, Text } from 'react-native'
import React, { ComponentProps, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { IconProps } from '@expo/vector-icons/build/createIconSet'
import { useTheme } from '@react-navigation/native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUserContext } from '@/hooks/useUserContext'

export type TabBarIconProps = IconProps<ComponentProps<typeof Ionicons>['name']> & {
    inFocus: boolean
}

export default function TabBarIcon({ style, inFocus, ...rest }: TabBarIconProps) {
    const { dark, colors } = useTheme();
    const { user, setUser } = useUserContext();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value }
        ]
    }), [])

    useEffect(() => {
        if (inFocus)
            scale.value = withSpring(1.3);
        else
            scale.value = withSpring(1);
    }, [inFocus, user, setUser])

    return (
        <Animated.View style={[ animatedStyle ]}>
            <Ionicons color={inFocus ? colors.primary : colors.text} style={[style]} {...rest} />
        </Animated.View>
    )
}