// ============================
// API Configuration
// ============================
const API_BASE_URL = 'http://localhost/studyhive/api';

// ============================
// Hardcoded User Credentials
// ============================
const HARDCODED_USERS = {
  'banjaraavisek123@gmail.com': {
    id: 1,
    name: 'Avishek',
    email: 'banjaraavisek123@gmail.com',
    password: '432111',
    grade: '12',
    avatar: 'A',
    created_at: '2024-01-01'
  }
};

// ============================
// Theme Toggle
// ============================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function initTheme() {
  const savedTheme = localStorage.getItem('studyhive-theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark');
  } else {
    body.classList.add('dark');
  }
  
  // Force update icon visibility
  updateThemeIcons();
}
initTheme();

function updateThemeIcons() {
  const isDark = body.classList.contains('dark');
  const sunIcons = document.querySelectorAll('.sun-icon');
  const moonIcons = document.querySelectorAll('.moon-icon');
  
  if (isDark) {
    sunIcons.forEach(icon => icon.style.display = 'block');
    moonIcons.forEach(icon => icon.style.display = 'none');
  } else {
    sunIcons.forEach(icon => icon.style.display = 'none');
    moonIcons.forEach(icon => icon.style.display = 'block');
  }
}

// Theme toggle event listener
document.addEventListener('DOMContentLoaded', function() {
  const themeToggleBtn = document.getElementById('themeToggle');
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const isDark = body.classList.contains('dark');
      
      if (isDark) {
        body.classList.remove('dark');
        localStorage.setItem('studyhive-theme', 'light');
      } else {
        body.classList.add('dark');
        localStorage.setItem('studyhive-theme', 'dark');
      }
      
      updateThemeIcons();
    });
  }
});

// ============================
// Mobile Navigation
// ============================
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNav = document.getElementById('mobileNav');

if (mobileNavToggle && mobileNav) {
  mobileNavToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  if (mobileNavLinks.length > 0) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (mobileNavToggle && mobileNav) {
          mobileNavToggle.classList.remove('active');
          mobileNav.classList.remove('active');
          body.style.overflow = '';
        }
      });
    });
  }
}

// ============================
// Time-based Greeting
// ============================
const greetingEl = document.getElementById('greeting');

function updateGreeting() {
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting = 'Good Evening';

  if (hour >= 5 && hour < 12) greeting = 'Good Morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good Evening';
  else greeting = 'Good Night';

  greetingEl.textContent = greeting;
}
updateGreeting();

// ============================
// Header Scroll Effect
// ============================
const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');

function handleScroll() {
  if (!header) return;

  const scrollY = window.scrollY;

  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (progressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }
}
window.addEventListener('scroll', handleScroll);
handleScroll();

// ============================
// Continue Learning Card (INDEX.HTML ONLY)
// ============================
const continueCard = document.getElementById('continueCard');
const continueClose = document.getElementById('continueClose');
const continueSubject = document.getElementById('continueSubject');
const continueBtn = document.getElementById('continueBtn');

if (continueCard && continueClose && continueSubject && continueBtn) {
  const cardDismissed = localStorage.getItem('studyhive-continue-dismissed');
  
  const lastStudied = {
    subject: 'Physics',
    topic: 'Wave Optics',
    link: 'physics.html'
  };
  
  continueSubject.textContent = `${lastStudied.subject} - ${lastStudied.topic}`;
  continueBtn.href = lastStudied.link;
  
  let cardShown = false;
  
  if (!cardDismissed) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400 && !cardShown) {
        continueCard.classList.add('visible');
        cardShown = true;
      }
    });
  }
  
  continueClose.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    continueCard.classList.remove('visible');
    setTimeout(() => continueCard.classList.add('hidden'), 500);
    localStorage.setItem('studyhive-continue-dismissed', 'true');
  });
}

// ============================
// Scroll Animations
// ============================
const fadeElements = document.querySelectorAll('.fade-in');

if (fadeElements.length) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => fadeObserver.observe(el));
}

// ============================
// Smooth Scroll
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = header ? header.offsetHeight : 80;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top: targetPosition, behavior: 'smooth' });

    const modal = document.getElementById('startZeroModal');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      body.style.overflow = '';
    }
  });
});

// ============================
// Track Subject Visit
// ============================
function trackSubjectVisit(subject, topic) {
  localStorage.setItem(
    'studyhive-last-subject',
    JSON.stringify({ subject, topic, timestamp: Date.now() })
  );
  localStorage.removeItem('studyhive-continue-dismissed');
}
window.trackSubjectVisit = trackSubjectVisit;

