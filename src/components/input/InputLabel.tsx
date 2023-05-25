interface Props {
    value: number | string | readonly string[],
    label: string;
}

export default function InputLabel (props: Props) {
    return (
        <div className="flex flex:row align-items:center">
            <label className="flex:1 form-label opacity:0.8">
                {props.label}
            </label>
            <input
                value={props.value}
                className="flex:1 b:1px|solid|#CCC r:1em px:1em py:0.5em"
                type="number"
                min={0}
            />
        </div>
    )
} 