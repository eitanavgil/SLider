import React, {useState} from "react";
import "./SliderBox.css";
import {useSwipeable, Swipeable} from 'react-swipeable'
import {directions} from "../../utils/Utils";

export interface props {
    value: number;
    index: number;
    allowedDirections?: directions[]
}

const SlideBox = (props: props) => {

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            setDir(directions.LEFT)
        },
        onSwipedRight: () => {
            setDir(directions.RIGHT)
        },
        onSwipedUp: () => {
            setDir(directions.UP)
        },
        onSwipedDown: () => {
            setDir(directions.DOWN)
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const [dir, setDir] = useState("");

    return <div {...handlers} className={`slider-box c${props.value}`}>
        {`${dir} ${props.value} - ${props.index}`}
    </div>

};
export default SlideBox;
