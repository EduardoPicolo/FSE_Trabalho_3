export enum ACTIONS {
  ADD_DEVICE = 'ADD_DEVICE',
  REMOVE_DEVICE = 'REMOVE_DEVICE',
  UPDATE_DEVICE = 'UPDATE_DEVICE'
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
      return state.filter((device) => device.mac !== action.payload.mac)
    }

    case 'UPDATE_DEVICE': {
      const { mac, ...rest } = action.payload
      const index = state.findIndex((d) => d.mac === mac)
      const newState = [...state]
      newState[index] = { ...newState[index], ...rest }

      return newState
    }

    default:
      console.log('Invalid action')

      return state
      break
  }
}
