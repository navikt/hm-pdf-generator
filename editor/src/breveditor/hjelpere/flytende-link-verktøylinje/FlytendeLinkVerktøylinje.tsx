import { flip, offset } from "@platejs/floating";
import {
  type LinkFloatingToolbarState,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
  useFloatingLinkUrlInput,
  useFloatingLinkUrlInputState,
} from "@platejs/link/react";
import { Box, Button, HStack } from "@navikt/ds-react";
import { DocPencilIcon, LinkBrokenIcon } from "@navikt/aksel-icons";
import { EndreLink } from "./EndreLink.tsx";
import { OpenLinkButton } from "./OpenLinkButton.tsx";

export function FlytendeLinkVerktøylinje() {
  const state: LinkFloatingToolbarState = {
    floatingOptions: {
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ["bottom-end", "top-start", "top-end"],
          padding: 12,
        }),
      ],
      placement: "bottom-start",
    },
  };

  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(useFloatingLinkInsertState(state));

  const editState = useFloatingLinkEditState(state);
  const {
    props: editProps,
    ref: editRef,
    editButtonProps,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);

  const { props: linkProps, ref: linkRef } = useFloatingLinkUrlInput(
    useFloatingLinkUrlInputState(),
  );

  if (hidden) return null;

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
        <EndreLink
          textInputProps={textInputProps}
          unlinkButtonProps={unlinkButtonProps}
          linkProps={linkProps}
          linkRef={linkRef}
        />
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
        {editState.isEditing && (
          <EndreLink
            textInputProps={textInputProps}
            unlinkButtonProps={unlinkButtonProps}
            linkProps={linkProps}
            linkRef={linkRef}
          />
        )}
        {!editState.isEditing && (
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
              <OpenLinkButton />
              <Button
                icon={<LinkBrokenIcon />}
                variant="tertiary"
                size="small"
                {...unlinkButtonProps}
              />
            </HStack>
          </div>
        )}
      </Box>
    </>
  );
}
