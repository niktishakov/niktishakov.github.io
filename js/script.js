// Calculate scrollbar width once when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    // Add click handler for close button
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        const name = document.getElementById('modal-name').value;
        const email = document.getElementById('modal-email').value;
        const projectType = document.getElementById('modal-project-type').value;
        const message = document.getElementById('modal-message').value;

        // Create issue body
        const body = `
### Contact Information
- **Name:** ${name}
- **Email:** ${email}
- **Project Type:** ${projectType}

### Project Details
${message}
        `;

        // GitHub API request
        fetch('https://api.github.com/repos/niktishakov/niktishakov.github.io/issues', {
            method: 'POST',
            headers: {
                'Authorization': `token ${config.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: `Project Inquiry from ${name}`,
                body: body,
                labels: ['project-inquiry']
            })
        })
        .then(response => {
            if (response.ok) {
                closeModal();
                alert('Message sent successfully!');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });

    const menuButton = document.querySelector('.menu-button');
    
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            toggleMenu();
        });
    }
});

function openModal() {
    const modal = document.getElementById('contact-modal');
    modal.style.display = 'block';
    // Small delay to ensure display is set before adding show class
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Match the transition duration
    document.body.classList.remove('modal-open');
}

function submitForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('modal-name').value;
    const email = document.getElementById('modal-email').value;
    const projectType = document.getElementById('modal-project-type').value;
    const message = document.getElementById('modal-message').value;

    // Create issue body
    const body = `
Name: ${name}
Email: ${email}
Project Type: ${projectType}
Message: ${message}
    `;

    // GitHub API request
    fetch('https://api.github.com/repos/niktishakov/niktishakov.github.io/issues', {
        method: 'POST',
        headers: {
            'Authorization': `token ${config.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            title: `Project Inquiry from ${name}`,
            body: body,
            labels: ['project-inquiry']
        })
    })
    .then(response => {
        if (response.ok) {
            closeModal();
            alert('Message sent successfully!');
            e.target.reset();
        } else {
            throw new Error('Failed to send message');
        }
    })
    .catch(error => {
        alert('Error sending message. Please try again.');
    });
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}