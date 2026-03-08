const startJourneyBtn = document.querySelector('#startJourney');
const firstSection = document.querySelector('#como-empezo');
const toggleLetterBtn = document.querySelector('#toggleLetter');
const secretLetter = document.querySelector('#secretLetter');
const revealElements = document.querySelectorAll('.reveal');

// Scroll suave desde el hero hacia la primera sección del recorrido.
if (startJourneyBtn && firstSection) {
  startJourneyBtn.addEventListener('click', () => {
    firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Interacción para abrir/cerrar la carta final.
if (toggleLetterBtn && secretLetter) {
  toggleLetterBtn.addEventListener('click', () => {
    const isExpanded = toggleLetterBtn.getAttribute('aria-expanded') === 'true';
    toggleLetterBtn.setAttribute('aria-expanded', String(!isExpanded));
    secretLetter.hidden = isExpanded;

    const textNode = toggleLetterBtn.querySelector('.envelope__text');
    if (textNode) {
      textNode.textContent = isExpanded ? 'Abrir mensaje' : 'Cerrar mensaje';
    }
  });
}

// Animaciones de aparición al hacer scroll.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  {
    threshold: 0.2,
  },
);

revealElements.forEach((element) => observer.observe(element));

// TODO: Estructura base para agregar música más adelante sin autoplay.
// const music = document.querySelector('#bgMusic');
// const playMusicBtn = document.querySelector('#playMusic');
// if (music && playMusicBtn) {
//   playMusicBtn.addEventListener('click', () => {
//     music.paused ? music.play() : music.pause();
//   });
// }
