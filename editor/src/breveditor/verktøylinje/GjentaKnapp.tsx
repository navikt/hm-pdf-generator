import { Button, Tooltip } from "@navikt/ds-react";
import { useEditorState } from "platejs/react";
import { ArrowRedoIcon } from "@navikt/aksel-icons";

const GjentaKnapp = ({}: {}) => {
  const editor = useEditorState();
  return (
    <Tooltip content={"Gjenta"} keys={[]}>
      <Button
        disabled={editor.history.redos.length == 0}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault();
          editor.redo();
        }}
        variant="tertiary-neutral"
        size="small"
        icon={
          <ArrowRedoIcon
            className="menyKnappParent"
            title="Gjenta"
            fontSize="1rem"
          />
        }
      />
    </Tooltip>
  );
};

export default GjentaKnapp;
