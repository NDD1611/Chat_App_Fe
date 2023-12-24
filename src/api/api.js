
import axios from './axios'
import axiosFile from './axiosSendFile'
import { logout } from '../utils/auth.util'

const register = async (data) => {
    try {
        let response = await axios.post('/auth/register', data)
        return {
            err: false,
            response
        }
    } catch (exception) {
        return {
            err: true,
            exception
        }
    }
}

const login = async (data) => {
    try {
        let response = await axios.post('/auth/login', data)
        return {
            err: false,
            response
        }
    } catch (exception) {
        return {
            err: true,
            exception
        }
    }
}

const refreshToken = async (userDetails) => {
    try {
        let response = await axios.post('/auth/refresh-token', { userDetails: userDetails })
        return response
    } catch (exception) {
        return {
            err: true,
            exception
        }
    }
}

//secure router
const uploadAvatar = async (data) => {
    try {
        let response = await axios.post('/file/upload-avatar', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const uploadImageMessage = async (data) => {
    try {
        let response = await axios.post('/file/upload-image-message', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
const updateUserInfo = async (data) => {
    try {
        let response = await axios.post('/user/update-info', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const friendInvitation = async (data) => {
    try {
        let response = await axios.post('/friend/friend-invitation', data)
        return {
            code: false,
            response
        }
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
const rejectInvitation = async (data) => {
    try {
        let response = await axios.post('/friend/reject-invitation', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
const acceptInvitation = async (data) => {
    try {
        let response = await axios.post('/friend/accept-invitation', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const checkErr = (exception) => {
    const errCode = exception?.response?.status
    if (errCode === 401 || errCode === 403) {
        logout()
    }
}
const findFriend = async (data) => {
    try {
        let response = await axios.post('/friend/find', data)
        return {
            err: false,
            response: response
        }
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

const deleteFriend = async (data) => {
    try {
        let response = await axios.post('/friend/delete', data)
        return {
            err: false,
            response
        }
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let createNewConversation = async (data) => { // have first message
    try {
        let response = await axios.post('/conversation/create-with-message', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let uploadFile = async (data) => {
    try {
        let response = await axiosFile.post('/file/upload-file-message', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let downLoadFile = async (data) => {
    try {
        let response = await axiosFile.post('/file/download', data, {
            headers: {
                responseType: 'arraybuffer'
            }
        })
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
let testQueryLimit = async () => {
    try {
        let response = await axiosFile.get('/test-query-limit')
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let createConversation = async (data) => { // create without message
    try {
        let response = await axios.post('/conversation/create-without-message', data)
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

let deleteConversation = async (data) => {
    try {
        let response = await axios.delete('/conversation/delete', { data })
        return response
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}
export let createGroupApi = async (data) => {
    try {
        let response = await axios.post('/conversation/group', data)
        return {
            err: false,
            response
        }
    } catch (exception) {
        checkErr(exception)
        return {
            err: true,
            exception
        }
    }
}

export default {
    register, login, refreshToken, uploadFile, createConversation,
    uploadAvatar, updateUserInfo, uploadImageMessage, deleteConversation,
    friendInvitation, rejectInvitation, acceptInvitation,
    findFriend, deleteFriend, createNewConversation, downLoadFile, testQueryLimit
}

