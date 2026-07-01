"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.75}
        luminanceSmoothing={0.5}
        intensity={0.35}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.25}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
