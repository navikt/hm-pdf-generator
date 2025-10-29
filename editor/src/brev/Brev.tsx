import useSWR from "swr";
import { Alert, Loader } from "@navikt/ds-react";
import Breveditor from "./breveditor/Breveditor.tsx";
import { BrevmalVelger } from "./brevmaler/Brevmaler.tsx";
import { useMemo, useState } from "react";

export const Brev = ({ sakId }: { sakId: number }) => {
  const { isLoading, error, data, mutate } = useSWR<
    {
      error?: string;
      data?: any;
    },
    Error
  >(
    `/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`,
    async (key: string) =>
      fetch(key, { method: "get" }).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        } else {
          throw Error(`status-code=${res.status.toString()}`);
        }
      }),
  );

  const [valgtMal, velgMal] = useState<string>();
  const errorEr404 = useMemo(() => data?.error == "brev-ikke-funnet", [data]);

  if (isLoading) {
    return <Loader title="Laster inn brevutkast..." />;
  } else if (error) {
    return <Alert variant="warning">Brev ikke tilgjengelig.</Alert>;
  }

  console.log("here", errorEr404);

  return (
    <>
      {errorEr404 && !valgtMal && <BrevmalVelger velgMal={velgMal} />}
      {(!errorEr404 || valgtMal) && data && (
        <div
          style={{
            background: "#242424",
          }}
        >
          <Breveditor
            metadata={{
              brukersNavn: "Ola Nordmann",
              brukersFødselsnummer: "26848497710",
              saksnummer: sakId,
              brevOpprettet: "1. Januar 2025",
              saksbehandlerNavn: "Jon Åsen",
              attestantsNavn: "Kari Hansen",
              hjelpemiddelsentral: "Nav hjelpemiddelsentral Agder",
            }}
            defaultMarkdown={valgtMal}
            state={data?.data}
            onStateChange={(state) => {
              let newState = {
                brevtype: "BREVEDITOR_VEDTAKSBREV",
                målform: "NB",
                data: state,
              };
              (async () => {
                await fetch(`/api/sak/${sakId}/brevutkast`, {
                  method: "post",
                  body: JSON.stringify(newState),
                });
                await mutate(newState);
              })();
            }}
            onSlettBrev={() => {
              (async () => {
                await fetch(
                  `/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`,
                  {
                    method: "delete",
                  },
                );
                await mutate(); // Reload
              })();
            }}
            // onValueChange={(newValue, history, html) => {
            //   console.log("App.tsx: onValueChange", {
            //     value: newValue,
            //     history: history,
            //     html,
            //     stylesheet_version: "v1",
            //     brevutkast_id: 1000,
            //   });
            // }}
          />
        </div>
      )}
    </>
  );
};
