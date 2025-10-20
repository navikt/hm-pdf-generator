import { Button, Tooltip } from "@navikt/ds-react";
import { LinkIcon } from "@navikt/aksel-icons";
import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from "@platejs/link/react";

const LinkKnapp = ({}: {}) => {
  const state = useLinkToolbarButtonState();
  const { props: buttonProps } = useLinkToolbarButton(state);
  return (
    <Tooltip content={"Link"} keys={[]}>
      <Button
        variant={buttonProps.pressed ? "primary-neutral" : "tertiary-neutral"}
        size="small"
        icon={
          <LinkIcon className="menyKnappParent" title="Link" fontSize="1rem" />
        }
        onMouseDown={buttonProps.onMouseDown}
        onClick={buttonProps.onClick}
      />
    </Tooltip>
  );
};

export default LinkKnapp;
