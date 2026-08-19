document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero__slide");
  const dots = document.querySelectorAll(".hero__dot");
  if (!slides.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer;

  const show = (i) => {
    slides[index].classList.remove("is-active");
    if (dots[index]) dots[index].classList.remove("is-active");
    index = i;
    slides[index].classList.add("is-active");
    if (dots[index]) dots[index].classList.add("is-active");
  };

  const next = () => show((index + 1) % slides.length);

  const restart = () => {
    clearInterval(timer);
    if (!prefersReducedMotion) timer = setInterval(next, 6000);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      restart();
    });
  });

  restart();
});
