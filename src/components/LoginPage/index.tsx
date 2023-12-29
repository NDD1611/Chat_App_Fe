"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Checkbox,
    Anchor,
    Stack,
    Box,
    Flex,
} from "@mantine/core";
import { useLingui } from "@lingui/react";
import { register, login } from "@/api/access";
import { authActions } from "@/redux/actions/authAction";
import { SwitchLanguage } from "@/components/Common/SwitchLanguage";
import { toastMessage } from "../../utils/toast.util";
import Image from "next/image";
import { useCurrentLocale } from "next-i18n-router/client";
import i18nConfig from "../../../i18nConfig";
export const AuthForm = (props: PaperProps) => {
    let i18n = useLingui();
    const [type, toggle] = useToggle(["login", "register"]);
    i18n._("login");
    i18n._("register");
    const [showLoader, setShowLoader] = useState(false);
    const dispatch = useDispatch();
    const locale = useCurrentLocale(i18nConfig);
    const router = useRouter();
    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const form = useForm({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
            terms: true,
        },

        validate: {
            email: (val) => (emailRegex.test(val) ? null : i18n._("Invalid email")),
            password: (val) =>
                val.length < 6 ? i18n._("Password should include at least 6 characters") : null,
            confirmPassword: (value, values) =>
                value !== values.password && type === "register"
                    ? i18n._("Passwords did not match")
                    : null,
        },
    });

    const handleSubmitForm = async () => {
        if (type === "login") {
            setShowLoader(true);
            const response: any = await login({
                email: form.values.email,
                password: form.values.password,
            });
            if (response.error) {
                toast.error(
                    toastMessage(response?.exception?.response?.data?.metadata?.code, i18n),
                    {
                        position: "bottom-center",
                    },
                );
                setShowLoader(false);
            } else {
                const data = response?.data?.metadata?.userDetails;
                localStorage.setItem("userDetails", JSON.stringify(data));
                const tokens = response?.data?.metadata?.tokens;
                localStorage.setItem("tokens", JSON.stringify(tokens));
                dispatch({
                    type: authActions.SET_USER_DETAIL,
                    userDetails: data,
                });
                router.push(`/${locale}`);
            }
        } else if (type === "register") {
            setShowLoader(true);
            const response: any = await register({
                email: form.values.email,
                password: form.values.password,
                firstName: form.values.firstName,
                lastName: form.values.lastName,
            });

            if (response?.error) {
                toast.error(
                    toastMessage(response?.exception?.response?.data?.metadata?.code, i18n),
                    {
                        position: "bottom-center",
                    },
                );
                setShowLoader(false);
            } else {
                toast.success(toastMessage(response?.data?.metadata?.code, i18n), {
                    position: "bottom-center",
                });
                toggle();
                const data = response?.data?.metadata?.userDetails;
                localStorage.setItem("userDetails", JSON.stringify(data));
                const tokens = response?.data?.metadata?.tokens;
                localStorage.setItem("tokens", JSON.stringify(tokens));
                dispatch({
                    type: authActions.SET_USER_DETAIL,
                    userDetails: data,
                });
                router.push(`/${locale}`);
            }
        }
    };

    return (
        <Flex h={"100vh"} w={"100vw"}>
            <Box
                visibleFrom="md"
                w={"50%"}
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Box component="div" w={"100%"} h={"60%"} pos={"relative"}>
                    <Image
                        src={"/bg2.png"}
                        fill
                        sizes="(max-width: 100%)"
                        alt="bg image"
                        priority={true}
                    />
                </Box>
            </Box>
            <Flex justify={"center"} align={"center"} mx={"auto"}>
                <Paper w={{ base: "400px", md: "450px" }} radius="md" p="xl" withBorder {...props}>
                    <Flex justify={"space-between"}>
                        <Text size="lg" fw={500}>
                            {i18n._(type)}
                        </Text>
                        <SwitchLanguage />
                    </Flex>

                    <form
                        onSubmit={form.onSubmit(() => {
                            handleSubmitForm();
                        })}
                    >
                        <Stack>
                            {type === "register" && (
                                <TextInput
                                    required
                                    label={i18n._("First name")}
                                    placeholder={i18n._("Your firstName")}
                                    value={form.values.firstName}
                                    onChange={(event) =>
                                        form.setFieldValue("firstName", event.currentTarget.value)
                                    }
                                    radius="md"
                                />
                            )}
                            {type === "register" && (
                                <TextInput
                                    required
                                    label={i18n._("Last name")}
                                    placeholder={i18n._("Your lastName")}
                                    value={form.values.lastName}
                                    onChange={(event) =>
                                        form.setFieldValue("lastName", event.currentTarget.value)
                                    }
                                    radius="md"
                                />
                            )}

                            <TextInput
                                required
                                label="Email"
                                placeholder="test@gmail.com"
                                value={form.values.email}
                                onChange={(event) =>
                                    form.setFieldValue("email", event.currentTarget.value)
                                }
                                error={form.errors.email && "Invalid email"}
                                radius="md"
                            />

                            <PasswordInput
                                required
                                label={i18n._("Password")}
                                placeholder={i18n._("Your password")}
                                value={form.values.password}
                                onChange={(event) =>
                                    form.setFieldValue("password", event.currentTarget.value)
                                }
                                error={
                                    form.errors.password &&
                                    i18n._("Password should include at least 6 characters")
                                }
                                radius="md"
                            />

                            {type === "register" && (
                                <PasswordInput
                                    label={i18n._("Confirm password")}
                                    placeholder={i18n._("Confirm password")}
                                    {...form.getInputProps("confirmPassword")}
                                />
                            )}

                            {type === "register" && (
                                <Checkbox
                                    label={i18n._("I accept terms and conditions")}
                                    checked={form.values.terms}
                                    onChange={(event) =>
                                        form.setFieldValue("terms", event.currentTarget.checked)
                                    }
                                />
                            )}
                        </Stack>

                        <Group justify="space-between" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                c="dimmed"
                                onClick={() => toggle()}
                                size="xs"
                            >
                                {type === "register"
                                    ? i18n._("You already have an account? Login")
                                    : i18n._("You don't have an account? Register")}
                            </Anchor>
                            {showLoader ? (
                                <Button loading type="submit" radius="xl">
                                    {upperFirst(i18n._(type))}
                                </Button>
                            ) : (
                                <Button type="submit" radius="xl">
                                    {upperFirst(i18n._(type))}
                                </Button>
                            )}
                        </Group>
                    </form>
                </Paper>
            </Flex>
        </Flex>
    );
};
