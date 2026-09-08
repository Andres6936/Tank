const asQueryPreview = async (args: { xml: string }) => {
  const stream = await fetch(
    new URL("/api/documents", import.meta.env.VITE_PREVIEW_API_URL).href,
    {
      method: "POST",
      body: JSON.stringify({
        xml: args.xml,
        seal: "red",
      }),
    },
  );
  if (!stream.ok)
    throw new Error(
      "The server cannot process your request: " + stream.statusText,
    );
  const buffer = await stream.arrayBuffer();
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return url;
};

export { asQueryPreview };
