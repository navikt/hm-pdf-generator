import { Button, Tooltip } from "@navikt/ds-react";
import { useEditorState } from "platejs/react";
import type { ReactNode } from "react";

const MarkKnapp = ({
  tittel,
  markKey,
  ikon,
  editorOrToolbarInFocus,
}: {
  tittel: string;
  markKey: string;
  ikon: ReactNode;
  editorOrToolbarInFocus: boolean;
}) => {
  const editor = useEditorState();
  const active = editorOrToolbarInFocus && !!editor.api.mark(markKey);
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={!editorOrToolbarInFocus}
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
