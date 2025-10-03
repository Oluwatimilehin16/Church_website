// Global intervals storage for cleanup
const intervals = {
    heroSlide: null,
    leadership: null,
    testimonials: null,
    gallery: null,
    ministries: null,
    sermon: null
};

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('hide');
    }, 1500);
});

// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (!nav.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
    }
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hero Slideshow - FIXED
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Clear existing interval and create new one
if (intervals.heroSlide) clearInterval(intervals.heroSlide);
intervals.heroSlide = setInterval(nextSlide, 5000);

let currentEventPage = 1;
const eventsGrid = document.getElementById('eventsGrid');
const eventCards = document.querySelectorAll('.event-card-new');

function getEventsPerPage() {
    return window.innerWidth <= 768 ? 1 : 3;
}

function getTotalEventPages() {
    return Math.ceil(eventCards.length / getEventsPerPage());
}

function updateEventsDisplay() {
    const isMobile = window.innerWidth <= 768;
    const eventsPerPage = getEventsPerPage();
    const totalPages = getTotalEventPages();
    
    if (currentEventPage > totalPages) {
        currentEventPage = 1;
    }
    
    if (isMobile) {
        eventCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentEventPage - 1) {
                card.classList.add('active');
            }
        });
    } else {
        const startIndex = (currentEventPage - 1) * eventsPerPage;
        const endIndex = startIndex + eventsPerPage;
        
        eventCards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'flex' : 'none';
        });
    }
    
    const currentPageEl = document.getElementById('currentEventPage');
    const totalPagesEl = document.getElementById('totalEventPages');
    if (currentPageEl) currentPageEl.textContent = currentEventPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
}

function moveEvents(direction) {
    const totalPages = getTotalEventPages();
    
    if (direction === 'next' && currentEventPage < totalPages) {
        currentEventPage++;
    } else if (direction === 'prev' && currentEventPage > 1) {
        currentEventPage--;
    }
    updateEventsDisplay();
}

// Auto-advance events on mobile
let eventsAutoInterval;
function startEventsAuto() {
    if (eventsAutoInterval) clearInterval(eventsAutoInterval);
    
    if (window.innerWidth <= 768 && eventCards.length > 0) {
        eventsAutoInterval = setInterval(() => {
            const totalPages = getTotalEventPages();
            if (currentEventPage >= totalPages) {
                currentEventPage = 1;
            } else {
                currentEventPage++;
            }
            updateEventsDisplay();
        }, 5000);
    }
}

function stopEventsAuto() {
    if (eventsAutoInterval) {
        clearInterval(eventsAutoInterval);
        eventsAutoInterval = null;
    }
}
// Leadership Slider - FIXED
let currentLeaderSlide = 1;
const leaderSlides = document.querySelectorAll('.leader-slide');
const leaderDots = document.querySelectorAll('.slider-dots .dot');

function goToSlide(slideNumber) {
    leaderSlides.forEach(slide => slide.classList.remove('active'));
    leaderDots.forEach(dot => dot.classList.remove('active'));
    
    currentLeaderSlide = slideNumber;
    if (leaderSlides[slideNumber - 1]) {
        leaderSlides[slideNumber - 1].classList.add('active');
    }
    if (leaderDots[slideNumber - 1]) {
        leaderDots[slideNumber - 1].classList.add('active');
    }
}

// Clear and restart leadership auto-rotate
if (intervals.leadership) clearInterval(intervals.leadership);
if (leaderSlides.length > 0) {
    intervals.leadership = setInterval(() => {
        const nextSlide = currentLeaderSlide === leaderSlides.length ? 1 : currentLeaderSlide + 1;
        goToSlide(nextSlide);
    }, 8000);
}

// Gallery Pagination - FIXED
let currentGalleryPage = 1;
const galleryGrid = document.getElementById('galleryGrid');
const galleryItems = document.querySelectorAll('.gallery-item');

function getGalleryItemsPerPage() {
    return window.innerWidth <= 768 ? 1 : 4;
}

function getTotalGalleryPages() {
    return Math.ceil(galleryItems.length / getGalleryItemsPerPage());
}

function updateGalleryDisplay() {
    const isMobile = window.innerWidth <= 768;
    const itemsPerPage = getGalleryItemsPerPage();
    const totalPages = getTotalGalleryPages();
    
    // Reset to page 1 if current page exceeds new total
    if (currentGalleryPage > totalPages) {
        currentGalleryPage = 1;
    }
    
    if (isMobile) {
        galleryItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentGalleryPage - 1) {
                item.classList.add('active');
            }
        });
    } else {
        const startIndex = (currentGalleryPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        galleryItems.forEach((item, index) => {
            item.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });
    }
    
    const currentPageEl = document.getElementById('currentGalleryPage');
    const totalPagesEl = document.getElementById('totalGalleryPages');
    if (currentPageEl) currentPageEl.textContent = currentGalleryPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
}

