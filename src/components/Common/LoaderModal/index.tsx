import { Oval } from "react-loader-spinner";
import styles from "./index.module.scss";

export const LoaderModal = () => {
    return (
        <>
            <div className={styles.LoaderModal}>
                <Oval width={200} color="#0062cc" secondaryColor="#ccc" />
            </div>
        </>
    );
};
