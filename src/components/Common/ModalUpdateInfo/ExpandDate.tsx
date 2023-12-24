import styles from "./ExpandDate.module.scss";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCheck } from '@fortawesome/free-solid-svg-icons'
export const ExpandDate = ({
    dataArr,
    value,
    setValue,
}: {
    dataArr: any;
    value: any;
    setValue: any;
}) => {
    const handleSelectValue = (e: any, value: any) => {
        e.stopPropagation();
        setValue(value);
    };

    return (
        <div className={styles.expand}>
            {dataArr.map((element: any) => {
                return (
                    <div
                        key={element}
                        className={`${styles.element} ${value === element ? styles.bgBlue : ""}`}
                        onClick={(e) => {
                            handleSelectValue(e, element);
                        }}
                    >
                        {element}
                        {/* <FontAwesomeIcon
                            className={`${styles.iconCheck} ${value !== element ? styles.hideIconCheck : ''}`}
                            icon={faCheck}
                        /> */}
                    </div>
                );
            })}
        </div>
    );
};
