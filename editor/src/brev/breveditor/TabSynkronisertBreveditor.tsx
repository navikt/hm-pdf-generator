import Breveditor, { type StateMangement } from "./Breveditor.tsx";
import { useRef, useState } from "react";

type BreveditorParams = Parameters<typeof Breveditor>[0];
export const TabSynkronisertBreveditor = (
  props: Omit<BreveditorParams, "state" | "onStateChange">,
) => {
  const [state, setState] = useState<StateMangement>();
  const channel = useRef(
    (() => {
      const c = new BroadcastChannel("breveditor-tab-sync");
      c.onmessage = ({ data }: MessageEvent<StateMangement>) => {
        setState(data);
      };
      return c;
    })(),
  );
  return (
    <Breveditor
      state={state}
      onStateChange={(newState) => channel.current.postMessage(newState)}
      {...props}
    />
  );
};
