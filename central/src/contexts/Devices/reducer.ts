export enum ACTIONS {
  ADD_DEVICE = 'ADD_DEVICE',
  REMOVE_DEVICE = 'REMOVE_DEVICE'
}

type State = Device[]

type Action = {
  type: ACTIONS
  payload: any
}

export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_DEVICE': {
      return [...state, action.payload]
    }

    case 'REMOVE_DEVICE': {
    }

    default:
      console.log('Invalid action')

      return state
      break
  }
}
