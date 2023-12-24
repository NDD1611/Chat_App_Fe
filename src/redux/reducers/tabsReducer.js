import { tabsActions } from "../actions/tabsAction";
const initState = {
    breakPointMobile: 700,
    maintabSelect: "Conversations",
    countAnnounceMessage: 0,
    showTabTwo: true,
    showTabThree: true,
    showTabOne: true,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case tabsActions.SET_MAIN_TAB:
            return {
                ...state,
                maintabSelect: action.maintabSelect,
            };
        case tabsActions.SET_COUNT_ANNOUNCE_MESSAGE:
            return {
                ...state,
                countAnnounceMessage: action.countAnnounceMessage,
            };
        case tabsActions.SET_SHOW_TAB_ONE:
            return {
                ...state,
                showTabOne: true,
            };
        case tabsActions.SET_SHOW_TAB_TWO:
            return {
                ...state,
                showTabTwo: true,
            };
        case tabsActions.SET_SHOW_TAB_THREE:
            return {
                ...state,
                showTabThree: true,
            };
        case tabsActions.SET_CLOSE_TAB_ONE:
            return {
                ...state,
                showTabOne: false,
            };
        case tabsActions.SET_CLOSE_TAB_TWO:
            return {
                ...state,
                showTabTwo: false,
            };
        case tabsActions.SET_CLOSE_TAB_THREE:
            return {
                ...state,
                showTabThree: false,
            };
        default:
            return state;
    }
};

export default reducer;
