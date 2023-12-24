import { todoActions } from "../actions/todoAction";

const initState = {
    counter: 0,
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case todoActions.INCREAMENT:
            return {
                ...state,
                counter: state.counter + 1,
            };
        case todoActions.DECREAMENT:
            return {
                ...state,
                counter: state.counter - 1,
            };
        default:
            return state;
    }
};

export default reducer;
