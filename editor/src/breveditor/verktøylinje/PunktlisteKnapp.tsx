import { BulletListIcon } from "@navikt/aksel-icons";
import { ListStyleType } from "@platejs/list";
import ListeKnapp from "./hjelpere/ListeKnapp.tsx";

const PunktlisteKnapp = ({
  editorOrToolbarInFocus,
}: {
  editorOrToolbarInFocus: boolean;
}) => {
  return (
    <ListeKnapp
      tittel="Punktliste"
      listeStilType={ListStyleType.Circle}
      ikon={<BulletListIcon title="Punktliste" fontSize="1rem" />}
      editorOrToolbarInFocus={editorOrToolbarInFocus}
    />
  );
};

export default PunktlisteKnapp;
