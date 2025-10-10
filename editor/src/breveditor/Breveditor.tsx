import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import { MarkdownPlugin, remarkMdx } from "@platejs/markdown";
import { BaseParagraphPlugin, KEYS } from "platejs";
import {
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseH4Plugin,
  BaseHeadingPlugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
} from "@platejs/basic-nodes";
import {
  BlockMenuPlugin,
  BlockSelectionPlugin,
} from "@platejs/selection/react";
import { useEffect, useRef, useState } from "react";
import NavLogo from "./../assets/nav-logo.svg?react";
import Verktøylinje from "./Verktøylinje.tsx";
import { LinkPlugin } from "@platejs/link/react";
import { BoldPlugin } from "@platejs/basic-nodes/react";

const Breveditor = ({ markdown }: { markdown: string }) => {
  let editor = usePlateEditor(
    {
      plugins: [
        ...[
          MarkdownPlugin.configure({
            options: {
              plainMarks: [KEYS.suggestion, KEYS.comment],
              remarkPlugins: [
                remarkMdx /*, remarkMath, remarkGfm, remarkMention*/,
              ],
            },
          }),
        ],
        ...[
          BaseH1Plugin,
          BaseH2Plugin,
          BaseH3Plugin,
          BaseH4Plugin,
          BaseParagraphPlugin,
          BaseHeadingPlugin,
          // BaseBoldPlugin,
          BaseItalicPlugin,
          BaseUnderlinePlugin,
          // BaseLinkPlugin,
          BoldPlugin,
          LinkPlugin,
          BlockMenuPlugin,
          BlockSelectionPlugin,
        ],
      ],
      //value: [{ type: "p", children: [{ text: "Hello world!" }] }],
      value: (editor) =>
        editor.getApi(MarkdownPlugin).markdown.deserialize(markdown, {
          remarkPlugins: [
            // remarkMath,
            // remarkGfm,
            remarkMdx,
            // remarkMention,
            // remarkEmoji as any,
          ],
        }),
    },
    [],
  );

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorContainerRef.current && editorContentRef.current) {
      let designedWidth = 794; // 595pt in px
      let actualWidth = editorContainerRef.current.clientWidth;
      let scale = actualWidth / designedWidth;
      editorContentRef.current.style.transform = `scale(${scale})`;
    }
  }, [editorContainerRef, editorContentRef]);

  const plateContentRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Plate editor={editor}>
      <Verktøylinje
        editorIsFocused={isFocused}
        plateContentRef={plateContentRef}
      />
      <div
        style={{
          padding: "0 10px 10px 10px",
          overflowY: "auto",
          height: "100%",
        }}
      >
        <div ref={editorContainerRef} className="editor-container">
          <div ref={editorContentRef} className="editor-content">
            <div className="page">
              <div className="header">
                <NavLogo />
                <dl>
                  <dt>Navn:</dt>
                  <dd>Ola Nordmann</dd>
                  <dt>Fødselsnummer:</dt>
                  <dd>26848497710</dd>
                  <dt>Saksnummer:</dt>
                  <dd>1000</dd>
                </dl>
                <span>22. Januar 2025</span>
              </div>
              <PlateContent
                ref={plateContentRef}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                className="contentEditable"
                placeholder="Type your amazing content here..."
              />
            </div>
          </div>
        </div>
      </div>
    </Plate>
  );
};

export default Breveditor;
