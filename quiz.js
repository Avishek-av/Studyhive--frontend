// ============================================
// STUDYHIVE QUIZ SYSTEM - FULLY WORKING VERSION
// ============================================

console.log('🚀 Loading Quiz System...');

// Quiz data
const QUIZ_DATA = {
    physics: [
        {
            question: 'What is the SI unit of force?',
            options: ['Newton', 'Joule', 'Watt', 'Pascal'],
            correct: 0,
            difficulty: 'easy'
        },
        {
            question: 'Which law states that energy cannot be created or destroyed?',
            options: ['First Law of Thermodynamics', 'Second Law of Thermodynamics', 'Law of Conservation of Energy', 'Ohm\'s Law'],
            correct: 2,
            difficulty: 'medium'
        },
        {
            question: 'What is the value of Planck\'s constant?',
            options: ['6.626 × 10⁻³⁴ J·s', '3.00 × 10⁸ m/s', '9.81 m/s²', '1.602 × 10⁻¹⁹ C'],
            correct: 0,
            difficulty: 'hard'
        },
        {
            question: 'Which phenomenon explains why the sky appears blue?',
            options: ['Refraction', 'Reflection', 'Rayleigh Scattering', 'Doppler Effect'],
            correct: 2,
            difficulty: 'medium'
        },
        {
            question: 'What type of lens is used to correct nearsightedness?',
            options: ['Convex', 'Concave', 'Bifocal', 'Plano'],
            correct: 1,
            difficulty: 'easy'
        }
    ],
    chemistry: [
        {
            question: 'What is the pH of a neutral solution?',
            options: ['0', '7', '14', '10'],
            correct: 1,
            difficulty: 'easy'
        },
        {
            question: 'Which element has the highest electronegativity?',
            options: ['Fluorine', 'Oxygen', 'Chlorine', 'Nitrogen'],
            correct: 0,
            difficulty: 'hard'
        },
        {
            question: 'What is the process called when a solid changes directly to gas?',
            options: ['Sublimation', 'Deposition', 'Evaporation', 'Condensation'],
            correct: 0,
            difficulty: 'medium'
        },
        {
            question: 'Which gas is most abundant in Earth\'s atmosphere?',
            options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
            correct: 2,
            difficulty: 'easy'
        },
        {
            question: 'What is the chemical symbol for Gold?',
            options: ['Go', 'Gd', 'Au', 'Ag'],
            correct: 2,
            difficulty: 'medium'
        }
    ],
    maths: [
        {
            question: 'What is the value of 5! (5 factorial)?',
            options: ['20', '60', '120', '720'],
            correct: 2,
            difficulty: 'easy'
        },
        {
            question: 'What is the derivative of ln(x)?',
            options: ['1/x', 'x', 'e^x', '1'],
            correct: 0,
            difficulty: 'hard'
        },
        {
            question: 'What is the value of i² (where i is imaginary unit)?',
            options: ['1', '-1', 'i', '0'],
            correct: 1,
            difficulty: 'medium'
        },
        {
            question: 'What is the sum of angles in a triangle?',
            options: ['90°', '180°', '270°', '360°'],
            correct: 1,
            difficulty: 'easy'
        },
        {
            question: 'What is the Pythagorean theorem formula?',
            options: ['a² + b² = c²', 'a + b = c', 'a² - b² = c²', '2a + 2b = 2c'],
            correct: 0,
            difficulty: 'medium'
        }
    ],
    cs: [
        {
            question: 'What does CPU stand for?',
            options: ['Central Processing Unit', 'Computer Processing Unit', 'Central Program Unit', 'Computer Program Unit'],
            correct: 0,
            difficulty: 'easy'
        },
        {
            question: 'What is the time complexity of bubble sort in worst case?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
            correct: 2,
            difficulty: 'hard'
        },
        {
            question: 'Which of these is NOT an object-oriented programming language?',
            options: ['Java', 'C++', 'Python', 'C'],
            correct: 3,
            difficulty: 'medium'
        },
        {
            question: 'What does HTTP stand for?',
            options: ['Hyper Text Transfer Protocol', 'High Tech Transfer Protocol', 'Hyper Transfer Text Protocol', 'Home Tool Transfer Protocol'],
            correct: 0,
            difficulty: 'easy'
        },
        {
            question: 'What is the default port for HTTPS?',
            options: ['80', '443', '8080', '21'],
            correct: 1,
            difficulty: 'medium'
        }
    ]
};

