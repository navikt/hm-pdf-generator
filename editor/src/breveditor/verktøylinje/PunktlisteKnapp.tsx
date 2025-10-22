import { BulletListIcon } from "@navikt/aksel-icons";
import { ListStyleType } from "@platejs/list";
import ListeKnapp from "./hjelpere/ListeKnapp.tsx";

const PunktlisteKnapp = ({}: {}) => {
  return (
    <ListeKnapp
      tittel="Punktliste"
      listeStilType={ListStyleType.Circle}
      ikon={<BulletListIcon fontSize="1rem" />}
    />
  );
};

export default PunktlisteKnapp;
