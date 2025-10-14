import { type RefObject, useState } from "react";
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

const Verktøylinje = ({
  editorIsFocused,
  plateContentRef,
  erZoomed,
  settZoomed,
}: {
  editorIsFocused: boolean;
  plateContentRef: RefObject<any>;
  erZoomed: boolean;
  settZoomed: (zoomed: boolean) => void;
}) => {
  const [erVerktøylinjeFokusert, settVerktøylinjeFokusert] = useState(false);
  const editorOrToolbarInFocus = editorIsFocused || erVerktøylinjeFokusert;

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
      onFocusCapture={(_) => settVerktøylinjeFokusert(true)}
      onBlurCapture={(_) => settVerktøylinjeFokusert(false)}
    >
      <div className="left-items">
        <AngreKnapp />
        <GjentaKnapp />
        <FetKnapp editorOrToolbarInFocus={editorOrToolbarInFocus} />
        <KursivKnapp editorOrToolbarInFocus={editorOrToolbarInFocus} />
        <UnderlinjeKnapp editorOrToolbarInFocus={editorOrToolbarInFocus} />
        <PunktlisteKnapp editorOrToolbarInFocus={editorOrToolbarInFocus} />
        <NummerertListeKnapp editorOrToolbarInFocus={editorOrToolbarInFocus} />
        <BlokktypeMeny
          editorOrToolbarInFocus={editorOrToolbarInFocus}
          plateContentRef={plateContentRef}
        />
      </div>
      <div className="right-items">
        <SvitsjMargerKnapp erZoomed={erZoomed} settZoomed={settZoomed} />
      </div>
    </Box>
  );
};

export default Verktøylinje;
