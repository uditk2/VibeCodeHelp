// Application State
let currentUser = null;
let userIssue = null;

// DOM Elements
const sections = {
    landing: document.getElementById('landing'),
    login: document.getElementById('login'),
    issueForm: document.getElementById('issueForm'),
    calendar: document.getElementById('calendar'),
    thankYou: document.getElementById('thankYou')
};

const buttons = {
    getStarted: document.getElementById('getStartedBtn'),
    googleLogin: document.getElementById('googleLoginBtn'),
    home: document.getElementById('homeBtn'),
    logout: document.getElementById('logoutBtn')
};

const userElements = {
    userInfo: document.getElementById('userInfo'),
    userName: document.querySelector('.user-name')
};

const forms = {
    issue: document.getElementById('issueFormElement')
};

// Utility Functions
function showSection(sectionName) {
    Object.values(sections).forEach(section => {
        section.classList.add('hidden');
    });
    sections[sectionName].classList.remove('hidden');
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Google OAuth Setup
// For static sites, you only need CLIENT ID (no client secret required)
// Steps to get Client ID:
// 1. Go to https://console.cloud.google.com/
// 2. Create project → APIs & Services → Credentials
// 3. Create OAuth 2.0 Client ID
// 4. Add your GitHub Pages domain to Authorized JavaScript origins:
//    - https://yourusername.github.io
// 5. Replace 'YOUR_GOOGLE_CLIENT_ID' below with your actual client ID
function initializeGoogleAuth() {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: '694406473742-tookdni6o5i4ddj0m970nb90nmat8v7d.apps.googleusercontent.com', // Replace with actual client ID from Google Cloud Console
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: false
        });
    }
}

// Google Sign-In Handler
function handleGoogleSignIn(response) {
    try {
        // Decode the JWT token (in production, verify this server-side)
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        currentUser = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };

        saveToLocalStorage('user', currentUser);

        // Update UI to show user info
        updateUserInterface();

        // Show issue form after successful login
        showSection('issueForm');

        console.log('User signed in:', currentUser);
    } catch (error) {
        console.error('Error handling Google sign-in:', error);
        alert('Sign-in failed. Please try again.');
    }
}

// Mock Google Sign-In for Demo (remove in production)
function mockGoogleSignIn() {
    currentUser = {
        id: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@example.com',
        picture: 'https://via.placeholder.com/100'
    };

    saveToLocalStorage('user', currentUser);
    updateUserInterface();
    showSection('issueForm');
    console.log('Mock user signed in:', currentUser);
}

// Issue Form Handler
function handleIssueForm(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    userIssue = {
        projectType: formData.get('projectType') || document.getElementById('projectType').value,
        issueType: formData.get('issueType') || document.getElementById('issueType').value,
        description: formData.get('issueDescription') || document.getElementById('issueDescription').value,
        urgency: formData.get('urgency') || document.getElementById('urgency').value,
        submittedAt: new Date().toISOString()
    };

    // Validate form
    if (!userIssue.projectType || !userIssue.issueType || !userIssue.description || !userIssue.urgency) {
        alert('Please fill in all required fields.');
        return;
    }

    saveToLocalStorage('userIssue', userIssue);

    // Show calendar section
    showSection('calendar');
    loadCalendar();

    console.log('Issue form submitted:', userIssue);
}

// Calendar Integration
function loadCalendar() {
    const calEmbed = document.querySelector('.cal-embed');

    // Create Cal.com embed
    const iframe = document.createElement('iframe');
    iframe.src = 'https://cal.com/udit-khandelwal-mpzber/vibecodehelp';
    iframe.width = '100%';
    iframe.height = '600';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';

    // Add prefill data if available
    if (currentUser && userIssue) {
        const prefillData = {
            name: currentUser.name,
            email: currentUser.email,
            notes: `Project Type: ${userIssue.projectType}\nIssue Type: ${userIssue.issueType}\nUrgency: ${userIssue.urgency}\n\nDescription: ${userIssue.description}`
        };

        // Add prefill parameters to iframe src
        const urlParams = new URLSearchParams(prefillData);
        iframe.src += '?' + urlParams.toString();
    }

    calEmbed.innerHTML = '';
    calEmbed.appendChild(iframe);

    // Listen for booking completion (Cal.com postMessage)
    window.addEventListener('message', handleCalMessage, false);
}

// Handle Cal.com messages
function handleCalMessage(event) {
    if (event.origin !== 'https://cal.com') {
        return;
    }

    if (event.data.type === 'booking-confirmed' || event.data === 'cal:booking_successful') {
        // Booking was successful
        console.log('Booking confirmed!');
        showSection('thankYou');

        // Save booking confirmation
        const bookingData = {
            confirmedAt: new Date().toISOString(),
            user: currentUser,
            issue: userIssue,
            eventData: event.data
        };
        saveToLocalStorage('bookingConfirmation', bookingData);

        // Send confirmation email or additional processing here
        sendBookingConfirmation(bookingData);
    }
}

