import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.scss";
import { useEffect, useState } from "react";
import { tabsActions } from "@/redux/actions/tabsAction";
import { LoaderModal } from "@/components/Common/LoaderModal";
import { modalActions } from "@/redux/actions/modalActions";
import { toast } from "react-toastify";
import { friendActions } from "@/redux/actions/friendAction";
import { Avatar, Box, Button, Center, Indicator } from "@mantine/core";
import { useLingui } from "@lingui/react";
import { IconChevronLeft, IconUserPlus } from "@tabler/icons-react";
import { toastMessage } from "@/utils/toast.util";
import { RootState } from "@/redux/store";
import { friendInvitation } from "@/api/friend";
export const HeaderChatArea = () => {
    let i18n = useLingui();
    const dispatch = useDispatch();
    const conversationSelected = useSelector(
        (state: RootState) => state.conversation.conversationSelected,
    );
    const activeUsers = useSelector((state: RootState) => state.auth.activeUsers);
    const listFriends = useSelector((state: RootState) => state.friend.listFriends);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const isFriend = useSelector((state: RootState) => state.friend.isFriend);
    const [receiverUser, setReceiverUser] = useState<any>({});
    const [isGroup, setIsGroup] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
        let receiverUserJson = localStorage.getItem("receiverUser");
        let receiverUser = receiverUserJson ? JSON.parse(receiverUserJson) : null;
        if (receiverUser) {
            setReceiverUser(receiverUser);
            if (listFriends) {
                let check = false;
                listFriends.forEach((friend: any) => {
                    if (friend._id == receiverUser._id) {
                        check = true;
                    }
                });
                if (check) {
                    dispatch({
                        type: friendActions.SET_IS_FRIEND,
                    });
                } else {
                    dispatch({
                        type: friendActions.SET_IS_NOT_FRIEND,
                    });
                }
            }
        }
    }, [conversationSelected, listFriends]);

    useEffect(() => {
        if (conversationSelected?.participants?.length > 2) {
            setIsGroup(true);
        } else {
            setIsGroup(false);
        }
    }, [conversationSelected]);

    const handleBackConversation = () => {
        dispatch({
            type: tabsActions.SET_CLOSE_CHAT_AREA_ON_MOBILE,
        });
    };

    const addFriend = async () => {
        let receiverUserJson = localStorage.getItem("receiverUser");
        let receiverUser = receiverUserJson ? JSON.parse(receiverUserJson) : null;
        let userDetailsJson = localStorage.getItem("userDetails");
        let userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        setShowLoader(true);
        const response: any = await friendInvitation({
            senderId: userDetails._id,
            receiverId: receiverUser._id,
        });
        if (response.error) {
            setShowLoader(false);
            toast.error(toastMessage(response?.exception?.response?.data?.metadata?.code, i18n));
            dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND });
        } else {
            setShowLoader(false);
            toast.success(toastMessage(response?.data?.metadata?.code, i18n));
            dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND });
        }
    };

    return (
        conversationSelected && (
            <div
                id="headerChat"
                className={`${styles.headerChatArea} ${
                    theme === "dark" && styles.headerChatAreaDark
                } `}
            >
                {showLoader && <LoaderModal />}
                <div className={`${styles.headerContent} bg-[#F3F4F6]`}>
                    <div className={styles.headerLeft}>
                        {window.innerWidth < 700 && (
                            <div className={styles.backButton} onClick={handleBackConversation}>
                                <IconChevronLeft />
                            </div>
                        )}
                        <div className={styles.headerAvatar}>
                            {isGroup ? (
                                <Center>
                                    {
                                        <Avatar
                                            src={conversationSelected?.avatarGroup}
                                            size={"lg"}
                                            alt="avatar"
                                        />
                                    }
                                </Center>
                            ) : (
                                <Center>
                                    {activeUsers.includes(receiverUser._id) ? (
                                        <Indicator
                                            size={16}
                                            offset={7}
                                            position="bottom-end"
                                            color="green"
                                            withBorder
                                        >
                                            <Avatar
                                                src={receiverUser.avatar}
                                                size={"lg"}
                                                alt="avatar"
                                            />
                                        </Indicator>
                                    ) : (
                                        <Avatar
                                            src={receiverUser.avatar}
                                            size={"lg"}
                                            alt="avatar"
                                        />
                                    )}
                                </Center>
                            )}
                        </div>
                        {isGroup ? (
                            <div className={styles.headerName}>
                                <p className={styles.name}>
                                    {" "}
                                    {receiverUser &&
                                        receiverUser.firstName + " " + receiverUser.lastName}
                                </p>
                                <p className={styles.minuteActive}>
                                    {conversationSelected?.participants?.length +
                                        " " +
                                        i18n._("members")}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.headerName}>
                                <p className={styles.name}>
                                    {" "}
                                    {receiverUser &&
                                        receiverUser.firstName + " " + receiverUser.lastName}
                                </p>
                                {activeUsers.includes(receiverUser._id) && isFriend && (
                                    <p className={styles.minuteActive}>{i18n._("just accessed")}</p>
                                )}
                                {!isFriend && (
                                    <p className={styles.stranger}>{i18n._("Stranger")}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {!isFriend && !isGroup && (
                    <Box component="div" className={styles.sendInviteFriend}>
                        <Box component="div" p={10}>
                            <IconUserPlus size={20} />
                            <Box component="span" ml={10}>
                                {i18n._("Send a friend request to this person")}
                            </Box>
                        </Box>
                        <Button mr={30} p={5} component="div" onClick={addFriend}>
                            {i18n._("Make friend")}
                        </Button>
                    </Box>
                )}
            </div>
        )
    );
};
