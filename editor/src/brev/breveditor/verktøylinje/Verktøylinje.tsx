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
import LinkKnapp from "./LinkKnapp.tsx";
import SlettBrevutkastKnapp from "./SlettBrevutkastKnapp.tsx";

const Verktøylinje = ({}: {}) => {
  const breveditor = useBreveditorContext();
  return (
    <Box
      className="toolbar"
      onMouseDown={(e) => {
        // Prevent default for all other elements
        e.preventDefault();
      }}
      onFocusCapture={(_) =>
        breveditor.settBreveditorEllerVerktoylinjeFokusert(true)
      }
      onBlurCapture={(_) =>
        breveditor.settBreveditorEllerVerktoylinjeFokusert(
          breveditor.erPlateContentFokusert,
        )
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
        <LinkKnapp />
        <SvitsjMargerKnapp />
        <BlokktypeMeny />
      </div>
      <div className="right-items">
        <div
          style={{
            fontSize: "0.8rem",
            padding: "4px",
            alignContent: "center",
          }}
        >
          Lagret
        </div>
        <SlettBrevutkastKnapp />
      </div>
    </Box>
  );
};

export default Verktøylinje;
