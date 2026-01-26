// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const profileIcon = document.querySelector('.profile-icon');
  const profileDropdown = document.querySelector('.profile-dropdown');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // Profile dropdown toggle functionality
  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!profileIcon.contains(e.target)) {
        profileDropdown.classList.remove('active');
      }
    });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    const offset = document.querySelector('.navbar').offsetHeight;

    window.scrollTo({
      top: targetElement.offsetTop - offset,
      behavior: 'smooth',
    });
  });
});

// Typing animation for hero section
const texts = [
  'Full-Stack Developer',
  'Software Developer',
  'Frontend Developer',
  'UI/UX Designer',
  'Tech Enthusiast',
];
let currentTextIndex = 0;
let charIndex = 0;
const typingText = document.querySelector('.typing-text');
const cursor = document.querySelector('.cursor');

function type() {
  if (charIndex < texts[currentTextIndex].length) {
    typingText.textContent += texts[currentTextIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 1000);
  }
}

function erase() {
  if (charIndex > 0) {
    typingText.textContent = texts[currentTextIndex].substring(
      0,
      charIndex - 1
    );
    charIndex--;
    setTimeout(erase, 50);
  } else {
    currentTextIndex = (currentTextIndex + 1) % texts.length;
    setTimeout(type, 500);
  }
}

// Start typing animation
if (typingText) {
  setTimeout(type, 500);
}

// Cursor blink animation
if (cursor) {
  setInterval(() => {
    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
  }, 500);
}

// Scroll animations for skill bars
window.addEventListener('scroll', () => {
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach((bar) => {
    const barTop = bar.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (barTop < windowHeight * 0.8 && bar.style.width === '0px') {
      const width = bar.style.width || getComputedStyle(bar).width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 300);
    }
  });
});

// Timeline visibility on scroll
window.addEventListener('scroll', () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const windowHeight = window.innerHeight;

  timelineItems.forEach((item, index) => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < windowHeight * 0.8) {
      setTimeout(() => {
        item.classList.add('visible');
      }, index * 300);
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// View more projects button animation
document
  .querySelector('.view-more-btn')
  ?.addEventListener('mouseover', function () {
    this.style.background = 'linear-gradient(90deg, #6c63ff, #00d4ff)';
  });

document
  .querySelector('.view-more-btn')
  ?.addEventListener('mouseout', function () {
    this.style.background = 'linear-gradient(90deg, #6c63ff, #00d4ff, 0.5)';
  });

// Particle and Thread Animation for Hero Background
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const numParticles = 50;
const maxDistance = 80;

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() * 2 - 1) * 0.3;
    this.speedY = (Math.random() * 2 - 1) * 0.3;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = 'rgba(108, 99, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(108, 99, 255, 0.4)';
    ctx.shadowBlur = 5;
  }
}

// Initialize particles
function initParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

initParticles();

// Draw lines between particles
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const distance = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );

      if (distance < maxDistance) {
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.8 - distance / maxDistance})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  drawLines();

  requestAnimationFrame(animateParticles);
}

animateParticles();

// Reinitialize particles on resize
window.addEventListener('resize', initParticles);

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeDropdown = document.getElementById('themeDropdown');

if (themeToggle && themeDropdown) {
  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.style.display =
      themeDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!themeToggle.contains(e.target)) {
      themeDropdown.style.display = 'none';
    }
  });
}

// Function to set theme
function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  localStorage.setItem('theme', theme);
  // Close dropdown after selection
  themeDropdown.style.display = 'none';
}

// Load saved theme on page load
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
});

// Scroll-triggered animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements in About section
document
  .querySelectorAll('.about-image, .about-text, .about-stats')
  .forEach((element) => {
    observer.observe(element);
  });

// Observe elements in Skills section
document.querySelectorAll('.skill-card').forEach((element) => {
  observer.observe(element);
});

// Observe elements in Projects section
document.querySelectorAll('.project-card, .view-more').forEach((element) => {
  observer.observe(element);
});

// Observe elements in Experience section
document.querySelectorAll('.timeline-item').forEach((element) => {
  observer.observe(element);
});

// Observe elements in Contact section
document.querySelectorAll('.contact-info, .contact-form').forEach((element) => {
  observer.observe(element);
});

// Observe footer
document.querySelectorAll('.footer').forEach((element) => {
  observer.observe(element);
});

// Preloader
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1000);
    }, 1500);
  }
});

// Project Filtering
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length === 0 || projectCards.length === 0) {
    console.log('No filter buttons or project cards found.');
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');
      console.log('Filter applied:', filter); // Debug log
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        console.log('Card category:', category); // Debug log
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Log initial categories for debugging
  projectCards.forEach((card, index) => {
    const category = card.getAttribute('data-category');
    console.log(`Project ${index + 1} category: ${category}`);
  });
}
initProjectFiltering();

// Achievements Carousel with Swiper.js
function initAchievementsCarousel() {
  if (typeof Swiper === 'undefined') {
    console.log('Swiper.js not loaded, applying fallback visibility');
    // Fallback to show cards without carousel if Swiper is not available
    document.querySelectorAll('.achievement-card').forEach((card) => {
      card.style.display = 'block';
      card.style.visibility = 'visible';
      card.style.opacity = '1';
      card.style.width = '100%'; // Full width for stacking
      card.style.margin = '10px 0'; // Vertical margin for spacing
      card.classList.add('visible'); // Add visible class for animations
    });
    const wrapper = document.querySelector('.swiper-wrapper');
    if (wrapper) {
      wrapper.style.display = 'flex';
      wrapper.style.flexWrap = 'wrap';
      wrapper.style.justifyContent = 'center';
      wrapper.style.flexDirection = 'column'; // Stack vertically
      wrapper.style.alignItems = 'center'; // Center align
      wrapper.style.width = '100%'; // Ensure full width
    }
    const container = document.querySelector('.swiper-container');
    if (container) {
      container.style.overflow = 'visible'; // Prevent clipping
      container.style.height = 'auto'; // Allow natural height
    }
    return;
  }
  const swiper = new Swiper('.achievements-carousel', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
  // Reinitialize on resize to fix mobile visibility issues
  window.addEventListener('resize', () => {
    swiper.update();
  });
  // Initial update to ensure visibility
  swiper.update();
  // Force visibility of cards on initialization
  document.querySelectorAll('.achievement-card').forEach((card) => {
    card.style.display = 'block';
    card.style.visibility = 'visible';
    card.style.opacity = '1';
  });
}
initAchievementsCarousel();

// Observe achievements section
document.querySelectorAll('.achievements').forEach((element) => {
  observer.observe(element);
});

// Observe achievement cards for animation
document.querySelectorAll('.achievement-card').forEach((element) => {
  observer.observe(element);
});
