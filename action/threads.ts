export const LOAD_THREADS = 'LOAD_THREADS'
export const CHOOSE_THREAD = 'CHOOSE_THREAD'
export const CREATE_THREAD = 'CREATE_THREAD'
export const DELETE_THREAD = 'DELETE_THREAD'
export const UPDATE_THREAD = 'UPDATE_THREAD'

import {firestore} from '../../../networkUtil/firebaseUtils'
import firebase from 'firebase'
import _ from 'lodash'

export const loadThreadsFromServer = (threads) => {
  return {
    type: LOAD_THREADS,
    payload: threads,
  }
}

export const chooseThread = (thread) => async (dispatch) => {
  return dispatch({type: CHOOSE_THREAD, payload: {thread}})
}

export const leaveThread = (threadId, userID) => async (dispatch) => {
    try {
      const updates = {}
      updates[`members.${userID}`] = firebase.firestore.FieldValue.delete()
      updates['updatedAt'] = firebase.firestore.FieldValue.serverTimestamp()
      await firestore
        .collection('thread_definitions')
        .doc(threadId)
        .update(updates)
      dispatch({type: DELETE_THREAD, id: threadId})
    } catch (error) {
      console.log(error)
    }
  }


export const updateThread = (threadID, fieldToUpdate, updateValue) => {
  return {type: UPDATE_THREAD, payload: {threadID, fieldToUpdate, updateValue}}
}

export const createThread = async (
  selectedUsers: Array<{
    id: string
    firstName: string
    lastName: string
    imageURL: string
  }>, //First in [users] has to be the current user who is creating the thread.
  currentUser,
  type: 0 | 1,
  groupTitle = 'Group Chat'
) => {
  //If there is no user id...FIND OUT WHY!
  if (selectedUsers.length <= 0) {
    return null
  }
  const newThreadRef = await firestore.collection('thread_definitions').doc()
  // const threadMessagesRef = firestore.collection('thread_messages').doc(newThreadRef.id).collection('messages')
  // threadMessagesRef.doc('001').set({'init': true})
  let thread = {}
  let members = {}
  thread['id'] = newThreadRef.id
  thread['createdBy'] = selectedUsers[0].id
  thread['mostRecentMessage'] = {
    text: '',
    date: new Date(),
    sender: currentUser.id,
  }
  //get a map of members
  selectedUsers.forEach(
    (user) =>
      (members[user.id] = {
        firstName: user.firstName,
        lastName: user.lastName,
        imageURL: user.imageURL,
        //threadTitle: user.firstName + ' ' + user.lastName
      })
  )
  thread['members'] = members
  if (type === 0) {
    thread['type'] = 0
  } else {
    thread['type'] = 1
    thread['groupTitle'] = groupTitle
  }
  await newThreadRef.set(thread)

  thread['membersArr'] = Object.keys(members)

  return thread
}

export const PressOnUserToInitiateChat = async (
  selectedUser,
  currentUser,
  loadedThreads,
  dispatch
) => {
  //Before user gets to createThread, make sure this thread actually needs to be created.
  const FindExistedThreadIndex = loadedThreads.findIndex((thread_info) =>
    _.isEqual(
      thread_info.membersArr.sort(),
      [selectedUser.id, currentUser.id].sort()
    )
  )
  if (FindExistedThreadIndex >= 0) {
    dispatch(chooseThread(loadedThreads[FindExistedThreadIndex]))
    return loadedThreads[FindExistedThreadIndex]
  }

  const member = (user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageURL: user.imageURL,
  })

  const selectedUsers = [member(currentUser), member(selectedUser)]
  const thread = await createThread(selectedUsers, currentUser, 0)
  dispatch({type: CREATE_THREAD, payload: thread})
  dispatch(chooseThread(thread))
  return thread
}

export const creatGroupChat = async (
  selectedMembers,
  currentUser,
  groupTitle,
  dispatch
) => {
  const thread = await createThread(selectedMembers, currentUser, 1, groupTitle)
  dispatch({type: CREATE_THREAD, payload: thread})
  dispatch(chooseThread(thread))
}
