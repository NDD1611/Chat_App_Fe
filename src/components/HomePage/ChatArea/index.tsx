import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import dynamic from "next/dynamic";
import { sendMessage, sendMessageGroup } from "@/socket/connection.socket";
import { MessageArea } from "./MessageArea";
import { conversationActions } from "@/redux/actions/conversationAction";
import { HeaderChatArea } from "./Header";
import api from "@/api/api";
import { IconTopInputArea } from "./IconTopInputArea";
import { useLingui } from "@lingui/react";
import { IconMoodSmile, IconSend } from "@tabler/icons-react";
import { RootState } from "@/redux/store";

const EmojiPicker = dynamic(
    () => {
        return import("emoji-picker-react");
    },
    { ssr: false },
);

const ChatArea = () => {
    const { i18n } = useLingui();
    const conversationSelected = useSelector(
        (state: RootState) => state.conversation.conversationSelected,
    );
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const [receiverUser, setReceiverUser] = useState<any>({});
    const [userDetails, setUserDetails] = useState<any>({});
    const [showEmoji, setShowEmoji] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const chatMessageElement = useRef<any>();
    const inputAreaElement = useRef<any>();
    const headerElement = useRef<any>();

    const dispatch = useDispatch();
    useEffect(() => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        setUserDetails(userDetails);
        document.addEventListener("click", (e) => {
            setShowEmoji(false);
        });
    }, []);

    useEffect(() => {
        const receiverUserJson = localStorage.getItem("receiverUser");
        const receiverUser = receiverUserJson ? JSON.parse(receiverUserJson) : null;
        if (receiverUser) {
            setReceiverUser(receiverUser);
            let divInputElement = document.getElementById("divInput");
            if (divInputElement) {
                divInputElement.innerHTML = "";
                divInputElement.focus();
            }
        }

        let resizeObserver = new ResizeObserver((entries) => {
            let heightInputArea = entries[0].target;
            let headerContainerElement = document.getElementById("headerContainer");
            let messageArea = document.getElementById("chatMessageArea");
            if (headerContainerElement && messageArea) {
                let height =
                    window.innerHeight -
                    heightInputArea.clientHeight -
                    headerContainerElement.clientHeight -
                    10;
                messageArea.style.height = height + "px";
            }
        });
        let inputAreaElement = document.getElementById("inputArea");
        if (inputAreaElement) {
            resizeObserver.observe(inputAreaElement);
        }
        if (conversationSelected?.participants.length > 2) {
            setIsGroup(true);
        } else {
            setIsGroup(false);
        }
    }, [conversationSelected]);

    useEffect(() => {
        let headerContainerElement = document.getElementById("headerContainer");
        let inputAreaElement = document.getElementById("inputArea");
        let messageArea = document.getElementById("chatMessageArea");
        if (headerContainerElement && inputAreaElement && messageArea) {
            let height =
                window.innerHeight -
                inputAreaElement.clientHeight -
                headerContainerElement.clientHeight;
            messageArea.style.height = height - 5 + "px";
        }

        let chatAreaElement = document.getElementById("chatArea");
        let rightInputElement = document.getElementById("rightInput");
        let divInputElement = document.getElementById("divInput");

        if (chatAreaElement && rightInputElement && divInputElement) {
            let widthInput = chatAreaElement.clientWidth - rightInputElement.clientWidth;
            divInputElement.style.width = widthInput - 5 + "px";
        }
    });
    const handleEmojiClick = (event: any) => {
        let divInput = document.getElementById("divInput");
        if (divInput) {
            let unifiedEmoji = event.unified;
            let imgElement = document.createElement("img");
            imgElement.src = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${unifiedEmoji}.png`;
            imgElement.className = styles.emojiDivInput;
            divInput.appendChild(imgElement);
        }
    };
    const getMessageFromDivInputElement = () => {
        let divInputElement = document.getElementById("divInput");
        if (divInputElement) {
            let message = "";
            if (divInputElement.childNodes) {
                let childNodes = divInputElement.childNodes;
                for (let index in childNodes) {
                    let node: any = childNodes[index];
                    if (node.nodeName === "#text") {
                        message = message + node.textContent;
                    } else if (node.nodeName === "IMG") {
                        let src = node.src;
                        let unified = src.slice(src.length - 9, src.length - 4);
                        let emojiEncoded = "&#x" + unified + ";";
                        message = message + emojiEncoded;
                    }
                }
            }
            divInputElement.focus();
            divInputElement.innerHTML = "";
            return message;
        }
    };
    const handleSendMessage = async () => {
        let message: any = getMessageFromDivInputElement();
        let senderId = userDetails._id;
        let receiverId = receiverUser._id;
        if (message.length && message !== "&nbsp;" && message !== "") {
            let conversationSelectedId = conversationSelected._id;
            let data = {
                _id: new Date() + Math.random().toString(),
                sender: {
                    _id: senderId,
                },
                receiverId,
                conversation: { _id: conversationSelectedId },
                content: message.replace("&nbsp;", ""),
                type: "text",
                date: new Date().getTime(),
                status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            };
            let conversationCurrent = null;
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index];
                }
            }
            if (conversationCurrent) {
                if (conversationCurrent.messages.length != 0) {
                    conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime =
                        false;
                }
                conversationCurrent.messages.push(data);
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent,
                });
                sendMessage(data);
            } else {
                let response: any = await api.createNewConversation({
                    sender: {
                        _id: senderId,
                    },
                    receiverId,
                    content: message.replace("&nbsp;", ""),
                    type: "text",
                    date: new Date().getTime(),
                    status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                });

                if (response.err) {
                    alert(i18n._("An error occurred. Please try again later."));
                } else {
                    let { conversation } = response?.data;
                    dispatch({
                        type: conversationActions.SET_SELECT_CONVERSATION,
                        conversationSelected: conversation,
                    });
                }
            }
        }
    };
    const handleSendMessageGroup = async () => {
        let message: any = getMessageFromDivInputElement();
        let senderId = userDetails._id;
        let receiverId = receiverUser._id;
        if (message.length && message !== "&nbsp;" && message !== "") {
            let conversationSelectedId = conversationSelected._id;
            let data = {
                _id: new Date() + Math.random().toString(),
                sender: {
                    _id: senderId,
                },
                conversation: { _id: conversationSelectedId },
                content: message.replace("&nbsp;", ""),
                type: "text",
                date: new Date().getTime(),
                status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
            };
            let conversationCurrent = null;
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index];
                }
            }
            if (conversationCurrent) {
                if (conversationCurrent.messages.length != 0) {
                    conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime =
                        false;
                }
                conversationCurrent.messages.push(data);
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent,
                });
                sendMessageGroup(data);
            }
        }
    };
    const handleKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (isGroup) {
                handleSendMessageGroup();
            } else {
                handleSendMessage();
            }
        }
    };

    const handleClickSendIcon = () => {
        if (isGroup) {
            handleSendMessageGroup();
        } else {
            handleSendMessage();
        }
    };

    const handleShowEmojiPicker = (e: any) => {
        e.stopPropagation();
        setShowEmoji(!showEmoji);
    };

    const handleStopPropagation = (e: any) => {
        e.stopPropagation();
    };
    return (
        <div
            id="chatArea"
            className={`${styles.ChatArea} ${theme === "dark" && styles.ChatAreaDark}`}
        >
            {conversationSelected === null && (
                <div className={styles.chatOnboard}>{i18n._("Select a conversation to chat")}</div>
            )}
            <div id="headerContainer" ref={headerElement}>
                <HeaderChatArea />
            </div>

            {conversationSelected && (
                <div ref={chatMessageElement} id="chatMessageArea" className={styles.chatMessage}>
                    <MessageArea />
                </div>
            )}
            {conversationSelected && (
                <div id="inputArea" className={styles.inputArea} ref={inputAreaElement}>
                    <IconTopInputArea />
                    <div className={styles.containerEmojiPicker} onClick={handleStopPropagation}>
                        {showEmoji && (
                            <EmojiPicker onEmojiClick={handleEmojiClick} autoFocusSearch={false} />
                        )}
                    </div>
                    <div className={styles.mainInput}>
                        <div
                            id="divInput"
                            className={styles.divInputFake}
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            data-text={
                                receiverUser
                                    ? i18n._("Send message to ") +
                                      receiverUser.firstName +
                                      " " +
                                      receiverUser.lastName
                                    : ""
                            }
                            onKeyDown={(e) => {
                                handleKeyDown(e);
                            }}
                        ></div>

                        <div id="rightInput" className={styles.rightInputArea}>
                            <div className={styles.buttonShowEmoji} onClick={handleShowEmojiPicker}>
                                <IconMoodSmile />
                            </div>
                            <div className={styles.btnSend} onClick={handleClickSendIcon}>
                                <IconSend size={25} color="#fff" stroke={2} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatArea;
