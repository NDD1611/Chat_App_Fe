import { useSelector } from "react-redux";
import { MessageEmoji } from "../MessageEmoji";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import { FileMessage } from "../FileMessage";
import { memo } from "react";
import { RootState } from "@/redux/store";
import { Avatar } from "@mantine/core";

const Content = ({ message }: { message: any }) => {
    if (message.type == "text") {
        return (
            <div className={styles.content}>
                <MessageEmoji text={message.content} />
            </div>
        );
    } else if (message.type == "image") {
        return (
            <div className={styles.contentImage}>
                <div className={styles.messageImage}>
                    <img src={message.content} />
                </div>
            </div>
        );
    } else {
        return <FileMessage message={message} bgColor="#ccc" />;
    }
};
function arePropsEqual(oldProps: any, newProps: any) {
    return (
        oldProps.message._id === newProps.message._id &&
        oldProps.isLastMessage === newProps.isLastMessage
    );
}
const MessageLeft = memo(
    ({
        message,
        sameAuthPre,
        sameAuthNext,
        isLastMessage,
    }: {
        message: any;
        sameAuthPre: Boolean;
        sameAuthNext: Boolean;
        isLastMessage: Boolean;
    }) => {
        let date = new Date(message?.date);
        let dateString = `
        ${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}
        :
        ${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
        return (
            <>
                <div className={styles.containerLeft}>
                    {!sameAuthPre && (
                        <Avatar
                            src={message?.sender?.avatar}
                            style={{ backgroundColor: "#fff" }}
                            size={"md"}
                        />
                    )}
                </div>
                <div className={`${styles.messageLeft}`}>
                    <Content message={message} />
                    <div className={styles.footerDate}>{!sameAuthNext && dateString}</div>
                </div>
            </>
        );
    },
    arePropsEqual,
);
MessageLeft.displayName = "MessageLeft";
export default MessageLeft;
