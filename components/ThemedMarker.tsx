import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { LatLng, MapMarkerProps, Marker, MarkerPressEvent } from 'react-native-maps'
import { ToDoItem } from '@/constants/Authenticate'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@react-navigation/native'
import { styles } from '@/constants/Styles'
import { ThemedText } from './ThemedText'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import Animated, { interpolateColor, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated'
import { EventRegister } from 'react-native-event-listeners'
import { useUserContext } from '@/hooks/useUserContext'

type ThemedMarkerProps = Omit<MapMarkerProps, 'coordinate'> & {
    item: ToDoItem
    coordinate?: LatLng
}

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export default function ThemedMarker({ item, coordinate = undefined, onPress, style, ...rest } : ThemedMarkerProps) {
    const { dark, colors } = useTheme()
    const [clicked, setClicked] = useState(false);
    const [markerColor, setMarkerColor] = useState(colors.primary);
    const { user, setUser } = useUserContext();
    const scale = useSharedValue(1);

    const s = StyleSheet.create({
        marker: {
            // position: 'relative'
        },

        markerIcon: {
            padding: 10,
        }
    })

    function pressHandler(e: MarkerPressEvent) {
        setClicked(!clicked);
        EventRegister.emit('isolateMarker', {
            id: item.creationTime,
        });
        if (onPress) onPress(e);
    }

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
        ],
    }), [user, setUser])

    useEffect(() => {
        if (clicked) // check this
            scale.value = withRepeat(withTiming(1.5, { duration: 350 }), -1, true);
        else 
            scale.value = withTiming(1, { duration: 350 });

        
        const handlers = [
            EventRegister.addEventListener('isolateMarker', data => {
                if (data.id && item.creationTime !== data.id) 
                    setClicked(false);
            }),
            EventRegister.addEventListener('bottomSheetClosed', () => setClicked(false)),
        ]

        return () => {
            handlers.forEach(handler => EventRegister.removeEventListener(handler as string))
        }
    }, [])

    return (
        <Marker onPress={pressHandler} style={[ s.marker, style ]} coordinate={coordinate ?? item.location ?? { longitude: 0, latitude: 0 }} {...rest}>
            <AnimatedIcon name='radio-button-on-outline' size={28 * (item.priority ? (1 + (item.priority / 5)) : 1)} style={[animatedStyle, s.markerIcon]} color={clicked ? colors.notification : colors.primary} />
        </Marker>
    )
}