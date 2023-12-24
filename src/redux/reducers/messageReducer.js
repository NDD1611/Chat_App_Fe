import { messageActions } from "../actions/messageActions";

const initState = {
    maxWidth: 500,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case messageActions.SET_MAX_WIDTH_MESSAGE:
            return {
                ...state,
                maxWidth: action.maxWidth,
            };
        default:
            return state;
    }
};

export default reducer;
