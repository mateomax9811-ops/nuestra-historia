const startJourneyBtn = document.querySelector('#startJourney');
const firstSection = document.querySelector('#como-empezo');
const nextSceneButtons = document.querySelectorAll('.scene-next');

const revealScene = (sceneId) => {
  const scene = document.querySelector(`#${sceneId}`);
  if (!scene) return;

  const wasHidden = scene.hasAttribute('hidden');
  if (wasHidden) {
    scene.hidden = false;
    scene.classList.add('is-visible');
  }

  scene.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
