import { useSelector } from "react-redux";

import { MessageEmoji } from "../MessageEmoji";
import styles from "./MessageRight.module.scss";
import { memo, useState } from "react";
import { RootState } from "@/redux/store";
import { FileMessage } from "../FileMessage";
import { useLingui } from "@lingui/react";

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
                    {message.status == "0" && (
                        <div className={styles.loaderImage}>
                            <div className={styles.backgroundImageLoader}></div>
                            <div
                                className={styles.circularProgress}
                                id={message.date + "circularProgress"}
                            >
                                <span
                                    className={styles.progressValue}
                                    id={message.date + "progressValue"}
                                >
                                    0%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return <FileMessage message={message} bgColor="#0A7CFF" />;
    }
};

function arePropsEqual(oldProps: any, newProps: any) {
    return (
        oldProps.message._id === newProps.message._id &&
        oldProps.isLastMessage === newProps.isLastMessage &&
        oldProps.status === newProps.status
    );
}
const MessageRight = memo(
    ({
        message,
        isLastMessage,
        status,
    }: {
        message: any;
        isLastMessage: Boolean;
        status: String;
    }) => {
        let i18n = useLingui();
        const theme = useSelector((state: RootState) => state.themeMode.theme);
        let statusString;
        if (isLastMessage) {
            switch (status) {
                case "0":
                    statusString = i18n._("sending");
                    break;
                case "1":
                    statusString = i18n._("sent");
                    break;
                case "2":
                    statusString = i18n._("received");
                    break;
                case "3":
                    statusString = i18n._("watched");
                    break;
            }
        }
        return (
            <>
                {message.sameDay === false && (
                    <div className={styles.dateShow}>
                        <p>{message.dateShow}</p>
                    </div>
                )}
                {message.sameAuth == false && <div style={{ height: "10px" }}></div>}
                <div className={styles.messageRight}>
                    <Content message={message} />
                </div>
                <div
                    className={`${styles.footerDate} ${theme === "dark" && styles.footerDateDark}`}
                >
                    {message.showTime ? message.hourMinute : ""}
                </div>
                <div className={styles.status}>
                    {isLastMessage && <div className={styles.contentStatus}>{statusString}</div>}
                </div>
            </>
        );
    },
    arePropsEqual,
);
MessageRight.displayName = "MessageRight";
export default MessageRight;
