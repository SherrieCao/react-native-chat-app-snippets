import React, {useReducer, useMemo} from 'react'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {useSelector} from 'react-redux'

import {AddGroupChat} from '../AddThread'
import CreateName from './GroupChat_CreateName'
import createGCReducer from './createGroupChatReducer'

const MainStack = createStackNavigator()

export const CreateGCContext = React.createContext()
//Because we don't have a default value for our CountStateContext, we'll get an error on the highlighted line where we're destructing the return value of useContext.
//None of us likes runtime errors, so your knee-jerk reaction may be to add a default value to avoid the runtime error. However, what use would the context be if it didn't have an actual value? If it's just using the default value that's been provided, then it can't really do much good.

export default function GCCreatorStack() {
  const user = useSelector((store) => store.user)
  const {id, firstName, lastName, imageURL} = user 
  const [state, updateState] = useReducer(createGCReducer, {
    groupTitle: '',
    members: [{id, firstName, lastName, imageURL}],
  })

  const contextValue = useMemo(() => {
    return {state, updateState}
  }, [state, updateState])

  return (
    <CreateGCContext.Provider value={contextValue}>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <MainStack.Screen name="CreateUsers" component={AddGroupChat} />
        <MainStack.Screen name="CreateName" component={CreateName} />
      </MainStack.Navigator>
    </CreateGCContext.Provider>
  )
}
