import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import * as React from "react";
import { type RefObject } from "react";
import { ActionMenu, Button } from "@navikt/ds-react";
import { KEYS } from "platejs";
import {
  useEditorPlugin,
  useEditorSelector,
  useEditorState,
} from "platejs/react";
import {
  BulletListIcon,
  ChevronDownIcon,
  Density3Icon,
  NumberListIcon,
  PencilWritingFillIcon,
} from "@navikt/aksel-icons";
import { ListStyleType, someList, toggleList } from "@platejs/list";
import { TypeH1, TypeH2, TypeH3 } from "@styled-icons/bootstrap";

const BlokktypeMeny = ({
  editorOrToolbarInFocus,
  plateContentRef,
}: {
  editorOrToolbarInFocus: boolean;
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
          editor.tf.resetBlock({ at: path });
          editor.tf.toggleBlock(type, { at: path });
        });
    },
    [editor],
  );

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
            <span style={{ minWidth: "50px", display: "inline-block" }}>-</span>
          )}
          {!noBlockSelected && moreThanOneBlockSelected && <>Flere</>}
          {!noBlockSelected && blockType == "p" && <>Brødtekst</>}
          {!noBlockSelected && blockType == "h1" && <>Tittel</>}
          {!noBlockSelected && blockType == "h2" && <>Overskrift 1</>}
          {!noBlockSelected && blockType == "h3" && <>Overskrift 2</>}
          {!noBlockSelected && blockType == "h4" && <>Overskrift 3</>}
          {!noBlockSelected &&
            !moreThanOneBlockSelected &&
            blockType == "ul" && <>Punktliste</>}
          {!noBlockSelected &&
            !moreThanOneBlockSelected &&
            blockType == "ol" && <>Nummerert liste</>}
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
            icon={<NumberListIcon title="Nummerert liste" fontSize="1rem" />}
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
  );
};

export default BlokktypeMeny;
