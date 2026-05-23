import RuntimeHeroTypography from "./RuntimeHeroTypography";
import RuntimeNavigation from "./RuntimeNavigation";
import RuntimeOverlayGrid from "./RuntimeOverlayGrid";
import RuntimeInterfaceFog from "./RuntimeInterfaceFog";

import RuntimeContent from "./RuntimeContent";

export default function RuntimeInterfaceLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      <RuntimeOverlayGrid />
      <RuntimeInterfaceFog />
      <RuntimeNavigation />
      
      <RuntimeHeroTypography />

      <RuntimeContent />
    </div>
  );
}
