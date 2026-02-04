// Chapter Navigation and Progress Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const sections = document.querySelectorAll('.content-section');
    const sidebarLinks = document.querySelectorAll('.topics-nav a');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    const miniProgressFill = document.getElementById('miniProgressFill');
    const miniProgressPercent = document.getElementById('miniProgressPercent');
    
    // Define section titles for this chapter (This should be overridden in each HTML file)
    // Default empty object, will be populated by inline script in HTML
    window.sectionTitles = window.sectionTitles || {};
    
    // Track reading progress
    function updateReadingProgress() {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;
        
        // Calculate progress based on how much of the chapter has been read
        // Start with 5% minimum, increase as user scrolls
        const calculatedProgress = Math.min(Math.max(scrollPercentage, 5), 100);
        
        // Update progress bars
        if (progressFill) {
            progressFill.style.width = `${calculatedProgress}%`;
        }
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(calculatedProgress)}%`;
        }
        
        // Mini nav progress updates with scroll (0-100%)
        if (miniProgressFill) {
            miniProgressFill.style.width = `${Math.min(scrollPercentage, 100)}%`;
        }
        if (miniProgressPercent) {
            miniProgressPercent.textContent = `${Math.round(Math.min(scrollPercentage, 100))}%`;
        }
        
        // Update active sidebar link based on scroll position
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        // Update active link in sidebar
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        // Update mini-nav title
        if (currentSection && window.sectionTitles[currentSection]) {
            const currentSectionTitle = document.getElementById('currentSectionTitle');
            if (currentSectionTitle) {
                currentSectionTitle.textContent = window.sectionTitles[currentSection];
            }
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active link
                sidebarLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                // Update mini-nav title
                const sectionId = targetId.substring(1);
                if (window.sectionTitles[sectionId]) {
                    const currentSectionTitle = document.getElementById('currentSectionTitle');
                    if (currentSectionTitle) {
                        currentSectionTitle.textContent = window.sectionTitles[sectionId];
                    }
                }
            }
        });
    });
    
    // Show/hide mini-nav on scroll
    function updateMiniNavVisibility() {
        const miniNav = document.getElementById('stickyMiniNav');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            miniNav.style.transform = 'translateY(0)';
            miniNav.style.opacity = '1';
        } else {
            miniNav.style.transform = 'translateY(-100%)';
            miniNav.style.opacity = '0';
        }
    }
    
    // Initialize everything
    updateReadingProgress();
    updateMiniNavVisibility();
    
    // Add event listeners
    window.addEventListener('scroll', function() {
        updateReadingProgress();
        updateMiniNavVisibility();
    });
    window.addEventListener('resize', updateReadingProgress);
    
    // Initialize theme
    const savedTheme = localStorage.getItem('studyhive-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
    
    // Mark chapter as complete when reaching the end
    function checkChapterCompletion() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        // If user has scrolled to near the bottom (90% or more)
        if (scrollPosition + windowHeight >= documentHeight - 100) {
            // Get chapter number from title
            const chapterMatch = document.title.match(/Chapter (\d+):/);
            const chapterNumber = chapterMatch ? chapterMatch[1] : 'unknown';
            
            // Mark as completed in localStorage
            localStorage.setItem(`chapter${chapterNumber}-completed`, 'true');
            
            // Update progress to 100%
            if (progressFill) progressFill.style.width = '100%';
            if (progressPercent) progressPercent.textContent = '100%';
            if (miniProgressFill) miniProgressFill.style.width = '100%';
            if (miniProgressPercent) miniProgressPercent.textContent = '100%';
            
            // Show completion message if it exists
            const completionMsg = document.querySelector('.completion-message');
            if (completionMsg) {
                completionMsg.style.display = 'block';
            }
        }
    }
    
    // Check completion on scroll
    window.addEventListener('scroll', checkChapterCompletion);
});

// Function to toggle MCQ answers
function toggleAnswer(button) {
    const answer = button.previousElementSibling;
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        button.textContent = 'Show Solution';
    } else {
        answer.style.display = 'block';
        button.textContent = 'Hide Solution';
    }
}

// Function to manually mark chapter as completed (sets progress to 100%)
function markChapterComplete() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    const miniProgressFill = document.getElementById('miniProgressFill');
    const miniProgressPercent = document.getElementById('miniProgressPercent');
    
    // Get chapter number from title
    const chapterMatch = document.title.match(/Chapter (\d+):/);
    const chapterNumber = chapterMatch ? chapterMatch[1] : 'unknown';
    
    if (progressFill && progressPercent) {
        progressFill.style.width = '100%';
        progressPercent.textContent = '100%';
        
        if (miniProgressFill) miniProgressFill.style.width = '100%';
        if (miniProgressPercent) miniProgressPercent.textContent = '100%';
        
        // Save to localStorage
        localStorage.setItem(`chapter${chapterNumber}-completed`, 'true');
        
        // Show completion message
        const completionMsg = document.querySelector('.completion-message');
        if (completionMsg) {
            completionMsg.style.display = 'block';
        }
    }
}

// Function to save notes for specific chapter
function saveNotes() {
    const notes = document.getElementById('chapterNotes');
    const chapterMatch = document.title.match(/Chapter (\d+):/);
    const chapterNumber = chapterMatch ? chapterMatch[1] : 'unknown';
    
    if (notes) {
        localStorage.setItem(`chapter${chapterNumber}-notes`, notes.value);
        alert('Notes saved successfully!');
    }
}

// Function to load saved notes
function loadNotes() {
    const chapterMatch = document.title.match(/Chapter (\d+):/);
    const chapterNumber = chapterMatch ? chapterMatch[1] : 'unknown';
    const savedNotes = localStorage.getItem(`chapter${chapterNumber}-notes`);
    const notes = document.getElementById('chapterNotes');
    
    if (notes && savedNotes) {
        notes.value = savedNotes;
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    loadNotes();
    
    // Check if chapter was previously completed
    const chapterMatch = document.title.match(/Chapter (\d+):/);
    const chapterNumber = chapterMatch ? chapterMatch[1] : 'unknown';
    
    if (localStorage.getItem(`chapter${chapterNumber}-completed`)) {
        const progressFill = document.querySelector('.progress-fill');
        const progressPercent = document.querySelector('.progress-percent');
        const miniProgressFill = document.getElementById('miniProgressFill');
        const miniProgressPercent = document.getElementById('miniProgressPercent');
        
        if (progressFill && progressPercent) {
            progressFill.style.width = '100%';
            progressPercent.textContent = '100%';
        }
        if (miniProgressFill) miniProgressFill.style.width = '100%';
        if (miniProgressPercent) miniProgressPercent.textContent = '100%';
    }
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('studyhive-theme', newTheme);
            
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }
    
    // Add mark as complete button functionality if it exists
    const completeBtn = document.getElementById('markCompleteBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', markChapterComplete);
    }
    
    // Add save notes button functionality if it exists
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', saveNotes);
    }
});