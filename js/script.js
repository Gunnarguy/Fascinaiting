// Select the icon
const icon = document.querySelector('.icon');

// Add event listener
icon.addEventListener('click', () => {
    icon.classList.toggle('clicked');
});

// JavaScript for responsive menu and other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Code for responsive menu toggle
    const menuToggle = document.querySelector('#menu-toggle');
    const navMenu = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Additional interactive elements can be added here
});
