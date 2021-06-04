import React from 'react'
import {Bubble, MessageText} from 'react-native-gifted-chat'
import Colors from '../../../constants/Colors'

export const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      textStyle={{fontFamily: 'Light'}}
      wrapperStyle={{
        left: {
          padding: 3,
          backgroundColor: Colors.EvenlighterBlueGrey,
          borderRadius: 18,
        },
        right: {
          marginRight: 10,
          padding: 3,
          backgroundColor: 'rgba(0,122,255,0.7)',
          borderRadius: 18,
        },
      }}
    />
  )
}

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    customTextStyle={{fontSize: 16, lineHeight: 22, fontFamily: 'Light'}}
  />
)
