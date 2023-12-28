import { useSelector, useDispatch } from "react-redux";
import styles from "./index.module.scss";
import { friendActions } from "@/redux/actions/friendAction";
import { tabsActions } from "@/redux/actions/tabsAction";
import { useLingui } from "@lingui/react";
import { RootState } from "@/redux/store";
import { IconMailOpened, IconUser } from "@tabler/icons-react";

export const MenuItemFriend = () => {
    let i18n = useLingui();
    const dispatch = useDispatch();
    const selectItem = useSelector((state: RootState) => state.friend.selectItem);
    const pendingInvitation = useSelector((state: RootState) => state.friend.pendingInvitations);

    const showTab3AndCloseTabTwo = () => {
        if (window.innerWidth < 700) {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE,
            });
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_TWO,
            });
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_ONE,
            });
        } else {
            dispatch({
                type: tabsActions.SET_SHOW_TAB_THREE,
            });
            dispatch({
                type: tabsActions.SET_SHOW_TAB_TWO,
            });
        }
    };
    return (
        <>
            <div>
                <div
                    className={`${styles.Item} ${
                        selectItem === "listFriend" ? styles.selectItem : ""
                    }`}
                    onClick={() => {
                        dispatch({
                            type: friendActions.SET_SELECT_ITEM_TAB_TWO,
                            selectItem: "listFriend",
                        });
                        showTab3AndCloseTabTwo();
                    }}
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
                    onClick={() => {
                        dispatch({
                            type: friendActions.SET_SELECT_ITEM_TAB_TWO,
                            selectItem: "friendInvitation",
                        });
                        showTab3AndCloseTabTwo();
                    }}
                >
                    <div className={styles.Icon}>
                        <IconMailOpened />
                    </div>
                    <p>{i18n._("Friend request")}</p>
                    {pendingInvitation.length !== 0 && (
                        <div className={styles.quantityFriendInvitation}>
                            <span>{pendingInvitation.length}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
