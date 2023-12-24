import { conversationActions } from "../actions/conversationAction";

const initState = {
    conversations: null,
    conversationSelected: null,
    popoverId: "",
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case conversationActions.SET_CONVERSATION:
            return {
                ...state,
                conversations: action.conversations,
            };
        case conversationActions.SET_SELECT_CONVERSATION:
            return {
                ...state,
                conversationSelected: action.conversationSelected,
            };
        case conversationActions.SET_POPOVER_ID:
            return {
                ...state,
                popoverId: action.id,
            };
        case conversationActions.SEND_NEW_MESSAGE:
            let copyConversations = [...state.conversations];
            let newConversation = action.newConversation;
            for (let index in copyConversations) {
                if (copyConversations[index]._id === newConversation._id) {
                    copyConversations[index] = newConversation;
                }
            }
            return {
                ...state,
                conversations: copyConversations,
            };
        case conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES:
            var { listMessage, conversationId } = action;
            var conversationsCopy = [...state.conversations];
            for (let index in conversationsCopy) {
                if (conversationsCopy[index]._id === conversationId) {
                    for (let i in conversationsCopy[index].messages) {
                        let message = conversationsCopy[index].messages[i];
                        for (let mesInList of listMessage) {
                            if (message.date == mesInList.date) {
                                message.status = "3";
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                conversations: conversationsCopy,
            };
        case conversationActions.SET_STATUS_SENT_FOR_MESSAGES:
            var { listMessage, conversationId } = action;
            var conversationsCopy = [...state.conversations];
            for (let index in conversationsCopy) {
                if (conversationsCopy[index]._id === conversationId) {
                    for (let i in conversationsCopy[index].messages) {
                        let message = conversationsCopy[index].messages[i];
                        for (let mesInList of listMessage) {
                            if (message.date == mesInList.date) {
                                message.status = "1";
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                conversations: conversationsCopy,
            };
        case conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES:
            var { listMessage, conversationId } = action;
            var conversationsCopy = [...state.conversations];
            for (let index in conversationsCopy) {
                if (conversationsCopy[index]._id === conversationId) {
                    for (let i in conversationsCopy[index].messages) {
                        let message = conversationsCopy[index].messages[i];
                        for (let mesInList of listMessage) {
                            if (message.date == mesInList.date) {
                                message.status = "2";
                            }
                        }
                    }
                }
            }
            return {
                ...state,
                conversations: conversationsCopy,
            };
        default:
            return state;
    }
};

export default reducer;
