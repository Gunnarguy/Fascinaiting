document.getElementById('searchButton').addEventListener('click', () => {
    const drugName = document.getElementById('drugName').value;
    if (!drugName) {
        alert('Please enter a drug name');
        return;
    }

    fetch(`/search?drugName=${encodeURIComponent(drugName)}`)
        .then(response => response.json())
        .then(data => {
            const resultWindow = document.getElementById('resultWindow');
            const drugInfo = data.results?.[0];
            if (drugInfo) {
                resultWindow.innerHTML = `<p><strong>Generic Name:</strong> ${drugInfo.openfda.generic_name[0]}</p>
                                          <p><strong>Brand Name:</strong> ${drugInfo.openfda.brand_name[0]}</p>
                                          <p><strong>Indications and Usage:</strong> ${drugInfo.indications_and_usage?.[0] || 'N/A'}</p>`;
            } else {
                resultWindow.innerHTML = 'No information found.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('resultWindow').innerHTML = 'Failed to fetch information.';
        });
});
