"use client";
import { logout } from "@/utils/auth.util";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Common/Navbar";
import { TabTwo } from "../Common/TabTwo";
import HeaderTabTwo from "../Common/TabTwo/HeaderTabTwo";
import { ConversationList } from "./ConversationList";
import { TabThree } from "../Common/TabThree";
import ChatArea from "./ChatArea";
export const HomePages = () => {
    const [render, setRender] = useState<Boolean>(false);

    useEffect(() => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        if (!userDetails) {
            logout();
        } else {
            setRender(true);
        }
    }, []);
    if (render)
        return (
            <div id="dashboard" className="flex h-screen w-screen">
                <Navbar></Navbar>
                <TabTwo>
                    <HeaderTabTwo />
                    <ConversationList />
                </TabTwo>
                <TabThree>
                    <ChatArea></ChatArea>
                </TabThree>
            </div>
        );
};
