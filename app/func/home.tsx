import { StyleSheet, Platform, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { styles } from '@/constants/Styles'
import { ToDoItem, } from '@/constants/Authenticate'
import MapView from 'react-native-maps'
import ThemedMarker from '@/components/ThemedMarker'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useTheme } from '@react-navigation/native'
import { EventRegister } from 'react-native-event-listeners'
import 'react-native-get-random-values'
import ThemedBottomSheet from '@/components/ThemedBottomSheet'
import { Ionicons } from '@expo/vector-icons'
import { useUserContext } from '@/hooks/useUserContext'
import { requestForegroundPermissionsAsync } from 'expo-location'

// DateTimePickerAndroid.open(AndroidNativeProps)
// DateTimePickerAndroid.dismiss(mode: AndroidNativeProps['mode'])

export default function Home() {
    const { user, setUser } = useUserContext();
    const mapRef = useRef<MapView>(null);
    const [currentItem, setCurrentItem] = useState<{ item: ToDoItem, index: number } | undefined>(undefined);
    const { dark, colors } = useTheme()

    const [initialRegion, setInitialRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: .05,
        longitudeDelta: .05,
    })
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        altitude: 0,
    });

    async function locationManager() {
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') 
            return;
    
        // TODO: uncomment
        // let location = await getCurrentPositionAsync({});
        let location = {
            coords: {
                latitude: 37.422131, 
                longitude: -122.084801,
                altitude: 0,
            }
        }
        setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude ?? 0,
        });
        setInitialRegion({
            ...initialRegion,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        mapRef.current?.animateToRegion({
            ...initialRegion,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    }

    useEffect(() => {
        locationManager();
    }, [user, setUser]);

    function markerClickHandler(item: ToDoItem, index: number) {
        return () => {
            EventRegister.emit('openBottomSheet');
            setCurrentItem({ item, index });
        };
    }

    function addToDoItem() {
        user.items.push({
            creationTime: Date.now(),
            completionTime: undefined,
            title: '',
            description: '',
            location: undefined,
            priority: undefined,
            complete: false,
        });
        setCurrentItem({ item: user.items[user.items.length - 1], index: user.items.length - 1 });
        EventRegister.emit('openBottomSheet');
        setUser({ ...user });
    }

    const s = StyleSheet.create({
        homeRoot: {
            position: 'relative',
        },

        addButton: {
            position: 'absolute',
            bottom: 10,
            right: 10,

            ...Platform.select({
                ios: {
                    marginBottom: 40,
                },
                default: {
                    marginBottom: 20,
                }
            }),

            padding: 10,
            borderRadius: 30,
            backgroundColor: colors.primary,
            ...styles.v,
            justifyContent: 'center',
            alignItems: 'center',

            elevation: 2,
            shadowColor: colors.text,
            shadowOpacity: .5,
            shadowRadius: 1,
            shadowOffset: { width: 0, height: 2 },
        }
    })

    return (
        <GestureHandlerRootView style={[ styles.flex1, s.homeRoot ]}>
            <MapView 
                ref={mapRef}
                style={[ styles.flex1, ]}
                initialRegion={initialRegion}>

                { 
                    user.items.map((item, index) => {
                        return (
                            item.location && !item.complete ? <ThemedMarker key={index} item={item} onPress={markerClickHandler(item, index)} /> : null
                        );
                    })
                }

            </MapView>

            <Pressable onPress={addToDoItem} style={[ s.addButton ]}>
                <Ionicons name='add-outline' size={40} color={colors.text} />
            </Pressable>

            <ThemedBottomSheet children={undefined} currentItem={currentItem} setCurrentItem={setCurrentItem} />
        </GestureHandlerRootView>
    )
}