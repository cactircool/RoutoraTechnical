import { getItem, setItem } from "expo-secure-store"
import { useState } from 'react'
import firebase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get, getDatabase, IteratedDataSnapshot, query } from 'firebase/database'
import 'firebase/firestore'
import { getFirestore, addDoc, collection, where, getDocs, doc, getDoc, updateDoc, initializeFirestore } from "firebase/firestore";
import * as Crypto from 'expo-crypto'

export interface ToDoItem {
    creationTime: number
    completionTime?: number
    title: string
    description: string 
    location?: {
        latitude: number,
        longitude: number
    }
    priority?: number // [0, 1, 2, 3, 4]
    complete: boolean
}

export interface User {
    username: string
    hashedPassword: string
    items: ToDoItem[]
}

export const API_KEY = 'enter_api_key';

const firebaseConfig = {
    apiKey: "AIzaSyAZ8d4Gea5tdTNxR1IiK0LQMHDBQYvEb0Y",
    authDomain: "fret-fa3f4.firebaseapp.com",
    projectId: "fret-fa3f4",
    storageBucket: "fret-fa3f4.appspot.com",
    messagingSenderId: "1038773012854",
    appId: "1:1038773012854:web:043d1da85151c80e451257",
    measurementId: "G-VXVR2WXL1Y"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { ignoreUndefinedProperties: true, })
// db = getFirestore(app);

let docId: string | undefined;
export function getDocId(): string {
    return docId!;
}

export async function updateUser(user: User) {
    const docRef = doc(db, 'users', getDocId());
    console.log(user);
    await updateDoc(docRef, user as { [key: string]: any });
}

export async function authenticate(username: string, password: string, register: boolean): Promise<User | undefined> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef as any, where('username', '==', username) as any);
    const snippet = await getDocs(q as any);

    if (register) {
        if (snippet.size !== 0)
            return undefined;
        
        const data = {
            username: username,
            hashedPassword: await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password),
            items: [],
        };
        const docRef = await addDoc(usersRef, data);
        docId = docRef.id;
        return data;
    }

    // hash password and make call to firebase to validate attempt
    if (snippet.size > 1) // under failed auth conditions
        return undefined;

    let user: User | undefined;
    snippet.forEach(child => {
        let obj = child.data() as any;
        user = {
            username: obj.username,
            hashedPassword: obj.hashedPassword,
            items: obj.items,
        };
        docId = child.id;
        return true;
    })

    if (user?.hashedPassword !== (await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password)))
        return undefined;

    /*
    {
        username: 'arhuan',
        hashedPassword: '',
        items: [
            {
                creationTime: new Date(Date.now()).getTime(),
                completionTime: new Date(Date.now() + 86_400_000).getTime(), // 86,400,000 ms in 1 day
                title: 'Hello world!',
                description: 'Goodbye world!',
                location: {
                    latitude: 37.422131,
                    longitude: -122.084801,
                },
                priority: 1,
                complete: false,
            },
            {
                creationTime: new Date(Date.now() + 100).getTime(),
                completionTime: new Date(Date.now() + 86_400_000).getTime(), // 86,400,000 ms in 1 day
                title: 'Hello world2!',
                description: 'Goodbye world!',
                location: {
                    latitude: 37.422131,
                    longitude: -122.086801,
                },
                priority: 3,
                complete: false,
            },
            {
                creationTime: new Date(Date.now() + 100).getTime(),
                completionTime: new Date(Date.now() + 86_500_000).getTime(), // 86,400,000 ms in 1 day
                title: 'Hello world2!',
                description: 'Goodbye world!',
                location: {
                    latitude: 37.422131,
                    longitude: -122.089801,
                },
                priority: 3,
                complete: false,
            }
        ],
    }
    */
    

    return user; // You're broke at the moment so all authentication works
}
