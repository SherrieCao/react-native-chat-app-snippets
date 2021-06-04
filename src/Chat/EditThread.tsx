import React, {useEffect, useState} from 'react'
import {
  View,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native'
import Colors from '../../../../constants/Colors'
import HorizonalFlatlistOfUsersItem from '../../../../components/Layout/HorizonalFlatlistOfUsersItem'
import Separator from '../../../../components/Layout/Separator'
import Header from '../../../../components/Header/Header'
import {useDispatch, useSelector} from 'react-redux'
import {leaveThread} from '../../../redux/actions/threads'
import ContactProfileModal from '../../../../components/Layout/ContactProfileModal'
import {getUserInfoByID} from '../../../../networkUtil/firebaseUtils'

const EditThread = ({navigation}) => {
  const currThread = useSelector((store) => store.threads.currThread)
  const membersInfoList = Object.entries(currThread.members) //each element is a array: element[0] is userID and element[1] is an object {firstName, lastName, image}
  const user = useSelector((store) => store.user)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [selectedUserInfo, setSelectedUserInfo] = useState({
    id: '',
    imageURL: '',
    firstName: '',
    lastName: '',
    bio: 'loading...',
  })
  const dispatch = useDispatch()

  const toggleProfileModal = () => {
    setProfileModalVisible(!profileModalVisible)
  }

  membersInfoList.push([
    'addMember',
    {
      imageURL:
        'https://www.materialui.co/materialIcons/content/add_grey_192x192.png',
      firstName: '',
    },
  ])

  //Remove member in firestore/thread_definition, delete thread in store.threads.conversation, navigate back to Home.
  const PressDeleteAndLeave = () => {
    dispatch(leaveThread(currThread.id, user.id))
    navigation.navigate('Home')
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} nextScreen={false} text={'Chat Info'} />
      <FlatList
        data={membersInfoList}
        numColumns={4}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.memberListContainer}
        renderItem={({item}) => (
          <HorizonalFlatlistOfUsersItem
            closeBtn={false}
            item={{imageURL: item[1].imageURL, firstName: item[1].firstName}}
            onPress={() =>
              getUserInfoByID(item[0])
                .then((userInfo) => {
                  setSelectedUserInfo(userInfo)
                  toggleProfileModal()
                })
                .catch((e) => {
                  console.log(e)
                  alert('Please try again. ')
                })
            }
          />
        )}
      />
      <View
        style={{
          justifyContent: 'flex-end',
          margin: 10,
          backgroundColor: '#fff',
          borderRadius: 5,
        }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => alert('Need to set up feedback form here!')}>
          <Text style={{...styles.btnText, marginBottom: 0, fontSize: 16}}>
            Something's Wrong
          </Text>
          <Text style={styles.smallText}>
            Give Feedback and Report Conversation
          </Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          style={{...styles.btn, alignItems: 'center', paddingVertical: 20}}>
          <Text
            style={[styles.btnText, {color: Colors.borderRed}]}
            onPress={PressDeleteAndLeave}>
            Delete and Leave
          </Text>
        </TouchableOpacity>
      </View>
      <ContactProfileModal
        visibility={profileModalVisible}
        toggleModal={toggleProfileModal}
        navigation={navigation}
        selectedUser={selectedUserInfo}
      />
    </View>
  )
}

export default EditThread

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height,
    backgroundColor: Colors.background,
    flex: 1,
  },
  memberListContainer: {
    backgroundColor: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
    minWidth: Dimensions.get('screen').width - 20,
  },
  btn: {paddingVertical: 10, paddingHorizontal: 10},
  btnText: {
    color: Colors.Black,
    fontFamily: 'Regular',
    fontSize: 18,
  },
  smallText: {fontFamily: 'Light', color: Colors.Grey, fontSize: 12},
})
