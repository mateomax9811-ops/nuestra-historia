const startJourneyBtn = document.querySelector('#startJourney');
const firstSection = document.querySelector('#como-empezo');
const toggleLetterBtn = document.querySelector('#toggleLetter');
const secretLetter = document.querySelector('#secretLetter');
const revealElements = document.querySelectorAll('.reveal');

// Scroll al iniciar el recorrido
if (startJourneyBtn && firstSection) {
  startJourneyBtn.addEventListener('click', () => {
    firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Carta final
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

// Reveal más fluido
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((element) => observer.observe(element));
