export const initialState = {
  total: 35700,
  log: [], 
};

export default function appdataReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOTAL':
      return {
        ...state,
        total: state.total + action.total,
      }; 
    default:
      return state;
  }
}
