import styles from "./MessageArea.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
    checkSameAuthWithNextMessage,
    checkSameAuthWithPreviousMessage,
} from "@/utils/message.util";
import { updateStatusMessage } from "@/socket/connection.socket";
import { conversationActions } from "@/redux/actions/conversationAction";
import MessageLeft from "../MessageLeft";
import MessageRight from "../MessageRight/MessageRight";
import { messageActions } from "@/redux/actions/messageActions";
import { useLingui } from "@lingui/react";
import { Avatar, Divider } from "@mantine/core";
import { RootState } from "@/redux/store";
import { useCurrentLocale } from "next-i18n-router/client";
import i18nConfig from "../../../../i18nConfig";
export const MessageArea = () => {
    let i18n = useLingui();
    const conversationSelected = useSelector(
        (state: RootState) => state.conversation.conversationSelected,
    );
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const [messages, setMessages] = useState([]);
    const [receiverUser, setReceiverUser] = useState<any>({});
    const [userDetails, setUserDetails] = useState<any>({});
    const messageAreaElement = useRef<any>();
    const dispatch = useDispatch();
    const locale = useCurrentLocale(i18nConfig);

    let lengthMessage = messages.length;

    useEffect(() => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        setUserDetails(userDetails);

        let receiverUserJson = localStorage.getItem("receiverUser");
        let receiverUser = receiverUserJson ? JSON.parse(receiverUserJson) : null;
        setReceiverUser(receiverUser);
        const conversationId = conversationSelected._id;
        if (conversations) {
            conversations.forEach((conversation: any) => {
                if (conversationId === conversation._id) {
                    setMessages(JSON.parse(JSON.stringify(conversation.messages)));
                }
            });
        }
    }, [conversationSelected, conversations, locale, i18n]);

    useEffect(() => {
        if (userDetails) {
            let listMessageStatusEqual2: any = [];
            messages?.forEach((message: any) => {
                if (message.sender._id != userDetails._id && message.status == "2") {
                    listMessageStatusEqual2.push(message);
                }
            });
            if (listMessageStatusEqual2.length != 0) {
                dispatch({
                    type: conversationActions.SET_STATUS_WATCHED_FOR_MESSAGES,
                    listMessage: listMessageStatusEqual2,
                    conversationId: conversationSelected._id,
                });
                // emit update sender
                updateStatusMessage({
                    listMessage: listMessageStatusEqual2,
                    conversationId: conversationSelected._id,
                });
            }
        }
        let messageAreaElement = document.getElementById("messageArea");
        if (messageAreaElement) {
            messageAreaElement.scrollTop = messageAreaElement.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        let widthChatArea;
        if (window.innerWidth < 700) {
            widthChatArea = Math.floor((window.innerWidth - 64) * 0.8); // width of mainTab and TabTwo
        } else {
            widthChatArea = Math.floor((window.innerWidth - 64 - 344) * 0.8); // width of mainTab and TabTwo
        }
        if (widthChatArea) {
            dispatch({
                type: messageActions.SET_MAX_WIDTH_MESSAGE,
                maxWidth: widthChatArea,
            });
        }
    }, []);

    useEffect(() => {
        let id = setTimeout(() => {
            let messageAreaElement = document.getElementById("messageArea");
            if (messageAreaElement) {
                messageAreaElement.scrollTop = messageAreaElement.scrollHeight;
            }
        }, 50);
        return () => {
            clearTimeout(id);
        };
    });

    return (
        <div id="messageArea" className={styles.messageArea} ref={messageAreaElement}>
            <div style={{ height: "30px" }}></div>
            {messages &&
                messages.map((message: any, index: number) => {
                    let preMessage = messages[index - 1];
                    let nextMessage = messages[index + 1];
                    let sameAuthPre = checkSameAuthWithPreviousMessage(preMessage, message);
                    let sameAuthNext = checkSameAuthWithNextMessage(message, nextMessage);
                    let isLastMessage = lengthMessage - 1 === index;
                    if (message.type === "accept_friend") {
                        if (message.sender._id === userDetails._id) {
                            return (
                                <div key={message._id}>
                                    {message.sameDay === false && (
                                        <Divider label={message.dateShow} />
                                    )}
                                    <div className={styles.acceptFriend}>
                                        <Avatar
                                            src={receiverUser?.avatar}
                                            size={"md"}
                                            bg={"#fff"}
                                        />
                                        <p>
                                            {receiverUser?.firstName + " " + receiverUser?.lastName}
                                        </p>
                                        <p> {i18n._("has agreed to make friends")}</p>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={message._id}>
                                    {message.sameDay === false && (
                                        <Divider label={message.dateShow} />
                                    )}
                                    <div className={styles.acceptFriend}>
                                        <p>{i18n._("you just made friends with")}</p>
                                        <Avatar src={message?.sender?.avatar} size={"md"} />
                                        <p>
                                            {message?.sender
                                                ? message?.sender?.firstName +
                                                  " " +
                                                  message?.sender?.lastName
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                    }
                    if (message.type === "create_group") {
                        if (message.sender._id === userDetails._id) {
                            return (
                                <div key={message._id}>
                                    {message.sameDay === false && (
                                        <Divider label={message.dateShow} />
                                    )}
                                    <div className={styles.acceptFriend}>
                                        <p> {i18n._("You have successfully created the group")}</p>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={message._id}>
                                    {message.sameDay === false && (
                                        <Divider label={message.dateShow} />
                                    )}
                                    <div className={styles.acceptFriend}>
                                        <p>{i18n._("You have just been added to the group")}</p>
                                    </div>
                                </div>
                            );
                        }
                    }

                    if (message.sender._id === userDetails._id) {
                        return (
                            <div key={message._id}>
                                <MessageRight
                                    message={message}
                                    isLastMessage={isLastMessage}
                                    status={message.status}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <div key={message._id}>
                                <div className={styles.containerMessageLeft}>
                                    <MessageLeft
                                        message={message}
                                        sameAuthPre={sameAuthPre}
                                        sameAuthNext={sameAuthNext}
                                        isLastMessage={isLastMessage}
                                    />
                                </div>
                            </div>
                        );
                    }
                })}
            <div style={{ height: "20px" }}></div>
        </div>
    );
};
