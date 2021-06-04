/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {InputToolbar, Composer, Send, Actions} from 'react-native-gifted-chat'
import {Ionicons} from '@expo/vector-icons'
import Colors from '../../../constants/Colors'
import {pickImageAsync, takePictureAsync} from './mediaUtils'

export const renderInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: 'white',
      paddingVertical: 10,
    }}
    primaryStyle={{alignItems: 'center'}}
  />
)

export const RenderActions = (props) => {
  //const [cameraSelected, setCameraSelected] = useState(false)
  const {onSend, userID} = props
  return (
    <Actions
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      icon={() => (
        <Ionicons name="ios-camera-outline" size={24} color={Colors.Blue} />
      )}
      //onPressActionButton={() => setCameraSelected(true)}
      options={{
        'Choose From Photo Library': () => {
          pickImageAsync(onSend, userID)
          /*if (props.selectedImage !== null) {
            return <Image source={{uri: props.selectedImage.localUri}} />
          }*/
        },
        'Take a Photo': () => {
          takePictureAsync(onSend, userID)
        },
        Cancel: () => {},
      }}
      optionTintColor="#222B45"
    />
  )
} /*{
  return (
    <TouchableOpacity
      {...props}
      style={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 0,
      }}
      onPress={() => props.showAttachmentOptions(true)}>
      <Ionicons name="add-circle-outline" size={35} color={Colors.Dark} />
    </TouchableOpacity>
  )
}*/

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      backgroundColor: '#EDF1F7',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingVertical: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
      marginRight: 6,
      marginVertical:6
    }}
    //textInputAutoFocus={true} This might be a solution to keep keyboard up after sending a message.
  />
)

export const renderSend = (props) => (
  <Send
    {...props}
    disabled={!props.text}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    }}>
    <Ionicons name="ios-send" size={24} color={Colors.Blue} />
  </Send>
)
