import * as React from "react";
import { useState } from "react";
import type { TLinkElement } from "platejs";
import { KEYS } from "platejs";
import {
  flip,
  offset,
  type UseVirtualFloatingOptions,
} from "@platejs/floating";
import { getLinkAttributes } from "@platejs/link";
import {
  type LinkFloatingToolbarState,
  submitFloatingLink,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
  useFloatingLinkUrlInput,
  useFloatingLinkUrlInputState,
} from "@platejs/link/react";

import { useEditorRef, useEditorSelection } from "platejs/react";
import { Box, Button, HStack, TextField, VStack } from "@navikt/ds-react";
import {
  DocPencilIcon,
  ExternalLinkIcon,
  FloppydiskIcon,
  LinkBrokenIcon,
} from "@navikt/aksel-icons";

export function LinkFlytendeVerktøylinje({
  state,
}: {
  state?: LinkFloatingToolbarState;
}) {
  const floatingOptions: UseVirtualFloatingOptions = React.useMemo(() => {
    return {
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ["bottom-end", "top-start", "top-end"],
          padding: 12,
        }),
      ],
      placement: "bottom-start",
    };
  }, []);

  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });

  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState);
  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });

  const { props: linkProps, ref: linkRef } = useFloatingLinkUrlInput(
    useFloatingLinkUrlInputState(),
  );

  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);

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
  const onKeyDownCapture = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      attemptSubmit();
    }
  };

  if (hidden) return null;

  const inputContent = (
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
    </VStack>
  );

  const editContent = editState.isEditing ? (
    inputContent
  ) : (
    <div className="box-content flex items-center">
      <HStack gap="1">
        <Button
          icon={<DocPencilIcon />}
          variant="tertiary"
          size="small"
          {...editButtonProps}
        >
          Endre link
        </Button>
        <LinkOpenButton />
        <Button
          icon={<LinkBrokenIcon />}
          variant="tertiary"
          size="small"
          {...unlinkButtonProps}
        />
      </HStack>
    </div>
  );

  return (
    <>
      <Box
        background="surface-default"
        padding="space-8"
        borderRadius="xlarge"
        borderColor="border-subtle"
        borderWidth="1"
        shadow="small"
        ref={insertRef}
        {...insertProps}
      >
        {inputContent}
      </Box>

      <Box
        background="surface-default"
        padding="space-8"
        borderRadius="xlarge"
        borderColor="border-subtle"
        borderWidth="1"
        shadow="small"
        ref={editRef}
        {...editProps}
      >
        {editContent}
      </Box>
    </>
  );
}

function LinkOpenButton() {
  const editor = useEditorRef();
  const selection = useEditorSelection();

  const attributes = React.useMemo(
    () => {
      const entry = editor.api.node<TLinkElement>({
        match: { type: editor.getType(KEYS.link) },
      });
      if (!entry) {
        return {};
      }
      const [element] = entry;
      return getLinkAttributes(editor, element);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection],
  );

  // TODO: Vurder å bruk next/link til å wrappe Button i stedenfor onClick, ala. forslag i Aksel. NPM var nede når jeg
  // skrev denne koden, så bruker onClick nå!
  return (
    <Button
      icon={<ExternalLinkIcon />}
      variant="tertiary"
      size="small"
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      onClick={() => {
        window.open(attributes.href, "_blank");
      }}
    />
  );
}
