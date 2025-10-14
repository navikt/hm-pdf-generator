import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import * as React from "react";
import { type ReactNode, type RefObject, useState } from "react";
import { ActionMenu, Box, Button, Tooltip } from "@navikt/ds-react";
import { type Editor, KEYS } from "platejs";
import { TextApi } from "@platejs/slate";
import {
  useEditorPlugin,
  useEditorState,
  useEditorSelector,
} from "platejs/react";
import {
  ArrowRedoIcon,
  ArrowUndoIcon,
  BulletListIcon,
  ChevronDownIcon,
  Density3Icon,
  ExpandIcon,
  NumberListIcon,
  PencilWritingFillIcon,
  ShrinkIcon,
} from "@navikt/aksel-icons";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import { TypeH1, TypeH2, TypeH3 } from "@styled-icons/bootstrap";

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

  const turnInto = React.useCallback(
    (type: string) => {
      editor
        .getApi(BlockSelectionPlugin)
        .blocks()
        .forEach(([node, path]) => {
          if (node[KEYS.listType]) {
            editor.tf.unsetNodes([KEYS.listType, "indent"], {
              at: path,
            });
          }
          editor.tf.resetBlock({ at: path });
          editor.tf.toggleBlock(type, { at: path });
        });
    },
    [editor],
  );

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
  const blockType = (() => {
    if (punktlistePressed) return "ul";
    if (nummerertListePressed) return "ol";
    let blocks = editorStateChange.api.blocks();
    return blocks.length == 1 ? blocks[0]!![0]!!.type : undefined;
  })();
  const moreThanOneBlockSelected = (() =>
    editorStateChange.api.blocks().length > 1)();
  const noBlockSelected = (() =>
    !editorOrToolbarInFocus || editorStateChange.api.blocks().length == 0)();

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
        <ActionMenu
          onOpenChange={(open) => {
            if (!open) setTimeout(() => plateContentRef.current?.focus(), 10);
          }}
        >
          <ActionMenu.Trigger>
            <Button
              variant="secondary-neutral"
              icon={<ChevronDownIcon aria-hidden />}
              iconPosition="right"
              size="small"
              disabled={!editorOrToolbarInFocus}
            >
              {noBlockSelected && (
                <span style={{ minWidth: "50px", display: "inline-block" }}>
                  -
                </span>
              )}
              {moreThanOneBlockSelected && <>Flere</>}
              {!noBlockSelected && blockType == "p" && <>Brødtekst</>}
              {!noBlockSelected && blockType == "h1" && <>Tittel</>}
              {!noBlockSelected && blockType == "h2" && <>Overskrift 1</>}
              {!noBlockSelected && blockType == "h3" && <>Overskrift 2</>}
              {!noBlockSelected && blockType == "h4" && <>Overskrift 3</>}
              {!noBlockSelected && blockType == "ul" && <>Punktliste</>}
              {!noBlockSelected && blockType == "ol" && <>Nummerert liste</>}
            </Button>
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Group label="Grunnleggende stiler">
              <ActionMenu.Item
                icon={<Density3Icon title="Brødtekst" fontSize="1rem" />}
                onSelect={(_) => turnInto("p")}
              >
                Brødtekst
              </ActionMenu.Item>
            </ActionMenu.Group>
            <ActionMenu.Group label="Overskrifter">
              <ActionMenu.Item
                icon={<PencilWritingFillIcon title="Tittel" fontSize="1rem" />}
                onSelect={(_) => turnInto("h1")}
              >
                Tittel
              </ActionMenu.Item>
              <ActionMenu.Item
                icon={
                  <TypeH1
                    title="Overskrift 1"
                    fontSize="1rem"
                    style={{ scale: "0.7" }}
                  />
                }
                onSelect={(_) => turnInto("h2")}
              >
                Overskrift 1
              </ActionMenu.Item>
              <ActionMenu.Item
                icon={
                  <TypeH2
                    title="Overskrift 2"
                    fontSize="1rem"
                    style={{ scale: "0.7" }}
                  />
                }
                onSelect={(_) => turnInto("h3")}
              >
                Overskrift 2
              </ActionMenu.Item>
              <ActionMenu.Item
                icon={
                  <TypeH3
                    title="Overskrift 3"
                    fontSize="1rem"
                    style={{ scale: "0.7" }}
                  />
                }
                onSelect={(_) => turnInto("h4")}
              >
                Overskrift 3
              </ActionMenu.Item>
            </ActionMenu.Group>
            <ActionMenu.Group label="Lister">
              <ActionMenu.Item
                icon={<BulletListIcon title="Punktliste" fontSize="1rem" />}
                onSelect={(_) =>
                  !punktlistePressed &&
                  toggleList(editor, {
                    listStyleType: ListStyleType.Circle,
                  })
                }
              >
                Punktliste
              </ActionMenu.Item>
              <ActionMenu.Item
                icon={
                  <NumberListIcon title="Nummerert liste" fontSize="1rem" />
                }
                onSelect={(_) =>
                  !nummerertListePressed &&
                  toggleList(editor, {
                    listStyleType: ListStyleType.Decimal,
                  })
                }
              >
                Nummerert liste
              </ActionMenu.Item>
            </ActionMenu.Group>
          </ActionMenu.Content>
        </ActionMenu>
      </div>
      <div className="right-items">
        {!erZoomed && (
          <Tooltip content={"Zoom inn"} keys={[]}>
            <Button
              icon={<ExpandIcon title="Zoom inn" fontSize="1rem" />}
              onClick={() => settZoomed(true)}
              variant="tertiary-neutral"
              size="small"
            />
          </Tooltip>
        )}
        {erZoomed && (
          <Tooltip content={"Zoom ut"} keys={[]}>
            <Button
              icon={<ShrinkIcon title="Zoom ut" fontSize="1rem" />}
              onClick={() => settZoomed(false)}
              variant="primary-neutral"
              size="small"
            />
          </Tooltip>
        )}
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
