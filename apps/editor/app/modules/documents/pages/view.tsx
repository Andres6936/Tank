import { XmlEditor } from "~/components/Editor";

export default function View() {
  return (
    <div className="flex flex-1 flex-row gap-2">
      <div className="relative flex flex-1">
        <div className="absolute inset-0 flex-1">
          <XmlEditor />
        </div>
      </div>
      <div className="relative flex flex-1">
        <div className="absolute inset-0 flex-1 border border-zinc-300">
          <iframe
            src="https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
