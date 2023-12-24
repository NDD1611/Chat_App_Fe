import { themeActions } from "../actions/themeActions";

const initState = {
    theme: "light", // light, dark
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case themeActions.SET_LIGHT_THEME:
            return {
                ...state,
                theme: "light",
            };
        case themeActions.SET_DARK_THEME:
            return {
                ...state,
                theme: "dark",
            };
        default:
            return state;
    }
};

export default reducer;
