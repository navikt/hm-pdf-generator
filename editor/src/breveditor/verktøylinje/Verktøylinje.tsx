import { BlockMenuPlugin } from "@platejs/selection/react";
import { type RefObject, useState } from "react";
import { Box, Button, Tooltip } from "@navikt/ds-react";
import { useEditorPlugin, useEditorSelector } from "platejs/react";
import {
  BulletListIcon,
  ExpandIcon,
  NumberListIcon,
} from "@navikt/aksel-icons";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import BlokktypeMeny from "./BlokktypeMeny.tsx";
import AngreKnapp from "./AngreKnapp.tsx";
import GjentaKnapp from "./GjentaKnapp.tsx";
import FetKnapp from "./FetKnapp.tsx";
import KursivKnapp from "./KursivKnapp.tsx";
import UnderlinjeKnapp from "./UnderlinjeKnapp.tsx";

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
  const { editor } = useEditorPlugin(BlockMenuPlugin);

  const [erVerktøylinjeFokusert, settVerktøylinjeFokusert] = useState(false);
  const editorOrToolbarInFocus = editorIsFocused || erVerktøylinjeFokusert;

  const punktlistePressed = useEditorSelector(
    (editor) =>
      someList(editor, [
        ListStyleType.Disc,
        ListStyleType.Circle,
        ListStyleType.Square,
      ]),
    [],
  );

  const nummerertListePressed = useEditorSelector(
    (editor) => someList(editor, [ListStyleType.Decimal]),
    [],
  );

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
        <Tooltip content={"Punktliste"} keys={[]}>
          <Button
            disabled={!editorOrToolbarInFocus}
            icon={<BulletListIcon title="Punktliste" fontSize="1rem" />}
            size="small"
            variant={punktlistePressed ? "primary-neutral" : "tertiary-neutral"}
            onClick={(_) => {
              toggleList(editor, {
                listStyleType: ListStyleType.Circle,
              });
            }}
          />
        </Tooltip>
        <Tooltip content={"Nummerert liste"} keys={[]}>
          <Button
            disabled={!editorOrToolbarInFocus}
            icon={<NumberListIcon title="Nummerert liste" fontSize="1rem" />}
            size="small"
            variant={
              nummerertListePressed ? "primary-neutral" : "tertiary-neutral"
            }
            onClick={(_) => {
              toggleList(editor, {
                listStyleType: ListStyleType.Decimal,
              });
            }}
          />
        </Tooltip>
        <BlokktypeMeny
          editorOrToolbarInFocus={editorOrToolbarInFocus}
          plateContentRef={plateContentRef}
        />
      </div>
      <div className="right-items">
        <Tooltip content={erZoomed ? "Vis marger" : "Skjul marger"} keys={[]}>
          <Button
            icon={
              <ExpandIcon
                title={erZoomed ? "Vis marger" : "Skjul marger"}
                fontSize="1rem"
              />
            }
            onClick={() => settZoomed(!erZoomed)}
            variant="tertiary-neutral"
            size="small"
          />
        </Tooltip>
      </div>
    </Box>
  );
};

export default Verktøylinje;
