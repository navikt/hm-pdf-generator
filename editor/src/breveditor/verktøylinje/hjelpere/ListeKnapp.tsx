import { Button, Tooltip } from "@navikt/ds-react";
import { useEditorSelector, useEditorState } from "platejs/react";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import type { ReactNode } from "react";
import { useBreveditorContext } from "../../Breveditor.tsx";

const ListeKnapp = ({
  tittel,
  listeStilType,
  ikon,
}: {
  tittel: string;
  listeStilType: ListStyleType;
  ikon: ReactNode;
}) => {
  const breveditor = useBreveditorContext();
  const editor = useEditorState();
  const pressed = useEditorSelector(
    (editor) => someList(editor, [listeStilType]),
    [],
  );
  const active = breveditor.harFokus && pressed;
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={!breveditor.harFokus}
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