function moveGallery(direction) {
    const totalPages = getTotalGalleryPages();
    
    if (direction === 'next' && currentGalleryPage < totalPages) {
        currentGalleryPage++;
    } else if (direction === 'prev' && currentGalleryPage > 1) {
        currentGalleryPage--;
    }
    updateGalleryDisplay();
}

// Gallery auto-advance - FIXED
function startGalleryAuto() {
    if (intervals.gallery) clearInterval(intervals.gallery);
    
    if (window.innerWidth <= 768 && galleryItems.length > 0) {
        intervals.gallery = setInterval(() => {
            const totalPages = getTotalGalleryPages();
            if (currentGalleryPage >= totalPages) {
                currentGalleryPage = 1;
            } else {
                currentGalleryPage++;
            }
            updateGalleryDisplay();
        }, 4000);
    }
}

function stopGalleryAuto() {
    if (intervals.gallery) {
        clearInterval(intervals.gallery);
        intervals.gallery = null;
    }
}
function startMinistriesAuto() {
    if (intervals.ministries) clearInterval(intervals.ministries);
    
    if (window.innerWidth <= 768 && ministryCards.length > 0) {
        intervals.ministries = setInterval(() => {
            moveMinistry('next');
        }, 5000);
    }
}

function stopMinistriesAuto() {
    if (intervals.ministries) {
        clearInterval(intervals.ministries);
        intervals.ministries = null;
    }
}

// Ministries Carousel - FIXED
let currentMinistryIndex = 0;
const ministryCards = document.querySelectorAll('.ministry-card');

function updateMinistriesDisplay() {
    if (window.innerWidth <= 768 && ministryCards.length > 0) {
        ministryCards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentMinistryIndex) {
                card.classList.add('active');
            }
        });
    } else {
        ministryCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'block';
        });
    }
}

function moveMinistry(direction) {
    if (window.innerWidth <= 768 && ministryCards.length > 0) {
        if (direction === 'next') {
            currentMinistryIndex = (currentMinistryIndex + 1) % ministryCards.length;
        } else {
            currentMinistryIndex = currentMinistryIndex === 0 ? ministryCards.length - 1 : currentMinistryIndex - 1;
        }
        updateMinistriesDisplay();
    }
}

// Sermon Carousel - NEW
let currentSermonIndex = 0;
const sermonCards = document.querySelectorAll('.sermon-card');

function updateSermonDisplay() {
    if (window.innerWidth <= 768 && sermonCards.length > 0) {
        sermonCards.forEach((card, index) => {
            if (index === currentSermonIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    } else {
        // Desktop: show all, remove active class
        sermonCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'block';
        });
    }
}

function moveSermon(direction) {
    if (window.innerWidth <= 768 && sermonCards.length > 0) {
        if (direction === 'next') {
            currentSermonIndex = (currentSermonIndex + 1) % sermonCards.length;
        } else {
            currentSermonIndex = currentSermonIndex === 0 ? sermonCards.length - 1 : currentSermonIndex - 1;
        }
        updateSermonDisplay();
    }
}
function startSermonAuto() {
    if (intervals.sermon) clearInterval(intervals.sermon);
    
    if (window.innerWidth <= 768 && sermonCards.length > 0) {
        intervals.sermon = setInterval(() => {
            moveSermon('next');
        }, 5000);
    }
}

function stopSermonAuto() {
    if (intervals.sermon) {
        clearInterval(intervals.sermon);
        intervals.sermon = null;
    }
}

// Testimonials Carousel - NEW
let currentTestimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function updateTestimonialDisplay() {
    if (window.innerWidth <= 768 && testimonialCards.length > 0) {
        testimonialCards.forEach((card, index) => {
            if (index === currentTestimonialIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    } else {
        // Desktop: show all, remove active class
        testimonialCards.forEach(card => {
            card.classList.remove('active');
            card.style.display = 'block';
        });
    }
}
function moveTestimonialCarousel(direction) {
    if (window.innerWidth <= 768 && testimonialCards.length > 0) {
        if (direction === 'next') {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
        } else {
            currentTestimonialIndex = currentTestimonialIndex === 0 ? testimonialCards.length - 1 : currentTestimonialIndex - 1;
        }
        updateTestimonialDisplay();
    }
}

// Touch swipe support - IMPROVED
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe(element, onSwipeLeft, onSwipeRight) {
    if (!element) return;
    
    const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (diff < -50) onSwipeLeft();
        if (diff > 50) onSwipeRight();
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// Apply swipe handlers
const ministriesSection = document.querySelector('.ministries-grid');
if (ministriesSection) {
    handleSwipe(
        ministriesSection,
        () => moveMinistry('next'),
        () => moveMinistry('prev')
    );
}

const sermonSection = document.querySelector('.sermon-grid');
if (sermonSection) {
    handleSwipe(
        sermonSection,
        () => moveSermon('next'),
        () => moveSermon('prev')
    );
}

const testimonialSection = document.querySelector('.testimonials-grid');
if (testimonialSection) {
    handleSwipe(
        testimonialSection,
        () => moveTestimonialCarousel('next'),
        () => moveTestimonialCarousel('prev')
    );
}

if (galleryGrid) {
    handleSwipe(
        galleryGrid,
        () => {
            stopGalleryAuto();
            moveGallery('next');
            setTimeout(startGalleryAuto, 10000);
        },
        () => {
            stopGalleryAuto();
            moveGallery('prev');
            setTimeout(startGalleryAuto, 10000);
        }
    );
}

if (eventsGrid) {
    handleSwipe(
        eventsGrid,
        () => {
            stopEventsAuto();
            moveEvents('next');
            setTimeout(startEventsAuto, 10000);
        },
        () => {
            stopEventsAuto();
            moveEvents('prev');
            setTimeout(startEventsAuto, 10000);
        }
    );
}
// Counter Animation - SINGLE FIXED IMPLEMENTATION
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

// Intersection Observer - OPTIMIZED
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
            
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

const statsSection = document.querySelector('.stats');
if (statsSection) observer.observe(statsSection);

// Video Player
function playVideo() {
    const overlay = document.querySelector('.video-overlay');
    const iframe = document.getElementById('sermon-video');
    
    if (overlay && iframe) {
        overlay.classList.add('hidden');
        const src = iframe.src;
        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
    }
}

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 100;
            const offsetPosition = target.offsetTop - headerOffset;
            
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            
            document.querySelector('.nav-menu')?.classList.remove('active');
            document.querySelector('.menu-toggle')?.classList.remove('active');
        }
    });
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input && input.value) {
            alert('Thank you for subscribing! You will receive our weekly newsletter.');
            input.value = '';
        }
    });
}

