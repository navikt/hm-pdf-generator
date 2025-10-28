import MarkKnapp from "./hjelpere/MarkKnapp.tsx";

const UnderlinjeKnapp = ({}: {}) => {
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
    />
  );
};

export default UnderlinjeKnapp;
