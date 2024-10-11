import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '@/constants/Styles'
import { ThemedText } from '@/components/ThemedText'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'
import { getItem } from 'expo-secure-store'
import { updateUser, User } from '@/constants/Authenticate'
import { UserProvider, useUserContext } from '@/hooks/useUserContext'
import { EventRegister } from 'react-native-event-listeners'

export default function Layout() {
  const userString = getItem('fret_user');
  if (!userString) {
    alert('User could not be found');
    throw new Error('User could not be found');
  }
  const [user, _setUser] = useState(JSON.parse(userString) as User);
  const setUser = (_: User) => {
    _setUser(_);
    updateUser(_);
  }

  useEffect(() => {
    const handlers = [
      EventRegister.addEventListener('deleteItem', data => {
          if (data.index !== undefined) {
              user.items.splice(data.index, 1)
          }
          setUser({ ...user });
      }),
      EventRegister.addEventListener('saveCurrentItem', (item) => {
          if (!item)
              return;
          user.items[item.index] = item.item;
          setUser({ ...user });
      }),
      EventRegister.addEventListener('completeItem', (item) => {
          user.items[item.index].complete = true;
          setUser({ ...user });
      }),
    ]

    return () => {
        for (const handler of handlers)
            EventRegister.removeEventListener(handler as string);
    }
  }, [user, setUser])

  return (
    <UserProvider user={user} setUser={setUser}>
      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }} tabBar={props => <TabBar {...props} />}>
          <Tabs.Screen name='home' />
          <Tabs.Screen name='list' />
      </Tabs>
    </UserProvider>
  )
}