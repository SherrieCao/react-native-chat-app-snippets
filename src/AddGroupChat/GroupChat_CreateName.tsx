import React, {useContext} from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import Header from '../../../../components/Header/Header'
import HorizonalFlatlistOfUsers from '../../../../components/Layout/HorizontalFlatlistOfUsers'
import Colors from '../../../../constants/Colors'
import {creatGroupChat} from '../../../redux/actions/threads'
import {UPDATE_NAME} from './createGroupChatReducer'
import {CreateGCContext} from './GroupChatNav'

const CreateName = ({navigation}) => {
  const {state, updateState} = useContext(CreateGCContext)
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  return (
    <View style={{flex: 1}}>
      <Header
        text={'Give it a kick@$$ name'}
        navigation={navigation}
        nextScreen={false}
      />
      <HorizonalFlatlistOfUsers state={state} updateState={updateState} />
      <TextInput
        value={state.groupTitle}
        style={styles.textInput}
        onChangeText={(text) => updateState({type: UPDATE_NAME, payload: text})}
        placeholder={'Brainstorm SQUAD'}
        textAlign={'center'}
        numberOfLines={1}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          creatGroupChat(
            state.members,
            user,
            state.groupTitle,
            dispatch
          ).then(() => navigation.navigate('Messages'))
        }}>
        <Text style={styles.btnText}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    top: 50,
    backgroundColor: '#fff',
    fontSize: 35,
    borderRadius: 18,
    paddingVertical: 10,
    borderColor: Colors.BlueGrey100,
    borderWidth: 0.8,
    width: Dimensions.get('screen').width * 0.9,
    alignSelf: 'center',
    height: 75,
  },
  btnText: {
    color: Colors.primary,
    fontFamily: 'Medium',
    fontSize: 24,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CreateName
