import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./splash.css";

interface SplashProps {
  visible: boolean;
}

function SplashScreen({ visible }: SplashProps) {
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!splashRef.current || !logoRef.current || !glowRef.current) return;

    if (visible) {
      // ENTRY
      gsap.set(splashRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        display: "flex",
      });

      gsap.set(glowRef.current, { scale: 1 });

      gsap.fromTo(
        logoRef.current,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        }
      );
    } else {
      // EXIT (IMPORTANT FIX)
      const tl = gsap.timeline();

      tl.to(glowRef.current, {
        scale: 3.8,
        opacity: 0.85,
        duration: 0.9,
        ease: "power2.inOut",
      })
        .to(
          splashRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              if (splashRef.current) {
                // 🔥 THIS IS THE KEY FIX
                splashRef.current.style.pointerEvents = "none";
                splashRef.current.style.display = "none";
              }
            },
          },
          "-=0.4"
        );
    }
  }, [visible]); 

  onComplete: () => {
  if (splashRef.current) {
    splashRef.current.style.display = "none";
    splashRef.current.style.pointerEvents = "none";
  }
}


  return (
    <div className="splash" ref={splashRef}>
      <div className="glow" ref={glowRef} />
      <h1 className="splash-logo" ref={logoRef}>
        🍬 Sweet Shop
      </h1>
      <p className="splash-text">Managing sweetness professionally</p>
    </div>
  );
}

export default SplashScreen;
