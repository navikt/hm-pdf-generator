import { Button, Tooltip } from "@navikt/ds-react";
import { useEditorState } from "platejs/react";
import { ArrowUndoIcon } from "@navikt/aksel-icons";

const SettInnHeaderKnapp = ({}: {}) => {
  const editor = useEditorState();
  return (
    <Tooltip content={"SettInnHeader"} keys={[]}>
      <Button
        disabled={editor.history.undos.length == 0}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault();
          editor.tf.insertNode({
            type: "brevHeader",
            children: [{ text: "" }],
          });
          editor.tf.insertBreak();
        }}
        variant="tertiary-neutral"
        size="small"
        icon={
          <ArrowUndoIcon
            className="menyKnappParent"
            title="Angre"
            fontSize="1rem"
          />
        }
      />
    </Tooltip>
  );
};

export default SettInnHeaderKnapp;
