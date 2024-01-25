import { useEffect } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem, Avatar, Menu, Box } from "@mantine/core";
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
                                <IconBrandWechat
                                    style={{ width: rem(35), height: rem(35) }}
                                    stroke={1.5}
                                />
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
                                <IconUserSquareRounded
                                    style={{ width: rem(35), height: rem(35) }}
                                    stroke={1.5}
                                />
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
