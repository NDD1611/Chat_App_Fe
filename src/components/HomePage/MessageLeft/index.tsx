import { useSelector } from "react-redux";
import { MessageEmoji } from "../MessageEmoji";
import styles from "./index.module.scss";
import { useState } from "react";
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
export const MessageLeft = ({ message }: { message: any }) => {
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    return (
        <>
            <div className={`${styles.messageLeft} ${theme === "dark" && styles.messageLeftDark}`}>
                <Content message={message} />
                <div className={styles.footerDate}>
                    {message.showTime ? message.hourMinute : ""}
                </div>
            </div>
        </>
    );
};
