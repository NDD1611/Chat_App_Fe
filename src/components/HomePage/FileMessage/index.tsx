import { useState } from "react";
import { useLayoutEffect } from "react";
import styles from "./index.module.scss";
import { PrepareIconFile } from "../PrepareIconFile";
import { initializeApp } from "firebase/app";
import { getBlob, getStorage, ref } from "firebase/storage";
import { calcFileSize } from "@/utils/message.util";
import { IconDownload } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { firebaseConfig } from "@/firebase/firebase.config";

export const FileMessage = ({ message, bgColor }: { message: any; bgColor: string }) => {
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [fileSizeType, setFileSizeType] = useState("");
    const [ext, setExt] = useState("");
    const [showLoader, setShowLoader] = useState(false);

    const downloadFile = async () => {
        try {
            setShowLoader(true);
            let res = await fetch(message.content);
            let blob = await res.blob();
            let pathBlob = URL.createObjectURL(blob);
            let aElement = document.createElement("a");
            aElement.href = pathBlob;
            aElement.download = fileName;
            document.body.appendChild(aElement);
            aElement.click();
            document.body.removeChild(aElement);
            setShowLoader(false);
        } catch (e) {
            console.log(e, "err");
        }
    };
    const downloadFileFirebase = async () => {
        try {
            setShowLoader(true);
            const app = initializeApp(firebaseConfig);
            const storage = getStorage();
            let fileNameOnCloud = message.content.split("?")[0].split("%2F").pop();
            const storageRef = ref(storage, "file/" + fileNameOnCloud);

            let blob = await getBlob(storageRef);
            let pathBlob = URL.createObjectURL(blob);
            let aElement = document.createElement("a");
            aElement.href = pathBlob;
            aElement.download = fileName;
            document.body.appendChild(aElement);
            aElement.click();
            document.body.removeChild(aElement);
            setShowLoader(false);
        } catch (e) {
            console.log(e, "err");
        }
    };
    useLayoutEffect(() => {
        if (message.type) {
            let type = JSON.parse(message.type);
            setFileName(type.name);
            // calculator file size
            if (type?.size) {
                let { size, sizeType } = calcFileSize(type.size);
                setFileSize(size);
                setFileSizeType(sizeType);
            }
            // find .ext from file name
            let name = type.name;
            if (name) {
                let ext = name.split(".").pop();
                setExt(ext);
            }
        }
    }, []);
    return (
        <div className={styles.contentFile} style={{ backgroundColor: `${bgColor}` }}>
            <div className={styles.iconFile}>
                <PrepareIconFile ext={ext} />
            </div>
            <div className={styles.rightFile}>
                <p className={styles.fileName}> {fileName} </p>
                {message.status == "0" && (
                    <div className={styles.progress}>
                        <div className={styles.progressBar}>
                            <div id={message.date} className={styles.bar}></div>
                        </div>
                        <div id={message.date + "filesize"}>
                            {/* change from send file at iconTopInput */}
                        </div>
                    </div>
                )}
                {message.status != "0" && (
                    <div className={styles.rightBottom}>
                        <div className={styles.size}>{fileSize + fileSizeType}</div>
                        <div>
                            {showLoader ? (
                                <Button
                                    className={styles.downloadBtn}
                                    classNames={styles}
                                    onClick={downloadFileFirebase}
                                    loading
                                    loaderProps={{ type: "dots" }}
                                >
                                    <IconDownload size={20} color="#fff" />
                                </Button>
                            ) : (
                                <Button
                                    className={styles.downloadBtn}
                                    classNames={styles}
                                    onClick={downloadFileFirebase}
                                >
                                    <IconDownload size={20} color="#fff" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
