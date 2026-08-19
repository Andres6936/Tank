import { CloudDownload, Copy, Play, Settings } from "lucide-react";
import { useState } from "react";

const Options = () => {
  return (
    <div className="absolute top-8 left-2/4 -translate-x-2/4 flex flex-row gap-2 border shadow bg-white rounded w-fit px-2 py-1">
      <div>
        <Play size={18} strokeWidth={1} />
      </div>
      <div>
        <CloudDownload size={18} strokeWidth={1} />
      </div>
      <div>
        <Copy size={18} strokeWidth={1} />
      </div>
      <div>
        <Settings size={18} strokeWidth={1} />
      </div>
    </div>
  );
};

const Document = () => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative w-[10rem] aspect-16/23 rounded border bg-zinc-200 hover:bg-zinc-300">
        <Options />
      </div>
      <p className="text-xs/4 text-balance text-center mt-2 px-2">
        Asistente Conversacional y Operativo (IA)
      </p>
    </div>
  );
};

export default function Page() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-4 place-content-start">
      <Document /> <Document /> <Document />
    </div>
  );
}
