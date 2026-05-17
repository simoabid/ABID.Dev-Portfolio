import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
  rect: DOMRect
) => {
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

interface MagicCardProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: React.ElementType;
  className?: string;
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  [key: string]: any;
}

export const MagicCard = React.forwardRef<HTMLElement, MagicCardProps>(
  (
    {
      children,
      as: Component = 'div',
      className = '',
      disableAnimations = false,
      particleCount = DEFAULT_PARTICLE_COUNT,
      glowColor = DEFAULT_GLOW_COLOR,
      enableTilt = true,
      clickEffect = false,
      enableMagnetism = false,
      enableStars = true,
      enableBorderGlow = true,
      style,
      ...props
    },
    externalRef
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const cardRef =
      (externalRef as React.RefObject<HTMLElement>) || internalRef;
    const particlesRef = useRef<HTMLElement[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef<HTMLElement[]>([]);
    const particlesInitialized = useRef(false);
    const rotateXToRef = useRef<((value: number) => gsap.core.Tween) | null>(
      null
    );
    const rotateYToRef = useRef<((value: number) => gsap.core.Tween) | null>(
      null
    );
    const magnetXToRef = useRef<((value: number) => gsap.core.Tween) | null>(
      null
    );
    const magnetYToRef = useRef<((value: number) => gsap.core.Tween) | null>(
      null
    );
    const isMobile = useMobileDetection();
    const shouldDisableAnimations = disableAnimations || isMobile;

    const initializeParticles = useCallback(() => {
      if (
        particlesInitialized.current ||
        !cardRef.current ||
        !enableStars ||
        shouldDisableAnimations
      )
        return;

      const { width, height } = cardRef.current.getBoundingClientRect();
      memoizedParticles.current = Array.from({ length: particleCount }, () =>
        createParticleElement(
          Math.random() * width,
          Math.random() * height,
          glowColor
        )
      );
      particlesInitialized.current = true;
    }, [
      particleCount,
      glowColor,
      enableStars,
      shouldDisableAnimations,
      cardRef,
    ]);

    const clearAllParticles = useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      particlesRef.current.forEach((particle) => {
        if (particle && particle.parentNode) {
          gsap.to(particle, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'back.in(1.7)',
            onComplete: () => {
              if (particle && particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            },
          });
        }
      });
      particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
      if (
        !cardRef.current ||
        !isHoveredRef.current ||
        !enableStars ||
        shouldDisableAnimations
      )
        return;

      if (!particlesInitialized.current) {
        initializeParticles();
      }

      memoizedParticles.current.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;

          const clone = particle.cloneNode(true) as HTMLElement;
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
          );

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true,
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
          });
        }, index * 100);

        timeoutsRef.current.push(timeoutId);
      });
    }, [initializeParticles, enableStars, shouldDisableAnimations, cardRef]);

    useEffect(() => {
      if (shouldDisableAnimations || !cardRef.current) return;

      const element = cardRef.current;
      rotateXToRef.current = gsap.quickTo(element, 'rotateX', {
        duration: 0.14,
        ease: 'power2.out',
      });
      rotateYToRef.current = gsap.quickTo(element, 'rotateY', {
        duration: 0.14,
        ease: 'power2.out',
      });
      magnetXToRef.current = gsap.quickTo(element, 'x', {
        duration: 0.24,
        ease: 'power2.out',
      });
      magnetYToRef.current = gsap.quickTo(element, 'y', {
        duration: 0.24,
        ease: 'power2.out',
      });

      const handleMouseEnter = () => {
        isHoveredRef.current = true;
        animateParticles();

        if (enableTilt) {
          gsap.to(element, {
            rotateX: 5,
            rotateY: 5,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 1000,
          });
        }
      };

      const handleMouseLeave = () => {
        isHoveredRef.current = false;
        clearAllParticles();

        if (enableTilt) {
          gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }

        if (enableMagnetism) {
          magnetXToRef.current?.(0);
          magnetYToRef.current?.(0);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableTilt && !enableMagnetism) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          rotateXToRef.current?.(rotateX);
          rotateYToRef.current?.(rotateY);
        }

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.05;
          const magnetY = (y - centerY) * 0.05;

          magnetXToRef.current?.(magnetX);
          magnetYToRef.current?.(magnetY);
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (!clickEffect) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );

        const ripple = document.createElement('div');
        ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1,
          },
          {
            scale: 1,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => ripple.remove(),
          }
        );
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('click', handleClick);

      return () => {
        isHoveredRef.current = false;
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('click', handleClick);
        clearAllParticles();
      };
    }, [
      animateParticles,
      clearAllParticles,
      shouldDisableAnimations,
      enableTilt,
      enableMagnetism,
      clickEffect,
      glowColor,
      cardRef,
    ]);

    const baseClassName = `magic-bento-card ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''} ${enableStars ? 'particle-container' : ''} ${className}`;

    return (
      <Component
        ref={cardRef as any}
        className={baseClassName}
        style={{ ...style, '--glow-color': glowColor } as React.CSSProperties}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

MagicCard.displayName = 'MagicCard';

interface GlobalSpotlightProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}

