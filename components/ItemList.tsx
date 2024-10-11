import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { API_KEY, ToDoItem } from '@/constants/Authenticate'
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import ItemGroup from './ItemGroup';
import { useUserContext } from '@/hooks/useUserContext';

export interface ItemListProps {
    items: ToDoItem[],
}

async function getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${API_KEY}`);
    let json = await res.json()
    if (json.status === 'OK') 
        return json?.results?.[0]?.formatted_address;
    throw new Error('not found');
}

async function getCurrentLocation() {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') 
        return;
    return await getCurrentPositionAsync({});
}

export default function ItemList({ items }: ItemListProps) {
    const { user, setUser } = useUserContext();
    let [buckets, setBuckets] = useState<{ [key: string]: ToDoItem[] }>({})
    const [locationLess, setLocationLess] = useState<ToDoItem[]>([]);

    async function groupItems() {
        buckets = {};
        const loc = await getCurrentLocation();
        let _items = items.sort((a, b) => {
            if (!a.location || !b.location || !loc)
                return 0
            return Math.sqrt(Math.pow(b.location.latitude - loc?.coords.latitude, 2) + Math.pow(b.location.longitude - loc?.coords.longitude, 2)) - Math.sqrt(Math.pow(a.location.latitude - loc?.coords.latitude, 2) + Math.pow(a.location.longitude - loc?.coords.longitude, 2))
        })
    
        const locationLess = _items.filter(item => item.location === undefined)
        _items = _items.filter(item => item.location !== undefined)

        for (let i = 0; i < _items.length; ++i) {
            let addr = await getAddressFromCoordinates(_items[i].location!.latitude, _items[i].location!.longitude);
            if (addr in buckets) {
                buckets[addr].push(_items[i]);
            } else {
                buckets[addr] = [_items[i]]
            }
        }

        setBuckets(buckets)
        setLocationLess(locationLess);
    }

    useEffect(() => {
        groupItems();
    }, [user, setUser]);

    return (
        <>
            { Object.entries(buckets).map(([addr, value], index) => <ItemGroup key={index} group={[ addr, (value ?? []).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)) ]} />) }
            { locationLess.length > 0 && <ItemGroup group={[ 'no location', locationLess ]} /> }
        </>
    )
}