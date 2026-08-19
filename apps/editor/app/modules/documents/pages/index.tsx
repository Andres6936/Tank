const Document = () => {
  return (
    <div>
      <div className="w-[10rem] aspect-[16/23] rounded border bg-zinc-200"></div>
      <p className="text-xs/4 text-balance text-center mt-2 px-2">
        Asistente Conversacional y Operativo (IA)
      </p>
    </div>
  );
};

export default function Page() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,160px)] gap-4 place-content-start">
      <Document /> <Document /> <Document />
    </div>
  );
}
