import { View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTextInput } from '@/components/ThemedTextInput'
import { styles } from '@/constants/Styles'
import { AnimatedThemedText } from '@/components/AnimatedThemedText'
import { useTheme } from '@react-navigation/native'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import { authenticate } from '@/constants/Authenticate'

const COMMON_AUTH_WRAPPER_PADDING = 10;
const COMMON_BORDER_RADIUS = 5;

export default function Login() {
    const { dark, colors } = useTheme();
    const [value, setValue] = useState({
        username: '',
        password: '',
    });

    const s = StyleSheet.create({
        pageWrapper: {
            gap: 20,
        },
    
        title: {
            fontSize: 64,
        },
    
        authWrapper: {
            gap: 15,
            ...styles.v, 
            ...styles.maxw,
            padding: COMMON_AUTH_WRAPPER_PADDING,
        },
    
        authInput: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: COMMON_BORDER_RADIUS,
            ...styles.maxw,
            padding: 15,
            fontSize: 18,
        },

        buttonsWrapper: {
            ...styles.h,
            ...styles.maxw,
            gap: 10,
        },

        buttonWrapperCommon: {
            borderRadius: COMMON_BORDER_RADIUS,
            flex: 1,
            ...styles.center,
            paddingVertical: 25,
        },

        registerButtonWrapper: {
            borderWidth: 1,
            borderColor: colors.border,
        },

        loginButtonWrapper: {
            backgroundColor: colors.primary,
            borderRadius: COMMON_BORDER_RADIUS,
        },

        buttonText: {
            fontSize: 20,
        },
    })

    async function login() {
        const user = await authenticate(value.username, value.password, false);
        if (!user) {
            alert('Invalid login credentials');
            return;
        }

        // reroute to home page and pass in user somehow
        SecureStore.setItem('fret_user', JSON.stringify(user));
        router.push('/func/home');
    }

    return (
        <SafeAreaView style={[ styles.flex1, styles.center, s.pageWrapper ]}>
            <ThemedText type='title' style={[ s.title, ]}>fret</ThemedText>

            <View style={[ s.authWrapper, ]}>
                <ThemedTextInput 
                    style={[ s.authInput, ]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='username' 
                    value={value.username}
                    onChangeText={text => setValue({ ...value, username: text })}/>
                <ThemedTextInput 
                    style={[ s.authInput, ]}
                    secureTextEntry
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='password' 
                    value={value.password}
                    onChangeText={text => setValue({ ...value, password: text })}/>

                <View style={[ s.buttonsWrapper, ]}>
                    <Pressable style={[ s.registerButtonWrapper, s.buttonWrapperCommon ]} onPress={() => router.push('/auth/register')}>
                        <ThemedText type='defaultSemiBold' style={[ s.buttonText ]}>register</ThemedText>
                    </Pressable>

                    <Pressable style={[ s.loginButtonWrapper, s.buttonWrapperCommon ]} onPress={login}>
                        <ThemedText flip type='defaultSemiBold' style={[ s.buttonText ]}>login</ThemedText>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}