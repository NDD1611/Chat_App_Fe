"use client";
import { useEffect } from "react";
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

export const FriendPage = () => {
    const dispatch = useDispatch();
    const selectItem = useSelector((state: RootState) => state.friend.selectItem);

    useEffect(() => {
        if (window.location.pathname === "/friend") {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: "friends",
            });
        }
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        if (!userDetails) {
            logout();
        }
    }, []);
    return (
        <div id="dashboard" className={classes.friendPage}>
            <div className={classes.navBar}>
                <Navbar></Navbar>
            </div>
            <div className={classes.conversation}>
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
