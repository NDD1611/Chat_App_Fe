import { friendActions } from "../actions/friendAction";

const initState = {
    selectItem: "listFriend",
    listFriends: [],
    pendingInvitations: [],
    isFriend: true,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case friendActions.SET_SELECT_ITEM_TAB_TWO:
            return {
                ...state,
                selectItem: action.selectItem,
            };
        case friendActions.SET_PENDING_INVITATION:
            return {
                ...state,
                pendingInvitations: action.pendingInvitations,
            };
        case friendActions.SET_LIST_FRIEND:
            return {
                ...state,
                listFriends: action.listFriends,
            };
        case friendActions.SET_IS_FRIEND:
            return {
                ...state,
                isFriend: true,
            };
        case friendActions.SET_IS_NOT_FRIEND:
            return {
                ...state,
                isFriend: false,
            };
        default:
            return state;
    }
};

export default reducer;
