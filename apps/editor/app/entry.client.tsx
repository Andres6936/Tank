import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { Providers } from "./layout/providers";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Providers>
        <HydratedRouter />
      </Providers>
    </StrictMode>,
  );
});
