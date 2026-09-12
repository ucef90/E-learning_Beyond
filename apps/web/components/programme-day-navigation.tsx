"use client";

import { useEffect } from "react";

function revealDay(id: string) {
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement) target.open = true;
}

export function ProgrammeDayNavigation({ days }: { days: number[] }) {
  useEffect(() => {
    const revealHash = () => {
      const id = window.location.hash.slice(1);
      if (/^programme-jour-\d+$/.test(id)) revealDay(id);
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    return () => window.removeEventListener("hashchange", revealHash);
  }, []);
  return (
    <nav className="programme-days-nav" aria-label="Journées du programme">
      {days.map((day) => (
        <a
          key={day}
          href={`#programme-jour-${day}`}
          onClick={() => revealDay(`programme-jour-${day}`)}
        >
          Jour {day}
        </a>
      ))}
      <a href="#programme-evaluation">Évaluation</a>
    </nav>
  );
}
