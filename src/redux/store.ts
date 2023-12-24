import { composeWithDevTools } from "redux-devtools-extension";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import todoReducer from "./reducers/todoReducer";
import authReducer from "./reducers/authReducer";
import tabsReducer from "./reducers/tabsReducer";
import modalReducer from "./reducers/modalReducer";
import friendReducer from "./reducers/friendReducer";
import conversationReducer from "./reducers/conversationReducer";
import messageReducer from "./reducers/messageReducer";
import themeReducer from "./reducers/themeReducer";

const rootReducer = combineReducers({
    todo: todoReducer,
    auth: authReducer,
    tabs: tabsReducer,
    modal: modalReducer,
    friend: friendReducer,
    conversation: conversationReducer,
    message: messageReducer,
    themeMode: themeReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export type RootState = ReturnType<typeof store.getState>;
