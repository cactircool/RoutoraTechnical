import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import { User } from '@/constants/Authenticate';
import { getItem } from 'expo-secure-store';
import { styles } from '@/constants/Styles';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import ItemList from '@/components/ItemList';
import { EventRegister } from 'react-native-event-listeners';
import { useUserContext } from '@/hooks/useUserContext';

export interface Section {
    title: string
    content: React.JSX.Element,
}

export default function List() {
    const { user, setUser } = useUserContext();
    const [, force] = useReducer(x => x + 1, []);
    const [openData, setOpenData] = useState({
        incomplete: false,
        complete: false,
    })

    useEffect(() => {
        EventRegister.addEventListener('forceListUpdate', (complete) => {
            let copy = { ...openData };
            force();
            setOpenData(copy);
        })
    }, [user, setUser]);

    const s = StyleSheet.create({
        wrapper: {
            padding: 20,
            flex: 1,
            ...styles.maxw,
        },

        listTitle: {
            fontSize: 64,
        },

        accordionContent: {

        }
    })
    
    return (
        <SafeAreaView style={[ styles.flex1 ]}>
            <ScrollView style={[ s.wrapper ]}>
                <ThemedText type='title' style={[ s.listTitle, ]}>list</ThemedText>
                <Header title='incomplete' active={openData.incomplete} onPress={() => setOpenData({ ...openData, incomplete: !openData.incomplete })} />
                <Collapsible collapsed={!openData.incomplete}>
                    <ItemList key={user.items.filter(item => !item.complete).join(',')} items={user.items.filter(item => !item.complete)} />
                </Collapsible>

                <Header title='complete' active={openData.complete} onPress={() => setOpenData({ ...openData, complete: !openData.complete })} />
                <Collapsible collapsed={!openData.complete}>
                    <ItemList key={user.items.filter(item => item.complete).join(',')} items={user.items.filter(item => item.complete)} />
                </Collapsible>
            </ScrollView>
        </SafeAreaView>
    )
}

function Header({ title, active, onPress }: { title: string, active: boolean, onPress: () => void }) {
    const s = StyleSheet.create({
        accordHeader: {
            padding: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
    })

    return (
        <Pressable onPress={onPress}>
            <View style={[ styles.h, styles.maxw, s.accordHeader ]}>
                <ThemedText type='title'>{ title }</ThemedText>
                <Ionicons name={ active ? 'chevron-up-outline' : 'chevron-down-outline' } size={20} color="#bbb" />
            </View>
        </Pressable>
    )
}

function renderContent(seciton: Section, _: unknown, isActive: boolean) {
    const s = StyleSheet.create({
        contentView: {
            padding: 10,
            paddingLeft: 30,
        }
    })
    return (
        <View style={[ s.contentView, styles.maxw ]}>
            {seciton.content}
        </View>
    )
}