import React from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import Messages from './Messages'
import EditThread from './EditThread'

const Stack = createStackNavigator()
export default function ChatNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name='-' component={Messages} />
      <Stack.Screen
        name="EditThread"
        component={EditThread}
        options={{...TransitionPresets.SlideFromRightIOS,}}
      />
    </Stack.Navigator>
  )
}
