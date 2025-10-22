import {
  PlateElement,
  type PlateElementProps,
  createPlatePlugin,
} from "platejs/react";

export function BrevHeader({ children, ...props }: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <div
        contentEditable={false}
        style={{ background: "red", padding: "10px" }}
      >
        testitest {children}
      </div>
    </PlateElement>
  );
}

export const BrevHeaderPlugin = createPlatePlugin({
  key: "brevHeader",
  node: {
    isElement: true,
    isVoid: true,
    type: "brevHeader",
    component: BrevHeader,
  },
});
