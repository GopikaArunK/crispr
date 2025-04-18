document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const predictionForm = document.getElementById('predictionForm');
    const mrnaSequence = document.getElementById('mrnaSequence');
    const lengthIndicator = document.querySelector('.length-indicator');
    const validationMessage = document.querySelector('.validation-message');
    const resultsContainer = document.querySelector('.results-container');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Sequence validation
    mrnaSequence.addEventListener('input', function() {
        const sequence = this.value.toUpperCase();
        this.value = sequence; // Convert to uppercase
        
        // Update length indicator
        lengthIndicator.textContent = `${sequence.length}/30`;
        
        // Validate sequence
        if (sequence.length > 30) {
            validationMessage.textContent = 'Sequence must not exceed 30 nucleotides';
            validationMessage.style.color = '#ef4444';
        } else if (sequence.length < 30 && sequence.length > 0) {
            validationMessage.textContent = 'Sequence must be exactly 30 nucleotides';
            validationMessage.style.color = '#f59e0b';
        } else if (!/^[ATCG]*$/.test(sequence) && sequence.length > 0) {
            validationMessage.textContent = 'Invalid nucleotides. Use only A, T, C, G';
            validationMessage.style.color = '#ef4444';
        } else if (sequence.length === 30) {
            validationMessage.textContent = 'Valid sequence!';
            validationMessage.style.color = '#22c55e';
        } else {
            validationMessage.textContent = '';
        }
    });

    // Form submission
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            mrnaSequence: mrnaSequence.value.toUpperCase(),
            targetGene: document.getElementById('targetGene').value,
            cutPosition: document.getElementById('cutPosition').value
        };

        // Validate sequence length
        if (formData.mrnaSequence.length !== 30) {
            alert('Please enter a valid 30-nucleotide sequence.');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            // TODO: Replace with actual API endpoint
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Prediction failed');
            }

            const result = await response.json();
            
            // Update and show results
            updateResults(result.efficiency_score);
            resultsContainer.style.display = 'block';
            
            // Smooth scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request. Please try again.');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Update results display
    function updateResults(score) {
        const scoreValue = document.querySelector('.score-value');
        const targetScore = parseFloat(score);
        let currentScore = 0;
        
        // Animate the score counter
        const animation = setInterval(() => {
            if (currentScore >= targetScore) {
                clearInterval(animation);
                currentScore = targetScore;
            } else {
                currentScore += 0.01;
            }
            scoreValue.textContent = currentScore.toFixed(2);
        }, 20);

        // Update visualization
        const visualization = document.querySelector('.sequence-visualization');
        // TODO: Add sequence visualization logic here
    }

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            return;
        }
        
        if (currentScroll > lastScroll) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}); 