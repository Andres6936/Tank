import { useQuery } from "@tanstack/react-query";

const asQuery = async (args: { xml: string }) => {
  const stream = await fetch("http://localhost:6936/api/documents", {
    method: "POST",
    body: JSON.stringify({
      xml: args.xml,
      seal: "red",
    }),
  });
  const buffer = await stream.arrayBuffer();
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return url;
};

export const Preview = ({ content }: { content: string }) => {
  const query = useQuery({
    queryKey: ["/preview", content],
    queryFn: () => asQuery({ xml: content }),
  });

  if (query.isLoading || !query.data) {
    return <p>Loading ...</p>;
  }

  if (query.isError) {
    return <p>Error: {query.error.message}</p>;
  }

  const url = query.data;

  return <iframe src={url} className="w-full h-full" />;
};
