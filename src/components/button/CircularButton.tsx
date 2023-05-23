import {MouseEventHandler, ReactNode} from "react";

interface Props {
    onClick?: MouseEventHandler<HTMLButtonElement>
    children: ReactNode
}

export default function (props: Props) {
    return (
        <button onClick={props.onClick}
                className={"flex justify-content:center align-items:center b:none r:50% p:0.5em bg:blue-50 w:2em h:2em fg:white"}>
            {props.children}
        </button>
    )
}