import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { Conversation } from "../Conversation";
import { Oval } from "react-loader-spinner";
import { useEffect } from "react";
import { useLayoutEffect } from "react";
import { useState } from "react";
import { useLingui } from "@lingui/react";
import { RootState } from "@/redux/store";

export const ConversationList = () => {
    let i18n = useLingui();
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const [conversationsShow, setConversationsShow] = useState<any>([]);
    useLayoutEffect(() => {
        if (conversations) {
            let conversationsShow = [...conversations];
            for (let i = 0; i < conversationsShow.length - 1; i++) {
                let conversationI = conversationsShow[i];
                if (conversationI.messages.length) {
                    let lastMessageI = conversationI.messages[conversationI.messages.length - 1];
                    for (let j = i + 1; j < conversationsShow.length; j++) {
                        let conversationJ = conversationsShow[j];
                        if (conversationJ.messages.length) {
                            let lastMessageJ =
                                conversationJ.messages[conversationJ.messages.length - 1];
                            if (lastMessageJ.date > lastMessageI.date) {
                                let temp = conversationsShow[i];
                                conversationsShow[i] = conversationsShow[j];
                                conversationsShow[j] = temp;
                            }
                        }
                    }
                }
            }
            setConversationsShow(conversationsShow);
        }
    }, [conversations]);

    useEffect(() => {
        let headerTabTwoElement = document.getElementById("headerTabTwo");
        let conversationListElement = document.getElementById("conversationList");
        if (headerTabTwoElement && conversationListElement) {
            let heightList = window.innerHeight - headerTabTwoElement.clientHeight;
            conversationListElement.style.height = heightList - 5 + "px";
        }
    });
    return (
        <div
            id="conversationList"
            className={`${styles.conversationList} ${
                theme === "dark" && styles.conversationListDark
            }`}
        >
            {!conversations && (
                <div className={styles.listLoader}>
                    <Oval width={50} height={50} color="#0062cc" secondaryColor="#ccc" />
                </div>
            )}
            {conversations?.length == 0 && (
                <div className={styles.noListConversation}>
                    {i18n._("Make friends to start chatting")}
                </div>
            )}
            {conversations &&
                conversationsShow.map((conversation: any) => {
                    return <Conversation key={conversation._id} conversation={conversation} />;
                })}
        </div>
    );
};
