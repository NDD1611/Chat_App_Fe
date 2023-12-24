import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
export const TabTwo = (props: any) => {
    const showTabTwo = useSelector((state: RootState) => state.tabs.showTabTwo);
    const theme = useSelector((state: RootState) => state.themeMode.theme);
    return (
        <>
            {showTabTwo && (
                <div className={`w-[344px] border-r-2 ${theme === "dark" && "bg-[#262626]"}`}>
                    {props.children}
                </div>
            )}
        </>
    );
};