// ============================
// Start From Zero Modal (INDEX.HTML ONLY)
// ============================
const startZeroBtn = document.getElementById('startZeroBtn');
const startZeroModal = document.getElementById('startZeroModal');
const modalClose = document.getElementById('modalClose');
const modalStartBtn = document.getElementById('modalStartBtn');

if (startZeroBtn && startZeroModal && modalClose && modalStartBtn) {
  startZeroBtn.addEventListener('click', function(e) {
    e.preventDefault();
    startZeroModal.classList.add('active');
    body.style.overflow = 'hidden';
  });

  [modalClose, modalStartBtn].forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      startZeroModal.classList.remove('active');
      body.style.overflow = '';
    });
  });

  startZeroModal.addEventListener('click', e => {
    if (e.target === startZeroModal) {
      startZeroModal.classList.remove('active');
      body.style.overflow = '';
    }
  });
}

// ============================
// Login Required Modal
// ============================
function showLoginRequiredModal() {
  const modalHTML = `
    <div class="modal-overlay active" id="loginRequiredModal">
      <div class="modal-content">
        <button class="modal-close" onclick="closeLoginRequiredModal()" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="modal-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </div>
        <h3 class="modal-title">Login Required</h3>
        <p class="modal-desc">
          Please login or sign up to access all subjects, track your progress, and continue where you left off.
        </p>
        <div class="modal-actions">
          <a href="login.html" class="modal-btn secondary-btn">Login</a>
          <a href="signup.html" class="modal-btn primary-btn">Sign Up Now</a>
        </div>
      </div>
    </div>
  `;
  
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalHTML;
  document.body.appendChild(modalDiv.firstElementChild);
  document.body.style.overflow = 'hidden';
}

function closeLoginRequiredModal() {
  const modal = document.getElementById('loginRequiredModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

window.showLoginRequiredModal = showLoginRequiredModal;
window.closeLoginRequiredModal = closeLoginRequiredModal;

// ============================
// Login Function (Using Hardcoded Credentials)
// ============================
async function loginUser(email, password) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user exists in hardcoded data
  if (HARDCODED_USERS[email] && HARDCODED_USERS[email].password === password) {
    const user = HARDCODED_USERS[email];
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    // Set session in localStorage
    localStorage.setItem('studyhive_user', JSON.stringify(userWithoutPassword));
    
    return {
      success: true,
      user: userWithoutPassword
    };
  }
  
  return {
    success: false,
    message: 'Invalid email or password'
  };
}

// ============================
// Authentication State Management
// ============================
async function checkAuthState() {
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  const mobileAuthButtons = document.getElementById('mobileAuthButtons');
  const greetingEl = document.getElementById('greeting');
  const headerBtn = document.getElementById('headerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const subjectCards = document.querySelectorAll('.subject-card');
  const continueCard = document.getElementById('continueCard');

  try {
    // Check localStorage for user session
    const userData = localStorage.getItem('studyhive_user');
    
    if (userData) {
      const user = JSON.parse(userData);
      
      // Show user menu, hide auth buttons (SAFE)
      if (authButtons) authButtons.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (mobileAuthButtons) mobileAuthButtons.style.display = 'none';
      
      // Update user info (SAFE)
      if (userName) userName.textContent = user.name.split(' ')[0];
      if (userAvatar) {
        userAvatar.textContent = user.avatar || user.name.charAt(0).toUpperCase();
      }
      
      // Update greeting (SAFE)
      if (greetingEl) {
        const hour = new Date().getHours();
        let greeting = 'Good Evening';
        if (hour >= 5 && hour < 12) greeting = 'Good Morning';
        else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
        else if (hour >= 17 && hour < 21) greeting = 'Good Evening';
        else greeting = 'Good Night';
        
        greetingEl.textContent = `${greeting}, ${user.name.split(' ')[0]}`;
      }
      
      // Enable subject cards (SAFE - only if they exist)
      if (subjectCards && subjectCards.length > 0) {
        subjectCards.forEach(card => {
          card.style.pointerEvents = 'auto';
          card.style.opacity = '1';
          card.style.cursor = 'pointer';
          card.classList.remove('disabled');
          card.onclick = null;
        });
      }
      
      // Show continue card if exists (SAFE)
      if (continueCard) {
        continueCard.style.display = 'flex';
      }
      
      // Change header button text (SAFE)
      if (headerBtn) {
        headerBtn.textContent = 'CONTINUE LEARNING';
        headerBtn.href = '#subjects';
      }
      
      // Logout handler
      if (logoutBtn) {
        logoutBtn.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          localStorage.removeItem('studyhive_user');
          window.location.href = 'index.html';
        };
      }
      
    } else {
      // User is NOT logged in
      showLoggedOutState();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showLoggedOutState();
  }
  
  function showLoggedOutState() {
    // Show auth buttons, hide user menu (SAFE)
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    if (mobileAuthButtons) mobileAuthButtons.style.display = 'flex';
    
    // Disable subject cards (SAFE - only if they exist)
    if (subjectCards && subjectCards.length > 0) {
      subjectCards.forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.7';
        card.style.cursor = 'not-allowed';
        card.classList.add('disabled');
        card.onclick = function(e) {
          e.preventDefault();
          showLoginRequiredModal();
        };
      });
    }
    
    // Hide continue card (SAFE)
    if (continueCard) {
      continueCard.style.display = 'none';
    }
    
    // Set header button to default (SAFE)
    if (headerBtn) {
      headerBtn.textContent = 'START LEARNING';
      headerBtn.href = '#subjects';
    }
  }
}

