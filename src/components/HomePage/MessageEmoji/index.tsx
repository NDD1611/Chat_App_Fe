import { useState, useEffect } from "react";
import { Emoji } from "emoji-picker-react";

export const MessageEmoji = ({ text }: { text: any }) => {
    const [listContents, setListContent] = useState<any>([]);
    useEffect(() => {
        let array = [];
        let textCopy = text;
        while (textCopy != "") {
            let indexEmoji = textCopy.indexOf("&#x");
            if (indexEmoji != -1) {
                let strFront = textCopy.slice(0, indexEmoji);
                let strMiddle = textCopy.slice(indexEmoji, indexEmoji + 9);
                let strRear = textCopy.slice(indexEmoji + 9, textCopy.length);
                array.push(strFront);
                array.push(strMiddle);
                textCopy = strRear;
            } else {
                array.push(textCopy);
                textCopy = "";
            }
        }
        setListContent(array);
    }, [text]);

    return (
        <>
            <div>
                {listContents.map((content: any, index: any) => {
                    if (content !== "") {
                        if (content.includes("&#x")) {
                            let newContent = content.slice(3, 8);
                            return <Emoji key={index} unified={newContent} size={16} />;
                        } else {
                            return (
                                <span key={index} className="spanMessage">
                                    {content}
                                </span>
                            );
                        }
                    }
                })}
            </div>
        </>
    );
};
