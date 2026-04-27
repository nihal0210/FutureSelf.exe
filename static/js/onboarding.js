document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const totalSteps = 5;
    
    const steps = document.querySelectorAll('.wizard-step');
    const progressBar = document.getElementById('wizard-progress');
    const nextBtns = document.querySelectorAll('.next-btn');
    const form = document.getElementById('onboarding-form');
    
    // Slider logic
    const slider = document.getElementById('hours-slider');
    const sliderVal = document.getElementById('hours-val');
    if (slider) {
        slider.addEventListener('input', (e) => {
            sliderVal.textContent = `${e.target.value} Hours`;
        });
    }

    function updateStep() {
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validate radio selection before moving
            const currentStepEl = document.getElementById(`step-${currentStep}`);
            const checked = currentStepEl.querySelector('input[type="radio"]:checked');
            if (!checked) {
                alert("Please select an option to proceed.");
                return;
            }
            
            if (currentStep < totalSteps) {
                currentStep++;
                updateStep();
            }
        });
    });

    const finishBtn = document.getElementById('finish-onboarding');
    if (finishBtn) {
        finishBtn.addEventListener('click', async () => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const res = await fetch('/api/user/onboarding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                
                if (result.success) {
                    window.location.href = '/dashboard';
                } else {
                    alert("Error saving data. Please try again.");
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
});
