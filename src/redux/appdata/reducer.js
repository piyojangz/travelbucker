export const initialState = {
  user: undefined,
  activetrip: undefined,
  symbol: undefined,
  total: 0,
  invitecount: 0,
  chartdata: {
    food: 1
    , drink: 1
    , rest: 3
    , power: 4
    , ticket: 5
    , activity: 6
    , other: 7
  }

};

export default function appdataReducer(state = initialState, action) {
  switch (action.type) {
    case 'USER':
      if (action.user) {
        return {
          ...state,
          user: action.user,
        };
      }
    case 'ACTIVETRIP':
      if (action.activetrip) {
        return {
          ...state,
          activetrip: action.activetrip,
        };
      }
    case 'CHARTDATA':
      if (action.chartdata) {
        return {
          ...state,
          chartdata: action.chartdata,
        };
      }
    case 'TOTAL':
      if (action.total) {
        return {
          ...state,
          total: action.total,
        };
      }
    case 'SYMBOL':
      if (action.symbol) {
        return {
          ...state,
          symbol: action.symbol,
        };
      }
    case 'INVITECOUNT':
      if (action.invitecount) {
        return {
          ...state,
          invitecount: action.invitecount,
        };
      }
    default:
      return state;
  }
}
