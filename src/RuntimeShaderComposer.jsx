import RuntimeShaderField from "./RuntimeShaderField";
import RuntimeDistortionLayer from "./RuntimeDistortionLayer";
import RuntimeEnergyOcean from "./RuntimeEnergyOcean";
import RuntimeRefractionField from "./RuntimeRefractionField";

export default function RuntimeShaderComposer() {
  return (
    <>
      <RuntimeShaderField />

      <RuntimeDistortionLayer />

      <RuntimeEnergyOcean />

      <RuntimeRefractionField />
    </>
  );
}
