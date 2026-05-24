document.addEventListener('DOMContentLoaded', () => {
  const stickyHeader = document.getElementById('sticky-header');
  const heroSection = document.getElementById('hero');

  if (!stickyHeader || !heroSection) return;

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      stickyHeader.classList.remove('is-visible');
    } else {
      stickyHeader.classList.add('is-visible');
    }
  }, { threshold: 0 });

  heroObserver.observe(heroSection);
});
