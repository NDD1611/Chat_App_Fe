import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLingui } from '@lingui/react';
import { modalActions } from '@/redux/actions/modalActions'
import { Avatar, Button, Modal } from '@mantine/core'
import { RootState } from '@/redux/store'
import { IconEdit } from '@tabler/icons-react';

export const ModalDisplayInfo = () => {
    const { i18n } = useLingui();
    const showModalInfo = useSelector((state: RootState) => state.modal.showModalInfo)
    const avatarLink = useSelector((state: RootState) => state.auth.userDetails.avatar)
    const dispatch = useDispatch()
    const dateFake = useSelector((state: RootState) => state.auth.userDetails.birthday)
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')

    useEffect(() => {
        const userDetailsJson = localStorage.getItem('userDetails')
        const userDetails = userDetailsJson ? JSON.parse(userDetailsJson) : null
        let date = new Date(userDetails.birthday)
        setDay(date.getDate().toString())
        setMonth((date.getMonth() + 1).toString())
        setYear(date.getFullYear().toString())
    }, [dateFake])

    const userDetails = useSelector((state: RootState) => state.auth.userDetails)
    const handleCloseModalInfo = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_INFO })
    }
    const handleClickUpdateInfo = () => {
        dispatch({ type: modalActions.SET_HIDE_MODAL_INFO })
        dispatch({ type: modalActions.SET_SHOW_MODAL_UPDATE_INFO })
    }
    return <Modal size={'sm'} opened={showModalInfo} onClose={handleCloseModalInfo} title={i18n._('Account information')} centered>
        <div className={styles.contentModalInfo}>
            <div className={styles.image}>
                <img
                    src='/images/backgroundProfile.jpg'
                />
            </div>
            <div className={styles.avatarInfo}>
                <Avatar
                    src={avatarLink}
                    size={'lg'} alt='avatar'
                ></Avatar>
            </div>
            <p className={styles.name}>{userDetails.firstName + ' ' + userDetails.lastName}</p>
            <div className={styles.userInfo}>
                <p className='mb-2'>{i18n._("Information")}</p>
                <div>
                    <p>Email</p>
                    <p>{userDetails.email}</p>
                </div>
                <div className='my-2'>
                    <p>{i18n._("Gender")}</p>
                    <p>{userDetails.sex ? userDetails.sex : i18n._("No information")}</p>
                </div>
                <div>
                    <p>{i18n._("Date of birth")}</p>
                    <p>{userDetails.birthday ? day + '/' + month + '/' + year : i18n._("No information")}</p>
                </div>
                <div className={styles.divBtn}>
                    <Button rightSection={<IconEdit />} className={styles.btnShowModalUpdateInfo} onClick={() => { handleClickUpdateInfo() }} >
                        {i18n._("Update information")}
                    </Button>
                </div>
            </div>
        </div>
    </Modal>
}