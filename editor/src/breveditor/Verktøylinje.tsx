import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import * as React from "react";
import { type ReactNode } from "react";
import { Box, Button, HStack, Select, Tooltip } from "@navikt/ds-react";
import type { Editor } from "platejs";
import { TextApi } from "@platejs/slate";
import { useEditorPlugin, useEditorState } from "platejs/react";

const Verktøylinje = ({}: {}) => {
  const { editor } = useEditorPlugin(BlockMenuPlugin);

  const turnInto = React.useCallback(
    (type: string) => {
      console.log(
        "turn into 1",
        "type",
        type,
        editor.getApi(BlockSelectionPlugin).blocks(),
      );
      editor
        .getApi(BlockSelectionPlugin)
        .blocks()
        .forEach(([_, path]) => {
          //if (node[KEYS.listType]) {
          //  editor.tf.unsetNodes([KEYS.listType, "indent"], {
          //    at: path,
          //  });
          //}
          console.log("turn into 2", "type", type, "path", path);
          editor.tf.toggleBlock(type, { at: path });
        });
    },
    [editor],
  );

  const editorStateChange = useEditorState();
  const blockType = (() => {
    let blocks = editorStateChange.api.blocks();
    return blocks.length == 1 ? blocks[0]!![0]!!.type : undefined;
  })();
  const moreThanOneBlockSelected = (() =>
    editorStateChange.api.blocks().length > 1)();
  const noBlockSelected = (() => editorStateChange.api.blocks().length == 0)();

  return (
    <Box className="toolbar">
      <Box className="toolbar_section">
        <HStack wrap justify={{ lg: "start", xl: "start" }}>
          <MarkButton
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
            <Select
              label=""
              hideLabel={true}
              size="small"
              onChange={(e) => {
                turnInto(e.target.value);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              value={
                noBlockSelected
                  ? "noBlockSelected"
                  : moreThanOneBlockSelected
                    ? "moreThanOneBlockSelected"
                    : blockType
              }
            >
              {noBlockSelected && (
                <option value="noBlockSelected" disabled={true}>
                  -
                </option>
              )}
              {moreThanOneBlockSelected && (
                <option value="moreThanOneBlockSelected" disabled={true}>
                  Flere
                </option>
              )}
              <option value="p">Brødtekst</option>
              <option value="h1">Overskrift 1</option>
              <option value="h2">Overskrift 2</option>
              <option value="h3">Overskrift 3</option>
              <option value="h4">Overskrift 4</option>
            </Select>
          </div>
        </HStack>
      </Box>
    </Box>
  );
};

export default Verktøylinje;

const MarkButton = ({
  format,
  icon,
  title,
  keys,
}: {
  format: string;
  icon: ReactNode;
  title?: string;
  keys?: string[];
}) => {
  const editor = useEditorState();
  return (
    <Tooltip content={title ? title : ""} keys={keys}>
      <Button
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
