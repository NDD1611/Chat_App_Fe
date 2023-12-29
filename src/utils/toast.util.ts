export const toastMessage = (code: string, i18n: any) => {
    switch (code) {
        case "register_0":
            return i18n._("Email is already in use!");
        case "register_1":
            return i18n._("Register failed!");
        case "common_0":
            return i18n._("An error occurred. Please try again later!");
        case "register_2":
            return i18n._("Register successfully!");
        case "login_0":
            return i18n._("Email isn't exist!");
        case "login_1":
            return i18n._("Wrong password!");
        case "login_2":
            return i18n._("Login successfully!");
        case "findFriend_0":
            return i18n._("User not found!");
        case "friendInvitation_0":
            return i18n._("You have sent a friend request before!");
        case "friendInvitation_1":
            return i18n._("You have received a friend request from this person before!");
        case "friendInvitation_2":
            return i18n._("Sent friend request successfully!");
        case "create_group_0":
            return i18n._("Create group successfully!");
    }
};
