'use strict';

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const sections = document.querySelectorAll('.section');
const overlay = document.querySelector('.overlay');
const logo = document.querySelector('.nav__logo');
const imgsLazy = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnsTab = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const dotsContainer = document.querySelector('.dots');
const navBar = document.querySelector('.nav');
const operationsContent = document.querySelectorAll('.operations__content');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelector('.nav__link');

// Modal window

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Events

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();

  section1.scrollIntoView({ behavior: 'smooth' });
});

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const activeElem = e.target.closest('.operations__tab');

  if (!activeElem) return;

  btnsTab.forEach(btn => btn.classList.remove('operations__tab--active'));
  operationsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );

  activeElem.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${activeElem.dataset.tab}`)
    .classList.add('operations__content--active');
});

const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const target = e.target;
    const otherLinks = target.closest('.nav').querySelectorAll('.nav__link');

    otherLinks.forEach(link => {
      if (link !== target) link.style.opacity = this;
    });
  }
};

navBar.addEventListener('mouseover', hoverHandler.bind(0.5));

navBar.addEventListener('mouseout', hoverHandler.bind(1));

// Intersection Observer

const fixedNavbar = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    navBar.classList.add('sticky');
  } else {
    navBar.classList.remove('sticky');
  }
};

const headerObservOpt = {
  root: null,
  threshold: 0,
  rootMargin: `-${navBar.getBoundingClientRect().height}px`,
};

const headerIntObserv = new IntersectionObserver(fixedNavbar, headerObservOpt);
headerIntObserv.observe(header);

const displaySection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObservOpt = {
  root: null,
  threshold: 0.2,
};

const sectionObserv = new IntersectionObserver(
  displaySection,
  sectionObservOpt
);

sections.forEach(sec => {
  sectionObserv.observe(sec);
  sec.classList.add('section--hidden');
});

// Lazy Loading

const imagesObservOpt = {
  root: null,
  threshold: 0,
  rootMargin: '100px',
};

const imgLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imagesObserv = new IntersectionObserver(imgLoad, imagesObservOpt);

imgsLazy.forEach(img => imagesObserv.observe(img));

// Slider

let currSlide = 0;
const maxSlide = slides.length;

const renderDots = function () {
  console.log(slides.length);
  for (let i = 0; i < slides.length; i++) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  }
};

renderDots();

const activeDot = function (slideNum) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  dotsContainer
    .querySelector(`.dots__dot[data-slide="${slideNum}"]`)
    .classList.add('dots__dot--active');
};

const translateSlides = function (slideNum) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - slideNum)}%)`;
  });
  activeDot(slideNum);
};

const nextSlide = function () {
  if (currSlide === maxSlide - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  translateSlides(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1;
  } else {
    currSlide--;
  }

  translateSlides(currSlide);
};

translateSlides(0);

btnSliderLeft.addEventListener('click', prevSlide);

btnSliderRight.addEventListener('click', nextSlide);

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slideNum = e.target.dataset.slide;

    translateSlides(slideNum);
  }
});
