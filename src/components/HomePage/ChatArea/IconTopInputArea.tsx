import styles from "./IconTopInputArea.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { conversationActions } from "@/redux/actions/conversationAction";
import { sendMessage, sendMessageGroup } from "@/socket/connection.socket";
import { toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { calcFileSize } from "@/utils/message.util";
import { useLingui } from "@lingui/react";
import { IconPaperclip, IconPhoto } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { firebaseConfig } from "@/firebase/firebase.config";
import { createConversation } from "@/api/conversation";
export const IconTopInputArea = () => {
    let i18n = useLingui();
    const dispatch = useDispatch();
    const conversationSelected = useSelector(
        (state: RootState) => state.conversation.conversationSelected,
    );
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const [isGroup, setIsGroup] = useState(false);
    useEffect(() => {
        if (conversationSelected?.participants?.length > 2) {
            setIsGroup(true);
        } else {
            setIsGroup(false);
        }
    }, [conversationSelected]);
    const handleSendImage = async (e: any) => {
        let file = e.target.files[0];
        let fileBlob = file instanceof Blob ? file : new Blob([file], { type: file.type });
        if (file) {
            let srcBlob = URL.createObjectURL(file);
            let userDetailsJson = localStorage.getItem("userDetails");
            let userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
            let receiverUserJson = localStorage.getItem("receiverUser");
            let receiverUser = receiverUserJson ? JSON.parse(receiverUserJson) : null;
            let conversationSelectedId = conversationSelected._id;
            let conversationCurrent = null;
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index];
                }
            }
            let dateMessage = new Date().getTime();
            if (conversationCurrent) {
                let data = {
                    _id: new Date(),
                    sender: {
                        _id: userDetails._id,
                    },
                    conversation: { _id: conversationSelectedId },
                    content: srcBlob,
                    type: "image",
                    date: dateMessage,
                    status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                };
                if (conversationCurrent.messages.length) {
                    conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime =
                        false;
                }
                conversationCurrent.messages.push(data);
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent,
                });

                const app = initializeApp(firebaseConfig);
                const storage = getStorage();
                let fileName =
                    dateMessage +
                    "-" +
                    Math.round(Math.random() * 1e9) +
                    "." +
                    file.name.split(".").pop();
                const storageRef = ref(storage, "file/" + fileName);
                const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        let progressBarCircleElement = document.getElementById(
                            dateMessage + "circularProgress",
                        );
                        let progressCircleValue = document.getElementById(
                            dateMessage + "progressValue",
                        );
                        if (progressBarCircleElement && progressCircleValue) {
                            progressBarCircleElement.style.background = `conic-gradient(#0091ff ${
                                progress * 3.6
                            }deg, #ededed 0deg)`;
                            progressCircleValue.innerText = Math.floor(progress) + "/%";
                        }
                    },
                    (error) => {
                        console.log(error);
                        toast.error(i18n._("An error occurred. Please try again later."));
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            let newData = {
                                _id: dateMessage,
                                sender: {
                                    _id: userDetails._id,
                                },
                                receiverId: receiverUser._id,
                                conversation: { _id: conversationSelectedId },
                                content: downloadURL,
                                type: "image",
                                date: dateMessage,
                                status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                            };
                            if (isGroup) {
                                sendMessageGroup(newData);
                            } else {
                                sendMessage(newData);
                            }
                        });
                    },
                );
            } else {
                let response: any = await createConversation({
                    senderId: userDetails._id,
                    receiverId: receiverUser._id,
                });
                if (response.error) {
                    toast.error(i18n._("An error occurred. Please try again later."));
                } else {
                    let { conversation } = response?.data?.metadata;
                    for (let index in conversation.participants) {
                        if (conversation.participants[index] == userDetails._id) {
                            conversation.participants[index] = userDetails;
                        }
                        if (conversation.participants[index] == receiverUser._id) {
                            conversation.participants[index] = receiverUser;
                        }
                    }
                    let dateMessage = Date.now();
                    let data = {
                        _id: new Date(),
                        sender: {
                            _id: userDetails._id,
                        },
                        conversation: { _id: conversation._id },
                        content: srcBlob,
                        type: "image",
                        date: dateMessage,
                        status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    };
                    if (conversation.messages.length) {
                        conversation.messages[conversation.messages.length - 1].showTime = false;
                    }
                    conversation.messages.push(data);
                    let newConversations = [...conversations, conversation];
                    dispatch({
                        type: conversationActions.SET_SELECT_CONVERSATION,
                        conversationSelected: conversation,
                    });
                    dispatch({
                        type: conversationActions.SET_CONVERSATION,
                        conversations: newConversations,
                    });

                    const app = initializeApp(firebaseConfig);
                    const storage = getStorage();
                    let fileName =
                        dateMessage +
                        "-" +
                        Math.round(Math.random() * 1e9) +
                        "." +
                        file.name.split(".").pop();
                    const storageRef = ref(storage, "file/" + fileName);
                    const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            let progressBarCircleElement = document.getElementById(
                                dateMessage + "circularProgress",
                            );
                            let progressCircleValue = document.getElementById(
                                dateMessage + "progressValue",
                            );
                            if (progressBarCircleElement && progressCircleValue) {
                                progressBarCircleElement.style.background = `conic-gradient(#0091ff ${
                                    progress * 3.6
                                }deg, #ededed 0deg)`;
                                progressCircleValue.innerText = Math.floor(progress) + "/%";
                            }
                        },
                        (error) => {
                            console.log(error);
                            toast.error(i18n._("An error occurred. Please try again later."));
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                let newData = {
                                    _id: dateMessage,
                                    sender: {
                                        _id: userDetails._id,
                                    },
                                    receiverId: receiverUser._id,
                                    conversation: { _id: conversation._id },
                                    content: downloadURL,
                                    type: "image",
                                    date: dateMessage,
                                    status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                                };
                                if (isGroup) {
                                    sendMessageGroup(newData);
                                } else {
                                    sendMessage(newData);
                                }
                            });
                        },
                    );
                }
            }
        }
    };

    const sendFileUploadToFirebase = async (e: any) => {
        let file: any = e.target.files[0];
        if (file) {
            let dateMessage = Date.now();
            let fileBlob = file instanceof Blob ? file : new Blob([file], { type: file?.type });
            let srcBlob = URL.createObjectURL(file);
            let type = JSON.stringify({
                name: file.name,
                size: file.size,
                type: file.type,
            });
            let userDetailsJson = localStorage.getItem("userDetails");
            let userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
            let receiverUserJson = localStorage.getItem("receiverUser");
            let receiverUser = receiverUserJson ? JSON.parse(receiverUserJson) : null;
            let conversationSelectedId = conversationSelected._id;
            let conversationCurrent = null;
            for (let index = 0; index < conversations.length; index++) {
                if (conversations[index]._id == conversationSelectedId) {
                    conversationCurrent = conversations[index];
                }
            }
            if (conversationCurrent) {
                let data = {
                    _id: dateMessage,
                    sender: {
                        _id: userDetails._id,
                    },
                    conversation: { _id: conversationSelectedId },
                    content: srcBlob,
                    type: type,
                    date: dateMessage,
                    status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                };
                conversationCurrent.messages[conversationCurrent.messages.length - 1].showTime =
                    false;
                conversationCurrent.messages.push(data);
                dispatch({
                    type: conversationActions.SEND_NEW_MESSAGE,
                    newConversation: conversationCurrent,
                });

                const app = initializeApp(firebaseConfig);
                const storage = getStorage();
                let fileName =
                    dateMessage +
                    "-" +
                    Math.round(Math.random() * 1e9) +
                    "." +
                    file.name.split(".").pop();
                const storageRef = ref(storage, "file/" + fileName);
                const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                let count = 0;
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        if (count > 0) {
                            const progress =
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            let progressBarElement = document.getElementById(
                                dateMessage.toString(),
                            );
                            let infoSizeElement = document.getElementById(dateMessage + "filesize");
                            if (progressBarElement && infoSizeElement) {
                                let { size, sizeType } = calcFileSize(file.size);
                                let progressSize: any = String(
                                    Math.floor((progress / 100) * size * 100) / 100,
                                );
                                progressBarElement.style.width = progress + "%";
                                // convert 52.2 ->52.20, 7.1->7.10
                                let progressSizeString =
                                    progressSize.split(".").pop().length == 1
                                        ? progressSize + "0"
                                        : progressSize;
                                infoSizeElement.innerText =
                                    progressSizeString + "/" + size + sizeType;
                            }
                            count = 0;
                        }
                        count++;
                    },
                    (error) => {
                        console.log(error);
                        toast.error(i18n._("An error occurred. Please try again later."));
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            let newData = {
                                _id: dateMessage,
                                sender: {
                                    _id: userDetails._id,
                                },
                                receiverId: receiverUser._id,
                                conversation: { _id: conversationSelectedId },
                                content: downloadURL,
                                type: type,
                                date: dateMessage,
                                status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                            };
                            if (isGroup) {
                                sendMessageGroup(newData);
                            } else {
                                sendMessage(newData);
                            }
                        });
                    },
                );
            } else {
                let response: any = await createConversation({
                    senderId: userDetails._id,
                    receiverId: receiverUser._id,
                });
                if (response.error) {
                    toast.error(i18n._("An error occurred. Please try again later."));
                } else {
                    let { conversation } = response?.data?.metadata;
                    for (let index in conversation.participants) {
                        if (conversation.participants[index] == userDetails._id) {
                            conversation.participants[index] = userDetails;
                        }
                        if (conversation.participants[index] == receiverUser._id) {
                            conversation.participants[index] = receiverUser;
                        }
                    }
                    let dateMessage = Date.now();
                    let data = {
                        sender: {
                            _id: userDetails._id,
                        },
                        receiverId: receiverUser._id,
                        content: "",
                        type: type,
                        date: dateMessage,
                        status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                    };
                    if (conversation.messages.length) {
                        conversation.messages[conversation.messages.length - 1].showTime = false;
                    }
                    conversation.messages.push(data);
                    let newConversations = [...conversations, conversation];
                    dispatch({
                        type: conversationActions.SET_SELECT_CONVERSATION,
                        conversationSelected: conversation,
                    });
                    dispatch({
                        type: conversationActions.SET_CONVERSATION,
                        conversations: newConversations,
                    });

                    const app = initializeApp(firebaseConfig);
                    const storage = getStorage();
                    let fileName =
                        dateMessage +
                        "-" +
                        Math.round(Math.random() * 1e9) +
                        "." +
                        file.name.split(".").pop();
                    const storageRef = ref(storage, "file/" + fileName);
                    const uploadTask = uploadBytesResumable(storageRef, fileBlob);
                    let count = 0;
                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            if (count > 0) {
                                const progress =
                                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                let progressBarElement = document.getElementById(
                                    dateMessage.toString(),
                                );
                                let infoSizeElement = document.getElementById(
                                    dateMessage + "filesize",
                                );
                                if (progressBarElement && infoSizeElement) {
                                    let { size, sizeType } = calcFileSize(file.size);
                                    let progressSize: any = String(
                                        Math.floor((progress / 100) * size * 100) / 100,
                                    );
                                    progressBarElement.style.width = progress + "%";
                                    // convert 52.2 ->52.20, 7.1->7.10
                                    let progressSizeString =
                                        progressSize.split(".").pop().length == 1
                                            ? progressSize + "0"
                                            : progressSize;
                                    infoSizeElement.innerText =
                                        progressSizeString + "/" + size + sizeType;
                                }
                                count = 0;
                            }
                            count++;
                        },
                        (error) => {
                            console.log(error);
                            toast.error(i18n._("An error occurred. Please try again later."));
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                let newData = {
                                    _id: dateMessage,
                                    sender: {
                                        _id: userDetails._id,
                                    },
                                    receiverId: receiverUser._id,
                                    conversation: { _id: conversation._id },
                                    content: downloadURL,
                                    type: type,
                                    date: dateMessage,
                                    status: "0", //0: dang gui, 1: da gui, 2: da nhan, 3: da xem.
                                };
                                if (isGroup) {
                                    sendMessageGroup(newData);
                                } else {
                                    sendMessage(newData);
                                }
                            });
                        },
                    );
                }
            }
        }
    };
    return (
        <div className={styles.iconTopInput}>
            <label htmlFor="inputImage" className={styles.oneIcon}>
                <IconPhoto />
                <input
                    id="inputImage"
                    type="file"
                    accept="image/*"
                    className={styles.inputImage}
                    onChange={handleSendImage}
                />
            </label>
            <label htmlFor="inputFile" className={styles.oneIcon}>
                <IconPaperclip />
                {/* <input id='inputFile' type='file' className={styles.inputImage}
                    onChange={handleChangeInputFile}
                /> */}
                <input
                    id="inputFile"
                    type="file"
                    className={styles.inputImage}
                    onChange={sendFileUploadToFirebase}
                />
            </label>
        </div>
    );
};
