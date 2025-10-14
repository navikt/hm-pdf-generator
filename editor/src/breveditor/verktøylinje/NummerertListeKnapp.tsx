import { BulletListIcon } from "@navikt/aksel-icons";
import { ListStyleType } from "@platejs/list";
import ListeKnapp from "./hjelpere/ListeKnapp.tsx";

const NummerertListeKnapp = ({
  editorOrToolbarInFocus,
}: {
  editorOrToolbarInFocus: boolean;
}) => {
  return (
    <ListeKnapp
      tittel="Nummerert liste"
      listeStilType={ListStyleType.Decimal}
      ikon={<BulletListIcon title="Nummerert liste" fontSize="1rem" />}
      editorOrToolbarInFocus={editorOrToolbarInFocus}
    />
  );
};

export default NummerertListeKnapp;
