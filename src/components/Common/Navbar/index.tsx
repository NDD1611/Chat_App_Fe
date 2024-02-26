import { useEffect } from "react";
import {
    Center,
    Tooltip,
    UnstyledButton,
    Stack,
    rem,
    Avatar,
    Menu,
    Box,
    Image,
} from "@mantine/core";
import {
    IconLogout,
    IconBrandWechat,
    IconSettings,
    IconFileInfo,
    IconUserSquareRounded,
} from "@tabler/icons-react";
import classes from "./index.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { tabsActions } from "@/redux/actions/tabsAction";
import { authActions } from "@/redux/actions/authAction";
import { logout } from "@/utils/auth.util";
import { modalActions } from "@/redux/actions/modalActions";
// import ModalDisplayInfo from '../Modals/ModalDisplayInfo'
// import ModalUpdateInfo from '../Modals/ModalUpdateInfo'
import { useLingui } from "@lingui/react";
// import { ThemeMode } from './ThemeMode';
import { RootState } from "@/redux/store";
import { SwitchLanguage } from "../SwitchLanguage";
import { useCurrentLocale } from "next-i18n-router/client";
import i18nConfig from "../../../../i18nConfig";
import { removeLocaleFromPathname } from "@/utils/locale.util";
import { ModalDisplayInfo } from "../ModalDisplayInfo";
import { ModalUpdateInfo } from "../ModalUpdateInfo";

