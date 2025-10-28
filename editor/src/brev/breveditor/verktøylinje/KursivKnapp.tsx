import MarkKnapp from "./hjelpere/MarkKnapp.tsx";

const KursivKnapp = ({}: {}) => {
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
    />
  );
};

export default KursivKnapp;
