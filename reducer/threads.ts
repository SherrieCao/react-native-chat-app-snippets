import {
  LOAD_THREADS,
  CHOOSE_THREAD,
  DELETE_THREAD,
  CREATE_THREAD,
  UPDATE_THREAD
} from '../actions/threads'
import {BSThread} from '../../../models/BSThread'

const initialState = {
  conversations: [],
  currThread: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_THREADS:
      return {
        ...state,
        conversations: [...action.payload],
      }
    case CHOOSE_THREAD:
      return {
        ...state,
        currThread: action.payload.thread,
      }
    case DELETE_THREAD:
      return {
        ...state,
        conversations: state.conversations.filter(
          (thread) => thread.id !== action.id
        ),
      }
      case UPDATE_THREAD:
        const index = state.conversations.findIndex(thread => thread.id === action.payload.threadID); //finding index of the item
        const newArray = [...state.conversations]; //making a new array
        newArray[index][action.payload.fieldToUpdate] = action.payload.updateValue//changing value in the new array
        return { 
         ...state, //copying the orignal state
         conversations: newArray, //reassingning todos to new array
        }
    case CREATE_THREAD:
      const newThread =
        new BSThread(
              action.payload.id,
              action.payload.createdBy,
              action.payload.members,
              action.payload.membersArr, 
              action.payload.mostRecentMessage,
              action.payload.groupTitle,
              action.payload.type
            )
      return {
        ...state,
        conversations: [...state.conversations, newThread],
        currThread: newThread,
      }
    default:
      return state
  }
}
