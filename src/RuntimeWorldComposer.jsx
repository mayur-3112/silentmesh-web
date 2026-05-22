import RuntimeMegastructure from "./RuntimeMegastructure";
import RuntimeNebula from "./RuntimeNebula";
import RuntimeSignalRiver from "./RuntimeSignalRiver";
import RuntimeCathedral from "./RuntimeCathedral";
import RuntimeStormField from "./RuntimeStormField";
import RuntimeHorizon from "./RuntimeHorizon";

export default function RuntimeWorldComposer() {
  return (
    <>
      <RuntimeMegastructure />

      <RuntimeNebula />

      <RuntimeSignalRiver />

      <RuntimeCathedral />

      <RuntimeStormField />

      <RuntimeHorizon />
    </>
  );
}
