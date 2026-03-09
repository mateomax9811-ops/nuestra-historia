const startJourneyBtn = document.querySelector('#startJourney');
const firstSection = document.querySelector('#como-empezo');
const revealElements = document.querySelectorAll('.reveal');

// Scroll al iniciar el recorrido
if (startJourneyBtn && firstSection) {
  startJourneyBtn.addEventListener('click', () => {
    firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
