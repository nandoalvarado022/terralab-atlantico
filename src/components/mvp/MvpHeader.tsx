import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import logo from "@/assets/images/logo terralab-atlantico.png";

/**
 * Header sticky con logo que se “compacta” al hacer scroll.
 * La altura del header es fija: solo se escala el logo con transform.
 * Así no cambia el layout ni se produce el parpadeo (scrollY ↔ altura).
 */
export function MvpHeader() {
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Histéresis: evita oscilar en el umbral.
      setCompacto((prev) => (prev ? y > 8 : y > 48));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/90 backdrop-blur print:hidden sm:h-[4.5rem]">
      <div className="mx-auto flex h-full max-w-4xl items-center px-5">
        <Link to="/mvp" className="inline-flex items-center" aria-label="Forja MVP · Terra Lab Atlántico">
          <img
            src={logo}
            alt="Terra Lab Atlántico"
            className={`h-14 w-auto origin-left transition-transform duration-300 ease-out sm:h-16 ${
              compacto ? "scale-[0.55]" : "scale-100"
            }`}
          />
        </Link>
      </div>
    </header>
  );
}
