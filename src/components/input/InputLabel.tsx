interface Props {
    label: string;
}

export default function InputLabel (props: Props) {
    return (
        <div className="flex flex:row align-items:center">
            <label className="flex:1 form-label opacity:0.8">
                {props.label}
            </label>
            <input
                className="flex:1 form-control"
                type="number"
                min={0}
                disabled=""
            />
        </div>
    )
} 