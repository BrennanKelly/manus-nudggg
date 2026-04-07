import { useEffect, useRef } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe all .fade-up children
    const targets = el.querySelectorAll(".fade-up");
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
