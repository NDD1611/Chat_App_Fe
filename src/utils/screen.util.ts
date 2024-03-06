export const checkScreenDevice = () => {
    if (window.innerWidth < 700) {
        return "mobile";
    } else if (window.innerWidth > 700 && window.innerWidth < 1200) {
        return "tablet";
    } else {
        return "pc";
    }
};
