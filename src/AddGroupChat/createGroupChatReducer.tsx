export const UPDATE_NAME = 'UPDATE_NAME'
export const ADD_MEMBER = 'ADD_VIEWER'
export const DELETE_MEMBER = 'DELETE_VIEWER'

const createGCReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_NAME:
      return {
        ...state,
        groupTitle: action.payload,
      }
    case ADD_MEMBER:
      const {id, firstName, lastName,imageURL} = action.payload
      return {
        ...state,
        members: state.members.concat({
          id,
          firstName,
          lastName,
          imageURL,
        }),
      }
    case DELETE_MEMBER:
      return {
        ...state,
        members: state.members.filter(
          (member) => member.id !== action.payload.id
        ),
      }
    default:
      return state
  }
}

export default createGCReducer
