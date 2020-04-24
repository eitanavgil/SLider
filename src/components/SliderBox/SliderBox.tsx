import React from "react";
import "./SliderBox.css";

export interface props {
  color: number;
}
const SlideBox = (props: props) => {
  return <div className={`slider-box c${props.color}`}></div>;
};
export default SlideBox;
