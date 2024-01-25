import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import classes from "./index.module.scss";
export const TabThree = (props: any) => {
    const showTabThree = useSelector((state: RootState) => state.tabs.showTabThree);

    return <>{showTabThree && <div className={classes.tabThree}>{props.children}</div>}</>;
};
