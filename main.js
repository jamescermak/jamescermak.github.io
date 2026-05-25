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

  // threshold 0.1: starts fetch when 10% visible, giving the browser a small head start
  const lazyVideos = document.querySelectorAll('.js-lazy-video');
  const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const video = entry.target;
      const source = video.querySelector('source[data-src]');
      if (source) {
        source.src = source.dataset.src;
        video.load();
        video.play();
      }
      observer.unobserve(video);
    });
  }, { threshold: 0.1 });

  lazyVideos.forEach(video => lazyLoadObserver.observe(video));

  const SLIDESHOW_INTERVAL_MS = 4000;

  const modelingSlides = [
    {
      src: 'assets/images/modeling-hard-surface.jpg',
      alt: 'Hard-surface mechanical model showcasing precise polygon topology',
      technique: 'Hard-Surface Modeling',
      blurb: 'Precision polygon modeling with clean edge loops, designed for deformation and subdivision readiness.'
    },
    {
      src: 'assets/images/modeling-low-poly.jpg',
      alt: 'Low-poly stylized environment model with optimized geometry',
      technique: 'Low-Poly Stylized',
      blurb: 'Stylized low-poly modeling optimized for real-time rendering, balancing silhouette quality with minimal polygon count.'
    },
    {
      src: 'assets/images/modeling-character.jpg',
      alt: 'Character model with clean quad topology for rigging',
      technique: 'Character Modeling',
      blurb: 'Quad-dominant topology engineered for smooth deformation, with edge flow following anatomical muscle lines.'
    }
  ];

  const modelingContainer = document.querySelector('.js-slideshow-modeling');
  if (modelingContainer) {
    const imgEl = modelingContainer.querySelector('.js-modeling-image');
    const techniqueEl = modelingContainer.querySelector('.js-modeling-technique');
    const blurbEl = modelingContainer.querySelector('.js-modeling-blurb');
    const prevBtn = modelingContainer.querySelector('.js-modeling-prev');
    const nextBtn = modelingContainer.querySelector('.js-modeling-next');

    let currentIndex = 0;

    function showSlide(index) {
      const slide = modelingSlides[index];
      imgEl.src = slide.src;
      imgEl.alt = slide.alt;
      techniqueEl.textContent = slide.technique;
      blurbEl.textContent = slide.blurb;
      currentIndex = index;
    }

    showSlide(0);
    modelingContainer.classList.add('is-active');

    setInterval(() => {
      showSlide((currentIndex + 1) % modelingSlides.length);
    }, SLIDESHOW_INTERVAL_MS);

    prevBtn.addEventListener('click', () => {
      showSlide((currentIndex - 1 + modelingSlides.length) % modelingSlides.length);
    });

    nextBtn.addEventListener('click', () => {
      showSlide((currentIndex + 1) % modelingSlides.length);
    });
  }

  const reelVideos = [
    { src: 'assets/videos/reel-01.mp4', label: 'Animation reel — ending sequence' },
    { src: 'assets/videos/reel-02.mp4', label: 'Animation reel — red scene' },
    { src: 'assets/videos/reel-03.mp4', label: 'Animation reel — tar effect' }
  ];

  const reelVideo = document.querySelector('.js-slideshow-reel');
  if (reelVideo) {
    const reelSource = reelVideo.querySelector('source');
    let reelIndex = 0;

    function advanceReel() {
      reelIndex = (reelIndex + 1) % reelVideos.length;
      reelSource.src = reelVideos[reelIndex].src;
      reelVideo.setAttribute('aria-label', reelVideos[reelIndex].label);
      reelVideo.load();
      reelVideo.play();
    }

    reelVideo.addEventListener('ended', advanceReel);
  }
});
