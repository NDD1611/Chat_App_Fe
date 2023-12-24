//code: 'login_2' no toast login success

// announce
// code:    'register_0'          Email is already in use
// code:    'register_1'          Account registered successfully
// code:    'common_0'            An error occurred. Please try again later.
// code:    'login_0'             Email is incorrect
// code:    'login_1'             Incorrect password

// code:    'friendInvitation_0'  You have sent a friend request before
// code:    'friendInvitation_1'  You have received a friend request from this person before
// code:    'friendInvitation_2'  sent friend request successfully
// code:    'deleteFriend_0       Delete friends successfully!
// code;    'findFriend_0         Email account not registered

// code:    'createGroup_0'       Create group successfully!
export const toastMessage = (code: string, i18n: any) => {
    if (code == "register_0") {
        return i18n._("Email is already in use!");
    } else if (code == "register_1") {
        return i18n._("Account registration successful!");
    } else if (code == "common_0") {
        return i18n._("An error occurred. Please try again later!");
    } else if (code == "login_0") {
        return i18n._("Email is incorrect!");
    } else if (code == "login_1") {
        return i18n._("Incorrect password!");
    } else if (code == "friendInvitation_0") {
        return i18n._("You have sent a friend request before!");
    } else if (code == "friendInvitation_1") {
        return i18n._("You have received a friend request from this person before!");
    }
    if (code == "friendInvitation_2") {
        return i18n._("sent friend request successfully!");
    }
    if (code == "deleteFriend_0") {
        return i18n._("Delete friends successfully!");
    }
    if (code == "findFriend_0") {
        return i18n._("Email account not registered!");
    }
    if (code == "createGroup_0") {
        return i18n._("Create group successfully!");
    }
};
