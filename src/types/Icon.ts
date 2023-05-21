import type {MouseEventHandler} from "react";

export type IconProps = {
    readonly size?: number;
    readonly className?: string;
    readonly onClick?: MouseEventHandler<HTMLDivElement>;
}