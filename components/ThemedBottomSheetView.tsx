import { View, Text, Platform, StyleSheet, FlatList, Pressable, Alert, AlertButton } from 'react-native'
import React, { useState } from 'react'
import { API_KEY, ToDoItem } from '@/constants/Authenticate'
import { styles } from '@/constants/Styles'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import ThemedDatePicker from './ThemedDatePicker'
import { ThemedTextInput } from './ThemedTextInput'
import { useTheme } from '@react-navigation/native'
import { BottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types'
import { SelectList } from 'react-native-dropdown-select-list'
import { Ionicons } from '@expo/vector-icons'
import { EventRegister } from 'react-native-event-listeners'

export type ThemedBottomSheetViewProps = BottomSheetViewProps & {
    currentItem: { item: ToDoItem, index: number } | undefined,
    setCurrentItem: (_: { item: ToDoItem, index: number } | undefined) => void,
    saveCurrentItem: boolean,
    setSaveCurrentItem: (_: boolean) => void,
}

export default function ThemedBottomSheetView({ currentItem, setCurrentItem, saveCurrentItem, setSaveCurrentItem, ...rest }: ThemedBottomSheetViewProps) {
    const { dark, colors } = useTheme();

    let data = []
    for (let i = 1; i < 7; ++i) {
        let str = ''
        for (let j = 0; j < i; ++j)
            str += '!';
        data.push({ key: i, value: str })
    }

    const s = StyleSheet.create({
        bottomSheetView: {
            gap: 10,
            padding: 15,
            position: 'relative',
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

    function itemDeletionHandler() {
        Alert.alert('Delete item?', 'Deleted items cannot be restored', [
            {
                text: 'Cancel',
                onPress: value => {},
                isPreferred: true,
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: value => {
                    EventRegister.emit('deleteItem', {
                        index: currentItem ? currentItem.index : undefined,
                    });
                    setSaveCurrentItem(false);
                    EventRegister.emit('closeBottomSheet', null);
                },
                style: 'destructive',
            }
        ]);
    }

    function itemCompletionHandler() {
        console.log(currentItem, 'is complete');
        EventRegister.emit('completeItem', currentItem);
        EventRegister.emit('closeBottomSheet', null);
    }

    if (!currentItem)
        return <BottomSheetView style={[ styles.v, s.bottomSheetView ]} {...rest} />;

    return (
        <BottomSheetView style={[ styles.v, s.bottomSheetView ]} {...rest}>
            <View style={[ styles.h, styles.maxw, { gap: 10 } ]}>
                <Pressable style={[ styles.flex1, styles.h, { justifyContent: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: colors.primary } ]} onPress={itemCompletionHandler}>
                    <Ionicons color={colors.text} size={28} name='checkmark-outline' />
                </Pressable>
                <Pressable style={[ styles.flex1, styles.h, { justifyContent: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: colors.notification } ]} onPress={itemDeletionHandler}>
                    <Ionicons color='white' size={28} name='trash-outline' />
                </Pressable>
            </View>
            <ThemedTextInput 
                style={[ s.bottomSheetInput ]} 
                type='title' 
                placeholder='title' 
                multiline={true}
                value={currentItem!.item.title}
                onChangeText={text => setCurrentItem({ item: { ...currentItem!.item, title: text }, index: currentItem!.index })} />
            <ThemedTextInput 
                style={[ s.bottomSheetInput ]} 
                type='defaultSemiBold' 
                placeholder='description' 
                value={currentItem!.item.description}
                multiline={true}
                onChangeText={text => setCurrentItem({ item: { ...currentItem!.item, description: text }, index: currentItem!.index })} />
            <VirtualizedList>
                <GooglePlacesAutocomplete 
                    placeholder='location'
                    query={{ key: API_KEY }}
                    fetchDetails={true}
                    onPress={locationPressHandler(currentItem, setCurrentItem)}
                    onFail={error => console.error(error)}
                    onNotFound={() => console.log('no results')} 
                    textInputProps={{
                        placeholderTextColor: Platform.OS === 'android' ? colors.border : undefined,
                    }}
                    styles={{
                        textInput: {
                            ...s.bottomSheetInput,
                            fontFamily: 'Roboto_400Regular',
                        },
                        row: {
                            backgroundColor: colors.background,
                            color: colors.text,
                            fontFamily: 'Roboto_400Regular',
                            borderWidth: 0,
                            borderColor: colors.border,
                        },
                        description: {
                            backgroundColor: colors.background,
                            color: colors.text,
                            fontFamily: 'Roboto_400Regular',
                        }
                    }} />
            </VirtualizedList>

            <ThemedDatePicker />

            <SelectList 
                setSelected={(val: number) => setCurrentItem(currentItem ? { ...currentItem, item: { ...currentItem.item, priority: val } } : undefined)}
                save='value'
                data={data}
                search={false}
                searchicon={<View></View>}
                defaultOption={(currentItem && currentItem.item.priority) ? data[currentItem.item.priority - 1] : undefined}
                boxStyles={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    padding: 0,
                    margin: 0,
                }}
                inputStyles={{
                    fontFamily: 'Roboto_400Regular',
                    color: colors.text,
                    fontSize: 16,
                    margin: 0,
                    padding: 0,
                }}
                dropdownStyles={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                }}
                dropdownTextStyles={{
                    fontFamily: 'Roboto_400Regular',
                    color: colors.text,
                    fontSize: 16,
                    margin: 0,
                    padding: 0,
                }}
                placeholder='priority' />
        </BottomSheetView>
    )
}

const VirtualizedList = ({children}: React.PropsWithChildren) => {
    return (
        <FlatList
            data={[]}
            keyExtractor={() => "key"}
            renderItem={null}
            ListHeaderComponent={
                <>{children}</>
            }
        />
    )
}

function locationPressHandler(currentItem: { item: ToDoItem, index: number }, setCurrentItem: (_: { item: ToDoItem, index: number }) => void) {
    return (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
        setCurrentItem({ 
            item: { 
                ...currentItem!.item, 
                location: (details ? { 
                    latitude: details.geometry.location.lat, 
                    longitude: details.geometry.location.lng 
                } : undefined) 
            }, 
            index: currentItem!.index
        })
    }
}