import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    flex1: { flex: 1 },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    v: {
        flexDirection: 'column',
    },
    vr: {
        flexDirection: 'column-reverse',
    },
    h: {
        flexDirection: 'row',
    },
    hr: {
        flexDirection: 'row-reverse',
    },
    maxw: {
        width: '100%',
    },
    maxh: {
        height: '100%',
    },
    maxd: {
        height: '100%',
        width: '100%',
    },
})