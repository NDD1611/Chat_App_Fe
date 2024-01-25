import { useSelector } from "react-redux";

import { MessageEmoji } from "../MessageEmoji";
import styles from "./MessageRight.module.scss";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { FileMessage } from "../FileMessage";

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

export const MessageRight = ({ message }: { message: any }) => {
    const theme = useSelector((state: RootState) => state.themeMode.theme);
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
            <div className={`${styles.footerDate} ${theme === "dark" && styles.footerDateDark}`}>
                {message.showTime ? message.hourMinute : ""}
            </div>
            <div className={styles.status}>
                {message.showStatus ? (
                    <span className={styles.contentStatus}>{message.statusText}</span>
                ) : (
                    ""
                )}
            </div>
        </>
    );
};
