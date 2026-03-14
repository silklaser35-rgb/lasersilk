document.addEventListener('DOMContentLoaded', function () {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00'
        });
    }

    const modal = document.getElementById('discount-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalBookingBtn = document.getElementById('modalBookingBtn');

    if (modal && !sessionStorage.getItem('modalShown')) {
        setTimeout(() => {
            modal.classList.add('show');
            sessionStorage.setItem('modalShown', 'true');
        }, 15000);
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    if (modalBookingBtn) {
        modalBookingBtn.addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.remove('show');

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                setTimeout(() => {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            accordionItems.forEach(i => {
                i.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const priceCategories = document.querySelectorAll('.price-category');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            priceCategories.forEach(category => {
                if (filterValue === 'all') {
                    category.style.display = 'block';
                } else {
                    const categories = category.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        category.style.display = 'block';
                    } else {
                        category.style.display = 'none';
                    }
                }
            });
        });
    });

    window.addEventListener('load', function () {
        const womenFilter = document.querySelector('.filter-btn[data-filter="women"]');
        if (womenFilter) {
            setTimeout(() => {
                womenFilter.click();
            }, 100);
        }
    });

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');

            const activeTab = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        });
    });

    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }

    function initMap() {
        const mapContainer = document.getElementById('yandex-map');
        if (!mapContainer) return;

        const myMap = new ymaps.Map('yandex-map', {
            center: [55.839810, 37.489491],
            zoom: 16,
            controls: ['zoomControl']
        });

        const myPlacemark = new ymaps.Placemark([55.839810, 37.489491], {
            hintContent: 'LaserSilk',
            balloonContent: 'Головинское шоссе, 3, офис 301'
        }, {
            preset: 'islands#goldIcon',
            iconColor: '#D4AF37'
        });

        myMap.geoObjects.add(myPlacemark);
    }

    const appointmentForm = document.getElementById('appointmentForm');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            console.log('Form submitted:', data);

            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправлено!';
            submitButton.disabled = true;

            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);

            this.reset();

            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
            successMessage.style.cssText = `
                background: var(--gold);
                color: white;
                padding: 15px;
                border-radius: var(--border-radius-small);
                text-align: center;
                margin-top: 20px;
            `;

            const oldMessage = this.querySelector('.success-message');
            if (oldMessage) {
                oldMessage.remove();
            }

            this.appendChild(successMessage);

            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.price-card, .abonement-card, .special-card, .package-card');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const diodeCard = document.getElementById('diodeRejuvenation');
    const electroCard = document.getElementById('electroepilation');
    const diodeModal = document.getElementById('diodeModal');
    const electroModal = document.getElementById('electroModal');
    const closeDiode = document.getElementById('closeDiodeModal');
    const closeElectro = document.getElementById('closeElectroModal');

    function disableBodyScroll() {
        document.body.style.overflow = 'hidden';
    }

    function enableBodyScroll() {
        document.body.style.overflow = '';
    }

    if (diodeCard && diodeModal) {
        diodeCard.addEventListener('click', () => {
            diodeModal.classList.add('show');
            disableBodyScroll();
        });
    }

    if (electroCard && electroModal) {
        electroCard.addEventListener('click', () => {
            electroModal.classList.add('show');
            disableBodyScroll();
        });
    }

    if (closeDiode && diodeModal) {
        closeDiode.addEventListener('click', () => {
            diodeModal.classList.remove('show');
            enableBodyScroll();
        });
    }

    if (closeElectro && electroModal) {
        closeElectro.addEventListener('click', () => {
            electroModal.classList.remove('show');
            enableBodyScroll();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === diodeModal) {
            diodeModal.classList.remove('show');
            enableBodyScroll();
        }
        if (e.target === electroModal) {
            electroModal.classList.remove('show');
            enableBodyScroll();
        }
    });

    const modalBookingButtons = document.querySelectorAll('.procedure-modal-content .btn-gold');

    modalBookingButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            diodeModal.classList.remove('show');
            electroModal.classList.remove('show');
            enableBodyScroll();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                setTimeout(() => {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
});