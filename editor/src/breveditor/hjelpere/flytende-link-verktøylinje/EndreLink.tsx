import { Button, TextField, VStack } from "@navikt/ds-react";
import { FloppydiskIcon, LinkBrokenIcon } from "@navikt/aksel-icons";
import { useEditorRef } from "platejs/react";
import { type KeyboardEvent, useState } from "react";
import { submitFloatingLink } from "@platejs/link/react";
import { useBreveditorContext } from "../../Breveditor.tsx";
import { useFlytendeLinkVerktøylinjeContext } from "./FlytendeLinkVerktøylinje.tsx";

export function EndreLink() {
  const ctx = useFlytendeLinkVerktøylinjeContext();
  const breveditor = useBreveditorContext();

  const editor = useEditorRef();

  const { defaultValue: displayText } = ctx.floatingLinkInsert.textInputProps;

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
        placeholder="https://"
        size="small"
        error={harUrlError ? "Ugyldig adresse" : undefined}
        ref={ctx.floatingLinkUrlInput.ref}
        defaultValue={
          ctx.floatingLinkUrlInput.props.defaultValue.toString().trim()
            .length == 0
            ? displayText
            : ctx.floatingLinkUrlInput.props.defaultValue.toString().trim()
        }
        onChange={ctx.floatingLinkUrlInput.props.onChange}
      />
      <TextField
        label="Visningsnavn"
        size="small"
        data-plate-focus
        {...ctx.floatingLinkInsert.textInputProps}
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
          ctx.floatingLinkEdit.unlinkButtonProps.onClick();
          breveditor.fokuserPlateContent();
        }}
      >
        Fjern link
      </Button>
    </VStack>
  );
}
