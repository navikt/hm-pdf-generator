import { BulletListIcon } from "@navikt/aksel-icons";
import { ListStyleType } from "@platejs/list";
import ListeKnapp from "./hjelpere/ListeKnapp.tsx";

const NummerertListeKnapp = ({}: {}) => {
  return (
    <ListeKnapp
      tittel="Nummerert liste"
      listeStilType={ListStyleType.Decimal}
      ikon={<BulletListIcon fontSize="1rem" />}
    />
  );
};

export default NummerertListeKnapp;
