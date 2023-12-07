document.addEventListener('DOMContentLoaded', function() {
    var dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
        var button = dropdown.querySelector('.dropdown-button');
        button.addEventListener('click', function(event) {
            // Prevent multiple dropdowns from being open at the same time
            dropdowns.forEach(function(d) {
                if (d !== dropdown) {
                    d.querySelector('.dropdown-content').classList.add('hidden');
                }
            });
            // Toggle the current dropdown content
            var content = dropdown.querySelector('.dropdown-content');
            content.classList.toggle('hidden');
            event.stopPropagation();
        });
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function() {
        dropdowns.forEach(function(dropdown) {
            var content = dropdown.querySelector('.dropdown-content');
            if (!content.classList.contains('hidden')) {
                content.classList.add('hidden');
            }
        });
    });
        });