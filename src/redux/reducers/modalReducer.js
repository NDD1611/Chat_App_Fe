import { modalActions } from "../actions/modalActions";

const initState = {
    showModalFindFriend: false,
    showModalInfo: false,
    showModalUpdateInfo: false,
    showModalCreateGroup: false,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case modalActions.SET_SHOW_MODAL_FIND_FRIEND:
            return {
                ...state,
                showModalFindFriend: true,
            };
        case modalActions.SET_HIDE_MODAL_FIND_FRIEND:
            return {
                ...state,
                showModalFindFriend: false,
            };
        case modalActions.SET_SHOW_MODAL_INFO:
            return {
                ...state,
                showModalInfo: true,
            };
        case modalActions.SET_HIDE_MODAL_INFO:
            return {
                ...state,
                showModalInfo: false,
            };
        case modalActions.SET_SHOW_MODAL_UPDATE_INFO:
            return {
                ...state,
                showModalUpdateInfo: true,
            };
        case modalActions.SET_HIDE_MODAL_UPDATE_INFO:
            return {
                ...state,
                showModalUpdateInfo: false,
            };
        case modalActions.SET_SHOW_MODAL_CREATE_GROUP:
            return {
                ...state,
                showModalCreateGroup: true,
            };
        case modalActions.SET_HIDE_MODAL_CREATE_GROUP:
            return {
                ...state,
                showModalCreateGroup: false,
            };
        default:
            return state;
    }
};

export default reducer;
