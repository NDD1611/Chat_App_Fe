import classes from "./index.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { conversationActions } from "@/redux/actions/conversationAction";
import { updateReceivedMessageStatus } from "@/socket/connection.socket";
import { tabsActions } from "@/redux/actions/tabsAction";
import { MessageEmoji } from "../MessageEmoji";
import api from "@/api/api";
import { Box, Menu, rem } from "@mantine/core";
import { IconDots, IconPaperclip, IconPhotoFilled, IconTrash } from "@tabler/icons-react";
import { useLingui } from "@lingui/react";
import { Avatar } from "@mantine/core";
import { RootState } from "@/redux/store";
import { useCurrentLocale } from "next-i18n-router/client";
import i18nConfig from "../../../../i18nConfig";
export const Conversation = ({ conversation }: { conversation: any }) => {
    let i18n = useLingui();
    const userDetails = useSelector((state: RootState) => state.auth.userDetails);
    const conversationSelected = useSelector(
        (state: RootState) => state.conversation.conversationSelected,
    );
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const [friend, setFriend] = useState<any | {}>({});
    const [message, setMessage] = useState<any | null>({});
    const [countMessageReceived, setCountMessageReceived] = useState(0);
    const [fileName, setFileName] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const dispatch = useDispatch();

    const locale = useCurrentLocale(i18nConfig);

    useEffect(() => {
        if (userDetails) {
            let listMessageStatusEqual1: any = [];
            conversation?.messages.forEach((message: any) => {
                if (message.sender._id != userDetails._id && message.status == "1") {
                    listMessageStatusEqual1.push(message);
                }
            });
            if (listMessageStatusEqual1.length != 0) {
                updateReceivedMessageStatus({
                    conversationId: conversation._id,
                    listMessage: listMessageStatusEqual1,
                });
                dispatch({
                    type: conversationActions.SET_STATUS_RECEIVED_FOR_MESSAGES,
                    conversationId: conversation._id,
                    listMessage: listMessageStatusEqual1,
                });
            }
        }
    }, [message]);
    useEffect(() => {
        if (conversation?.participants?.length > 2) {
            setIsGroup(true);
        } else {
            setIsGroup(false);
        }
    }, []);
    useEffect(() => {
        const { participants, messages } = conversation;
        let friend: any = null;
        if (participants) {
            participants.forEach((user: any) => {
                if (user._id !== userDetails._id) {
                    setFriend(user);
                    friend = user;
                }
            });
        }
        if (messages.length && friend) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.type === "accept_friend") {
                if (userDetails._id === lastMessage.sender._id) {
                    let mesTemp =
                        friend.firstName +
                        " " +
                        friend.lastName +
                        " " +
                        i18n._("has agreed to make friends");
                    setMessage({ content: mesTemp, type: "text" });
                } else {
                    let mesTemp =
                        i18n._("you just made friends with") +
                        " " +
                        friend.firstName +
                        " " +
                        friend.lastName;
                    setMessage({ content: mesTemp, type: "text" });
                }
            } else if (lastMessage.type === "create_group") {
                if (userDetails._id === lastMessage.sender._id) {
                    let mesTemp = i18n._("You have successfully created the group");
                    setMessage({ content: mesTemp, type: "text" });
                } else {
                    let mesTemp = i18n._("You have just been added to the group");
                    setMessage({ content: mesTemp, type: "text" });
                }
            } else if (lastMessage.type == "text") {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({
                        content: i18n._("You") + ": " + lastMessage.content,
                        type: "text",
                    });
                } else {
                    setMessage({ content: lastMessage.content, type: "text" });
                }
            } else if (lastMessage.type == "image") {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: i18n._("You") + ": ", type: "image" });
                } else {
                    setMessage({ content: "", type: "image" });
                }
            } else {
                if (lastMessage.sender._id === userDetails._id) {
                    setMessage({ content: i18n._("You") + ": ", type: "file" });
                } else {
                    setMessage({ content: "", type: "file" });
                }
                if (lastMessage && lastMessage.type) {
                    let fileName = JSON.parse(lastMessage.type).name;
                    setFileName(fileName);
                }
            }
        }
        let listMessages = conversation.messages;
        let count = 0;
        for (let message of listMessages) {
            if (
                (message.status &&
                    message.status == "2" &&
                    message.sender._id != userDetails._id) ||
                (message.status == 2 && message.type === "accept_friend")
            ) {
                count++;
            }
        }
        setCountMessageReceived(count);
    }, [conversation, conversations, i18n, locale]);

    const handleChooseConversation = () => {
        localStorage.setItem("receiverUser", JSON.stringify(friend));
        dispatch({
            type: conversationActions.SET_SELECT_CONVERSATION,
            conversationSelected: conversation,
        });
        if (window.innerWidth < 700) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_TWO,
            });
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE,
            });
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_ONE,
            });
        }
    };
    useEffect(() => {
        const setPopoverId = () => {
            dispatch({
                type: conversationActions.SET_POPOVER_ID,
                id: "",
            });
        };
        document.addEventListener("click", setPopoverId);
        return () => {
            document.removeEventListener("click", setPopoverId);
        };
    });

    const deleteConversation = async (e: any) => {
        e.stopPropagation();
        let res: any = await api.deleteConversation({ conversationId: conversation._id });
        if (res.err) {
            console.log(res, "err");
        } else {
            console.log(res);
        }
    };
    return (
        <div
            className={`${classes.conversationItem} ${
                theme === "dark" && classes.conversationItemDark
            } ${
                conversationSelected &&
                conversation._id == conversationSelected._id &&
                classes.selectedConversation
            }`}
            onClick={handleChooseConversation}
        >
            <div className={classes.left}>
                {isGroup ? (
                    <Avatar src={conversation?.avatarGroup} size={"md"} />
                ) : (
                    <Avatar src={friend.avatar} size={"md"} />
                )}
            </div>
            <div className={classes.center}>
                <div>
                    <div className={classes.name}>
                        {isGroup
                            ? conversation.groupName
                            : friend.firstName + " " + friend.lastName}
                    </div>
                    <div className={classes.message}>
                        {message.type == "text" && <MessageEmoji text={message.content} />}
                        {message.type == "image" && (
                            <div className="flex">
                                {message.content}
                                <IconPhotoFilled className={classes.iconImage} />
                                {i18n._("Image")}
                            </div>
                        )}
                        {message.type == "file" && (
                            <div className="flex">
                                {message.content}
                                <IconPaperclip className={classes.iconImage} />
                                {fileName}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={classes.right}>
                {countMessageReceived != 0 && (
                    <Box
                        w={20}
                        h={20}
                        style={{
                            backgroundColor: "red",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "13px",
                        }}
                    >
                        {countMessageReceived}
                    </Box>
                )}
                <Menu
                    trigger="hover"
                    openDelay={100}
                    closeDelay={400}
                    shadow="md"
                    width={200}
                    position="right"
                >
                    <Menu.Target>
                        <Box
                            component="div"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <IconDots style={{ width: rem(25), height: rem(25) }} />
                        </Box>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            onClick={deleteConversation}
                        >
                            {i18n._("Delete conversation")}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </div>
    );
};
