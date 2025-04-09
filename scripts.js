/**
 * OpenAssistant Website JavaScript
 * Author: Gunnar Hostetler
 * Last updated: April 8, 2025
 * 
 * This script handles various interactive elements:
 * - Smooth scrolling navigation
 * - Active section highlighting
 * - Back-to-top button functionality
 * - Scroll progress indicator
 * - Fade-in animations on scroll
 * - Particle.js background initialization
 */

// Wait for the DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements to avoid repeated queries
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.section');

    // --- UI Element Creation ---

    /**
     * Creates and configures the back-to-top button
     * @returns {HTMLElement} The configured button element
     */
    const createBackToTopButton = () => {
        const btn = document.createElement('button');
        btn.textContent = '⬆️';
        btn.classList.add('back-to-top');
        btn.setAttribute('aria-label', 'Scroll back to top');
        document.body.appendChild(btn);

        // Add click event handler to scroll to top
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return btn;
    };

    /**
     * Creates and adds the scroll progress indicator
     * @returns {HTMLElement} The created scroll indicator element
     */
    const createScrollIndicator = () => {
        const indicator = document.createElement('div');
        indicator.classList.add('scroll-indicator');
        document.body.appendChild(indicator);
        return indicator;
    };

    // Create UI elements
    const backToTopBtn = createBackToTopButton();
    const scrollIndicator = createScrollIndicator();

    // --- Utility Functions ---

    /**
     * Debounces a function to limit how often it runs
     * @param {Function} func - The function to debounce
     * @param {number} wait - Time to wait in ms
     * @param {boolean} immediate - Whether to run immediately
     * @returns {Function} Debounced function
     */
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return function (...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    /**
     * Checks if an element is in the viewport
     * @param {HTMLElement} el - The element to check
     * @param {number} offset - Offset from the edge of viewport
     * @returns {boolean} Whether element is in viewport
     */
    const isInViewport = (el, offset = 100) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top + offset < window.innerHeight &&
            rect.bottom - offset > 0
        );
    };

    // --- Event Handler Functions ---

    /**
     * Sets the active navigation link based on scroll position
     */
    const setActiveSection = () => {
        // Find the section currently in view
        let currentSectionIndex = -1;
        const scrollPosition = window.scrollY + 100; // Offset for better UX

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight) {
                currentSectionIndex = index;
            }
        });

        // Update active state in navigation
        navLinks.forEach(link => link.classList.remove('active'));
        if (currentSectionIndex !== -1 && navLinks[currentSectionIndex]) {
            navLinks[currentSectionIndex].classList.add('active');
        }
    };

    /**
     * Shows/hides the back to top button based on scroll position
     */
    const toggleBackToTopBtn = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    /**
     * Updates the width of the scroll indicator
     */
    const updateScrollIndicator = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        scrollIndicator.style.width = `${scrollPercentage}%`;
    };

    /**
     * Adds 'visible' class to sections when they enter the viewport
     */
    const fadeInSections = () => {
        sections.forEach(section => {
            if (isInViewport(section)) {
                section.classList.add('visible');
            }
        });
    };

    // --- Initialize Particle.js Background ---

    /**
     * Initializes the particles.js background if the library is loaded
     */
    const initParticles = () => {
        if (typeof particlesJS === 'undefined') return;

        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00bcd4' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.2, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#004d99',
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    };

    /**
     * Initializes the AOS (Animate On Scroll) library if loaded
     */
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true
            });
        }
    };

    // --- Initialize Smooth Scrolling ---

    /**
     * Sets up smooth scrolling for navigation links
     */
    const initSmoothScrolling = () => {
        navLinks.forEach(link => {
            link.addEventListener('click', event => {
                // Only handle links to sections (like #features)
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    event.preventDefault();
                    const targetId = href;
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    };

    // --- Event Registration ---

    // Create debounced versions of functions for better performance
    const debouncedSetActiveSection = debounce(setActiveSection, 50);

    // Register all scroll and resize event listeners
    window.addEventListener('scroll', toggleBackToTopBtn);
    window.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('scroll', fadeInSections);
    window.addEventListener('scroll', debouncedSetActiveSection);
    window.addEventListener('resize', debouncedSetActiveSection);

    // --- Initialization ---

    // Set up all features and initial state
    const init = () => {
        initSmoothScrolling();
        initParticles();
        initAOS();
        setActiveSection();
        toggleBackToTopBtn();
        updateScrollIndicator();
        fadeInSections();
    };

    // Run initialization
    init();
});
