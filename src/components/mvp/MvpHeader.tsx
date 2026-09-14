import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import logo from "@/assets/images/logo terralab-atlantico.png";

export function MvpHeader() {
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    const umbral = 24;
    const onScroll = () => setCompacto(window.scrollY > umbral);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur print:hidden transition-[padding] duration-300 ${
        compacto ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center px-5">
        <Link to="/mvp" className="inline-flex items-center" aria-label="Forja MVP · Terra Lab Atlántico">
          <img
            src={logo}
            alt="Terra Lab Atlántico"
            className={`w-auto transition-all duration-300 ease-out ${
              compacto ? "h-8 sm:h-9" : "h-14 sm:h-16"
            }`}
          />
        </Link>
      </div>
    </header>
  );
}
