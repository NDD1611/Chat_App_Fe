import { authActions } from "../actions/authAction";

const initState = {
    userDetails: {},
    activeUsers: [],
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case authActions.SET_USER_DETAIL:
            return {
                ...state,
                userDetails: action.userDetails,
            };
        case authActions.SET_ACTIVE_USER:
            return {
                ...state,
                activeUsers: action.activeUsers,
            };
        default:
            return state;
    }
};

export default reducer;
