document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach((dropdown) => {
        const button = dropdown.querySelector('.dropdown-button');

        button.addEventListener('click', (event) => {
            closeOtherDropdowns(dropdowns, dropdown);

            const content = dropdown.querySelector('.dropdown-content');
            content.classList.toggle('hidden');

            event.stopPropagation();
        });
    });

    window.addEventListener('click', () => {
        dropdowns.forEach((dropdown) => {
            const content = dropdown.querySelector('.dropdown-content');

            if (!content.classList.contains('hidden')) {
                content.classList.toggle('hidden');
            }
        });
    });
});

function closeOtherDropdowns(dropdowns, currentDropdown) {
    dropdowns.forEach((dropdown) => {
        if (dropdown !== currentDropdown) {
            const content = dropdown.querySelector('.dropdown-content');
            content.classList.add('hidden');
        }
    });
}
