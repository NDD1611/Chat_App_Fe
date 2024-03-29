import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./index.module.scss";
import { tabsActions } from "@/redux/actions/tabsAction";
import { useLingui } from "@lingui/react";
import { Button, Avatar } from "@mantine/core";
import { RootState } from "@/redux/store";
import { IconChevronLeft, IconMailOpened } from "@tabler/icons-react";
import i18nConfig from "../../../../i18nConfig";
import { useCurrentLocale } from "next-i18n-router/client";
import { acceptInvitation, rejectInvitation } from "@/api/friend";

export const PendingInvitation = () => {
    let i18n = useLingui();
    const router = useRouter();
    const locale = useCurrentLocale(i18nConfig);
    const pendingInvitations = useSelector((state: RootState) => state.friend.pendingInvitations);
    const [showLoader, setShowLoader] = useState(false);
    const [showBackButton, setShowBackButton] = useState(false);
    const dispatch = useDispatch();
    const handleRejectFriend = async (invitation: any) => {
        let data = { invitationId: invitation._id, receiverId: invitation.receiver };
        setShowLoader(true);
        const response = await rejectInvitation(data);
        setShowLoader(false);
    };
    const handleAcceptFriend = async (invitation: any) => {
        setShowLoader(true);
        const response = await acceptInvitation({ invitationId: invitation._id });
        setShowLoader(false);
        router.push(`/${locale}`);
    };

    useEffect(() => {
        if (window.innerWidth < 700) {
            setShowBackButton(true);
        } else {
            setShowBackButton(false);
        }
    }, []);

    const handleClickBackButtonInPendingInvitation = () => {
        dispatch({
            type: tabsActions.SET_CLOSE_PENDING_INVITATION,
        });
    };

    return (
        <>
            <div className={styles.PendingInvitation}>
                <div className={styles.headerInvitation}>
                    {showBackButton && (
                        <div
                            className={styles.backButton}
                            onClick={handleClickBackButtonInPendingInvitation}
                        >
                            <IconChevronLeft />
                        </div>
                    )}
                    <div className={styles.headerIcon}>
                        <IconMailOpened />
                    </div>
                    {i18n._("Friend request")}
                </div>
                {pendingInvitations.length === 0 && (
                    <div className={styles.noResult}>
                        <div>
                            <img src="/images/invitation-emptystate.png" />
                        </div>
                        <div className={styles.titleNoResult}>
                            {i18n._("You don't have any friend requests")}
                        </div>
                    </div>
                )}
                <div className={styles.centerPending}>
                    {pendingInvitations.map((invitation: any) => {
                        return (
                            <div key={invitation._id} className={styles.pendingInvitationItem}>
                                <div className={styles.topItem}>
                                    <Avatar
                                        src={
                                            invitation?.senderId?.avatar
                                                ? invitation?.senderId?.avatar
                                                : ""
                                        }
                                        size={40}
                                    />
                                    <p className={styles.name}>
                                        {invitation.sender.lastName +
                                            " " +
                                            invitation.sender.firstName}
                                    </p>
                                </div>
                                <div className={styles.bottomItem}>
                                    {showLoader ? (
                                        <>
                                            <Button
                                                loading
                                                variant="filled"
                                                color="gray"
                                                onClick={() => {
                                                    handleRejectFriend(invitation);
                                                }}
                                            >
                                                {i18n._("Refuse")}
                                            </Button>
                                            <Button
                                                loading
                                                variant="filled"
                                                onClick={() => {
                                                    handleAcceptFriend(invitation);
                                                }}
                                            >
                                                {i18n._("Accept")}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="filled"
                                                color="gray"
                                                onClick={() => {
                                                    handleRejectFriend(invitation);
                                                }}
                                            >
                                                {i18n._("Refuse")}
                                            </Button>
                                            <Button
                                                variant="filled"
                                                onClick={() => {
                                                    handleAcceptFriend(invitation);
                                                }}
                                            >
                                                {i18n._("Accept")}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};