// Quiz State
let currentQuestion = 0;
let selectedAnswers = [];
let quizQuestions = [];
let timerInterval;
let timeLeft = 600; // 10 minutes
let score = 0;
let selectedSubjects = ['physics', 'chemistry', 'maths', 'cs'];

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Loaded - Initializing Quiz');
    
    // Setup subject checkboxes
    setupSubjectCheckboxes();
    
    // Setup start button
    setupStartButton();
    
    // Setup navigation buttons
    setupNavigationButtons();
    
    // Setup results buttons
    setupResultsButtons();
    
    console.log('✅ Quiz System Ready');
});

// Setup subject checkboxes
function setupSubjectCheckboxes() {
    const checkboxes = document.querySelectorAll('input[name="subjects"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const value = this.value;
            if (this.checked) {
                if (!selectedSubjects.includes(value)) {
                    selectedSubjects.push(value);
                }
            } else {
                selectedSubjects = selectedSubjects.filter(sub => sub !== value);
            }
            updateTotalQuestions();
        });
    });
}

// Update total questions display
function updateTotalQuestions() {
    const totalQuestions = selectedSubjects.length * 5;
    // Update in progress bar
    document.getElementById('totalQ').textContent = totalQuestions;
    // Also update in subject selection display
    const currentQElement = document.getElementById('currentQ');
    if (currentQElement) {
        currentQElement.textContent = '1';
    }
    console.log('📊 Total questions updated:', totalQuestions);
}

// Setup start button - CRITICAL FIX
function setupStartButton() {
    const startBtn = document.getElementById('startQuizBtn');
    
    if (!startBtn) {
        console.error('❌ Start button not found!');
        return;
    }
    
    // Remove ALL existing event listeners
    const newBtn = startBtn.cloneNode(true);
    startBtn.parentNode.replaceChild(newBtn, startBtn);
    
    // Get fresh button
    const freshBtn = document.getElementById('startQuizBtn');
    
    // Add direct onclick handler
    freshBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 Start Quiz Clicked!');
        
        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject.');
            return false;
        }
        
        startQuiz();
        return false;
    };
}

