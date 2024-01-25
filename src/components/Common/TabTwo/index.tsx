import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import classes from "./index.module.scss";
export const TabTwo = (props: any) => {
    const showTabTwo = useSelector((state: RootState) => state.tabs.showTabTwo);

    return <>{showTabTwo && <div className={classes.tabTwo}>{props.children}</div>}</>;
};
