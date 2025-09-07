        'use strict';
        
        class SimpleMenuController {
            constructor() {
                this.isOpen = false;
                this.activeMenuItem = null;
                this.init();
            }
            
            init() {
                // Get DOM elements
                this.hamburger = document.getElementById('hamburger');
                this.sidebar = document.getElementById('sidebar');
                this.overlay = document.getElementById('overlay');
                this.closeBtn = document.getElementById('closeBtn');
                this.menuLinks = document.querySelectorAll('.menu-link');
                
                this.setupEventListeners();
                // Tidak set default active menu lagi
            }
            
            setupEventListeners() {
                // Hamburger toggle
                this.hamburger.addEventListener('click', () => {
                    this.toggleSidebar();
                });
                
                // Close button
                this.closeBtn.addEventListener('click', () => {
                    this.closeSidebar();
                });
                
                // Overlay click to close
                this.overlay.addEventListener('click', () => {
                    this.closeSidebar();
                });
                
                // Menu item clicks
                this.menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.handleMenuClick(page, link);

        // buka link di tab baru
        window.open(link.href, '_blank');
    });
});

                // ESC key to close
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.closeSidebar();
                    }
                });
                
                // Close sidebar when clicking outside on mobile
                document.addEventListener('click', (e) => {
                    if (this.isOpen && 
                        !this.sidebar.contains(e.target) && 
                        !this.hamburger.contains(e.target)) {
                        this.closeSidebar();
                    }
                });
            }
            
            toggleSidebar() {
                if (this.isOpen) {
                    this.closeSidebar();
                } else {
                    this.openSidebar();
                }
            }
            
            openSidebar() {
                this.isOpen = true;
                this.sidebar.classList.add('open');
                this.hamburger.classList.add('open');
                this.overlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
            
            closeSidebar() {
                this.isOpen = false;
                this.sidebar.classList.remove('open');
                this.hamburger.classList.remove('open');
                this.overlay.classList.remove('active');
                document.body.style.overflow = 'auto'; // Restore body scroll
            }
            
            setActiveMenu(page) {
                // Remove active class from all menu items
                this.menuLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to selected menu
                const activeLink = document.querySelector(`[data-page="${page}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    this.activeMenuItem = page;
                }
            }
            
            handleMenuClick(page, linkElement) {
                console.log(`Navigating to: ${page}`);
                
                // Set active menu
                this.setActiveMenu(page);
                
                // Show notification
                this.showNotification(`Navigasi ke: ${linkElement.textContent.trim()}`);
                
                // Auto close sidebar on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.closeSidebar();
                    }, 200);
                }
            }
            
            showNotification(message) {
                // Remove existing notification
                const existingNotification = document.querySelector('.notification');
                if (existingNotification) {
                    existingNotification.remove();
                }
                
                // Create new notification
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                // Show notification
                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);
                
                // Hide and remove notification
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }, 2500);
            }
        }
        
        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new SimpleMenuController();
        });
        
        // Add some performance optimizations
        document.addEventListener('DOMContentLoaded', () => {
            // Preload hover states
            const style = document.createElement('style');
            style.textContent = `
                .menu-link:active {
                    transform: scale(0.98);
                }
            `;
            document.head.appendChild(style);
        });