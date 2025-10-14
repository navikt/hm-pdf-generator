import { BlockMenuPlugin } from "@platejs/selection/react";
import { type ReactNode, type RefObject, useState } from "react";
import { Box, Button, Tooltip } from "@navikt/ds-react";
import { type Editor } from "platejs";
import { TextApi } from "@platejs/slate";
import {
  useEditorPlugin,
  useEditorSelector,
  useEditorState,
} from "platejs/react";
import {
  ArrowRedoIcon,
  ArrowUndoIcon,
  BulletListIcon,
  ExpandIcon,
  NumberListIcon,
  ShrinkIcon,
} from "@navikt/aksel-icons";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import BlokktypeMeny from "./BlokktypeMeny.tsx";

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

  const editorStateChange = useEditorState();

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
        <MarkButton
          disabled={!editorOrToolbarInFocus}
          format="undo"
          icon={
            <ArrowUndoIcon
              className="menyKnappParent"
              title="Angre"
              fontSize="1rem"
            />
          }
          title="Angre"
          //keys={fetHurtigtast}
        />
        <MarkButton
          disabled={!editorOrToolbarInFocus}
          format="redo"
          icon={
            <ArrowRedoIcon
              className="menyKnappParent"
              title="Gjenta"
              fontSize="1rem"
            />
          }
          title="Gjenta"
          //keys={fetHurtigtast}
        />
        <MarkButton
          disabled={!editorOrToolbarInFocus}
          format="bold"
          icon={
            <div
              className={
                editorOrToolbarInFocus &&
                isMarkActive(editorStateChange, "bold")
                  ? "menyKnappParent active"
                  : "menyKnappParent"
              }
            >
              F
            </div>
          }
          title="Fet"
          //keys={fetHurtigtast}
        />
        <MarkButton
          disabled={!editorOrToolbarInFocus}
          format="italic"
          icon={
            <i
              className={
                editorOrToolbarInFocus &&
                isMarkActive(editorStateChange, "italic")
                  ? "menyKnappParent active"
                  : "menyKnappParent"
              }
            >
              K
            </i>
          }
          title="Kursiv"
          //keys={fetHurtigtast}
        />
        <MarkButton
          disabled={!editorOrToolbarInFocus}
          format="underline"
          icon={
            <div
              className={
                editorOrToolbarInFocus &&
                isMarkActive(editorStateChange, "underline")
                  ? "menyKnappParent active"
                  : "menyKnappParent"
              }
              style={{ textDecoration: "underline" }}
            >
              U
            </div>
          }
          title="Underlinje"
          //keys={fetHurtigtast}
        />
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

const MarkButton = ({
  disabled,
  format,
  icon,
  title,
  keys,
}: {
  disabled?: boolean;
  format: string;
  icon: ReactNode;
  title?: string;
  keys?: string[];
}) => {
  const editor = useEditorState();
  if (format == "undo" || format == "redo")
    return (
      <Tooltip content={title ? title : ""} keys={keys}>
        <Button
          disabled={
            format == "undo"
              ? editor.history.undos.length == 0
              : format == "redo"
                ? editor.history.redos.length == 0
                : false
          }
          onMouseDown={(event: { preventDefault: () => void }) => {
            event.preventDefault();
            if (
              format == "undo"
                ? editor.history.undos.length == 0
                : format == "redo"
                  ? editor.history.redos.length == 0
                  : false
            )
              return;
            if (format === "undo") editor.undo();
            if (format === "redo") editor.redo();
          }}
          variant="tertiary-neutral"
          size="small"
          icon={icon}
        />
      </Tooltip>
    );
  return (
    <Tooltip content={title ? title : ""} keys={keys}>
      <Button
        disabled={disabled}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
        variant={
          !disabled && isMarkActive(editor, format)
            ? "primary-neutral"
            : "tertiary-neutral"
        }
        size="small"
        icon={icon}
      />
    </Tooltip>
  );
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks: any = editor.api.marks();
  //console.log("here", marks ? marks[format] === true : false, format);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (format === "clear") {
    // remove all styles
    editor.tf.setNodes(
      {
        bold: false,
        italic: false,
        underline: false,
        change: false,
        light: false,
      },
      { match: TextApi.isText },
    );
    // make it a paragrah
    editor.tf.setNodes({ type: "paragraph", align: "left" });
  } else if (isActive) {
    editor.tf.removeMark(format);
  } else {
    editor.tf.addMark(format, true);
  }
};
