import useSWR from "swr";

export const useAvslagMal = () =>
  importerMal("avslag", import("./maler/avslag.md?raw"));

const importerMal = (key: string, imp: Promise<any>) => {
  return useSWR(key, async () => (await imp).default);
};
