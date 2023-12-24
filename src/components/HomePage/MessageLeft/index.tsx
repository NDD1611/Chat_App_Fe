import { useSelector } from "react-redux";
import { MessageEmoji } from "../MessageEmoji";
import styles from "./index.module.scss";
import { useState } from "react";
import { FileMessage } from "../FileMessage";
import { memo } from "react";
import { RootState } from "@/redux/store";

const Content = ({ message }: { message: any }) => {
    const maxWidth = useSelector((state: RootState) => state.message.maxWidth);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const [widthImg, setWidthImg] = useState(0);
    const handleLoadImg = (e: any) => {
        let img = e.target;
        let widthImg = img.naturalWidth * 0.3;
        if (widthImg > maxWidth) {
            setWidthImg(maxWidth);
        } else if (widthImg < 200) {
            setWidthImg(200);
        } else {
            setWidthImg(widthImg);
        }
    };

    if (message.type == "text") {
        return (
            <div className={styles.content} style={{ maxWidth: maxWidth + "px" }}>
                <MessageEmoji text={message.content} />
            </div>
        );
    } else if (message.type == "image") {
        return (
            <div className={styles.contentImage}>
                <div
                    className={styles.messageImage}
                    style={{ maxWidth: widthImg + "px", maxHeight: "500px" }}
                >
                    <img onLoad={handleLoadImg} src={message.content} />
                </div>
            </div>
        );
    } else {
        return (
            <div
                className={`${styles.containerFileLeft} ${
                    theme === "dark" && styles.containerFileLeftDark
                }`}
            >
                <FileMessage message={message} />
            </div>
        );
    }
};
export const MessageLeft = ({ message }: { message: any }) => {
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    return (
        <div className={`${styles.messageLeft} ${theme === "dark" && styles.messageLeftDark}`}>
            <Content message={message} />
            <div className={styles.footerDate}>{message.showTime ? message.hourMinute : ""}</div>
        </div>
    );
};
