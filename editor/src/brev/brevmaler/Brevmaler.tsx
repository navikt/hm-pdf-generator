import useSWR from "swr";
import { Button, Select } from "@navikt/ds-react";
import { useState } from "react";

export const BrevmalVelger = ({
  velgMal,
}: {
  velgMal: (mal: string) => void;
}) => {
  const [hovedType, setHovedType] = useState<string>();

  return (
    <div style={{ padding: "1em", background: "white", height: "100%" }}>
      <div style={{ maxWidth: "300px" }}>
        <Select
          label="Velg brevmal"
          onChange={(e) => {
            const v = e.target.value;
            if (v != "") setHovedType(v);
            else setHovedType(undefined);
          }}
        >
          <option value="">- Velg brevmal -</option>
          <option value="Innvilgelse">Innvilgelse</option>
          <option value="Delvis innvilgelse">Delvis innvilgelse</option>
          <option value="Avslag">Avslag</option>
        </Select>
        {hovedType === "Innvilgelse" && (
          <OpprettBrevKnapp
            velgMal={velgMal}
            unikNøkkel={hovedType}
            importer={import("./maler/innvilgelse.md?raw")}
          />
        )}
        {hovedType === "Delvis innvilgelse" && (
          <OpprettBrevKnapp
            velgMal={velgMal}
            unikNøkkel={hovedType}
            importer={import("./maler/delvis-innvilgelse.md?raw")}
          />
        )}
        {hovedType === "Avslag" && (
          <AvslagUndervalg velgMal={velgMal} hovedType={hovedType} />
        )}
      </div>
    </div>
  );
};

const AvslagUndervalg = ({
  velgMal,
  hovedType,
}: {
  velgMal: (mal: string) => void;
  hovedType: string;
}) => {
  const [underType, setUnderType] = useState<string>();
  return (
    <>
      <div style={{ margin: "1em 0 0 0" }}>
        <Select
          label="Velg avslagstype"
          onChange={(e) => {
            const v = e.target.value;
            if (v != "") setUnderType(v);
            else setUnderType(undefined);
          }}
        >
          <option value="">- Velg avslagstype -</option>
          <option value="Avslag pga. a">Avslag pga. a</option>
        </Select>
      </div>
      {underType == "Avslag pga. a" && (
        <OpprettBrevKnapp
          velgMal={velgMal}
          unikNøkkel={`${hovedType}-${underType}`}
          importer={import("./maler/avslag.md?raw")}
        />
      )}
    </>
  );
};

const OpprettBrevKnapp = ({
  velgMal,
  unikNøkkel,
  importer,
  transformerMal,
}: {
  velgMal: (mal: string) => void;
  unikNøkkel: string;
  importer: Promise<any>;
  transformerMal?: (mal: string) => string;
}) => {
  const [key, setKey] = useState<string>();
  const { isLoading, data } = useImporterMal(key, importer);

  if (data) velgMal(transformerMal ? transformerMal(data) : data);

  return (
    <Button
      loading={isLoading}
      onClick={() => {
        setKey(unikNøkkel);
      }}
      style={{ margin: "1em 0" }}
    >
      Opprett brev
    </Button>
  );
};

const useImporterMal = (
  key: string | undefined,
  importer: Promise<any> | undefined,
) => {
  return useSWR(
    key,
    importer === undefined
      ? async () => {}
      : async () => (await importer).default,
  );
};
