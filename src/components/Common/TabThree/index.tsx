import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const TabThree = (props: any) => {
    const showTabThree = useSelector((state: RootState) => state.tabs.showTabThree);

    return <>{showTabThree && <div className="w-full h-full">{props.children}</div>}</>;
};
