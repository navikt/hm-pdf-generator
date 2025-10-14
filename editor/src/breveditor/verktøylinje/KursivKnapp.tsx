import MarkKnapp from "./hjelpere/MarkKnapp.tsx";

const KursivKnapp = ({
  editorOrToolbarInFocus,
}: {
  editorOrToolbarInFocus: boolean;
}) => {
  return (
    <MarkKnapp
      tittel="Kursiv"
      markKey="italic"
      ikon={
        <span
          style={{
            fontStyle: "italic",
          }}
        >
          K
        </span>
      }
      editorOrToolbarInFocus={editorOrToolbarInFocus}
    />
  );
};

export default KursivKnapp;
