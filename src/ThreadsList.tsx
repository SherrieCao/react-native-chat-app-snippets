import React, {useState, useEffect} from 'react'
import {firestore} from '../../../networkUtil/firebaseUtils'
import {
  StyleSheet,
  ActivityIndicator,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native'
import Constants from 'expo-constants'
import {useDispatch, useSelector} from 'react-redux'
import {HeadingMed} from '../../../components/Typography/Heading'
import {loadThreadsFromServer} from '../../redux/actions/threads'
import Separator from '../../../components/Layout/Separator'
import {GroupChat, DirectMessage} from './renderList'
import {Ionicons} from '@expo/vector-icons'
import Colors from '../../../constants/Colors'
import Modal from 'react-native-modal'
import {BSThread} from '../../../models/BSThread'
import firebase from 'firebase'

const BottomPopUpMenu = ({isVisible, toggleModal, navigation}) => {
  return (
    <Modal
      isVisible={isVisible}
      style={styles.bottomPopUpMenu}
      backdropTransitionOutTiming={0}
      onBackdropPress={toggleModal}>
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 8,
        }}>
        <TouchableOpacity
          onPress={() => {
            toggleModal()
            navigation.navigate('AddDM')
          }}>
          <Text style={styles.bottomPopUpMenuText}>DIRECT MESSAGE</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          onPress={() => {
            toggleModal()
            navigation.navigate('AddGroupChat')
          }}>
          <Text style={styles.bottomPopUpMenuText}>GROUP CHAT</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const ThreadsList = ({navigation}) => {
  const threads = useSelector((store) => store.threads.conversations)
  const [threadsSorted, setThreadsSorted] = useState(threads)
  const user = useSelector((store) => store.user)
  const [loading, setLoading] = useState(true)
  const [isBottomPopUpMenuVisible, setBottomPopUpMenuVisible] = useState(false)
  const toggleBottomPopUpMenu = () => {
    setBottomPopUpMenuVisible(!isBottomPopUpMenuVisible)
  }
  const dispatch = useDispatch()

  useEffect(() => {
    firestore
      .collection('thread_definitions')
      .where(`members.${user.id}`, '!=', false) //Only get threads with current user
      .get()
      .then((querySnapshot) => {
        const threads = querySnapshot.docs.map((doc) => {
          const membersArr = Object.keys(doc.data().members)
          const {id, createdBy, members, mostRecentMessage, type} = doc.data()
          mostRecentMessage['date'] = new firebase.firestore.Timestamp(
            mostRecentMessage.date.seconds,
            mostRecentMessage.date.nanoseconds
          ).toDate()
          let groupTitle
          type === 0 ? (groupTitle = '') : (groupTitle = doc.data().groupTitle)
          const bsThread = new BSThread(
            id,
            createdBy,
            members,
            membersArr,
            mostRecentMessage,
            groupTitle,
            type
          )
          return bsThread
        })
        dispatch(loadThreadsFromServer(threads))
        if (loading) {
          setLoading(false)
        }
      })
  }, [])

  useEffect(() => {
    setThreadsSorted(
      threads.sort(function (a, b) {
        return b.mostRecentMessage.date - a.mostRecentMessage.date
      })
    )
  }, [threads])

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.Header}>
        <HeadingMed text={'Chat'} color="dark" padding="med" />
        <Ionicons
          style={styles.Btn}
          onPress={() => {
            setBottomPopUpMenuVisible(true)
          }}
          name="add-circle-outline"
          size={35}
          color={Colors.Dark}
        />
      </View>
      <FlatList
        style={{paddingTop: 2}}
        data={threadsSorted}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({item}) => {
          return item.type === 0 ? (
            <DirectMessage
              navigation={navigation}
              dispatch={dispatch}
              item={item}
              userID={user.id}
            />
          ) : (
            <GroupChat
              navigation={navigation}
              dispatch={dispatch}
              item={item}
            />
          )
        }}
      />
      <BottomPopUpMenu
        isVisible={isBottomPopUpMenuVisible}
        toggleModal={toggleBottomPopUpMenu}
        navigation={navigation}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  Header: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
    top: 0,
    left: 0,
    flexDirection: 'row',
    elevation: 4,
    shadowOpacity: 0.2948,
    shadowColor: '#BDC4D4',
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  row: {
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flexShrink: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
  },
  nameText: {
    fontFamily: 'Regular',
    fontSize: 18,
    color: '#000',
  },
  dateText: {},
  contentText: {
    fontFamily: 'Light',
    color: '#949494',
    fontSize: 16,
    marginTop: 2,
  },
  Btn: {right: 20, position: 'absolute', bottom: 10, zIndex: 999},
  bottomPopUpMenu: {justifyContent: 'flex-end', margin: 0, padding: 0},
  bottomPopUpMenuText: {
    fontFamily: 'Regular',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 15,
    marginHorizontal: 40,
  },
})
export default ThreadsList
