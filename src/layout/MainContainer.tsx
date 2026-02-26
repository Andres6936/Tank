import { ReactNode } from "react";

export default function MainContainer(props: { children: ReactNode }) {
  return (
    <main className="flex flex:1 flex:wrap@sm justify-content:space-around@sm flex-col flex:row@sm gap:0.5em gap:0.4em@sm">
      {props.children}
    </main>
  );
}
