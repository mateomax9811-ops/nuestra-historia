const startJourneyBtn = document.querySelector('#startJourney');
const firstSection = document.querySelector('#como-empezo');
const nextSceneButtons = document.querySelectorAll('.scene-next');
const carousels = document.querySelectorAll('[data-carousel]');
let activeScene = null;

const revealScene = (sceneId) => {
  const scene = document.querySelector(`#${sceneId}`);
  if (!scene) return;

  const wasHidden = scene.hasAttribute('hidden');
  if (wasHidden) {
    scene.hidden = false;
    scene.classList.add('is-visible');
  }

  if (activeScene && activeScene !== scene) {
    activeScene.classList.add('is-collapsed');
  }

  scene.classList.remove('is-collapsed');
  activeScene = scene;

  requestAnimationFrame(() => {
    scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

const setupCarousel = (carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.moment-slide'));
  const prevBtn = carousel.querySelector('.carousel-control--prev');
  const nextBtn = carousel.querySelector('.carousel-control--next');
  const dotsWrap = carousel.parentElement.querySelector('.carousel-dots');
  if (!track || !slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let currentIndex = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Ir al recuerdo ${index + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === slides.length - 1;

    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
    });
  };

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 35) return;

    if (delta < 0 && currentIndex < slides.length - 1) {
      currentIndex += 1;
      updateCarousel();
    } else if (delta > 0 && currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  }, { passive: true });

  updateCarousel();
};

// Inicio del recorrido
if (startJourneyBtn && firstSection) {
  startJourneyBtn.addEventListener('click', () => {
    revealScene(firstSection.id);
  });
}

// Revelado progresivo por escenas
nextSceneButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextId = button.getAttribute('data-next');
    if (nextId) revealScene(nextId);
  });
});

carousels.forEach(setupCarousel);
