document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main > section');
    const backToTopBtn = document.createElement('button');
    backToTopBtn.textContent = '⬆️';
    backToTopBtn.classList.add('back-to-top');
    document.body.appendChild(backToTopBtn);

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Function to highlight the active section in the navbar
    const setActiveSection = () => {
        let index = sections.length;

        while (--index && window.scrollY + 50 < sections[index].offsetTop) {}

        navLinks.forEach(link => link.classList.remove('active'));
        if (index >= 0) {
            navLinks[index].classList.add('active');
        }
    };

    // Debounce function to limit the rate at which the setActiveSection function is called
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return function () {
            const context = this, args = arguments;
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

    const debouncedSetActiveSection = debounce(setActiveSection);

    // Back to top button functionality
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Show/hide back to top button
    const toggleBackToTopBtn = () => {
        if (window.scrollY > 200) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    // Scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.classList.add('scroll-indicator');
    document.body.appendChild(scrollIndicator);

    const updateScrollIndicator = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = (window.scrollY / maxScroll) * 100;
        scrollIndicator.style.width = `${percentage}%`;
    };

    // Fade-in sections on scroll
    const fadeInSections = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                section.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', debouncedSetActiveSection);
    window.addEventListener('scroll', toggleBackToTopBtn);
    window.addEventListener('scroll', updateScrollIndicator);
    window.addEventListener('scroll', fadeInSections);
    window.addEventListener('resize', debouncedSetActiveSection);
    setActiveSection(); // Initial call to highlight the section
    toggleBackToTopBtn(); // Initial call to set back to top button visibility
    updateScrollIndicator(); // Initial call to set scroll indicator width
    fadeInSections(); // Initial call to set section visibility
});
