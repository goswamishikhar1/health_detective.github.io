document.addEventListener('DOMContentLoaded', function() {
    const symptomSearch = document.getElementById('symptomSearch');
    const symptomsDropdown = document.getElementById('symptomsDropdown');
    const selectedSymptomsList = document.getElementById('selectedSymptoms');
    const predictionForm = document.getElementById('predictionForm');
    const resultsDiv = document.getElementById('results');
    const API_URL = 'http://localhost:8000';  // Backend server URL

    let allSymptoms = [];
    let selectedSymptoms = new Set();

    // Load all unique symptoms from the backend
    async function loadSymptoms() {
        try {
            const response = await fetch(`${API_URL}/diseases`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            allSymptoms = [...new Set(data.diseases.flatMap(disease => disease.symptoms))].sort();
            updateSymptomsDropdown();
        } catch (error) {
            console.error('Error loading symptoms:', error);
            resultsDiv.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error loading symptoms: ${error.message}. Please make sure the backend server is running.
                </div>
            `;
        }
    }

    // Function to update the symptoms dropdown based on search
    function updateSymptomsDropdown() {
        const searchTerm = symptomSearch.value.toLowerCase();
        const filteredSymptoms = allSymptoms.filter(symptom => 
            symptom.includes(searchTerm)
        );

        symptomsDropdown.innerHTML = filteredSymptoms.map(symptom => `
            <li>
                <a class="dropdown-item ${selectedSymptoms.has(symptom) ? 'active' : ''}" href="#" data-symptom="${symptom}">
                    ${symptom}
                </a>
            </li>
        `).join('');

        // Add event listeners to dropdown items
        symptomsDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const symptom = this.dataset.symptom;
                if (this.classList.contains('active')) {
                    selectedSymptoms.delete(symptom);
                    this.classList.remove('active');
                } else {
                    selectedSymptoms.add(symptom);
                    this.classList.add('active');
                }
                updateSelectedSymptoms();
            });
        });
    }

    // Function to update the selected symptoms list
    function updateSelectedSymptoms() {
        selectedSymptomsList.innerHTML = Array.from(selectedSymptoms).map(symptom => `
            <span class="badge bg-primary me-2 mb-2">
                ${symptom}
                <button type="button" class="btn-close btn-close-white ms-2" aria-label="Remove" data-symptom="${symptom}"></button>
            </span>
        `).join('');

        // Add event listeners to remove buttons
        selectedSymptomsList.querySelectorAll('.btn-close').forEach(button => {
            button.addEventListener('click', function() {
                const symptom = this.dataset.symptom;
                selectedSymptoms.delete(symptom);
                updateSelectedSymptoms();
                updateSymptomsDropdown();
            });
        });
    }

    // Event listener for symptom search input
    symptomSearch.addEventListener('input', updateSymptomsDropdown);

    // Add event listener for Enter key press
    symptomSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = this.value.trim().toLowerCase();
            if (searchTerm) {
                // Find the exact match or first partial match
                const matchingSymptom = allSymptoms.find(symptom => 
                    symptom.toLowerCase() === searchTerm || 
                    symptom.toLowerCase().includes(searchTerm)
                );
                
                if (matchingSymptom) {
                    if (!selectedSymptoms.has(matchingSymptom)) {
                        selectedSymptoms.add(matchingSymptom);
                        updateSelectedSymptoms();
                        updateSymptomsDropdown();
                    }
                    this.value = ''; // Clear the search input
                }
            }
        }
    });

    // Event listener for form submission
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (selectedSymptoms.size === 0) {
            resultsDiv.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    Please select at least one symptom
                </div>
            `;
            return;
        }

        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    symptoms: Array.from(selectedSymptoms)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayResults(data.predictions);
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error: ${error.message}. Please make sure the backend server is running.
                </div>
            `;
        }
    });

    // Function to display results
    function displayResults(predictions) {
        if (!predictions || predictions.length === 0) {
            resultsDiv.innerHTML = `
                <div class="alert alert-info" role="alert">
                    No matching diseases found. Please try different symptoms.
                </div>
            `;
            return;
        }

        resultsDiv.innerHTML = predictions.map(prediction => `
            <div class="card mb-3">
                <div class="card-header">
                    <h5 class="mb-0">${prediction.disease}</h5>
                    <small class="text-muted">Match: ${prediction.match_percentage.toFixed(1)}%</small>
                </div>
                <div class="card-body">
                    <p class="card-text">${prediction.description}</p>
                    <h6>Precautions:</h6>
                    <ul>
                        ${prediction.precautions.map(precaution => `<li>${precaution}</li>`).join('')}
                    </ul>
                    <h6>Medications:</h6>
                    <ul>
                        ${prediction.medications.map(medication => `<li>${medication}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    // Initialize the application
    loadSymptoms();
}); 