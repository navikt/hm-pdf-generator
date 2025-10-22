import { createPlatePlugin } from "@udecode/plate/react";
import { PlateLeaf, type PlateLeafProps } from "@udecode/plate-common/react";

export const BrevHeader = () => {
  return <div style={{ background: "red", padding: "10px" }}>testitest</div>;
};

export function BrevHeader2({ className, children, ...props }: PlateLeafProps) {
  return (
    <PlateLeaf asChild className={className} {...props}>
      <div style={{ background: "red", padding: "10px" }}>
        testitest{children}
      </div>
      ;
    </PlateLeaf>
  );
}

export const BrevHeaderPlugin = createPlatePlugin({
  key: "brevHeader",
  node: {
    //isElement: true,
    isLeaf: true,
    type: "brevHeader",
    component: BrevHeader2,
  },
});
