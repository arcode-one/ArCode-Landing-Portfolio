export function initStackRadar() {
  const radar = document.querySelector(".stack-radar");

  if (!radar) {
    return;
  }

  const orbits = Array.from(radar.querySelectorAll(".stack-radar__orbit"));

  if (!orbits.length) {
    return;
  }

  const setActiveOrbit = (activeOrbit) => {
    orbits.forEach((orbit) => {
      const node = orbit.querySelector(".stack-radar__node");
      const isActive = orbit === activeOrbit;

      orbit.classList.toggle("is-active", isActive);

      if (node) {
        node.setAttribute("aria-expanded", String(isActive));
      }
    });
  };

  orbits.forEach((orbit) => {
    const node = orbit.querySelector(".stack-radar__node");

    if (!node) {
      return;
    }

    node.tabIndex = 0;
    node.setAttribute("role", "button");
    node.setAttribute("aria-expanded", "false");

    node.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      setActiveOrbit(orbit.classList.contains("is-active") ? null : orbit);
    });

    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveOrbit(orbit.classList.contains("is-active") ? null : orbit);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!radar.contains(event.target)) {
      setActiveOrbit(null);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setActiveOrbit(null);
    }
  });
}
