import "./Timer.css";
import { msToTime } from "../../utils/Utils";
import React, { useState, useEffect } from "react";

export interface props {
  onUpdated: (score: string) => void;
  start: boolean;
  onEnded?: (n: string) => void;
}

export interface state {
  startTime?: Date | undefined;
  now?: Date | undefined;
}

const Timer = (props: props, ref: any) => {
  const [time, setTime] = useState<state>({ startTime: new Date() });

  useEffect(() => {
    if (!props.start) {
      if (props.onEnded && time) {
        props.onEnded(getTimeDelta(time));
      }
      return;
    }
    setTime({ startTime: new Date() });
  }, [props.start]);

  useEffect(() => {
    if (!props.start) {
      return;
    }
    setTimeout(() => {
      props.onUpdated(getTimeDelta(time));
      setTime({ startTime: time?.startTime, now: new Date() });
    }, 103);
  }, [time]);

  const getTimeDelta = (t: state | undefined): string => {
    if (t && t.now && t.startTime) {
      return msToTime(t.now.getTime() - t.startTime.getTime());
    }
    return " ";
  };

  return <h1 className={"timer"}>{getTimeDelta(time)}</h1>;
};
export default Timer;
