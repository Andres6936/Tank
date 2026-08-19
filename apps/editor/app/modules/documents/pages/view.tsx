import { XmlEditor } from "~/components/Editor";

export default function View() {
  return (
    <div className="flex flex-1 flex-row gap-2">
      <div className="relative flex flex-1 bg-yellow-100">
        <div className="absolute inset-0 flex-1">
          <XmlEditor />
        </div>
      </div>
      <div className="flex flex-1 bg-sky-100"></div>
    </div>
  );
}
