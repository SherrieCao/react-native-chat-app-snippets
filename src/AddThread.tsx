import React, {useContext, useState} from 'react'
import {View, StyleSheet, KeyboardAvoidingView} from 'react-native'
import {useSelector} from 'react-redux'
import Header from '../../../components/Header/Header'
import {
  DMSearch,
  GCSearch,
} from '../../../components/Layout/AddThreadSearchUsers'
import Colors from '../../../constants/Colors'
import {CreateGCContext} from './AddGroupChat/GroupChatNav'

export const AddDM = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Header text={'New Chat'} navigation={navigation} nextScreen={false} />
      <DMSearch navigation={navigation} />
    </View>
  )
}

export const AddGroupChat = ({navigation}) => {
  const {state, updateState} = useContext(CreateGCContext)
  const user = useSelector((state) => state.user)
  const pressNext = () => {
    state.members.find((member) => member.id === user.id)
      ? navigation.navigate('CreateName')
      : alert('Oops! You are not in this chat!')
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <Header
        text={'Add Group Members'}
        navigation={navigation}
        nextOnPress={pressNext}
      />
      <GCSearch />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {backgroundColor: Colors.background, flex: 1},
})
