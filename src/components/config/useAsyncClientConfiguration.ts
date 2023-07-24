"use client";
import { useEffect, useState, useTransition } from "react";

type ConfigureModule = {
  configureAsync: () => Promise<void>;
};

export const useAsyncClientConfiguration = (): [boolean, boolean] => {
  const [configured, setConfigured] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    setShowFade(true);
    /* FontAwesome's "@fortawesome/fontawesome-svg-core" library is very large and causes the size of the initial
       bundle sent to the browser to be very large.  To avoid this, we instead dynamically import and perform the
       Font Awesome configuration to avoid a very large initial bundle. */
    import("~/application/config/fontAwesome/async").then((m: ConfigureModule) => {
      m.configureAsync()
        .then(() => {
          startTransition(() => {
            setConfigured(true);
            setTimeout(() => {
              setShowFade(false);
            }, 100);
          });
        })
        .catch((e: unknown) => {
          setShowFade(false);
          if (e instanceof Error) {
            throw new Error(`Client Configuration Error: ${e}`);
          } else {
            throw new Error("Unknown Client Configuration Error");
          }
        });
    });

    return () => {
      setShowFade(false);
    };
  }, []);

  return [configured, showFade];
};
