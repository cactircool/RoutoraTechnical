import { View, Text, StyleSheet, Platform, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_KEY, ToDoItem } from '@/constants/Authenticate';
import { styles } from '@/constants/Styles';
import ThemedDatePicker from './ThemedDatePicker';
import { ThemedTextInput } from './ThemedTextInput';
import ThemedBottomSheetView from './ThemedBottomSheetView';
import { useUserContext } from '@/hooks/useUserContext';

export type ThemedBottomSheetProps = BottomSheetProps & {
    currentItem: { item: ToDoItem, index: number } | undefined,
    setCurrentItem: (_: { item: ToDoItem, index: number } | undefined) => void
}

export default function ThemedBottomSheet({ currentItem, setCurrentItem, ...rest }: ThemedBottomSheetProps) {
    const sheetRef = useRef<BottomSheet>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [saveCurrentItem, setSaveCurrentItem] = useState(true);
    const snapPoints = [ '40%', '90%' ]
    const { dark, colors } = useTheme();
    const { user, setUser } = useUserContext();

    useEffect(() => {
        const handlers = [
            EventRegister.addEventListener('openBottomSheet', () => {
                EventRegister.emit('hideTabBar');
                setOpenDrawer(true);
            }),
            EventRegister.addEventListener('closeBottomSheet', (item: typeof currentItem) => {
                if (saveCurrentItem) 
                    EventRegister.emit('saveCurrentItem', item);
                setOpenDrawer(false);
                EventRegister.emit('showTabBar');
                EventRegister.emit('bottomSheetClosed');
            }),
        ]

        return () => {
            handlers.forEach(handler => EventRegister.removeEventListener(handler as string));
        }
    }, [user, setUser]);

    const s = StyleSheet.create({
        bottomSheetBackground: {
            backgroundColor: colors.background,
        },

        bottomSheet: {

        },

        bottomSheetInput: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 10,
            backgroundColor: colors.background,
            color: colors.text,
        },
    });

    if (!openDrawer)
        return null;

    return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={[ s.bottomSheetBackground ]}
            style={[ s.bottomSheet ]}
            onClose={() => EventRegister.emit('closeBottomSheet', currentItem)}
            {...rest}
        >
            <ThemedBottomSheetView saveCurrentItem={saveCurrentItem} setSaveCurrentItem={setSaveCurrentItem} currentItem={currentItem} setCurrentItem={setCurrentItem} children={undefined} />
        </BottomSheet>
    );
}