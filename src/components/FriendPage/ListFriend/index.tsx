import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { tabsActions } from "@/redux/actions/tabsAction";
import { conversationActions } from "@/redux/actions/conversationAction";
import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import { Avatar, Box, Divider, Menu, Modal, rem } from "@mantine/core";
import { IconChevronLeft, IconDots, IconEye, IconTrash, IconUser } from "@tabler/icons-react";
import { LoaderModal } from "@/components/Common/LoaderModal";
import { toast } from "react-toastify";
import { toastMessage } from "@/utils/toast.util";
import { RootState } from "@/redux/store";
import i18nConfig from "../../../../i18nConfig";
import { useCurrentLocale } from "next-i18n-router/client";
import { deleteFriend } from "@/api/friend";
import { checkScreenDevice } from "@/utils/screen.util";

export const ListFriend = () => {
    let i18n = useLingui();
    const locale = useCurrentLocale(i18nConfig);
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const maintabSelect = useSelector((state: RootState) => state.tabs.maintabSelect);
    const [showBackButton, setShowBackButton] = useState(false);
    const listFriends = useSelector((state: RootState) => state.friend.listFriends);
    const [showLoader, setShowLoader] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        let device = checkScreenDevice();
        if (device === "mobile") {
            setShowBackButton(true);
        } else {
            setShowBackButton(false);
        }
    }, []);

    const handleClickBackButtonInListFriend = () => {
        dispatch({
            type: tabsActions.SET_CLOSE_LIST_FRIEND,
        });
    };

    const [idPopover, setIdPopover] = useState();
    const [clientXPopover, setClientXPopover] = useState(0);
    const [clientYPopover, setClientYPopover] = useState(0);
    const handleMouseRightClick = (e: any, id: any) => {
        e.preventDefault();
        let popoverElement = document.getElementById(id);
        // popoverElement.style.display = 'block'
        setIdPopover(id);
        const x = e.clientX - e.target.getBoundingClientRect().x;
        const y = e.clientY - e.target.getBoundingClientRect().y;
        setClientXPopover(x);
        setClientYPopover(y);
    };

    const handleClickShowInfoFriend = (e: any, friend: any) => {
        e.stopPropagation();
        let date = new Date(friend.birthday);
        let day = date.getDate().toString();
        let month = (date.getMonth() + 1).toString();
        let year = date.getFullYear();
        let birthday = day + "/" + `${parseInt(month) < 10 ? 0 : ""}` + month + "/" + year;
        setInfoFriend({
            ...friend,
            birthday,
        });
        setIdPopover(undefined);
        setShowModalInfo(true);
    };
    const [infoFriend, setInfoFriend] = useState<any>();
    const [showModalInfo, setShowModalInfo] = useState(false);
    const handleCloseModalInfo = () => {
        setShowModalInfo(false);
    };
    const handleDeleteFriend = async (e: any, friendId: any) => {
        e.stopPropagation();
        setShowLoader(true);
        const userDetailsJson = localStorage.getItem("userDetails");
        let userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        let data = {
            userId: userDetails._id,
            friendId: friendId,
        };
        let response: any = await deleteFriend(data);
        if (response.error) {
            setShowLoader(false);
            toast.error(toastMessage(response?.exception?.response?.data?.metadata?.code, i18n));
        } else {
            setShowLoader(false);
            toast.success(toastMessage(response?.data?.metadata?.code, i18n));
        }
        setShowLoader(false);
    };
    const handleClickSendMessage = async (friend: any) => {
        localStorage.setItem("receiverUser", JSON.stringify(friend));
        const userDetailsJson = localStorage.getItem("userDetails");
        let userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        let conversationSelected = null;
        if (conversations) {
            conversations.forEach((conversation: any) => {
                let participants = conversation.participants;
                if (
                    participants.length === 2 &&
                    (participants[0]._id === userDetails._id ||
                        participants[0]._id === friend._id) &&
                    (participants[1]._id === userDetails._id || participants[1]._id === friend._id)
                ) {
                    conversationSelected = conversation;
                }
            });
        }

        if (conversationSelected) {
            dispatch({
                type: conversationActions.SET_SELECT_CONVERSATION,
                conversationSelected: conversationSelected,
            });
        } else {
            dispatch({
                type: conversationActions.SET_SELECT_CONVERSATION,
                conversationSelected: {
                    participants: [userDetails._id, friend._id],
                    messages: [],
                    date: new Date(),
                },
            });
        }

        let device = checkScreenDevice();
        if (device === "mobile") {
            dispatch({
                type: tabsActions.SET_SHOW_CHAT_AREA_ON_MOBILE,
            });
        }

        if (maintabSelect != "Conversations") {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: "Conversations",
            });
            router.push(`/${locale}`);
        }
    };
    return (
        <>
            {showLoader && <LoaderModal />}
            <Modal
                opened={showModalInfo}
                onClose={handleCloseModalInfo}
                title={i18n._("Account information")}
            >
                <div className={styles.contentModalInfo}>
                    <div className={styles.image}>
                        <img src="/images/backgroundProfile.jpg" />
                    </div>
                    <div className={styles.avatarInfo}>
                        <Avatar src={infoFriend?.avatar} color="blue" size={"lg"} />
                    </div>
                    <p className={styles.name}>
                        {infoFriend && infoFriend.firstName + " " + infoFriend.lastName}
                    </p>
                    <div className={styles.userInfo}>
                        <p>{i18n._("Information")}</p>
                        <div>
                            <p>{i18n._("Email")}</p>
                            <p>{infoFriend ? infoFriend.email : ""}</p>
                        </div>
                        <div>
                            <p>{i18n._("Sex")}</p>
                            <p>
                                {infoFriend &&
                                    (infoFriend.gender
                                        ? infoFriend.gender
                                        : i18n._("No information"))}
                            </p>
                        </div>
                        <div>
                            <p>{i18n._("Date of birth")}</p>
                            <p>
                                {infoFriend &&
                                    (infoFriend.birthday
                                        ? infoFriend.birthday
                                        : i18n._("No information"))}
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>

            <div className={styles.listFriend}>
                <div className={styles.headerInvitation}>
                    {showBackButton && (
                        <div
                            className={styles.backButton}
                            onClick={handleClickBackButtonInListFriend}
                        >
                            <IconChevronLeft />
                        </div>
                    )}
                    <Box mr={10}>
                        <IconUser size={20} />
                    </Box>
                    {i18n._("Friends List")}
                </div>
                <div>
                    {listFriends.length === 0 && (
                        <div className={styles.noFriend}>
                            {i18n._("You don't have friends yet, connect with friends")}
                        </div>
                    )}
                    {listFriends.map((friend: any) => {
                        return (
                            <Box key={friend._id} px={20}>
                                <div
                                    className={styles.friendItem}
                                    onContextMenu={(e) => {
                                        handleMouseRightClick(e, friend._id);
                                    }}
                                    onClick={(e) => {
                                        handleClickSendMessage(friend);
                                    }}
                                >
                                    <div className={styles.left}>
                                        <Avatar src={friend.avatar} color="blue" size={"md"} />
                                        <div className={styles.name}>
                                            {friend.firstName + " " + friend.lastName}
                                        </div>
                                    </div>
                                    <div className={styles.right}>{/* icon */}</div>
                                    <Menu
                                        trigger="hover"
                                        openDelay={100}
                                        closeDelay={400}
                                        shadow="md"
                                        width={200}
                                        position="left"
                                    >
                                        <Menu.Target>
                                            <Box
                                                component="div"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                mr={20}
                                            >
                                                <IconDots
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    style={{ width: rem(25), height: rem(25) }}
                                                />
                                            </Box>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClickShowInfoFriend(e, friend);
                                                }}
                                                leftSection={<IconEye size={14} />}
                                            >
                                                {i18n._("Watch information")}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteFriend(e, friend._id);
                                                }}
                                                color="red"
                                                leftSection={<IconTrash size={14} />}
                                            >
                                                {i18n._("Delete")}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </div>
                                <Divider />
                            </Box>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
