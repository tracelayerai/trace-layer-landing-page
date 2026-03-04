// Senior Dev Polish: Performance & Accessibility Optimized
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    const body = document.body;
    let isHeaderScrolled = false;

    // 1. Throttled Scroll Management
    const handleScroll = () => {
        const scrolled = window.scrollY > scrollThreshold;
        if (scrolled !== isHeaderScrolled) {
            isHeaderScrolled = scrolled;
            header?.classList.toggle('scrolled', isHeaderScrolled);
        }

        // Back to top visibility
        const btt = document.getElementById('backToTop');
        if (btt) {
            btt.classList.toggle('visible', window.scrollY > 500);
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 2. Mobile Menu Navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        const toggleMenu = (open) => {
            const shouldOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', shouldOpen);
            mobileToggle.classList.toggle('active', shouldOpen);
            body.style.overflow = shouldOpen ? 'hidden' : '';
            mobileToggle.setAttribute('aria-expanded', shouldOpen);
        };

        mobileToggle.addEventListener('click', () => toggleMenu());
        navLinks.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    // 3. Optimized Animation Observer
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateNodes = '.glass, .display-xl, .display-l, h3, .feature-card, .partner-card, .testimonial-card, .impact-card, .report-mockup, .company-grid';
    document.querySelectorAll(animateNodes).forEach(el => observer.observe(el));

    // 4. Robust Modal System
    const modalOverlay = document.getElementById('modalOverlay');
    const openModal = (type) => {
        if (!modalOverlay) return;
        modalOverlay.querySelectorAll('.modal-content-item').forEach(item => {
            item.classList.toggle('active', item.id === `${type}Content`);
        });
        modalOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay?.classList.remove('active');
        body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-trigger]');
        if (trigger) {
            e.preventDefault();
            openModal(trigger.getAttribute('data-modal-trigger'));
        }
        if (e.target === modalOverlay || e.target.closest('#modalClose')) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
    });

    // 5. Responsive Testimonials Carousel
    const initCarousel = () => {
        const track = document.getElementById('testimonialsTrack');
        const dotsContainer = document.getElementById('carouselDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const total = cards.length;
        const isMobile = window.innerWidth <= 768;
        const perPage = isMobile ? 1 : 3;
        const pages = Math.ceil(total / perPage);
        let current = 0;

        track.style.transform = '';
        cards.forEach(card => card.style.display = '');

        const goTo = (page) => {
            current = Math.max(0, Math.min(page, pages - 1));
            if (isMobile) {
                track.style.transform = `translateX(-${current * 100}%)`;
            } else {
                cards.forEach((card, idx) => {
                    card.style.display = Math.floor(idx / perPage) === current ? '' : 'none';
                });
            }
            dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
            prevBtn.style.opacity = current === 0 ? '0.3' : '1';
            nextBtn.style.opacity = current === pages - 1 ? '0.3' : '1';
        };

        dotsContainer.innerHTML = '';
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to page ${i + 1}`);
            dot.onclick = () => goTo(i);
            dotsContainer.appendChild(dot);
        }

        prevBtn.onclick = () => { if (current > 0) goTo(current - 1); };
        nextBtn.onclick = () => { if (current < pages - 1) goTo(current + 1); };
        goTo(0);
    };

    initCarousel();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initCarousel, 250);
    });

    // Back to top button
    const btt = document.getElementById('backToTop');
    btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    //  EmailJS Form Handling 
  emailjs.init("MbaMISbKohov2T2Fc");

    function handleFormSubmit(form, submitBtn) {
        const originalText = submitBtn.textContent;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const templateParams = {
                from_name:        form.querySelector('input[placeholder="Jane Smith"]')?.value || "",
                from_email:       form.querySelector('input[type="email"]')?.value || "",
                company:          form.querySelector('input[placeholder="Acme Corp"]')?.value || "",
                role:             form.querySelector('input[placeholder="Head of Compliance"]')?.value || "",
                institution_type: form.querySelectorAll("select")[0]?.value || "",
                use_case:         form.querySelectorAll("select")[1]?.value || "",
                message:          form.querySelector("textarea")?.value || "(no message)",
            };

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            emailjs.send("service_c0tpwhk", "template_qz3o3sn", templateParams)
                .then(function () {
                    submitBtn.textContent = "✅ Sent Successfully!";
                    submitBtn.style.background = "#22c55e";
                    form.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = "";
                        submitBtn.disabled = false;
                    }, 3000);
                })
               .catch((error) => {
                    console.error("EmailJS error:", error);
                    submitBtn.textContent = "❌ Failed Try Again.";
                    submitBtn.style.background = "#ef4444";
                    submitBtn.disabled = false;
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = "";
                    }, 3000);
                });
        });
    }


    // Attach to both modal forms
    const demoForm  = document.querySelector("#demoContent .institutional-form");
    const demoBtn   = demoForm?.querySelector(".form-submit");
    if (demoForm && demoBtn) handleFormSubmit(demoForm, demoBtn);

    const salesForm = document.querySelector("#salesContent .institutional-form");
    const salesBtn  = salesForm?.querySelector(".form-submit");
    if (salesForm && salesBtn) handleFormSubmit(salesForm, salesBtn);
});