import MarkKnapp from "./hjelpere/MarkKnapp.tsx";

const FetKnapp = ({
  editorOrToolbarInFocus,
}: {
  editorOrToolbarInFocus: boolean;
}) => {
  return (
    <MarkKnapp
      tittel="Fet"
      markKey="bold"
      ikon={<span>F</span>}
      editorOrToolbarInFocus={editorOrToolbarInFocus}
    />
  );
};

export default FetKnapp;
