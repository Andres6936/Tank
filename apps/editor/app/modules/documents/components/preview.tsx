import { useEffect, useRef } from "react";
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
    staleTime: 0,
    gcTime: 1000 * 60, // Keep the cache for 1 minute
  });

  const url = query.data;
  const previosUrl = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previosUrl.current && previosUrl.current !== url) {
      URL.revokeObjectURL(previosUrl.current);
    }
    previosUrl.current = url;
  }, [url]);

  useEffect(() => {
    return () => {
      if (previosUrl.current) {
        URL.revokeObjectURL(previosUrl.current);
      }
    };
  }, []);

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
