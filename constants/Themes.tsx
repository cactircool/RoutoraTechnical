import { Theme } from "@react-navigation/native";

export const dark: Theme = {
    dark: true,
    colors: {
        primary: '#5ECC74', // accent
        background: 'black',
        card: 'black',
        text: 'white',
        border: '#38353B',
        notification: '#D83909',
    }
}

export const light: Theme = {
    dark: false,
    colors: {
        primary: '#5ECC74', // accent
        background: 'white',
        card: 'white',
        text: 'black',
        border: '#A8A9B5',
        notification: '#29335C',
    }
}