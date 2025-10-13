import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import * as React from "react";
import { type ReactNode, type RefObject, useState } from "react";
import { ActionMenu, Box, Button, HStack, Tooltip } from "@navikt/ds-react";
import { type Editor, KEYS } from "platejs";
import { TextApi } from "@platejs/slate";
import { useEditorPlugin, useEditorState } from "platejs/react";
import {
  ArrowRedoIcon,
  ArrowUndoIcon,
  ChevronDownIcon,
} from "@navikt/aksel-icons";

const Verktøylinje = ({
  editorIsFocused,
  plateContentRef,
}: {
  editorIsFocused: boolean;
  plateContentRef: RefObject<any>;
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
          editor.tf.toggleBlock(type, { at: path });
        });
    },
    [editor],
  );

  const [erVerktøylinjeFokusert, settVerktøylinjeFokusert] = useState(false);
  const editorOrToolbarInFocus = editorIsFocused || erVerktøylinjeFokusert;

  const editorStateChange = useEditorState();
  const blockType = (() => {
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
      <Box className="toolbar_section">
        <HStack wrap justify={{ lg: "start", xl: "start" }}>
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
          <div style={{ padding: "10px", width: "200px" }}>
            {(() => {
              const opts: Map<string, string | null> = new Map([
                ["noBlockSelected", "-"],
                ["moreThanOneBlockSelected", "Flere"],
                ["p", "Brødtekst"],
                ["h1", "Overskrift 1"],
                ["h2", "Overskrift 2"],
                ["h3", "Overskrift 3"],
                ["h4", "Overskrift 4"],
              ]);
              return (
                <ActionMenu
                  onOpenChange={(open) => {
                    if (!open)
                      setTimeout(() => plateContentRef.current?.focus(), 10);
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
                      {noBlockSelected
                        ? "-"
                        : moreThanOneBlockSelected
                          ? "Flere"
                          : opts.get(blockType || "") || ""}
                    </Button>
                  </ActionMenu.Trigger>
                  <ActionMenu.Content>
                    <ActionMenu.Group label="Grunnleggende stiler">
                      <ActionMenu.Item onSelect={(_) => turnInto("p")}>
                        Brødtekst
                      </ActionMenu.Item>
                    </ActionMenu.Group>
                    <ActionMenu.Group label="Overskrifter">
                      <ActionMenu.Item onSelect={(_) => turnInto("h1")}>
                        Overskrift 1
                      </ActionMenu.Item>
                      <ActionMenu.Item onSelect={(_) => turnInto("h2")}>
                        Overskrift 2
                      </ActionMenu.Item>
                      <ActionMenu.Item onSelect={(_) => turnInto("h3")}>
                        Overskrift 3
                      </ActionMenu.Item>
                      <ActionMenu.Item onSelect={(_) => turnInto("h4")}>
                        Overskrift 4
                      </ActionMenu.Item>
                    </ActionMenu.Group>
                  </ActionMenu.Content>
                </ActionMenu>
              );
            })()}
          </div>
        </HStack>
      </Box>
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
          variant="tertiary"
        >
          {icon}
        </Button>
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
        variant={isMarkActive(editor, format) ? "primary" : "tertiary"}
      >
        {icon}
      </Button>
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
