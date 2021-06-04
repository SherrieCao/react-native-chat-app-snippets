import moment from 'moment'
import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from 'react-native'
import {useSelector} from 'react-redux'
import {SubHeading} from '../../../components/Typography/Heading'
import Colors from '../../../constants/Colors'
import {GetDMTitle, GetOtherUserID} from '../../../util/ThreadFuncs'
import {chooseThread} from '../../redux/actions/threads'

const GroupChatCoverImage = ({item}) => {
  const membersInfoArr = Object.values(item.members)
  const numOfMembers = membersInfoArr.length
  const numOfColumn = Math.ceil(Math.sqrt(numOfMembers))
  if (numOfMembers > 9) {
    membersInfoArr.splice(9)
  } //Only showing first 9 members of any group chat.
  return (
    <FlatList
      data={membersInfoArr}
      numColumns={numOfColumn}
      keyExtractor={(item, index) => 'key' + index}
      renderItem={({item}) => (
        <Image
          source={{uri: item.imageURL}}
          style={{
            width: 56 / numOfColumn,
            height: 56 / numOfColumn,
            margin: 0.5,
            borderRadius: 1,
          }}
        />
      )}
      contentContainerStyle={styles.threadCoverImage}
      style={{
        backgroundColor: Colors.EvenlighterBlueGrey,
        marginLeft: 10,
        overflow: 'hidden',
        borderRadius: 10,
      }}
    />
  )
}

const today = ((d) => new Date(d.toDateString()))(new Date())
const yesterday = new Date(today.getTime() - 86400000)

function showMRMDate(item, yesterday, today) {
  let dateString = ''
  const mRMdate = item.mostRecentMessage.date
  if (mRMdate < yesterday) {
    dateString = moment(mRMdate).format('YYYY-MM-DD')
  } else if (mRMdate < today) {
    dateString = 'yesterday'
  } else {
    dateString = moment(mRMdate).format('hh:mm A')
  }
  return dateString
}

const ThreadPreview = ({item, title}) => (
  <View style={styles.content}>
    <View style={{flexDirection: 'row'}}>
      <SubHeading
        text={title.length > 20 ? title.slice(0, 23) + '...' : title}
        padding={'none'}
        color={'primaryDark'}
      />
      <Text
        style={[
          styles.contentText,
          {fontSize: 12, position: 'absolute', right: 0},
        ]}>
        {showMRMDate(item, yesterday, today)}
      </Text>
    </View>
    <Text style={styles.contentText}>{item.mostRecentMessage.text}</Text>
  </View>
)

export const GroupChat = ({navigation, dispatch, item}) => (
  <TouchableOpacity
    onPress={() => {
      dispatch(chooseThread(item))
      navigation.navigate('Messages')
    }}x>
    <View style={styles.row}>
      <GroupChatCoverImage item={item} />
      {/* <Image
        source={{uri: avatorPlaceholder}}
        style={{
          width: 56,
          height: 56,
          borderRadius: 30,
          marginLeft: 10,
        }}
      /> */}
      <ThreadPreview item={item} title={item.groupTitle} />
    </View>
  </TouchableOpacity>
)

export const DirectMessage = ({navigation, dispatch, item, userID}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(chooseThread(item))
        navigation.navigate('Messages')
      }}>
      <View style={styles.row}>
        <Image
          source={{
            uri: item.members[GetOtherUserID(userID, item.membersArr)].imageURL,
          }}
          style={styles.threadCoverImage}
        />
        <ThreadPreview
          item={item}
          title={GetDMTitle(userID, item.membersArr, item.members)}
        />
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  row: {
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 10,
    alignItems: 'stretch',
    flex: 1,
  },
  contentText: {
    fontFamily: 'Light',
    color: '#949494',
    fontSize: 16,
    marginTop: 2,
  },
  threadCoverImage: {width: 56, height: 56, borderRadius: 10, marginLeft: 10},
})
