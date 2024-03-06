import { useSelector, useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { friendActions } from "@/redux/actions/friendAction";
import { tabsActions } from "@/redux/actions/tabsAction";
import { useLingui } from "@lingui/react";
import { RootState } from "@/redux/store";
import { IconMailOpened, IconUser } from "@tabler/icons-react";

export const MenuItemFriend = () => {
    let { i18n } = useLingui();
    const dispatch = useDispatch();
    const selectItem = useSelector((state: RootState) => state.friend.selectItem);
    const pendingInvitation = useSelector((state: RootState) => state.friend.pendingInvitations);
    const handleClickListFriends = () => {
        dispatch({
            type: friendActions.SET_SELECT_ITEM_TAB_TWO,
            selectItem: "listFriend",
        });
        dispatch({
            type: tabsActions.SET_SHOW_LIST_FRIEND,
        });
    };
    const handleClickPendingInvitation = () => {
        dispatch({
            type: friendActions.SET_SELECT_ITEM_TAB_TWO,
            selectItem: "friendInvitation",
        });
        dispatch({
            type: tabsActions.SET_SHOW_PENDING_INVITATION,
        });
    };
    return (
        <div className={styles.listItem}>
            <div
                className={`${styles.Item} ${selectItem === "listFriend" ? styles.selectItem : ""}`}
                onClick={handleClickListFriends}
            >
                <div className={styles.Icon}>
                    <IconUser />
                </div>
                <p>{i18n._("Friends List")}</p>
            </div>
            <div
                className={`${styles.Item} ${
                    selectItem === "friendInvitation" ? styles.selectItem : ""
                }`}
                onClick={handleClickPendingInvitation}
            >
                <div className={styles.Icon}>
                    <IconMailOpened />
                </div>
                <p>{i18n._("Friends request")}</p>
                {pendingInvitation.length !== 0 && (
                    <div className={styles.quantityFriendInvitation}>
                        <span>{pendingInvitation.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