// ============================
// Login Form Handler (For login.html)
// ============================
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember')?.checked || false;
      
      // Reset errors
      const emailError = document.getElementById('emailError');
      const passwordError = document.getElementById('passwordError');
      if (emailError) emailError.textContent = '';
      if (passwordError) passwordError.textContent = '';
      
      // Validation
      let isValid = true;
      
      if (!email || !email.includes('@')) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }
      
      if (!password) {
        if (passwordError) passwordError.textContent = 'Please enter your password';
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Show loading
      const loginBtn = document.getElementById('loginBtn');
      const loginLoader = document.getElementById('loginLoader');
      const btnText = document.querySelector('.btn-text');
      
      if (loginBtn) loginBtn.disabled = true;
      if (loginLoader) loginLoader.style.display = 'inline-block';
      if (btnText) btnText.style.opacity = '0.5';
      
      try {
        const result = await loginUser(email, password);
        
        if (result.success) {
          // Show success message
          alert('Login successful! Redirecting...');
          
          // Redirect to home page
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
          
        } else {
          // Show error message
          if (passwordError) passwordError.textContent = result.message || 'Invalid email or password';
        }
        
      } catch (error) {
        console.error('Login error:', error);
        if (passwordError) passwordError.textContent = 'An error occurred. Please try again.';
      } finally {
        // Hide loading
        if (loginBtn) loginBtn.disabled = false;
        if (loginLoader) loginLoader.style.display = 'none';
        if (btnText) btnText.style.opacity = '1';
      }
    });
  }
}

// ============================
// Signup Form Handler (For signup.html)
// ============================
function setupSignupForm() {
  const signupForm = document.getElementById('signupForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const grade = document.getElementById('grade').value;
      const terms = document.getElementById('terms').checked;
      
      // Reset errors
      const errorIds = ['nameError', 'signupEmailError', 'signupPasswordError', 
                      'confirmPasswordError', 'gradeError', 'termsError'];
      errorIds.forEach(id => {
        const errorEl = document.getElementById(id);
        if (errorEl) errorEl.textContent = '';
      });
      
      // Validation
      let isValid = true;
      
      if (!fullName || fullName.trim().length < 2) {
        const nameError = document.getElementById('nameError');
        if (nameError) nameError.textContent = 'Please enter your full name';
        isValid = false;
      }
      
      if (!email || !email.includes('@')) {
        const emailError = document.getElementById('signupEmailError');
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }
      
      if (!password || password.length < 4) {
        const passwordError = document.getElementById('signupPasswordError');
        if (passwordError) passwordError.textContent = 'Password must be at least 4 characters';
        isValid = false;
      }
      
      if (password !== confirmPassword) {
        const confirmError = document.getElementById('confirmPasswordError');
        if (confirmError) confirmError.textContent = 'Passwords do not match';
        isValid = false;
      }
      
      if (!grade) {
        const gradeError = document.getElementById('gradeError');
        if (gradeError) gradeError.textContent = 'Please select your grade';
        isValid = false;
      }
      
      if (!terms) {
        const termsError = document.getElementById('termsError');
        if (termsError) termsError.textContent = 'You must agree to the terms and conditions';
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Show loading
      const signupBtn = document.getElementById('signupBtn');
      const signupLoader = document.getElementById('signupLoader');
      const btnText = document.querySelector('.btn-text');
      
      if (signupBtn) signupBtn.disabled = true;
      if (signupLoader) signupLoader.style.display = 'inline-block';
      if (btnText) btnText.style.opacity = '0.5';
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if email already exists
        if (HARDCODED_USERS[email]) {
          const emailError = document.getElementById('signupEmailError');
          if (emailError) emailError.textContent = 'This email is already registered';
          return;
        }
        
        // Show success message
        alert('Account created successfully! Please log in with your credentials.');
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        
      } catch (error) {
        console.error('Signup error:', error);
        const emailError = document.getElementById('signupEmailError');
        if (emailError) emailError.textContent = 'An error occurred. Please try again.';
      } finally {
        // Hide loading
        if (signupBtn) signupBtn.disabled = false;
        if (signupLoader) signupLoader.style.display = 'none';
        if (btnText) btnText.style.opacity = '1';
      }
    });
  }
}

