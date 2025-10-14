import { Button, Tooltip } from "@navikt/ds-react";
import { useEditorSelector, useEditorState } from "platejs/react";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import type { ReactNode } from "react";

const ListeKnapp = ({
  tittel,
  listeStilType,
  ikon,
  editorOrToolbarInFocus,
}: {
  tittel: string;
  listeStilType: ListStyleType;
  ikon: ReactNode;
  editorOrToolbarInFocus: boolean;
}) => {
  const editor = useEditorState();
  const pressed = useEditorSelector(
    (editor) => someList(editor, [listeStilType]),
    [],
  );
  const active = editorOrToolbarInFocus && pressed;
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={!editorOrToolbarInFocus}
        icon={ikon}
        size="small"
        variant={active ? "primary-neutral" : "tertiary-neutral"}
        onClick={(_) => {
          toggleList(editor, {
            listStyleType: listeStilType,
          });
        }}
      />
    </Tooltip>
  );
};

export default ListeKnapp;
