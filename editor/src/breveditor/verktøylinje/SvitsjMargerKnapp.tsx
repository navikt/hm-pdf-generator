import { Button, Tooltip } from "@navikt/ds-react";
import { ExpandIcon } from "@navikt/aksel-icons";

const SvitsjMargerKnapp = ({
  erZoomed,
  settZoomed,
}: {
  erZoomed: boolean;
  settZoomed: (zoom: boolean) => void;
}) => {
  return (
    <Tooltip content={erZoomed ? "Vis marger" : "Skjul marger"} keys={[]}>
      <Button
        icon={
          <ExpandIcon
            title={erZoomed ? "Vis marger" : "Skjul marger"}
            fontSize="1rem"
          />
        }
        onClick={() => settZoomed(!erZoomed)}
        variant="tertiary-neutral"
        size="small"
      />
    </Tooltip>
  );
};

export default SvitsjMargerKnapp;
