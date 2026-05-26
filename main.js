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
      technique: 'Character Sculpting',
      blurb: 'Sculpted character head with anatomy-driven topology, built for clean subdivision and deformation across facial poses.'
    }
  ];

  const modelingContainer = document.querySelector('.js-slideshow-modeling');
  if (modelingContainer) {
    const imgEl = modelingContainer.querySelector('.js-modeling-image');
    const techniqueEl = modelingContainer.querySelector('.js-modeling-technique');
    const blurbEl = modelingContainer.querySelector('.js-modeling-blurb');
    const thumbsEl = modelingContainer.querySelector('.js-modeling-thumbs');

    let currentIndex = 0;
    let autoAdvance = setInterval(() => showSlide((currentIndex + 1) % modelingSlides.length), SLIDESHOW_INTERVAL_MS);

    const thumbImgs = modelingSlides.map((slide, i) => {
      const thumb = document.createElement('img');
      thumb.src = slide.src;
      thumb.alt = slide.technique;
      thumb.addEventListener('click', () => {
        clearInterval(autoAdvance);
        showSlide(i);
      });
      thumbsEl.appendChild(thumb);
      return thumb;
    });

    function showSlide(index) {
      const slide = modelingSlides[index];
      imgEl.src = slide.src;
      imgEl.alt = slide.alt;
      techniqueEl.textContent = slide.technique;
      blurbEl.textContent = slide.blurb;
      currentIndex = index;
      thumbImgs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    }

    showSlide(0);
    modelingContainer.classList.add('is-active');

  }

  const reelVideos = [
    { src: 'assets/videos/reel-01.mp4', label: 'Geometric music visualizer — opening sequence' },
    { src: 'assets/videos/reel-02.mp4', label: 'Geometric music visualizer — red scene' },
    { src: 'assets/videos/reel-03.mp4', label: 'Geometric music visualizer — closing sequence' }
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

  const audioPlayer = document.querySelector('.js-audio-player');
  if (audioPlayer) {
    const audio = audioPlayer.querySelector('.js-audio');
    const playBtn = audioPlayer.querySelector('.js-audio-play');
    const progressInput = audioPlayer.querySelector('.js-audio-progress');
    const timeDisplay = audioPlayer.querySelector('.js-audio-time');

    function formatTime(s) {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    function setFill(pct) {
      progressInput.style.setProperty('--fill', pct + '%');
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        audioPlayer.classList.add('is-playing');
        playBtn.setAttribute('aria-label', 'Pause');
      } else {
        audio.pause();
        audioPlayer.classList.remove('is-playing');
        playBtn.setAttribute('aria-label', 'Play');
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressInput.value = pct;
      setFill(pct);
      timeDisplay.textContent = formatTime(audio.currentTime);
    });

    progressInput.addEventListener('input', () => {
      const pct = parseFloat(progressInput.value);
      if (audio.duration) audio.currentTime = (pct / 100) * audio.duration;
      setFill(pct);
    });

    audio.addEventListener('ended', () => {
      audioPlayer.classList.remove('is-playing');
      playBtn.setAttribute('aria-label', 'Play');
      progressInput.value = 0;
      setFill(0);
      timeDisplay.textContent = '0:00';
    });
  }
});
