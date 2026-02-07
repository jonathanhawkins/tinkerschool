"use client";

import { useCallback, useState } from "react";

import type { FlashStep } from "./firmware-flasher";
import ChipFlashCompanion from "./chip-flash-companion";
import FirmwareFlasher from "./firmware-flasher";

export default function SetupContent() {
  const [step, setStep] = useState<FlashStep>("idle");
  const [progress, setProgress] = useState(0);

  const handleStepChange = useCallback(
    (newStep: FlashStep, newProgress: number) => {
      setStep(newStep);
      setProgress(newProgress);
    },
    []
  );

  return (
    <>
      <FirmwareFlasher onStepChange={handleStepChange} />
      <ChipFlashCompanion step={step} progress={progress} />
    </>
  );
}
