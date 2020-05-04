import "./Timer.css";
import {msToTime} from "../../utils/Utils";
import React, {useState, useEffect} from "react";

export interface props {
    start: boolean;
    onEnded?: (n:string) => void
}

export interface state {
    startTime?: Date | undefined;
    now?: Date | undefined;
}

const Timer = (props: props) => {

    const [time, setTime] = useState<state>();

    useEffect(() => {
        if (!props.start) {
            if(props.onEnded && time ){
                props.onEnded(getTimeDelta(time));
            }
            return;
        }
        setTime({startTime: new Date()})
    }, [props.start])

    useEffect(() => {
        if (!props.start) {
            return
        }
        setTimeout(() => {
            setTime({startTime: time?.startTime, now: new Date()})
        }, 50)
    }, [time])


    const getTimeDelta = (t: state | undefined): string => {
        if (t && t.now && t.startTime) {
            return msToTime(t.now.getTime() - t.startTime.getTime())
        }
        return "";
    }
    return <div className={"timer"}>{getTimeDelta(time)}</div>
};
export default Timer;
