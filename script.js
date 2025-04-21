/* script.js */
document.addEventListener("DOMContentLoaded", function() {
    function update3DEffects() {
        const windowHeight = window.innerHeight;

        document.querySelectorAll('.scroll-3d').forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top < windowHeight * 0.9 && rect.bottom > 0;
            
            if (isInView) {
                element.classList.add('in-view');
            } else {
                element.classList.remove('in-view');
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    const debouncedUpdate = debounce(update3DEffects, 50);

    window.addEventListener('scroll', debouncedUpdate);
    window.addEventListener('resize', debouncedUpdate);
    update3DEffects();

    if (window.innerWidth > 768) {
        const tiltElements = document.querySelectorAll('.btn, .step, .benefit, .faq-item');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });
        });
    }
});