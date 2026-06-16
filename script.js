document.addEventListener('DOMContentLoaded', () => {
  // Update dynamic background gradient based on scroll
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-y', scrollPercent);
  });

  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  if (mobileToggle) {
    const toggleMenu = () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    };

    const closeMenu = () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    };

    mobileToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      });

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        
        formStatus.style.display = 'flex';
        formStatus.className = 'form-status-box form-status-sending';
        formStatus.innerHTML = 'Transmitting inquiry protocol...';
        
        const formData = new FormData(contactForm);
        fetch('https://formsubmit.co/ajax/droneveda1@gmail.com', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          formStatus.className = 'form-status-box form-status-success';
          formStatus.innerHTML = 'Transmission successful. Engineering will review your scope.';
          contactForm.reset();
          submitBtn.disabled = false;
          
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 5000);
        })
        .catch(error => {
          formStatus.className = 'form-status-box';
          formStatus.innerHTML = 'Transmission failed. Try again.';
          formStatus.style.color = 'var(--error-color)';
          submitBtn.disabled = false;
        });
      }
    });
  }

  // Auto-resize and word count for project details textarea
  const projectDetailsTextarea = document.getElementById('projectDetailsTextarea');
  const wordCountDisplay = document.getElementById('wordCount');
  
  if (projectDetailsTextarea && wordCountDisplay) {
    projectDetailsTextarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
      
      const text = this.value.trim();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      wordCountDisplay.textContent = words.length + (words.length === 1 ? ' WORD' : ' WORDS');
    });
  }
});
