import { TabSynkronisertBreveditor } from "./breveditor/TabSynkronisertBreveditor.tsx";
import useSWR from "swr";
import { Alert, Loader } from "@navikt/ds-react";
import { useAvslagMal } from "./brevmaler/Brevmaler.ts";

export const Brev = ({ sakId }: { sakId: number }) => {
  const { isLoading, error, data } = useSWR<{
    data: any;
  }>(
    `/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`,
    async (key: string) =>
      fetch(key, { method: "get" }).then((res) => res.json()),
  );

  const mal = useAvslagMal();

  if (isLoading) {
    return <Loader title="Laster inn brevutkast..." />;
  } else if (error) {
    return <Alert variant="warning">Brev ikke tilgjengelig.</Alert>;
  }

  if (mal.isLoading) {
    return <Loader title="Laster inn brevutkast..." />;
  } else if (mal.error) {
    return <Alert variant="warning">Brev ikke tilgjengelig.</Alert>;
  }

  const template = mal.data || "";

  return (
    <TabSynkronisertBreveditor
      metadata={{
        brukersNavn: "Ola Nordmann",
        brukersFødselsnummer: "26848497710",
        saksnummer: sakId,
        brevOpprettet: "1. Januar 2025",
        saksbehandlerNavn: "Jon Åsen",
        attestantsNavn: "Kari Hansen",
        hjelpemiddelsentral: "Nav hjelpemiddelsentral Agder",
      }}
      defaultMarkdown={template}
      onValueChange={(newValue, history, html) => {
        console.log("App.tsx: onValueChange", {
          value: newValue,
          history: history,
          html,
          stylesheet_version: "v1",
          brevutkast_id: 1000,
        });
      }}
    />
  );
};
