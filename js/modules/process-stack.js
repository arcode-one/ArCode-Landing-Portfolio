function getProcessStackConfig() {
  const width = window.innerWidth;

  if (width <= 640) {
    return {
      offsets: [84, 108, 132, 156],
      pause: 20,
    };
  }

  if (width <= 820) {
    return {
      offsets: [88, 114, 140, 166],
      pause: 22,
    };
  }

  if (width <= 992) {
    return {
      offsets: [92, 120, 148, 176],
      pause: 24,
    };
  }

  if (width <= 1024) {
    return {
      offsets: [96, 128, 160, 192],
      pause: 28,
    };
  }

  if (width <= 1200) {
    return {
      offsets: [100, 134, 168, 202],
      pause: 30,
    };
  }

  return {
    offsets: [108, 144, 180, 216],
    pause: 34,
  };
}

export function initProcessStack() {
  const processSteps = Array.from(
    document.querySelectorAll(".process--merge .process-step")
  );

  if (processSteps.length === 0) {
    return;
  }

  const updateProcessStack = () => {
    const width = window.innerWidth;
    const { offsets, pause } = getProcessStackConfig();
    const useCompactOnly = width <= 820;

    processSteps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const threshold =
        offsets[index] ?? offsets[offsets.length - 1];
      const isCompact = rect.top <= threshold + (useCompactOnly ? pause : 2);
      const isPrecompact = useCompactOnly ? false : rect.top <= threshold + pause;

      step.classList.toggle("is-precompact", isPrecompact);
      step.classList.toggle("is-compact", isCompact);
    });
  };

  let ticking = false;

  const requestUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      updateProcessStack();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  updateProcessStack();
}
