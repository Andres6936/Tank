import React from "react";

type Props = React.ComponentPropsWithRef<"input"> & {
  value: number | string | readonly string[];
  label: string;
};

export default function InputLabel({ label, value, ...props }: Props) {
  return (
    <div className="flex flex:row align-items:center">
      <label className="flex:1 form-label opacity:0.8">{label}</label>
      <input
        value={value}
        onChange={() => {}}
        className="flex:1 b:1px|solid|#CCC r:1em px:1em py:0.5em"
        type="number"
        min={0}
        {...props}
      />
    </div>
  );
}
