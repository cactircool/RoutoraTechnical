import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '@/constants/Styles';

export default function Loading() {
    const [ellipses, setEllipses] = useState('');

    useEffect(() => {
        const interval = setInterval(() => setEllipses(ellipses === '...' ? '' : `${ellipses}.`), 1000);
        return () => clearInterval(interval);
    }, [ellipses]);

    return (
        <SafeAreaView style={[ styles.flex1, styles.center ]}>
            <Text>Loading{ellipses}</Text>
        </SafeAreaView>
    )
}