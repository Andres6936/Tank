import { CloudDownload, Copy, Play, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

const Options = ({ Id }: { Id: string }) => {
  return (
    <div className="absolute top-8 left-2/4 -translate-x-2/4 bg-white rounded-md shadow">
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          nativeButton={false}
          render={(props) => (
            <Link {...props} to={`/dashboard/documents/view/${Id}`} />
          )}
        >
          <Play size={18} strokeWidth={1} />
        </Button>
        <Button variant="outline" size="icon">
          <CloudDownload size={18} strokeWidth={1} />
        </Button>
        <Button variant="outline" size="icon">
          <Copy size={18} strokeWidth={1} />
        </Button>
        <Button variant="outline" size="icon">
          <Settings size={18} strokeWidth={1} />
        </Button>
      </ButtonGroup>
    </div>
  );
};

const getPublicUrl = (path: string) => {
  return new URL(path, `https://cdn.andres6936.dev/`).href;
};

type DocumentType = {
  Id: string;
  Title: string;
};

type ThumbnailType = {
  Id: string;
  PlacelholderHash: string;
};

type LowFileType = {
  Id: string;
  Path: string;
};

const Document = ({
  document,
  thumbnail,
  lowFile,
}: {
  document: DocumentType;
  thumbnail: ThumbnailType | null;
  lowFile: LowFileType | null;
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative w-[10rem] aspect-16/23 rounded border bg-zinc-200 hover:bg-zinc-300 overflow-hidden">
        {thumbnail && !isLoaded && (
          <img
            src={thumbnail.PlacelholderHash}
            alt="placeholder"
            className="absolute inset-0 w-full h-full object-cover blur-md scale-105"
          />
        )}

        {lowFile && (
          <img
            src={getPublicUrl(lowFile.Path)}
            alt={document.Title}
            onLoad={() => {
              setIsLoaded(true);
              console.log("Loaded");
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {isHover && <Options Id={document.Id} />}
      </div>
      <p className="text-xs/4 text-balance text-center mt-2 px-2">
        {document.Title}
      </p>
    </div>
  );
};

export { Document };
