import styles from "./ModalFindFriend.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { modalActions } from "@/redux/actions/modalActions";
import { tabsActions } from "@/redux/actions/tabsAction";
import { conversationActions } from "@/redux/actions/conversationAction";
import api from "@/api/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import { Button, Modal } from "@mantine/core";
import { toastMessage } from "@/utils/toast.util";
import { RootState } from "@/redux/store";
import { Avatar } from "@mantine/core";
import { useCurrentLocale } from "next-i18n-router/client";
import i18nConfig from "../../../../i18nConfig";
import { findFriend, friendInvitation } from "@/api/friend";

export const ModalFindFriend = () => {
    let i18n = useLingui();
    const locale = useCurrentLocale(i18nConfig);
    const showModalFindFriend = useSelector((state: RootState) => state.modal.showModalFindFriend);
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const listFriends = useSelector((state: RootState) => state.friend.listFriends);
    const maintabSelect = useSelector((state: RootState) => state.tabs.maintabSelect);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [infoFindFriend, setInfoFindFriend] = useState<any>();
    const [showLoader, setShowLoader] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const router = useRouter();

    const addFriend = async () => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        setShowLoader(true);
        const response: any = await friendInvitation({
            senderId: userDetails._id,
            receiverId: infoFindFriend._id,
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
        setInfoFindFriend(undefined);
    };

    const handleFindFriend = async () => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        setInfoFindFriend(undefined);
        if (email === userDetails.email) {
            dispatch({
                type: modalActions.SET_SHOW_MODAL_INFO,
            });
            dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND });
        } else {
            setShowLoader(true);
            const response: any = await findFriend({ email: email });
            if (response.error) {
                toast.error(
                    toastMessage(response?.exception?.response?.data?.metadata?.code, i18n),
                );
            } else {
                let { userData } = response?.data?.metadata;
                let date = new Date(userData.birthday);
                let day = date.getDate().toString();
                let month = (date.getMonth() + 1).toString();
                let year = date.getFullYear();
                let birthday = day + "/" + `${parseInt(month) < 10 ? 0 : ""}` + month + "/" + year;
                setInfoFindFriend({
                    ...userData,
                    birthday,
                });

                // check isFriend
                let check = false;
                if (listFriends) {
                    listFriends.forEach((friend: any) => {
                        if (friend._id == userData._id) {
                            check = true;
                        }
                    });
                }
                setIsFriend(check);
            }
            setShowLoader(false);
        }
    };
    const handleCloseModalFindFriend = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_FIND_FRIEND });
        setInfoFindFriend(undefined);
    };
    const handleClickSendMessage = async () => {
        if (infoFindFriend) {
            localStorage.setItem("receiverUser", JSON.stringify(infoFindFriend));
            const userDetailsJson = localStorage.getItem("userDetails");
            const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
            let conversationSelected = null;
            if (conversations) {
                conversations.forEach((conversation: any) => {
                    let participants = conversation.participants;
                    if (
                        participants.length === 2 &&
                        (participants[0]._id === userDetails._id ||
                            participants[0]._id === infoFindFriend._id) &&
                        (participants[1]._id === userDetails._id ||
                            participants[1]._id === infoFindFriend._id)
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
                handleCloseModalFindFriend();
            } else {
                dispatch({
                    type: conversationActions.SET_SELECT_CONVERSATION,
                    conversationSelected: {
                        participants: [userDetails._id, infoFindFriend._id],
                        messages: [],
                        date: new Date(),
                    },
                });
                handleCloseModalFindFriend();
            }

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

            if (maintabSelect != "Conversations") {
                dispatch({
                    type: tabsActions.SET_MAIN_TAB,
                    maintabSelect: "Conversations",
                });
                router.push(`/${locale}`);
            }
        }
    };
    return (
        <Modal
            centered
            size={"md"}
            opened={showModalFindFriend}
            onClose={handleCloseModalFindFriend}
            title={i18n._("Add friend")}
        >
            {/* <div className={`${styles.MainModal} ${showModalFindFriend ? '' : styles.closeModal}`}> */}
            <div className={styles.content}>
                {/* {showLoader && <LoaderModal />} */}
                <div className={styles.inputEmail}>
                    <input
                        value={email}
                        placeholder={i18n._("Email") + "..."}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>

                {infoFindFriend && (
                    <div className={styles.contentModalInfo}>
                        <div className={styles.image}>
                            <img src="/images/backgroundProfile.jpg" />
                            <div className={styles.AvatarContainer}>
                                <Avatar
                                    src={infoFindFriend.avatar ? infoFindFriend.avatar : ""}
                                    size={"lg"}
                                    bg={"#fff"}
                                ></Avatar>
                            </div>
                        </div>
                        <p className={styles.userName}>
                            {infoFindFriend.firstName + " " + infoFindFriend.lastName}
                        </p>

                        <div className={styles.addFriendBtns}>
                            <Button className={styles.btnCancel} onClick={handleClickSendMessage}>
                                {i18n._("Send message")}
                            </Button>
                            {!isFriend &&
                                (showLoader ? (
                                    <Button loading onClick={addFriend}>
                                        {i18n._("Make friend")}
                                    </Button>
                                ) : (
                                    <Button onClick={addFriend}>{i18n._("Make friend")}</Button>
                                ))}
                        </div>
                        <div className={styles.userInfo}>
                            <div>
                                <p>{i18n._("Email")}</p>
                                <p>{infoFindFriend.email}</p>
                            </div>
                            <div>
                                <p>{i18n._("Gender")}</p>
                                <p>
                                    {infoFindFriend.gender
                                        ? infoFindFriend.gender
                                        : i18n._("No information")}
                                </p>
                            </div>
                            <div>
                                <p>{i18n._("Date of birth")}</p>
                                <p>
                                    {infoFindFriend.birthday
                                        ? infoFindFriend.birthday
                                        : i18n._("No information")}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.footerBtn}>
                    <Button className={styles.btnCancel} onClick={handleCloseModalFindFriend}>
                        {i18n._("Cancel")}
                    </Button>
                    {showLoader ? (
                        <Button loading className={styles.btnFind} onClick={handleFindFriend}>
                            {i18n._("Find")}
                        </Button>
                    ) : (
                        <Button className={styles.btnFind} onClick={handleFindFriend}>
                            {i18n._("Find")}
                        </Button>
                    )}
                </div>
            </div>
            {/* </div > */}
        </Modal>
    );
};
