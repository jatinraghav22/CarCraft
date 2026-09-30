import gsap from 'gsap';

/**
 * Executes the cinematic transition sequence from video end to 3D CARCRAFT Dashboard
 * @param {Object} elements - DOM elements participating in the transition
 * @param {Function} onComplete - Callback executed when dashboard is ready
 */
export const runCinematicTransition = ({
  videoElement,
  overlayElement,
  lightStreakElement,
  dashboardWrapper,
  onComplete
}) => {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });

  // Step 1: Subtle zoom push-in on the final showroom frame
  if (videoElement) {
    tl.to(videoElement, {
      scale: 1.08,
      filter: 'brightness(1.15) contrast(1.1)',
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0);
  }

  // Step 2: Dark glass & vignette layer expands
  if (overlayElement) {
    tl.to(overlayElement, {
      opacity: 0.92,
      backdropFilter: 'blur(20px)',
      duration: 0.9,
      ease: 'power2.out'
    }, 0.2);
  }

  // Step 3: Lime-green CARCRAFT laser / light streak sweep
  if (lightStreakElement) {
    tl.fromTo(lightStreakElement, 
      {
        xPercent: -120,
        opacity: 0,
        scaleY: 0.5
      },
      {
        xPercent: 120,
        opacity: 1,
        scaleY: 1.2,
        duration: 0.85,
        ease: 'power4.inOut'
      },
      0.3
    ).to(lightStreakElement, {
      opacity: 0,
      duration: 0.3
    }, '-=0.2');
  }

  // Step 4: 3D dashboard elements emerge with depth
  if (dashboardWrapper) {
    tl.fromTo(dashboardWrapper,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
        rotationX: 10
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.0,
        ease: 'power3.out'
      },
      0.7
    );
  }

  return tl;
};
