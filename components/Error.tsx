import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from './ThemedText'
import { styles } from '@/constants/Styles'

export default function Error(props: { message?: string }) {
    return (
        <SafeAreaView style={[ styles.flex1, styles.center ]}>
            <ThemedText>{ props.message ?? 'Error #idk' }</ThemedText>
        </SafeAreaView>
    )
}