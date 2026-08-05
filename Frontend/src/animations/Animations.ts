import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type React from "react";
import { useRef } from "react";

//Custom hook.
export function useHeaderDropdown(ref: React.RefObject<HTMLDivElement | null>) {
  // Guardamos la referencia de la timeline dentro del hook
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // 1. Creamos la timeline dentro de useGSAP para una limpieza adecuada de React
    const tl = gsap.timeline({ paused: true });

    tl.to(ref.current, { 
      duration: 0.5,
      ease: "back.in",
      height: "auto"
    }, 0).to(ref.current, {
      autoAlpha: 1,
      duration: 0.5,
    }, 0.5 );

    tl.reversed(true);

    timelineRef.current = tl;
  }, { scope: ref });

  return timelineRef;
}

export function useResultDropdown(ref: React.RefObject<HTMLDivElement | null> ) {
  const timelineRef = useRef<gsap.core.Timeline| null>(null);

  useGSAP(() =>{
    const timeline = gsap.timeline({paused: true});

    timeline.to(ref.current, {
      //x:200,
      // y: 200,
      ease: "back.in",
      duration: 0.3,
      autoAlpha: 1
    }, 0)

    timelineRef.current = timeline;
  }, {scope: ref});

  return timelineRef;
}