// Live Badge Click Handler
const liveBadge = document.querySelector('.live-badge');
if (liveBadge) {
    liveBadge.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Live stream will start here. Connect your YouTube Live or streaming platform.');
    });
}

// Sermon Card Actions
document.querySelectorAll('.sermon-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.textContent.includes('Listen') ? 'play' : 'download';
    });
});

// Sermon Card Click (Full Card)
document.querySelectorAll('.sermon-card').forEach(card => {
    card.addEventListener('click', () => {
    });
});

// Directions Button
const directionsBtn = document.querySelector('.directions-btn');
if (directionsBtn) {
    directionsBtn.addEventListener('click', () => {
        const address = 'Groene Tuin 353, 3078 KG Rotterdam, Netherlands';
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    });
}

// Event Cards Hover Effect Enhancement
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax Effect on Scroll - OPTIMIZED
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero content
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled * 0.002);
            }
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// Add entrance animations to elements as they scroll into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.event-card, .ministry-card, .stat-item, .gallery-item');
    
    elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && element.style.opacity === '0') {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
};

// Initial setup for animated elements
document.querySelectorAll('.event-card, .ministry-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s ease-out';
});

window.addEventListener('scroll', animateOnScroll);

// Resize Handler - DEBOUNCED
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        currentEventIndex = 0;
        if (eventSlider) eventSlider.style.transform = 'translateX(0)';
        
        updateSermonDisplay();
        updateGalleryDisplay();
        updateMinistriesDisplay();
        updateTestimonialDisplay();
        
        stopEventsAuto();
        stopGalleryAuto();
        stopMinistriesAuto();
        stopSermonAuto();
        startGalleryAuto();
        startMinistriesAuto();
        startSermonAuto();
        startEventsAuto();

    }, 250);
});

// Easter egg: Keyboard shortcut for quick navigation
document.addEventListener('keydown', (e) => {
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        if (!e.target.matches('input, textarea')) {
            scrollToTop();
        }
    }
});

// Dynamic year in footer
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} Christ Ambassadors Ministries. All Rights Reserved.`;
}

window.addEventListener('load', () => {
    updateEventsDisplay();
    updateGalleryDisplay();
    updateMinistriesDisplay();
    updateSermonDisplay();           
    updateTestimonialDisplay();
    startEventsAuto();
    startGalleryAuto();
    startMinistriesAuto();
    startSermonAuto();             
    animateOnScroll();
    
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});
if (eventsGrid) {
    handleSwipe(
        eventsGrid,
        () => {
            stopEventsAuto();
            moveEvents('next');
            setTimeout(startEventsAuto, 10000);
        },
        () => {
            stopEventsAuto();
            moveEvents('prev');
            setTimeout(startEventsAuto, 10000);
        }
    );
}
// Service Worker Registration (PWA capabilities - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    Object.values(intervals).forEach(interval => {
        if (interval) clearInterval(interval);
    });
});