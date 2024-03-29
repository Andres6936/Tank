import {IconProps} from "../types/Icon.ts";

export default function IconCircleHalfFill(props: IconProps) {
    return (
        <div onClick={props.onClick} className={"flex justify-content:center justify-content:center " + props.className ?? ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 16} height={props.size ?? 16}
                fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 0 8 1v14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
            </svg>
        </div>
        )
}