export const Navbar = () => {
    const maintabSelect = useSelector((state: RootState) => state.tabs.maintabSelect);
    const userDetails = useSelector((state: RootState) => state.auth.userDetails);
    const showTabTwo = useSelector((state: RootState) => state.tabs.showTabTwo);
    const showTabThree = useSelector((state: RootState) => state.tabs.showTabThree);
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const countAnnounceMessage = useSelector((state: RootState) => state.tabs.countAnnounceMessage);
    const pendingInvitation = useSelector((state: RootState) => state.friend.pendingInvitations);
    const showTabOne = useSelector((state: RootState) => state.tabs.showTabOne);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    const dispatch = useDispatch();
    const { i18n } = useLingui();
    const locale = useCurrentLocale(i18nConfig);
    const router = useRouter();
    const handleNavbarClick = (mainTabSelect: string) => {
        if (mainTabSelect === "Conversations") {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: mainTabSelect,
            });
            router.push(`/${locale}/`);
        } else if (mainTabSelect === "friends") {
            dispatch({
                type: tabsActions.SET_MAIN_TAB,
                maintabSelect: mainTabSelect,
            });
            router.push(`/${locale}/friend`);
        }
    };

    useEffect(() => {
        const userDetailsJson = localStorage.getItem("userDetails");
        const userDetailsData = userDetailsJson ? JSON.parse(userDetailsJson) : null;
        dispatch({
            type: authActions.SET_USER_DETAIL,
            userDetails: userDetailsData,
        });
        if (window.innerWidth < 700 && showTabTwo && showTabThree) {
            dispatch({
                type: tabsActions.SET_CLOSE_TAB_THREE,
            });
        }
    }, []);

    useEffect(() => {
        if (conversations) {
            const userDetailsJson = localStorage.getItem("userDetails");
            const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null;
            let count = 0;
            conversations.forEach((conversation: any) => {
                let messages = conversation.messages;
                if (messages.length) {
                    messages.forEach((message: any) => {
                        if (
                            (message.sender._id != userDetails._id && message.status == "2") ||
                            (message.status == "2" && message.type === "accept_friend")
                        ) {
                            count++;
                        }
                    });
                }
            });
            dispatch({
                type: tabsActions.SET_COUNT_ANNOUNCE_MESSAGE,
                countAnnounceMessage: count,
            });
        }
    }, [conversations]);

    if (showTabOne)
        return (
            <nav className={classes.navbar}>
                <ModalDisplayInfo />
                <ModalUpdateInfo />
                <Center>
                    <Avatar src={userDetails.avatar} size={"md"} alt="avatar" />
                </Center>
                <div className={classes.navbarMain}>
                    <Stack justify="center" gap={0}>
                        <Tooltip
                            label={i18n._("Conversations")}
                            position="right"
                            transitionProps={{ duration: 0 }}
                        >
                            <UnstyledButton
                                onClick={() => handleNavbarClick("Conversations")}
                                className={classes.link}
                                data-active={maintabSelect === "Conversations" || undefined}
                            >
                                {/* <IconBrandWechat
                                    style={{ width: rem(35), height: rem(35) }}
                                    stroke={1.5}
                                /> */}
                                <svg
                                    viewBox="6 6 24 24"
                                    fill="currentColor"
                                    width="30"
                                    height="30"
                                    className={classes.svgColor}
                                    overflow="visible"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M29 17.504c0 6.103-4.606 10.57-11 10.57-1.065 0-2.08-.095-3.032-.327a4.26 4.26 0 0 0-2.39.09L8.91 28.962c-.59.202-1.164-.372-.964-.985l.729-2.411a3.007 3.007 0 0 0-.291-2.5C7.414 21.484 7 19.596 7 17.504v-.002c0-6.103 4.607-10.498 11-10.498S29 11.399 29 17.502v.002z"
                                    ></path>
                                </svg>
                                {<Box>{countAnnounceMessage !== 0 && countAnnounceMessage}</Box>}
                            </UnstyledButton>
                        </Tooltip>
                        <Tooltip
                            label={i18n._("friends")}
                            position="right"
                            transitionProps={{ duration: 0 }}
                        >
                            <UnstyledButton
                                onClick={() => handleNavbarClick("friends")}
                                className={classes.link}
                                data-active={maintabSelect === "friends" || undefined}
                            >
                                {/* <IconUserSquareRounded
                                    style={{ width: rem(35), height: rem(35) }}
                                    stroke={1.5}
                                /> */}
                                <svg
                                    viewBox="6 6 24 24"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                    className={classes.svgColor}
                                    overflow="visible"
                                >
                                    <path d="M7.25 12.305C7.25 16.207 9.446 18 12 18s4.75-1.793 4.75-5.695C16.75 9.123 14.75 7 12 7s-4.75 2.123-4.75 5.305zM15.082 21.607c.39-.423.262-1.13-.296-1.269A11.576 11.576 0 0 0 12 20c-4.835 0-9 2.985-9 6.665C3 27.405 3.37 28 4.06 28h7.81c.66 0 1.13-.675 1.13-1.335 0-1.97.83-3.697 2.082-5.058zM19.25 12.305C19.25 16.207 21.446 18 24 18s4.75-1.793 4.75-5.695C28.75 9.123 26.75 7 24 7s-4.75 2.123-4.75 5.305zM33 26.665c0 .74-.37 1.335-1.06 1.335H16.06c-.69 0-1.06-.595-1.06-1.335C15 22.985 19.165 20 24 20s9 2.985 9 6.665z"></path>
                                </svg>
                                {
                                    <Box>
                                        {pendingInvitation.length !== 0 && pendingInvitation.length}
                                    </Box>
                                }
                            </UnstyledButton>
                        </Tooltip>
                    </Stack>
                </div>

                <Stack justify="center" gap={0}>
                    {/* <ThemeMode /> */}
                    <SwitchLanguage />
                    <Menu shadow="md" width={200} position="right">
                        <Menu.Target>
                            <Box
                                component="div"
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <IconSettings style={{ width: rem(25), height: rem(25) }} />
                            </Box>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={
                                    <IconFileInfo style={{ width: rem(14), height: rem(14) }} />
                                }
                                onClick={() => {
                                    dispatch({ type: modalActions.SET_SHOW_MODAL_INFO });
                                }}
                            >
                                {i18n._("User information")}
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                leftSection={
                                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                                }
                                onClick={() => {
                                    logout();
                                }}
                            >
                                {i18n._("Logout")}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Stack>
            </nav>
        );
};
