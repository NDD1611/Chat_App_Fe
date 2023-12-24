import styles from "./ModalCreateGroup.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/redux/actions/modalActions";
import { useEffect, useState } from "react";
import { Avatar } from "@mantine/core";
import { IconCircle, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useLingui } from "@lingui/react";
import { Button, Modal } from "@mantine/core";
import { createGroupApi } from "@/api/api";
import { toastMessage } from "@/utils/toast.util";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";
const ModalCreateGroup = () => {
    let i18n = useLingui();
    const listFriends = useSelector((state: RootState) => state.friend.listFriends);
    const [groupName, setGroupName] = useState("");
    const [groupSelect, setGroupSelect] = useState([]);
    const [check, setCheck] = useState(false);
    const dispatch = useDispatch();
    const showModalCreateGroup = useSelector(
        (state: RootState) => state.modal.showModalCreateGroup,
    );
    const handleCloseModalCreateGroup = () => {
        dispatch({
            type: modalActions.SET_HIDE_MODAL_CREATE_GROUP,
        });
    };
    useEffect(() => {
        if (groupSelect.length >= 2 && groupName !== "") {
            setCheck(true);
        } else {
            setCheck(false);
        }
    }, [groupSelect, groupName]);

    const handleClickFriend = (user: any) => {
        let copyGroupSelect = JSON.parse(JSON.stringify(groupSelect));
        let check = false;
        groupSelect.map((x: any) => {
            if (user._id == x._id) {
                check = true;
            }
        });
        if (check) {
            copyGroupSelect = groupSelect.filter((x: any) => {
                return x._id != user._id;
            });
        } else {
            copyGroupSelect.push(user);
        }
        setGroupSelect(copyGroupSelect);
    };
    const checkUserExitInArray = (user: any, array: any) => {
        let check = false;
        for (let x of array) {
            if (user._id == x._id) {
                check = true;
            }
        }
        return check;
    };
    const handleRemoveUserFromGroupSelect = (user: any) => {
        let copyGroupSelect = groupSelect.filter((x: any) => {
            return x._id != user._id;
        });
        setGroupSelect(copyGroupSelect);
    };
    const createGroup = async () => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        if (check && userDetails) {
            let listIds = [userDetails._id, ...groupSelect.map((user: any) => user._id)];
            let data = {
                groupName: groupName,
                participants: listIds,
                leaderId: userDetails._id,
            };
            console.log(data);
            let res: any = await createGroupApi(data);
            handleCloseModalCreateGroup();
            if (res.err) {
                toast.error(toastMessage(res?.exception?.response?.data?.code, i18n));
            } else {
                toast.success(toastMessage(res?.response?.data?.code, i18n));
            }
        } else {
            alert(i18n._("Type in the group name and choose at least two friends"));
        }
    };
    return (
        <Modal
            size={"xl"}
            opened={showModalCreateGroup}
            onClose={handleCloseModalCreateGroup}
            title={i18n._("Create group")}
        >
            <div className={styles.content}>
                <div className={styles.bodyModal}>
                    <div className={styles.inputEmail}>
                        <input
                            value={groupName}
                            placeholder={i18n._("Group name") + "..."}
                            onChange={(e) => {
                                setGroupName(e.target.value);
                            }}
                        />
                    </div>
                    <div className={styles.listFriend}>
                        <div className={styles.listLeft}>
                            {listFriends &&
                                listFriends.map((friend: any) => {
                                    let check = checkUserExitInArray(friend, groupSelect);
                                    return (
                                        <div
                                            key={friend._id}
                                            className={styles.friendItem}
                                            onClick={() => {
                                                handleClickFriend(friend);
                                            }}
                                        >
                                            <div className={styles.check}>
                                                {check ? (
                                                    <IconCircleCheck color="#0d65fd" />
                                                ) : (
                                                    <IconCircle color="#ccc" />
                                                )}
                                            </div>
                                            <div>
                                                <Avatar src={friend?.avatar} size={30} />
                                            </div>
                                            <div className={styles.name}>
                                                {friend.firstName + " " + friend.lastName}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        {groupSelect.length > 0 && (
                            <div className={styles.listFriendSelect}>
                                {groupSelect &&
                                    groupSelect.map((friend: any) => {
                                        return (
                                            <div key={friend._id} className={styles.friendSelect}>
                                                <div className={styles.selectLeft}>
                                                    <div>
                                                        <Avatar src={friend?.avatar} size={20} />
                                                    </div>
                                                    <div className={styles.name}>
                                                        {friend.firstName + " " + friend.lastName}
                                                    </div>
                                                </div>
                                                <div>
                                                    <IconCircleX
                                                        onClick={(e: any) => {
                                                            handleRemoveUserFromGroupSelect(friend);
                                                        }}
                                                        color="#0d65fd"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.footerBtn}>
                    <Button className={styles.btnCancel} onClick={handleCloseModalCreateGroup}>
                        {i18n._("Cancel")}
                    </Button>
                    <Button
                        className={`${styles.btnFind} ${!check && styles.opacityHalf}`}
                        onClick={createGroup}
                    >
                        {i18n._("Create")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalCreateGroup;
