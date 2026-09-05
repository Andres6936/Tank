import { useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";

import { useViewContext } from "../context/view-context";
import { Skeleton } from "~/components/ui/skeleton";

const asQuery = async (args: { xml: string }) => {
  const stream = await fetch("http://localhost:6936/api/documents", {
    method: "POST",
    body: JSON.stringify({
      xml: args.xml,
      seal: "red",
    }),
  });
  if (!stream.ok)
    throw new Error(
      "The server cannot process your request: " + stream.statusText,
    );
  const buffer = await stream.arrayBuffer();
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  return url;
};

export const Preview = () => {
  const { content, autopreviewEnabled } = useViewContext();
  const debouncedContent = useDebounce(content, 1500);

  const query = useQuery({
    queryKey: ["/preview", debouncedContent],
    queryFn: () => asQuery({ xml: debouncedContent }),
    enabled: autopreviewEnabled,
    refetchOnWindowFocus: false,
  });

  const url = query.data;

  useEffect(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  if (!autopreviewEnabled) {
    return (
      <div className="w-full h-full flex flex-1 items-center justify-center">
        <p className="text-sm">Preview is disabled</p>
      </div>
    );
  }

  if (query.isLoading || !query.data) {
    return <Skeleton className="w-full h-full" />;
  }

  if (query.isError) {
    return <p>Error: {query.error.message}</p>;
  }

  return <iframe src={url} className="w-full h-full" />;
};