// Start the quiz
function startQuiz() {
    console.log('🚀 Starting Quiz...');
    console.log('Selected subjects:', selectedSubjects);
    
    // Calculate total questions
    const totalQuizQuestions = selectedSubjects.length * 5;
    console.log('Total questions for this quiz:', totalQuizQuestions);
    
    // Collect questions from selected subjects
    quizQuestions = [];
    selectedSubjects.forEach(subject => {
        if (QUIZ_DATA[subject]) {
            quizQuestions.push(...QUIZ_DATA[subject].map(q => ({ ...q, subject })));
        }
    });
    
    // Shuffle questions
    shuffleArray(quizQuestions);
    // Take only needed number
    quizQuestions = quizQuestions.slice(0, totalQuizQuestions);
    
    // Reset state
    currentQuestion = 0;
    selectedAnswers = new Array(quizQuestions.length).fill(null);
    score = 0;
    timeLeft = 600;
    
    // Start timer
    startTimer();
    
    // Show step 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    document.getElementById('step2').classList.add('active');
    
    // UPDATE THE TOTAL QUESTIONS DISPLAY IN STEP 2
    document.getElementById('totalQ').textContent = quizQuestions.length;
    document.getElementById('currentQ').textContent = '1';
    
    // Update progress
    updateProgress();
    
    // Show first question
    displayQuestion();
    
    console.log(`✅ Quiz started with ${quizQuestions.length} questions`);
    console.log(`📊 Display: Question 1/${quizQuestions.length}`);
}
// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start timer
function startTimer() {
    clearInterval(timerInterval);
    
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
        
        if (timeLeft <= 60) {
            document.getElementById('timer').classList.add('time-warning');
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Display current question
function displayQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        submitQuiz();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    
    // Update question info
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentSubject').textContent = 
        question.subject.charAt(0).toUpperCase() + question.subject.slice(1);
    document.getElementById('currentDifficulty').textContent = 
        question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
    document.getElementById('currentDifficulty').className = 'difficulty-tag ' + question.difficulty;
    
    document.getElementById('qNum').textContent = currentQuestion + 1;
    
    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const isSelected = selectedAnswers[currentQuestion] === index;
        const optionHTML = `
            <div class="option-item">
                <input type="radio" name="answer" id="option${index}" value="${index}" 
                       ${isSelected ? 'checked' : ''}>
                <label for="option${index}">
                    <span class="option-letter">${letters[index]}</span>
                    <span class="option-text">${option}</span>
                </label>
            </div>
        `;
        optionsContainer.innerHTML += optionHTML;
    });
    
    // Add click handlers for options
    document.querySelectorAll('.option-item input').forEach((input, index) => {
        input.addEventListener('change', () => {
            selectAnswer(index);
        });
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    updateProgress();
}

// Select answer
function selectAnswer(answerIndex) {
    selectedAnswers[currentQuestion] = answerIndex;
    const question = quizQuestions[currentQuestion];
    
    // Show feedback
    document.querySelectorAll('.option-item label').forEach((label, index) => {
        label.classList.remove('correct-answer', 'wrong-answer');
        if (index === question.correct) {
            label.classList.add('correct-answer');
        } else if (index === answerIndex && index !== question.correct) {
            label.classList.add('wrong-answer');
        }
    });
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');
    
    prevBtn.disabled = currentQuestion === 0;
    
    if (currentQuestion === quizQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

// Update progress bar
function updateProgress() {
    if (quizQuestions.length === 0) return;
    
    const progress = ((currentQuestion) / quizQuestions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${progress}%`;
    document.getElementById('currentQ').textContent = currentQuestion + 1;
    // DON'T update totalQ here - it's already set in startQuiz
    // This prevents overwriting the dynamic total
}

// Setup navigation buttons
function setupNavigationButtons() {
    // Previous button
    document.getElementById('prevQuestionBtn').onclick = function(e) {
        e.preventDefault();
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuestion();
        }
    };
    
    // Next button
    document.getElementById('nextQuestionBtn').onclick = function(e) {
        e.preventDefault();
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            displayQuestion();
        }
    };
    
    // Skip button
    document.getElementById('skipQuestionBtn').onclick = function(e) {
        e.preventDefault();
        selectedAnswers[currentQuestion] = null;
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            displayQuestion();
        }
    };
    
    // Submit button
    document.getElementById('submitQuizBtn').onclick = function(e) {
        e.preventDefault();
        submitQuiz();
    };
}

// Submit quiz
function submitQuiz() {
    clearInterval(timerInterval);
    calculateScore();
    showResults();
}

// Calculate score
function calculateScore() {
    score = 0;
    quizQuestions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct) {
            score++;
        }
    });
}

// Show results
function showResults() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    document.getElementById('step3').classList.add('active');
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    // Update score
    document.getElementById('finalScore').textContent = percentage;
    document.getElementById('betterThan').textContent = calculateBetterThan(percentage);
    
    // Update progress circle
    const scoreCircle = document.getElementById('scoreCircle');
    if (scoreCircle) {
        scoreCircle.style.setProperty('--progress', `${percentage}%`);
    }
    
    // Update motivational message
    const scoreDesc = document.querySelector('.score-desc');
    if (scoreDesc) {
        const message = getMotivationalMessage(percentage);
        scoreDesc.innerHTML = `<strong>${message}</strong><br><span style="font-size: 0.9em; opacity: 0.8;">You scored better than <span id="betterThan">${calculateBetterThan(percentage)}%</span> of students.</span>`;
    }
    
    // Generate subject breakdown
    generateSubjectBreakdown();
    
    // Generate recommendations
    generateRecommendations();
}

// Calculate better than percentage
function calculateBetterThan(percentage) {
    if (percentage >= 95) return 99;
    if (percentage >= 90) return 95;
    if (percentage >= 85) return 90;
    if (percentage >= 80) return 85;
    if (percentage >= 75) return 78;
    if (percentage >= 70) return 70;
    if (percentage >= 65) return 62;
    if (percentage >= 60) return 55;
    if (percentage >= 55) return 48;
    if (percentage >= 50) return 42;
    if (percentage >= 45) return 35;
    if (percentage >= 40) return 28;
    if (percentage >= 35) return 22;
    if (percentage >= 30) return 17;
    if (percentage >= 25) return 13;
    if (percentage >= 20) return 10;
    if (percentage >= 15) return 7;
    if (percentage >= 10) return 5;
    return 3;
}

// Get motivational message
function getMotivationalMessage(percentage) {
    if (percentage >= 95) return '🎯 PERFECT! Genius level unlocked!';
    if (percentage >= 90) return '🌟 OUTSTANDING! You\'re in the top 1%!';
    if (percentage >= 80) return '🔥 EXCELLENT! Keep up the great work!';
    if (percentage >= 70) return '👍 GOOD JOB! You\'re doing well!';
    if (percentage >= 60) return '📚 DECENT! Room for improvement.';
    if (percentage >= 50) return '🤔 AVERAGE! Study more next time.';
    if (percentage >= 40) return '😬 BELOW AVERAGE! Time to study more.';
    if (percentage >= 30) return '📉 POOR! Hit the books harder!';
    if (percentage >= 20) return '💀 VERY POOR! Serious study needed!';
    return '❌ DISASTER! Emergency study session!';
}

// Generate subject breakdown
function generateSubjectBreakdown() {
    const breakdown = {};
    
    // Initialize breakdown
    selectedSubjects.forEach(subject => {
        breakdown[subject] = { correct: 0, total: 0 };
    });
    
    // Calculate scores per subject
    quizQuestions.forEach((question, index) => {
        breakdown[question.subject].total++;
        if (selectedAnswers[index] === question.correct) {
            breakdown[question.subject].correct++;
        }
    });
    
    // Update UI
    const breakdownGrid = document.getElementById('subjectBreakdown');
    if (breakdownGrid) {
        breakdownGrid.innerHTML = '';
        
        Object.entries(breakdown).forEach(([subject, scores]) => {
            if (scores.total > 0) {
                const percentage = Math.round((scores.correct / scores.total) * 100);
                const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
                
                const breakdownHTML = `
                    <div class="breakdown-item">
                        <div class="breakdown-subject">
                            <span class="subject-icon ${subject}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    ${getSubjectIcon(subject)}
                                </svg>
                            </span>
                            <span>${subjectName}</span>
                        </div>
                        <div class="breakdown-score ${percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'poor'}">
                            ${percentage}%
                        </div>
                    </div>
                `;
                
                breakdownGrid.innerHTML += breakdownHTML;
            }
        });
    }
}

// Get subject icon
function getSubjectIcon(subject) {
    switch(subject) {
        case 'physics':
            return `<circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M12 2a10 10 0 0 0 0 20"/><path d="M2 12h20"/>`;
        case 'chemistry':
            return `<path d="M9 3h6v6l3 9H6l3-9V3z"/><path d="M9 3h6"/><path d="M10 15h4"/>`;
        case 'maths':
            return `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/><path d="M5 5l14 14"/><path d="M19 5l-14 14"/>`;
        case 'cs':
            return `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12" y1="2" x2="12" y2="22"/>`;
        default:
            return '';
    }
}

// Generate recommendations
function generateRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;
    
    recommendationsList.innerHTML = `
        <li>📚 <strong>Study daily:</strong> Consistent 30-minute sessions are better than long cramming</li>
        <li>🧠 <strong>Practice problems:</strong> Solve at least 5 problems from weak areas daily</li>
        <li>📝 <strong>Review mistakes:</strong> Go through incorrect answers and understand why</li>
        <li>⏰ <strong>Time management:</strong> Use Pomodoro technique (25 min study, 5 min break)</li>
        <li>🔄 <strong>Regular revision:</strong> Revise topics weekly to retain information</li>
    `;
}

// Setup results buttons
function setupResultsButtons() {
    // Retake quiz
document.getElementById('retakeQuizBtn').onclick = function(e) {
    e.preventDefault();
    // Reset total questions display
    document.getElementById('totalQ').textContent = '15'; // ADD THIS LINE
    location.reload();
};
    
    // View dashboard
    document.getElementById('viewDashboardBtn').onclick = function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    };
    
    // Share results
    document.getElementById('shareResultsBtn').onclick = function(e) {
        e.preventDefault();
        const percentage = Math.round((score / quizQuestions.length) * 100);
        const message = `I scored ${percentage}% on StudyHive Quiz! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My StudyHive Results',
                text: message,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(message).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    };
}

// Add emergency handler in case button still doesn't work
(function() {
    setTimeout(() => {
        const btn = document.getElementById('startQuizBtn');
        if (btn) {
            // Add nuclear option
            btn.setAttribute('onclick', 'window.startQuizNow()');
            
            // Define global function as fallback
            window.startQuizNow = function() {
                console.log('🚨 EMERGENCY START TRIGGERED');
                if (selectedSubjects.length === 0) {
                    document.querySelectorAll('input[name="subjects"]').forEach(cb => cb.checked = true);
                    selectedSubjects = ['physics', 'chemistry', 'maths', 'cs'];
                }
                startQuiz();
            };
        }
    }, 1000);
})();

console.log('✅ Quiz System Loaded Successfully');