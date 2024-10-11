import { View, Text, Platform, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { styles } from '@/constants/Styles';
import { ThemedText } from './ThemedText';
import { useTheme } from '@react-navigation/native';

export default function ThemedDatePicker() {
    const { dark, colors } = useTheme();
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time' | 'datetime' | 'countdown'>('date')
    const [date, setDate] = useState<Date>(new Date());

    const s = StyleSheet.create({
        datePickerView: {
            padding: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    })
    
    function dateChangeHandler(e: DateTimePickerEvent, d: Date | undefined) {
        // e.type == set | dismissed | neutral (android only)
        if (Platform.OS !== 'ios' && (e.type === 'set' || e.type === 'dismissed')) {
            if (mode === 'date') {
                setDate(d ?? new Date());
                setMode('time');
            } else {
                setDate(new Date(`${date.toDateString()} ${d ? d.toTimeString() : new Date(0).toTimeString()}`))
                setOpenDatePicker(false);
                setMode('date');
            }

            return;
        }

        if (e.type === 'set') 
            setDate(d ?? new Date());
    }

    if (Platform.OS === 'ios')
        return (
            <DateTimePicker 
                mode='datetime' 
                display='default' 
                value={date} 
                textColor={colors.text}
                accentColor={colors.primary}
                onChange={dateChangeHandler}/>
        );

    return (
        <View style={[ styles.maxw, styles.h, s.datePickerView ]}>
            <ThemedText>Complete by:</ThemedText>
            <Pressable onPress={() => setOpenDatePicker(true)}>
                <ThemedText style={{ paddingRight: 5, }}>{
                    date.toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: date.getFullYear() !== new Date(Date.now()).getFullYear() ? 'numeric' : undefined,
                        month: 'short',
                        day: 'numeric'
                    })
                }</ThemedText>
            </Pressable>

            {
                openDatePicker &&
                <DateTimePicker 
                    mode={mode} 
                    display='default' 
                    value={date} 
                    onChange={dateChangeHandler}/>
            }
        </View>
    );
}