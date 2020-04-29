import React, {useState} from "react";
import "./SliderBox.css";
import {useSwipeable} from 'react-swipeable'
import {directions} from "../../utils/Utils";
import Board, {boardItemData} from "../boards/Board/Board";

export interface props {
    interactive: boolean;
    data: boardItemData;
    onMove: (item: boardItemData) => void
}

const SlideBox = (props: props) => {

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            applyMove(directions.LEFT)
        },
        onSwipedRight: () => {
            applyMove(directions.RIGHT)
        },
        onSwipedUp: () => {
            applyMove(directions.UP)
        },
        onSwipedDown: () => {
            applyMove(directions.DOWN)
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const handleClick = () => {
        applyMove(props.data.allowedDirection)
    }

    const applyMove = (swipeDirection: directions | undefined) => {
        if (props.data.allowedDirection !== undefined && swipeDirection === props.data.allowedDirection) {
            props.onMove(props.data)
        } else {
            // TODO - fake animation here 

        }
    }

    const [dir, setDir] = useState("");

    return <div
        {...handlers}
        className={`slider-box c${props.data.value}`}
        onClick={handleClick}>
        {/*{`${dir} ${props.data.value} - ${props.data.index}`}<br/>*/}
        {/*{props.data.allowedDirection ? `${props.data.allowedDirection}` : "none"}*/}
    </div>

};
SlideBox.defaultProps = {interactive: false};
export default SlideBox;
