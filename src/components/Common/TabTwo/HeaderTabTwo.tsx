import styles from "./HeaderTabTwo.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "@/redux/actions/modalActions";
// import ModalFindFriend from '../Modals/ModalFindFriend'
// import ModalCreateGroup from '../Modals/ModalCreateGroup'
import { Tooltip } from "@mantine/core";
import { useLingui } from "@lingui/react";
import { IconUserPlus, IconUsersGroup } from "@tabler/icons-react";
import { RootState } from "@/redux/store";
import { ModalFindFriend } from "../ModalFindFriend/ModalFindFriend";
import ModalCreateGroup from "../ModalCreateGroup/ModalCreateGroup";

const HeaderTabTwo = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    let i18n = useLingui();
    return (
        <>
            <div id="headerTabTwo" className={styles.HeaderTabTwo}>
                <div className={styles.input}>
                    <Tooltip label={i18n._("Coming soon")}>
                        <input disabled placeholder={i18n._("Search") + "..."} />
                    </Tooltip>
                </div>
                <div
                    className={styles.iconAddFriend}
                    onClick={() => {
                        dispatch({ type: modalActions.SET_SHOW_MODAL_FIND_FRIEND });
                    }}
                >
                    <IconUserPlus color={`${theme === "dark" ? "#4EAC6D" : "#000"}`} size={20} />
                </div>
                <div
                    className={styles.iconAddGroup}
                    onClick={() => {
                        dispatch({ type: modalActions.SET_SHOW_MODAL_CREATE_GROUP });
                    }}
                >
                    <IconUsersGroup color={`${theme === "dark" ? "#4EAC6D" : "#000"}`} size={20} />
                </div>

                <ModalFindFriend />
                <ModalCreateGroup />
            </div>
        </>
    );
};

export default HeaderTabTwo;
