import useSWR from "swr";
import { Button, Select } from "@navikt/ds-react";
import { useState } from "react";

export const BrevmalVelger = ({
  velgMal,
}: {
  velgMal: (mal: string) => void;
}) => {
  const [hovedType, setHovedType] = useState<string>();

  const alternativer = [
    {
      title: "Innvilgelse",
      component: (
        <OpprettBrevKnapp
          velgMal={velgMal}
          unikNøkkel="Innvilgelse"
          importer={import("./maler/innvilgelse.md?raw")}
        />
      ),
    },
    {
      title: "Delvis innvilgelse",
      component: (
        <OpprettBrevKnapp
          velgMal={velgMal}
          unikNøkkel="Delvis innvilgelse"
          importer={import("./maler/delvis-innvilgelse.md?raw")}
        />
      ),
    },
    {
      title: "Avslag",
      component: <AvslagUndervalg velgMal={velgMal} />,
    },
    {
      title: "Tom brevmal",
      component: (
        <Button
          onClick={() => {
            velgMal("# ");
          }}
          style={{ margin: "1em 0" }}
        >
          Opprett brev
        </Button>
      ),
    },
  ];

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
          {alternativer.map((v) => (
            <option value={v.title}>{v.title}</option>
          ))}
        </Select>
        {alternativer.map((v) => (
          <>{hovedType == v.title && v.component}</>
        ))}
      </div>
    </div>
  );
};

const AvslagUndervalg = ({ velgMal }: { velgMal: (mal: string) => void }) => {
  const [underType, setUnderType] = useState<string>();
  const alternativer = [
    {
      title: "Bruker har ikke rett til hjelpemidler",
      component: (
        <OpprettBrevKnapp
          velgMal={velgMal}
          unikNøkkel={`avslag-${underType}`}
          importer={import("./maler/avslag-bruker-har-ikke-rett.md?raw")}
        />
      ),
    },
    {
      title: "Hjelpemiddelet gis ikke fra Folketrygden",
      component: (
        <OpprettBrevKnapp
          velgMal={velgMal}
          unikNøkkel={`avslag-${underType}`}
          importer={import("./maler/avslag-hjelpemiddelet-gis-ikke.md?raw")}
        />
      ),
    },
    {
      title: "Andre enn Nav dekker hjelpemiddelet",
      component: (
        <OpprettBrevKnapp
          velgMal={velgMal}
          unikNøkkel={`avslag-${underType}`}
          importer={import("./maler/avslag-andre-enn-nav-dekker.md?raw")}
        />
      ),
    },
  ];
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
          {alternativer.map((v) => (
            <option value={v.title}>{v.title}</option>
          ))}
        </Select>
      </div>
      {alternativer.map((v) => (
        <>{underType == v.title && v.component}</>
      ))}
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
