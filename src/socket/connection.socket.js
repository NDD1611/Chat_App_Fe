import { io } from "socket.io-client";
import { logout } from "../utils/auth.util";
import { store } from "../redux/store";
import { authActions } from "../redux/actions/authAction";
import { friendActions } from "../redux/actions/friendAction";
import { conversationActions } from "../redux/actions/conversationAction";
import api from "../api/api";

export let socket = null;
export const socketConnectToServer = (userDetails) => {
    const tokensJson = localStorage.getItem("tokens");
    const tokens = tokensJson ? JSON.parse(tokensJson) : null;
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
            accessToken: tokens.accessToken,
            userDetails: userDetails,
        },
    });
    console.log("connect socket server");
    socket.on("connect", () => {
        console.log(socket.id);
    });
    socket.on("connect_error", async (err) => {
        if (err.message === "TokenExpire") {
            let userDetails = JSON.parse(localStorage.getItem("userDetails"));
            let response = await api.refreshToken(userDetails);
            if (response && response.data) {
                localStorage.setItem("userDetails", JSON.stringify(response.data.userDetails));
                socketConnectToServer(response.data.userDetails);
            }
        } else if (err.message !== "UserConnected") {
            logout();
        }
    });
    socket.on("update-friend-invitation", (data) => {
        const { pendingInvitations } = data;
        store.dispatch({
            type: friendActions.SET_PENDING_INVITATION,
            pendingInvitations: pendingInvitations,
        });
    });
    socket.on("update-conversation", (data) => {
        const { conversations } = data;
        store.dispatch({
            type: conversationActions.SET_CONVERSATION,
            conversations: conversations,
        });
    });
    socket.on("update-list-friend", (data) => {
        const { listFriends } = data;
        store.dispatch({
            type: friendActions.SET_LIST_FRIEND,
            listFriends: listFriends,
        });
    });
    socket.on("update-watched-status-message-in-redux-store", (data) => {
        const { listMessage, conversationId } = data;
        store.dispatch({
            type: conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES,
            listMessage,
            conversationId,
        });
    });
    socket.on("update-sent-status-message-in-redux-store", (data) => {
        const { listMessage, conversationId } = data;
        store.dispatch({
            type: conversationActions.SET_STATUS_SENT_FOR_MESSAGES,
            listMessage,
            conversationId,
        });
    });
    socket.on("update-received-status-message-in-redux-store", (data) => {
        const { listMessage, conversationId } = data;
        store.dispatch({
            type: conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES,
            listMessage,
            conversationId,
        });
    });
    socket.on("all-active-user", (data) => {
        const { activeUsers } = data;
        store.dispatch({
            type: authActions.SET_ACTIVE_USER,
            activeUsers: activeUsers,
        });
    });
    socket.on("update-friends-user-details", (data) => {
        const { friends } = data;
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        userDetails.friends = friends;
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
    });
    socket.on("update-token", (data) => {
        let { token } = data;
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        userDetails.token = token;
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
    });
    socket.on("sendOneMessage", (data) => {
        let { message } = data;
        let conversations = [...store.getState()?.conversation?.conversations];
        if (conversations && message) {
            for (let i = 0; i < conversations.length; i++) {
                let conversation = conversations[i];
                if (message.conversation._id == conversation._id) {
                    conversation.messages.push(message);
                }
            }
            store.dispatch({
                type: conversationActions.SET_CONVERSATION,
                conversations: conversations,
            });
        }
    });

    setInterval(() => {
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        socket.emit("check-token-expire", userDetails);
    }, process.env.NEXT_PUBLIC_TIME_CHECK_TOKEN);
};

export const sendMessage = (data) => {
    socket.emit("send-message", data);
};
export const sendMessageGroup = (data) => {
    socket.emit("send-message-group", data);
};

export const updateStatusMessage = ({ listMessage, conversationId }) => {
    socket.emit("message-watched", {
        listMessage,
        conversationId,
    });
};
export const updateReceivedMessageStatus = ({ listMessage, conversationId }) => {
    socket.emit("message-received", {
        listMessage,
        conversationId,
    });
};
