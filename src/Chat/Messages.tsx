import React, {useState, useEffect, useCallback} from 'react'
import firebase from 'firebase'
import {Entypo, Ionicons} from '@expo/vector-icons'
import Constants from 'expo-constants'
import {View, StyleSheet, ActivityIndicator} from 'react-native'
import {GiftedChat} from 'react-native-gifted-chat'
import {HeadingMed} from '../../../../components/Typography/Heading'
import Colors from '../../../../constants/Colors'
import {useDispatch, useSelector} from 'react-redux'
import {firestore, addMessage} from '../../../../networkUtil/firebaseUtils'
import {renderBubble, renderMessageText} from '../MessageContainer'
//import AttachmentOptions from './AttachmentOptions'
import {
  renderInputToolbar,
  RenderActions,
  renderComposer,
  renderSend,
} from '../InputToolbar'
import {GetDMTitle} from '../../../../util/ThreadFuncs'
import {updateThread} from '../../../redux/actions/threads'
// import MessagesSideDrawerMenu from './EditThread'

GiftedChat.prototype.notifyInputTextReset = function () {
  if (this.props.onInputTextChanged && this.state.isInitialized === true) {
    this.props.onInputTextChanged('')
  }
}

const Messages = ({navigation}) => {
  let currThread = useSelector((store) => store.threads.currThread)
  const user = useSelector((store) => store.user)
  const [messages, setMessages] = useState([])
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = firestore
      .collection(`thread_messages/${currThread.id}/messages`)
      .orderBy('createdAt')
      .onSnapshot((snap) => {
        snap.docChanges().forEach(function (change) {
          if (change.type === 'added') {
            const messageItem = change.doc.data()
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, {
                ...messageItem,
                createdAt: new firebase.firestore.Timestamp(
                  messageItem.createdAt.seconds,
                  messageItem.createdAt.nanoseconds
                ).toDate(),
                user: {
                  _id: messageItem.user._id,
                  avatar: currThread.members[messageItem.user._id].imageURL,
                  name: currThread.members[messageItem.user._id].firstName,
                },
              })
            )
          }
        })
      })
    return () => unsubscribe()
  }, [])

  const onSend = useCallback(async (messages = []) => {
    setLoading(true)
    messages.forEach((message) => {
      let mRMUpdateText = ''
      if (message.messageType === 'image') {
        mRMUpdateText = '[image]'
      } else {
        mRMUpdateText =
          message.text.length > 33
            ? message.text.slice(0, 35) + '...'
            : message.text
      }
      const mostRecentMessageUpdate = {
        date: message.createdAt,
        sender: user.id,
        text: mRMUpdateText,
      }
      addMessage(currThread.id, message, mostRecentMessageUpdate).then(() =>
        setLoading(false)
      )
      dispatch(
        updateThread(
          currThread.id,
          'mostRecentMessage',
          mostRecentMessageUpdate
        )
      )
    })
  }, [])

  const renderFooter = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 10,
        }}>
        <ActivityIndicator size="small" color="#5500dc" animating={loading} />
      </View>
    )
  }

  const renderCustomActions = (props) => {
    return <RenderActions {...props} onSend={onSend} userID={user.id} />
  }

  const chatName =
    currThread.type === 0
      ? GetDMTitle(user.id, currThread.membersArr, currThread.members)
      : currThread.groupTitle

  return (
    <View style={{flex: 1}}>
      <View style={styles.heading}>
        <Ionicons
          name="chevron-back-circle-outline"
          size={32}
          color={Colors.primary}
          onPress={() => navigation.navigate('Home')}
          style={{marginLeft: 8, marginRight: 2}}
        />
        <View style={{flex: 1}}>
          <HeadingMed padding="small" color="dark" text={chatName} />
        </View>
        <Entypo
          name="dots-three-vertical"
          size={20}
          style={{
            color: Colors.BlueGrey600,
            paddingRight: 10,
          }}
          onPress={() =>
            navigation.navigate('EditThread', {
              chatName: chatName,
            })
          }
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.id, //Change this to user.id
          //avatar: user.imageURL
          //name: user.firstName
          //use BSThread?
          //Explore the possibility to fetch avatar&name from threads in redux
        }}
        isLoadingEarlier={true}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderComposer={renderComposer}
        renderSend={renderSend}
        listViewProps={{style: {marginBottom: 10}}}
        renderMessageText={renderMessageText}
        renderFooter={renderFooter}
        // renderUsernameOnMessage={true}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 18,
    paddingTop: Constants.statusBarHeight * 1.2,
    backgroundColor: 'white',
    alignItems: 'center',
  },
})
export default Messages
