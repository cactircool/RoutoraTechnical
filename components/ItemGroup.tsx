import { View, Text, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { ToDoItem } from '@/constants/Authenticate'
import { styles } from '@/constants/Styles'
import { useTheme } from '@react-navigation/native'
import { ThemedText } from './ThemedText'
import { RadioButton } from 'react-native-paper';
import { useUserContext } from '@/hooks/useUserContext'
import { EventRegister } from 'react-native-event-listeners'

export interface ItemGroupProps {
    group: [string, ToDoItem[]]
}

export default function ItemGroup({ group }: ItemGroupProps) {
    const { dark, colors } = useTheme();
    group[1] = group[1].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

    const s = StyleSheet.create({
        groupWrapper: {
            gap: 10,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
        },

        item: {
            padding: 10,
            gap: 10,
            display: 'flex',
            alignItems: 'center',
        }
    })

    return (
        <View style={[ styles.maxw, styles.v, s.groupWrapper ]}>
            <ThemedText type='subtitle'>{group[0]}</ThemedText>

            <View style={[ styles.maxw, styles.v, s.groupWrapper ]}>
                { group[1].map((value, index) => (
                    <View key={index} style={[ styles.maxw, styles.h, s.item ]}>
                        {
                            Platform.OS !== 'ios' ? <RButton index={index} group={group} /> :
                            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 30 }}>
                                <RButton index={index} group={group} />
                            </View>
                        }
                        <ThemedText style={{ fontSize: 18, }} numberOfLines={1}>{'!'.repeat(value.priority ?? 0)} {value.title}</ThemedText>
                    </View>
                )) }
            </View>
        </View>
    )
}

function RButton({ group, index }: { group: [string, ToDoItem[]], index: number }) {
    const { colors, dark } = useTheme();
    const [checked, setChecked] = useState(group[1][index].complete);
    const { user, setUser } = useUserContext();

    function checkToggle() {
        for (let i = 0; i < user.items.length; ++i)
            if (user.items[i].creationTime === group[1][index].creationTime) {
                user.items[i].complete = !checked;
                break;
            }
        let checkedCopy = checked;
        setChecked(!checked);
        setUser(user);
        EventRegister.emit('forceListUpdate', checkedCopy);
    }

    return (
        <RadioButton 
            value={index.toString()} 
            status={checked ? 'checked' : 'unchecked'}
            onPress={checkToggle}
            color={colors.primary}
            uncheckedColor={colors.text} />
    );
}