document.addEventListener('DOMContentLoaded', function() {
    const tariffBtns = document.querySelectorAll('.tariff-btn');
    const tariffCards = {
        '1': document.getElementById('tariff-1'),
        '6': document.getElementById('tariff-6'),
        '10': document.getElementById('tariff-10')
    };
    
    let isAnimating = false;
    
    function showTariff(tariff) {
        if (isAnimating) return;
        isAnimating = true;
        
        Object.values(tariffCards).forEach(card => {
            if (card && card.classList.contains('active')) {
                card.style.animation = 'cardDisappear 0.4s forwards';
                setTimeout(() => {
                    card.classList.remove('active');
                    card.style.animation = '';
                }, 350);
            }
        });
        
        setTimeout(() => {
            if (tariffCards[tariff]) {
                tariffCards[tariff].classList.add('active');
                tariffCards[tariff].style.animation = 'cardAppear 0.6s forwards';
            }
            isAnimating = false;
        }, 350);
        
        tariffBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.style.transform = '';
        });
        
        const activeBtn = Array.from(tariffBtns).find(btn => btn.dataset.tariff === tariff);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    tariffBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('active')) return;
            showTariff(this.dataset.tariff);
        });
    });
    
    showTariff('6');
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardDisappear {
            0% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);

    function smoothScrollToElement(element, offset = 120) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    function handleHashOnLoad() {
        const activeCard = document.querySelector('.tariff-card.active');
        
        if (activeCard) {
            smoothScrollToElement(activeCard);
        }
    }
    
    function handleAnchorClicks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement && targetElement.classList.contains('tariff-card')) {
                    e.preventDefault();
                    
                    history.pushState(null, null, href);
                    
                    if (!targetElement.classList.contains('active')) {
                        const tariffNumber = href.replace('#tariff-', '');
                        if (tariffNumber && tariffCards[tariffNumber]) {
                            showTariff(tariffNumber);
                        }
                    }
                    
                    smoothScrollToElement(targetElement);
                }
            });
        });
    }
    
    handleHashOnLoad();
    window.addEventListener('hashchange', handleHashOnLoad);
    handleAnchorClicks();
});