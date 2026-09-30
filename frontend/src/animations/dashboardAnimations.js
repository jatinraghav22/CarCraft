import gsap from 'gsap';

/**
 * Animate the entrance of CARCRAFT dashboard title and service cards
 * @param {HTMLElement} titleEl 
 * @param {HTMLElement} subtitleEl
 * @param {Array<HTMLElement>} cards 
 */
export const animateDashboardEntrance = (titleEl, subtitleEl, cards) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (titleEl) {
    tl.fromTo(titleEl,
      { opacity: 0, y: 30, letterSpacing: '0.2em' },
      { opacity: 1, y: 0, letterSpacing: '0.04em', duration: 0.8 }
    );
  }

  if (subtitleEl) {
    tl.fromTo(subtitleEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );
  }

  if (cards && cards.length > 0) {
    // Stagger in cards sequentially: Vehicles -> Parts -> Service -> Showroom
    tl.fromTo(cards,
      {
        opacity: 0,
        y: 80,
        rotationX: 14,
        scale: 0.92,
        transformOrigin: '50% 100%'
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out'
      },
      '-=0.3'
    );
  }

  return tl;
};

/**
 * Apply 3D tilt interaction on a card based on mouse movement
 */
export const apply3DTilt = (element, mouseX, mouseY, intensity = 12) => {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = mouseX - rect.left - rect.width / 2;
  const y = mouseY - rect.top - rect.height / 2;
  
  const rotateX = -(y / (rect.height / 2)) * intensity;
  const rotateY = (x / (rect.width / 2)) * intensity;

  gsap.to(element, {
    rotationX: rotateX,
    rotationY: rotateY,
    transformPerspective: 1000,
    ease: 'power2.out',
    duration: 0.4
  });
};

/**
 * Reset 3D tilt on mouse leave
 */
export const reset3DTilt = (element) => {
  if (!element) return;
  gsap.to(element, {
    rotationX: 0,
    rotationY: 0,
    ease: 'power2.out',
    duration: 0.6
  });
};
