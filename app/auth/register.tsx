import { View, Text, StyleSheet, Pressable, Dimensions, Platform, TextStyle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTextInput } from '@/components/ThemedTextInput'
import { styles } from '@/constants/Styles'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { AnimatedThemedText } from '@/components/AnimatedThemedText'
import { useTheme } from '@react-navigation/native'
import { router } from 'expo-router'
import { setItem } from 'expo-secure-store'
import { authenticate } from '@/constants/Authenticate'

const COMMON_AUTH_WRAPPER_PADDING = 10;
const COMMON_BORDER_RADIUS = 5;

export default function Register() {
    const { dark, colors } = useTheme();
    const [value, setValue] = useState({
        email: '',
        validEmail: undefined,
        phoneNumber: '',
        validPhone: undefined,
        username: '',
        validUsername: undefined as boolean | undefined,
        password: '',
        validPassword: undefined,
        rePassword: '',
        validRePassword: undefined,
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

        invalidInput: {
            borderColor: colors.notification,
        },

        validInput: {
            borderColor: colors.primary,
        },
    })

    async function register() {
        // create user on database asynchronously
        // route to home page and pass in user somehow

        const user = await authenticate(value.username, value.password, true)!;

        // reroute to home page and pass in user somehow
        setItem('fret_user', JSON.stringify(user));
        router.push('/func/home');
    }

    async function validateUsername(username: string) {
        return true;
    }

    const f = (x: boolean | undefined) => x !== undefined && !x ? s.invalidInput : x ? s.validInput : undefined;
    const dv = (prop: 'email' | 'phoneNumber' | 'username' | 'password' | 'rePassword', a: (text: string) => boolean) => 
        (text: string) => {
            setValue({ ...value, [prop]: text, [prop === 'phoneNumber' ? 'validPhone' : `valid${prop[0].toUpperCase()}${prop.substring(1)}`]: a(text) })
        }

    function isValidPassword(password: string) {
        // Define your password requirements here
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        // Check if the password meets all requirements
        return password.length >= minLength &&
                hasUpperCase &&
                hasLowerCase &&
                hasNumber &&
                hasSpecialChar;
    }

    return (
        <SafeAreaView style={[ styles.flex1, styles.center, s.pageWrapper ]}>
            <ThemedText type='title' style={[ s.title, ]}>fret</ThemedText>

            <View style={[ s.authWrapper, ]}>
                <ThemedTextInput 
                    style={[ s.authInput, f(value.validEmail) ]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='email' 
                    value={value.email}
                    onChangeText={dv('email', (text: string) => (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).test(text))}/>
                <ThemedTextInput 
                    style={[ s.authInput, f(value.validPhone) ]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='phone' 
                    keyboardType='numeric'
                    value={value.phoneNumber}
                    onChangeText={dv('phoneNumber', (text: string) => (/^(?!.*911.*\d{4})((\+?1[\/ ]?)?(?![\(\. -]?555.*)\( ?[2-9][0-9]{2} ?\) ?|(\+?1[\.\/ -])?[2-9][0-9]{2}[\.\/ -]?)(?!555.?01..)([2-9][0-9]{2})[\.\/ -]?([0-9]{4})$/).test(text))}/>
                <ThemedTextInput 
                    style={[ s.authInput, f(value.validUsername) ]}
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='username' 
                    value={value.username}
                    onChangeText={(text: string) => {
                        setValue({ ...value, username: text });
                        validateUsername(text).then(val => setValue({ ...value, username: text, validUsername: val }));
                    }}/>
                <ThemedTextInput 
                    style={[ s.authInput, f(value.validPassword) ]}
                    secureTextEntry
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='password' 
                    value={value.password}
                    onChangeText={dv('password', (text: string) => isValidPassword(text))}/>
                <ThemedTextInput 
                    style={[ s.authInput, f(value.validRePassword) ]}
                    secureTextEntry
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder='retype password' 
                    value={value.rePassword}
                    onChangeText={dv('rePassword', (text: string) => isValidPassword(text) && text === value.password)}/>

                <View style={[ s.buttonsWrapper, ]}>
                    <Pressable style={[ s.registerButtonWrapper, s.buttonWrapperCommon ]} onPress={() => router.push('/auth/login')}>
                        <ThemedText type='defaultSemiBold' style={[ s.buttonText ]}>login</ThemedText>
                    </Pressable>

                    <Pressable style={[ s.loginButtonWrapper, s.buttonWrapperCommon ]} onPress={register}>
                        <ThemedText flip type='defaultSemiBold' style={[ s.buttonText ]}>register</ThemedText>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}