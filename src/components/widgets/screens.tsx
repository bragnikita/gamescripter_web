import {ReactNode} from "react";
import React from "react";

export const narrow = (e: ReactNode) => {
    return <div className="top screen_patterns narrow">{e}</div>
};
export const screenMargins = (e: ReactNode) => {
    return <div className="top screen_patterns basic">{e}</div>
};