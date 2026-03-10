const startJourneyBtn = document.querySelector('#startJourney');
const firstSection = document.querySelector('#como-empezo');
const nextSceneButtons = document.querySelectorAll('.scene-next');
const carousels = document.querySelectorAll('[data-carousel]');
let activeScene = null;

const musicPanelsConfig = {
  distanceMusic: {
    provider: 'spotify',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/6eTCWWKBtnJI9Ui9OlLEyO?utm_source=generator',
  },
  beginningMusic: {
    provider: 'spotify',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/48ZVsNDCnSxbOTL4uz77qZ?utm_source=generator',
  },
  finalMusic: {
    provider: 'spotify',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/track/4Z9VQyYxP5mWQxS1hX9QyB?utm_source=generator',
  },
};

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
    const scrollBlock = scene.classList.contains('scene--final-highlight') ? 'center' : 'start';
    scene.scrollIntoView({ behavior: 'smooth', block: scrollBlock });
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

const setupMusicPanels = () => {
  const musicButtons = Array.from(document.querySelectorAll('[data-music-target]'));
  const musicPanels = Array.from(document.querySelectorAll('.music-panel'));
  if (!musicButtons.length || !musicPanels.length) return;

  let activePanelId = null;

  const closePanel = (panel, button) => {
    panel.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');

    window.setTimeout(() => {
      if (!panel.classList.contains('is-open')) {
        panel.hidden = true;
      }
    }, 260);

    const embedSlot = panel.querySelector('[data-music-embed]');
    if (embedSlot) embedSlot.innerHTML = '';
  };

  const buildEmbed = (config) => {
    if (!config) return null;

    if (config.provider === 'spotify') {
      if (!config.spotifyEmbedUrl) return null;
      const iframe = document.createElement('iframe');
      iframe.src = config.spotifyEmbedUrl;
      iframe.title = 'Reproductor de Spotify';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      iframe.height = '152';
      return iframe;
    }

    return null;
  };

  musicButtons.forEach((button) => {
    const targetId = button.getAttribute('data-music-target');
    if (!targetId) return;

    const panel = document.getElementById(targetId);
    if (!panel) return;

    button.addEventListener('click', () => {
      const shouldOpen = !panel.classList.contains('is-open');

      if (activePanelId && activePanelId !== targetId) {
        const activePanel = document.getElementById(activePanelId);
        const activeButton = musicButtons.find((item) => item.getAttribute('data-music-target') === activePanelId);
        if (activePanel && activeButton) {
          closePanel(activePanel, activeButton);
        }
        activePanelId = null;
      }

      if (!shouldOpen) {
        closePanel(panel, button);
        activePanelId = null;
        return;
      }

      const embedSlot = panel.querySelector('[data-music-embed]');
      if (embedSlot) {
        embedSlot.innerHTML = '';
        const embed = buildEmbed(musicPanelsConfig[targetId]);
        if (embed) {
          embedSlot.appendChild(embed);
        } else {
          const placeholder = document.createElement('p');
          placeholder.className = 'music-panel__placeholder';
          placeholder.textContent = 'Espacio listo para insertar el enlace musical definitivo.';
          embedSlot.appendChild(placeholder);
        }
      }

      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      activePanelId = targetId;
      requestAnimationFrame(() => panel.classList.add('is-open'));
    });
  });
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
setupMusicPanels();
