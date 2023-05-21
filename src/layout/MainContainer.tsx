import {ReactNode} from "react";

export default function MainContainer(props: {children: ReactNode}){
    return (
        <main className="flex flex:wrap@sm flex:col flex:row@sm gap:0.5em gap:0.4em@sm my:0.5em px:0.5em">
            {props.children}
        </main>
    )
}