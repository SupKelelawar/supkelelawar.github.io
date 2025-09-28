const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');

const animationConfig = {
    duration: 280,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fps: 60
};

let isAnimating = false;
let currentFrame = null;

function easeOutExpo(t) {
    return t === 1?1: 1-Math.pow(2, -10*t);
}
function easeInOutCubic(t) {
    return t < 0.5?4*t*t*t: (t-1)*(2*t-2)*(2*t-2)+1;
}

function animateSidebar(isOpening) {
    if (isAnimating) {
        if (currentFrame) cancelAnimationFrame(currentFrame);
    }
    isAnimating = true;
    const startTime = performance.now();
    const startTransform = isOpening?-260: 0;
    const endTransform = isOpening?0: -260;
    const transformDistance = endTransform-startTransform;
    function animate(currentTime) {
        const elapsed = currentTime-startTime;
        const progress = Math.min(elapsed/animationConfig.duration, 1);
        const easedProgress = easeInOutCubic(progress);
        const currentTransform = startTransform+(transformDistance*easedProgress);
        sidebar.style.transform = `translate3d(${currentTransform}px,0,0)`;
        const overlayOpacity = isOpening?easedProgress: 1-easedProgress;
        overlay.style.opacity = overlayOpacity;
        if (progress < 1) {
            currentFrame = requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            currentFrame = null;
            if (isOpening) {
                sidebar.classList.add('open');
                overlay.classList.add('active');
            } else {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                overlay.style.visibility = 'hidden';
            }
        }
    }
    currentFrame = requestAnimationFrame(animate);
}

function animateHamburger(isOpening) {
    const spans = hamburger.querySelectorAll('span');
    const duration = 200;
    const startTime = performance.now();
    function animateHam(currentTime) {
        const elapsed = currentTime-startTime;
        const progress = Math.min(elapsed/duration, 1);
        const easedProgress = easeOutExpo(progress);
        if (isOpening) {
            spans[0].style.transform = `rotate(${45*easedProgress}deg) translate(${4*easedProgress}px,${4*easedProgress}px)`;
            spans[1].style.opacity = 1-easedProgress;
            spans[2].style.transform = `rotate(${-45*easedProgress}deg) translate(${4*easedProgress}px,${-4*easedProgress}px)`;
        } else {
            spans[0].style.transform = `rotate(${45*(1-easedProgress)}deg) translate(${4*(1-easedProgress)}px,${4*(1-easedProgress)}px)`;
            spans[1].style.opacity = easedProgress;
            spans[2].style.transform = `rotate(${-45*(1-easedProgress)}deg) translate(${4*(1-easedProgress)}px,${-4*(1-easedProgress)}px)`;
        }
        if (progress < 1) requestAnimationFrame(animateHam);
    }
    requestAnimationFrame(animateHam);
}

function toggleSidebar() {
    if (isAnimating) return;
    const isOpening = !sidebar.classList.contains('open');
    if (isOpening) {
        overlay.style.visibility = 'visible';
        document.body.classList.add('sidebar-open');
        hamburger.classList.add('open');
        hamburger.style.display = 'none';
    } else {
        document.body.classList.remove('sidebar-open');
        hamburger.classList.remove('open');
        hamburger.style.display = 'flex';
    }
    animateSidebar(isOpening);
    animateHamburger(isOpening);
}

hamburger.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            setTimeout(()=>toggleSidebar(), 150);
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        toggleSidebar();
    }
});

sidebar.addEventListener('wheel', function(e) {
    e.stopPropagation();
    const isAtTop = sidebar.scrollTop === 0;
    const isAtBottom = sidebar.scrollTop+sidebar.clientHeight >= sidebar.scrollHeight;
    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) e.preventDefault();
}, {
    passive: false
});

let startY;
sidebar.addEventListener('touchstart', function(e) {
    startY = e.touches[0].clientY;
}, {
    passive: true
});
sidebar.addEventListener('touchmove', function(e) {
    e.stopPropagation();
    const currentY = e.touches[0].clientY;
    const isScrollingUp = currentY > startY;
    const isScrollingDown = currentY < startY;
    const isAtTop = sidebar.scrollTop === 0;
    const isAtBottom = sidebar.scrollTop+sidebar.clientHeight >= sidebar.scrollHeight;
    if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) e.preventDefault();
}, {
    passive: false
});

document.documentElement.style.scrollBehavior = 'smooth';

window.addEventListener('load', function() {
    const images = ['gambar/ua.png',
        'gambar/ua1.png',
        'gambar/c0.png',
        'gambar/dd.png',
        'gambar/ee.png'];
    let loadedCount = 0;
    images.forEach(src => {
        const img = new Image();
        img.onload = ()=> {
            loadedCount++;
            if (loadedCount === images.length) sidebar.classList.add('css-transition');
        };
        img.src = src;
    });
});

window.addEventListener('resize', function() {
    if (sidebar.classList.contains('open') && window.innerWidth > 768) return;
});