// Send booking confirmation (mock implementation)
function sendBookingConfirmation(bookingData) {
    // In a real implementation, this would send data to your backend
    console.log('Sending booking confirmation:', bookingData);

    // You could integrate with:
    // - Email service (SendGrid, Mailgun, etc.)
    // - Webhook to your backend
    // - Analytics tracking
    // - CRM integration
}

// Navigation Functions
function goHome() {
    showSection('landing');
    currentUser = null;
    userIssue = null;
    localStorage.clear();
    updateUserInterface();
}

// Logout Function
function logout() {
    // Clear user data
    currentUser = null;
    userIssue = null;

    // Clear localStorage
    localStorage.clear();

    // Return to landing page
    showSection('landing');

    // Update UI
    updateUserInterface();

    // Sign out from Google if signed in
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }

    console.log('User logged out successfully');
    trackEvent('user_logout', { method: 'manual' });
}

// Update User Interface based on authentication state
function updateUserInterface() {
    if (currentUser && userElements.userInfo && userElements.userName) {
        // User is logged in - show user info and logout button
        userElements.userInfo.classList.remove('hidden');
        userElements.userName.textContent = currentUser.name;
    } else if (userElements.userInfo) {
        // User is not logged in - hide user info
        userElements.userInfo.classList.add('hidden');
    }
}

// Check for existing session
function checkExistingSession() {
    const savedUser = getFromLocalStorage('user');
    const savedIssue = getFromLocalStorage('userIssue');
    const savedBooking = getFromLocalStorage('bookingConfirmation');

    if (savedBooking) {
        // User has already completed booking
        currentUser = savedUser;
        userIssue = savedIssue;
        updateUserInterface();
        showSection('thankYou');
    } else if (savedUser && savedIssue) {
        // User was in the middle of booking
        currentUser = savedUser;
        userIssue = savedIssue;
        updateUserInterface();
        showSection('calendar');
        loadCalendar();
    } else if (savedUser) {
        // User was logged in but didn't complete issue form
        currentUser = savedUser;
        updateUserInterface();
        showSection('issueForm');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Auth (will work when client ID is configured)
    setTimeout(initializeGoogleAuth, 1000);

    // Check for existing session
    checkExistingSession();

    // Get Started button
    if (buttons.getStarted) {
        buttons.getStarted.addEventListener('click', function() {
            showSection('login');
        });
    }

    // Google Login button (with fallback to mock for demo)
    if (buttons.googleLogin) {
        buttons.googleLogin.addEventListener('click', function() {
            if (typeof google !== 'undefined' && google.accounts) {
                google.accounts.id.prompt();
            } else {
                // Fallback to mock sign-in for demo purposes
                console.log('Google Auth not available, using mock sign-in for demo');
                mockGoogleSignIn();
            }
        });
    }

    // Issue form
    if (forms.issue) {
        forms.issue.addEventListener('submit', handleIssueForm);
    }

    // Home button
    if (buttons.home) {
        buttons.home.addEventListener('click', goHome);
    }

    // Logout button
    if (buttons.logout) {
        buttons.logout.addEventListener('click', logout);
    }
});

// Additional Features

// Smooth scrolling for better UX (currently unused but available for future features)
// function smoothScrollTo(element) {
//     element.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//     });
// }

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    });

    return isValid;
}

// Analytics tracking (integrate with your preferred analytics service)
function trackEvent(eventName, eventData) {
    console.log('Tracking event:', eventName, eventData);

    // Example integrations:
    // gtag('event', eventName, eventData);
    // analytics.track(eventName, eventData);
    // mixpanel.track(eventName, eventData);
}

// Track user interactions
document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.id === 'getStartedBtn') {
        trackEvent('cta_clicked', { button: 'get_started' });
    } else if (target.id === 'googleLoginBtn') {
        trackEvent('login_attempted', { method: 'google' });
    } else if (target.type === 'submit') {
        trackEvent('form_submitted', { form: 'issue_form' });
    }
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    // In production, send errors to your error tracking service
});

// Performance monitoring
window.addEventListener('load', function() {
    if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
            const loadTime = navigationEntries[0].loadEventEnd - navigationEntries[0].fetchStart;
            console.log('Page load time:', loadTime + 'ms');
            trackEvent('page_load', { load_time: loadTime });
        }
    }
});

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        handleIssueForm,
        validateEmail,
        validateForm
    };
}