import MarkKnapp from "./hjelpere/MarkKnapp.tsx";

const UnderlinjeKnapp = ({
  editorOrToolbarInFocus,
}: {
  editorOrToolbarInFocus: boolean;
}) => {
  return (
    <MarkKnapp
      tittel="Underlinje"
      markKey="underline"
      ikon={
        <span
          style={{
            textDecoration: "underline",
          }}
        >
          U
        </span>
      }
      editorOrToolbarInFocus={editorOrToolbarInFocus}
    />
  );
};

export default UnderlinjeKnapp;
