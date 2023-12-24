import { useSelector } from "react-redux";

import { MessageEmoji } from "../MessageEmoji";
import styles from "./MessageRight.module.scss";
import { useState } from "react";
import { RootState } from "@/redux/store";
import { FileMessage } from "../FileMessage";

const Content = ({ message }: { message: any }) => {
    const maxWidth = useSelector((state: RootState) => state.message.maxWidth);
    const [widthImg, setWidthImg] = useState(0);
    const handleLoadImg = (e: any) => {
        let img = e.target;
        let widthImg = img.naturalWidth * 0.3;
        // let heightImg = img.naturalHeight * 0.3
        if (widthImg > maxWidth) {
            setWidthImg(maxWidth);
        } else if (widthImg < 200) {
            setWidthImg(widthImg * 2);
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
                    {message.status == "0" && (
                        <div className={styles.loaderImage}>
                            {/* <Oval
                            width={50}
                            height={50}
                            color="#0062cc"
                            secondaryColor="#ccc"
                        /> */}
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
        return (
            <div className={styles.containerFileRight}>
                <FileMessage message={message} />
            </div>
        );
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
            <div
                className={`${styles.messageRight} ${theme === "dark" && styles.messageRightDark}`}
            >
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
