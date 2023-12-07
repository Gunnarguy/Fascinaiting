document.addEventListener('DOMContentLoaded', function() {
    var dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(function(dropdown) {
        var button = dropdown.querySelector('.dropdown-button');
        
        button.addEventListener('click', function(event) {
            closeOtherDropdowns(dropdowns, dropdown);
            
            var content = dropdown.querySelector('.dropdown-content');
            content.classList.toggle('hidden');
            
            event.stopPropagation();
        });
    });

    window.addEventListener('click', function() {
        dropdowns.forEach(function(dropdown) {
            var content = dropdown.querySelector('.dropdown-content');
            
            if (!content.classList.contains('hidden')) {
                content.classList.add('hidden');
            }
        });
    });
});

function closeOtherDropdowns(dropdowns, currentDropdown) {
    dropdowns.forEach(function(dropdown) {
        if (dropdown !== currentDropdown) {
            var content = dropdown.querySelector('.dropdown-content');
            content.classList.add('hidden');
        }
    });
}
