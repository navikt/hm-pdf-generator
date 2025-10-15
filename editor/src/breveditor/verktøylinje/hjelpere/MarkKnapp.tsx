import { Button, Tooltip } from "@navikt/ds-react";
import { useEditorState } from "platejs/react";
import type { ReactNode } from "react";
import { useBreveditorContext } from "../../Breveditor.tsx";

const MarkKnapp = ({
  tittel,
  markKey,
  ikon,
}: {
  tittel: string;
  markKey: string;
  ikon: ReactNode;
}) => {
  const breveditor = useBreveditorContext();
  const editor = useEditorState();
  const active = breveditor.harFokus && !!editor.api.mark(markKey);
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={!breveditor.harFokus}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault();
          editor.tf.toggleMark(markKey);
        }}
        variant={active ? "primary-neutral" : "tertiary-neutral"}
        size="small"
        icon={ikon}
        className={
          active ? "toolbar-button toolbar-button-active" : "toolbar-button"
        }
      />
    </Tooltip>
  );
};

export default MarkKnapp;
