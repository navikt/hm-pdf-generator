import useSWR from "swr";
import { Button, Select } from "@navikt/ds-react";
import { type ReactNode, useState } from "react";

export const BrevmalVelger = ({
  velgMal,
}: {
  velgMal: (mal: string) => void;
}) => {
  return (
    <div style={{ padding: "1em", background: "white", height: "100%" }}>
      <div style={{ maxWidth: "300px" }}>
        <Velger
          tittel="Velg brevmal"
          alternativer={[
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
                <Velger
                  tittel="Velg begrunnelse"
                  alternativer={[
                    {
                      title: "Bruker har ikke rett til hjelpemidler",
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="delvis-innvilgelse"
                          importer={
                            import(
                              "./maler/delvis-innvilgelse-bruker-har-ikke-rett.md?raw"
                            )
                          }
                        />
                      ),
                    },
                    {
                      title: "Hjelpemiddelet gis ikke fra Folketrygden",
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="delvis-innvilgelse-hjelpemiddelet-gis-ikke"
                          importer={
                            import(
                              "./maler/delvis-innvilgelse-hjelpemiddelet-gis-ikke.md?raw"
                            )
                          }
                        />
                      ),
                    },
                    {
                      title: "Andre enn Nav dekker hjelpemiddelet",
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="delvis-innvilgelse-andre-enn-nav-dekker"
                          importer={
                            import("./maler/avslag-andre-enn-nav-dekker.md?raw")
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
            },
            {
              title: "Avslag",
              component: (
                <Velger
                  tittel="Velg avslagstype"
                  alternativer={[
                    {
                      title: "Bruker har ikke rett til hjelpemidler",
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="avslag-bruker-har-ikke-rett"
                          importer={
                            import("./maler/avslag-bruker-har-ikke-rett.md?raw")
                          }
                        />
                      ),
                    },
                    {
                      title: "Hjelpemiddelet gis ikke fra Folketrygden",
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="avslag-hjelpemiddelet-gis-ikke"
                          importer={
                            import(
                              "./maler/avslag-hjelpemiddelet-gis-ikke.md?raw"
                            )
                          }
                        />
                      ),
                    },
                    {
                      title: "Andre enn Nav dekker hjelpemiddelet",
                      component: (
                        <OpprettBrevKnapp
                          velgMal={velgMal}
                          unikNøkkel="avslag-andre-enn-nav-dekker"
                          importer={
                            import("./maler/avslag-andre-enn-nav-dekker.md?raw")
                          }
                        />
                      ),
                    },
                  ]}
                />
              ),
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
          ]}
        />
      </div>
    </div>
  );
};

const Velger = ({
  tittel,
  alternativer,
}: {
  tittel: string;
  alternativer: { title: string; component: ReactNode }[];
}) => {
  const [underType, setUnderType] = useState<string>();
  return (
    <>
      <div style={{ margin: "1em 0 0 0" }}>
        <Select
          label={tittel}
          onChange={(e) => {
            const v = e.target.value;
            if (v != "") setUnderType(v);
            else setUnderType(undefined);
          }}
        >
          <option disabled={!!underType} value="">
            -
          </option>
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
