import { Button, TextField, VStack } from "@navikt/ds-react";
import { FloppydiskIcon, LinkBrokenIcon } from "@navikt/aksel-icons";
import { useEditorRef } from "platejs/react";
import React__default, { type KeyboardEvent, useState } from "react";
import { submitFloatingLink } from "@platejs/link/react";
import { useBreveditorContext } from "../../Breveditor.tsx";

export function EndreLink({
  textInputProps,
  unlinkButtonProps,
  linkProps,
  linkRef,
}: {
  /*
      onUrlChange: ChangeEventHandler<HTMLInputElement>;
      onTitleChange: ChangeEventHandler<HTMLInputElement>;
      defaultValueUrl?: string;
      defaultValueTitle?: string;
   */
  textInputProps: {
    defaultValue: string;
    ref: (el: HTMLInputElement) => void;
    onChange: React__default.ChangeEventHandler<HTMLInputElement>;
  };
  unlinkButtonProps: {
    onClick: () => void;
    onMouseDown: (e: React__default.MouseEvent<HTMLButtonElement>) => void;
  };
  linkProps: {
    defaultValue: string;
    onChange: React__default.ChangeEventHandler<HTMLInputElement>;
  };
  linkRef: React__default.RefObject<HTMLInputElement | null>;
}) {
  const breveditor = useBreveditorContext();
  const editor = useEditorRef();

  // Submit endringer og feilhåndtering
  const [harUrlError, settHarUrlError] = useState(false);
  const attemptSubmit = () => {
    if (submitFloatingLink(editor)) {
      settHarUrlError(false);
    } else {
      settHarUrlError(true);
    }
  };

  // Overstyr lagringsforsøk til å bruke vår funksjon slik at vi får feilhåndtering
  const onKeyDownCapture = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attemptSubmit();
    }
  };

  return (
    <VStack gap="4" padding="space-8" onKeyDownCapture={onKeyDownCapture}>
      <TextField
        label="Link adresse"
        size="small"
        error={harUrlError ? "Ugyldig adresse" : undefined}
        ref={linkRef}
        {...linkProps}
      />
      <TextField
        label="Visningsnavn"
        size="small"
        style={{}}
        data-plate-focus
        {...textInputProps}
      />
      <Button
        icon={<FloppydiskIcon />}
        variant="tertiary"
        size="small"
        onClick={attemptSubmit}
      >
        Lagre
      </Button>
      <Button
        icon={<LinkBrokenIcon />}
        variant="tertiary-neutral"
        size="small"
        onClick={() => {
          unlinkButtonProps.onClick();
          breveditor.fokuserPlateContent();
        }}
      >
        Fjern link
      </Button>
    </VStack>
  );
}
