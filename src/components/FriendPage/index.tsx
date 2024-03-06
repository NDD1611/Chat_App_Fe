"use client";
import { useEffect, useState } from "react";
import { logout } from "@/utils/auth.util";
import { useDispatch, useSelector } from "react-redux";
import { tabsActions } from "@/redux/actions/tabsAction";
import { TabTwo } from "@/components/Common/TabTwo";
import { MenuItemFriend } from "./MenuItemFriend";
import HeaderTabTwo from "@/components/Common/TabTwo/HeaderTabTwo";
import { TabThree } from "@/components/Common/TabThree";
import { PendingInvitation } from "./PendingInvitation";
import { ListFriend } from "./ListFriend";
import { Navbar } from "@/components/Common/Navbar";
import { RootState } from "@/redux/store";
import classes from "./index.module.scss";
import { checkScreenDevice } from "@/utils/screen.util";

export const FriendPage = () => {
    const dispatch = useDispatch();
    const [device, setDevice] = useState<String>("pc");
    const selectItem = useSelector((state: RootState) => state.friend.selectItem);
    const showListFriends = useSelector((state: RootState) => state.tabs.showListFriends);
    const showPendingInvitation = useSelector(
        (state: RootState) => state.tabs.showPendingInvitation,
    );

    useEffect(() => {
        dispatch({
            type: tabsActions.SET_MAIN_TAB,
            maintabSelect: "friends",
        });
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        if (!userDetails) {
            logout();
        }
        let device = checkScreenDevice();
        setDevice(device);
    }, []);

    if (device === "mobile" && showListFriends) {
        return (
            <div className={classes.chatArea}>
                <TabThree>{selectItem === "listFriend" && <ListFriend></ListFriend>}</TabThree>
            </div>
        );
    }

    if (device === "mobile" && showPendingInvitation) {
        return (
            <div className={classes.chatArea}>
                <TabThree>
                    {selectItem === "friendInvitation" && <PendingInvitation></PendingInvitation>}
                </TabThree>
            </div>
        );
    }

    if (device === "mobile" && !showListFriends && !showPendingInvitation) {
        return (
            <div id="friendPage" className={classes.friendPage}>
                <div className={classes.navBar}>
                    <Navbar></Navbar>
                </div>
                <div className={classes.friendList}>
                    <TabTwo>
                        <HeaderTabTwo></HeaderTabTwo>
                        <MenuItemFriend></MenuItemFriend>
                    </TabTwo>
                </div>
            </div>
        );
    }

    return (
        <div id="friendPage" className={classes.friendPage}>
            <div className={classes.navBar}>
                <Navbar></Navbar>
            </div>
            <div className={classes.friendList}>
                <TabTwo>
                    <HeaderTabTwo></HeaderTabTwo>
                    <MenuItemFriend></MenuItemFriend>
                </TabTwo>
            </div>
            <div className={classes.chatArea}>
                <TabThree>
                    {selectItem === "friendInvitation" && <PendingInvitation></PendingInvitation>}
                    {selectItem === "listFriend" && <ListFriend></ListFriend>}
                </TabThree>
            </div>
        </div>
    );
};
