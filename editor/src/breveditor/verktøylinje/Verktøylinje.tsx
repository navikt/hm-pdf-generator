import { Box } from "@navikt/ds-react";
import BlokktypeMeny from "./BlokktypeMeny.tsx";
import AngreKnapp from "./AngreKnapp.tsx";
import GjentaKnapp from "./GjentaKnapp.tsx";
import FetKnapp from "./FetKnapp.tsx";
import KursivKnapp from "./KursivKnapp.tsx";
import UnderlinjeKnapp from "./UnderlinjeKnapp.tsx";
import PunktlisteKnapp from "./PunktlisteKnapp.tsx";
import NummerertListeKnapp from "./NummerertListeKnapp.tsx";
import SvitsjMargerKnapp from "./SvitsjMargerKnapp.tsx";
import { useBreveditorContext } from "../Breveditor.tsx";

const Verktøylinje = ({}: {}) => {
  const breveditor = useBreveditorContext();
  return (
    <Box
      className="toolbar"
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        // Allow text inputs, textareas, selects, and contenteditable elements
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable
        ) {
          return; // Do not prevent default
        }
        // Prevent default for all other elements
        e.preventDefault();
      }}
      onFocusCapture={(_) =>
        breveditor.settBreveditorEllerVerktøylinjeHarFokus(true)
      }
      onBlurCapture={(_) =>
        breveditor.settBreveditorEllerVerktøylinjeHarFokus(breveditor.harFokus)
      }
    >
      <div className="left-items">
        <AngreKnapp />
        <GjentaKnapp />
        <FetKnapp />
        <KursivKnapp />
        <UnderlinjeKnapp />
        <PunktlisteKnapp />
        <NummerertListeKnapp />
        <BlokktypeMeny />
      </div>
      <div className="right-items">
        <SvitsjMargerKnapp />
      </div>
    </Box>
  );
};

export default Verktøylinje;
