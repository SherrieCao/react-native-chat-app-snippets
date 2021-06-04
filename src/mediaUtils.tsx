import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Linking from 'expo-linking'
import {GiftedChat} from 'react-native-gifted-chat'

import {Alert} from 'react-native'
import {setFileURL} from '../../../networkUtil/firebaseUtils'

function sendImageMessage(uri, userID, onSend) {
  return setFileURL(uri)
    .then((url) => {
      const imageMessage = {}
      imageMessage['_id'] = GiftedChat.defaultProps.messageIdGenerator()
      imageMessage['createdAt'] = new Date()
      imageMessage['user'] = {
        _id: userID,
      }
      imageMessage['image'] = url
      imageMessage['messageType'] = 'image'
      onSend([imageMessage])
    })
    .catch((e) => {
      throw new Error('Uploading error: ' + e)
    })
}

export default async function getPermissionAsync(permission) {
  const {status} = await Permissions.askAsync(permission)
  if (status !== 'granted') {
    const permissionName = permission.toLowerCase().replace('_', ' ')
    Alert.alert(
      'Cannot be done 😞',
      `If you would like to use this feature, you'll need to enable the ${permissionName} permission in your phone settings.`,
      [
        {
          text: "Let's go!",
          onPress: () => Linking.openURL('app-settings:'),
        },
        {text: 'Nevermind', onPress: () => {}, style: 'cancel'},
      ],
      {cancelable: true}
    )

    return false
  }
  return true
}

export async function getLocationAsync(onSend) {
  if (await getPermissionAsync(Permissions.LOCATION)) {
    const location = await Location.getCurrentPositionAsync({})
    if (location) {
      onSend([{location: location.coords}])
    }
  }
}

export const pickImageAsync = async (onSend, userID) => {
  if (await getPermissionAsync(Permissions.MEDIA_LIBRARY)) {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.cancelled) {
      return sendImageMessage(result.uri, userID, onSend)
    }
  }
}

export async function takePictureAsync(onSend, userID) {
  if (await getPermissionAsync(Permissions.CAMERA)) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.cancelled) {
      return sendImageMessage(result.uri, userID, onSend)
    }
  }
}