const GlobalSpotlight: React.FC<GlobalSpotlightProps> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const cardsRef = useRef<HTMLElement[]>([]);
  const sectionRectRef = useRef<DOMRect | null>(null);
  const cardMetricsRef = useRef<
    Array<{
      card: HTMLElement;
      rect: DOMRect;
      centerX: number;
      centerY: number;
      maxRadius: number;
    }>
  >([]);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;
    const setSpotlightX = gsap.quickTo(spotlight, 'left', {
      duration: 0.12,
      ease: 'power2.out',
    });
    const setSpotlightY = gsap.quickTo(spotlight, 'top', {
      duration: 0.12,
      ease: 'power2.out',
    });
    const setSpotlightOpacity = gsap.quickTo(spotlight, 'opacity', {
      duration: 0.2,
      ease: 'power2.out',
    });

    let frameId: number | null = null;
    let metricsFrameId: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      scheduleMetricsRefresh();
    });

    const collectCards = () => {
      if (!gridRef.current) return;
      cardsRef.current = Array.from(
        gridRef.current.querySelectorAll('.magic-bento-card')
      ) as HTMLElement[];
    };

    const refreshMetrics = () => {
      if (!gridRef.current) return;
      const section =
        gridRef.current.closest('.bento-section') || gridRef.current;
      const sectionRect = section.getBoundingClientRect();
      sectionRectRef.current = sectionRect;

      cardMetricsRef.current = cardsRef.current.map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          card,
          rect,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          maxRadius: Math.max(rect.width, rect.height) / 2,
        };
      });
    };

    const scheduleMetricsRefresh = () => {
      if (metricsFrameId !== null) return;
      metricsFrameId = requestAnimationFrame(() => {
        metricsFrameId = null;
        collectCards();
        refreshMetrics();
      });
    };

    const clearCardGlow = () => {
      cardsRef.current.forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
    };

    const renderSpotlightFrame = () => {
      frameId = null;
      if (!spotlightRef.current) return;

      const rect = sectionRectRef.current;
      if (!rect) return;

      const mouseX = pointerRef.current.x;
      const mouseY = pointerRef.current.y;

      const mouseInside =
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom;

      if (!mouseInside) {
        if (isInsideSection.current) {
          clearCardGlow();
        }
        isInsideSection.current = false;
        setSpotlightOpacity(0);
        return;
      }

      isInsideSection.current = true;
      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cardMetricsRef.current.forEach((metric) => {
        const distance =
          Math.hypot(mouseX - metric.centerX, mouseY - metric.centerY) -
          metric.maxRadius;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          metric.card,
          mouseX,
          mouseY,
          glowIntensity,
          spotlightRadius,
          metric.rect
        );
      });

      setSpotlightX(mouseX);
      setSpotlightY(mouseY);

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;
      setSpotlightOpacity(targetOpacity);
    };

    const scheduleFrame = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(renderSpotlightFrame);
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      scheduleFrame();
    };

    const handleMouseLeave = () => {
      if (isInsideSection.current) {
        clearCardGlow();
      }
      isInsideSection.current = false;
      setSpotlightOpacity(0);
    };

    collectCards();
    refreshMetrics();
    resizeObserver.observe(gridRef.current);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', scheduleMetricsRefresh, {
      passive: true,
    });
    window.addEventListener('scroll', scheduleMetricsRefresh, {
      passive: true,
    });

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      if (metricsFrameId !== null) {
        cancelAnimationFrame(metricsFrameId);
      }
      resizeObserver.disconnect();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', scheduleMetricsRefresh);
      window.removeEventListener('scroll', scheduleMetricsRefresh);
      clearCardGlow();
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      spotlightRef.current = null;
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

interface MagicContainerProps {
  children: ReactNode;
  className?: string;
  enableSpotlight?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
  disableAnimations?: boolean;
}

export const MagicContainer = React.forwardRef<
  HTMLDivElement,
  MagicContainerProps
>(
  (
    {
      children,
      className = '',
      enableSpotlight = true,
      spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
      glowColor = DEFAULT_GLOW_COLOR,
      disableAnimations = false,
    },
    externalRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);

    // Use external ref if provided, otherwise use internal ref for the spotlight
    const gridRef =
      (externalRef as React.RefObject<HTMLDivElement>) || internalRef;
    const isMobile = useMobileDetection();
    const shouldDisableAnimations = disableAnimations || isMobile;

    return (
      <>
        {enableSpotlight && !shouldDisableAnimations && (
          <GlobalSpotlight
            gridRef={gridRef}
            disableAnimations={shouldDisableAnimations}
            enabled={enableSpotlight}
            spotlightRadius={spotlightRadius}
            glowColor={glowColor}
          />
        )}
        <div
          className={`magic-bento-container bento-section ${className}`}
          ref={gridRef}
        >
          {children}
        </div>
      </>
    );
  }
);

MagicContainer.displayName = 'MagicContainer';