// ============================
// FAQ Accordion (Fixed with proper answers)
// ============================
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length === 0) return;
  
  // Open first FAQ by default
  faqQuestions[0].setAttribute('aria-expanded', 'true');
  faqQuestions[0].nextElementSibling.setAttribute('aria-hidden', 'false');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = this.nextElementSibling;
      
      // Toggle current item
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
      } else {
        // Close other FAQ items
        faqQuestions.forEach(q => {
          if (q !== this) {
            q.setAttribute('aria-expanded', 'false');
            const otherAnswer = q.nextElementSibling;
            otherAnswer.setAttribute('aria-hidden', 'true');
          }
        });
        
        this.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// ============================
// Focus Mode Preview (Fixed - WORKING)
// ============================
function initFocusModePreview() {
  const focusPreviewBtn = document.getElementById('focusPreviewBtn');
  const focusOverlay = document.getElementById('focusOverlay');
  const focusExitBtn = document.getElementById('focusExitBtn');
  
  if (!focusPreviewBtn || !focusOverlay || !focusExitBtn) return;
  
  focusPreviewBtn.addEventListener('click', function(e) {
    e.preventDefault();
    focusOverlay.classList.add('active');
    focusOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
  
  focusExitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    focusOverlay.classList.remove('active');
    focusOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
  
  focusOverlay.addEventListener('click', function(e) {
    if (e.target === focusOverlay) {
      focusOverlay.classList.remove('active');
      focusOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && focusOverlay.classList.contains('active')) {
      focusOverlay.classList.remove('active');
      focusOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

// ============================
// Set Active Navigation Link
// ============================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Remove active class from all nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Set active class based on current page
  if (currentPage === 'index.html' || currentPage === '') {
    // Find and activate SUBJECTS link on home page
    document.querySelectorAll('a[href*="#subjects"], a[href="index.html"]').forEach(link => {
      if (link.getAttribute('href').includes('#subjects') || link.getAttribute('href') === 'index.html') {
        link.classList.add('active');
      }
    });
  } else if (currentPage === 'learning-paths.html') {
    document.querySelectorAll('a[href="learning-paths.html"]').forEach(link => {
      link.classList.add('active');
    });
  } else if (currentPage === 'about.html') {
    document.querySelectorAll('a[href="about.html"]').forEach(link => {
      link.classList.add('active');
    });
  } else if (currentPage === 'faq.html') {
    document.querySelectorAll('a[href="faq.html"]').forEach(link => {
      link.classList.add('active');
    });
  } else if (currentPage === 'focus-mode.html') {
    // Focus mode should highlight PATHS since it's under learning features
    document.querySelectorAll('a[href="learning-paths.html"]').forEach(link => {
      link.classList.add('active');
    });
  } else if (currentPage === 'login.html') {
    // Login page - no active nav link
  } else if (currentPage === 'signup.html') {
    // Signup page - no active nav link
  }
}

// ============================
// Initialize Everything
// ============================
document.addEventListener('DOMContentLoaded', function() {
  // Check auth state
  checkAuthState();
  
  // Initialize theme
  initTheme();
  
  // Update greeting if element exists
  if (greetingEl) updateGreeting();
  
  // Set up scroll listener
  handleScroll();
  
  // Mobile nav event listeners
  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
  }
  
  // Theme toggle for all pages
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const isDark = body.classList.contains('dark');
      if (isDark) {
        body.classList.remove('dark');
        localStorage.setItem('studyhive-theme', 'light');
      } else {
        body.classList.add('dark');
        localStorage.setItem('studyhive-theme', 'dark');
      }
      updateThemeIcons();
    });
  }
  
  // Prevent form submissions from reloading page
  const forms = document.querySelectorAll('form');
  if (forms.length > 0) {
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
      });
    });
  }
  
  // Set active navigation link
  setActiveNavLink();
  
  // Initialize page-specific features
  initFAQAccordion();
  initFocusModePreview();
  setupLoginForm();
  setupSignupForm();
});

// ============================
// Global Navigation Helper
// ============================
function navigateTo(url) {
  window.location.href = url;
}

window.navigateTo = navigateTo;