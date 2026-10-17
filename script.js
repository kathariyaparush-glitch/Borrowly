/* ==========================================
   BORROWLY INTERACTIVE FRONTEND SCRIPT
   Handles: Navigation, Search, Filters, 
   Modals, Wishlist, and Feedback Toasts.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. STICKY NAVBAR SCROLL EFFECT
       ========================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================
       2. MOBILE NAVIGATION TOGGLE
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    /* ==========================================
       3. SEARCH & CATEGORY FILTERING LOGIC
       ========================================== */
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroCampusSelect = document.getElementById('hero-campus-select');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const searchTags = document.querySelectorAll('.search-tag');
    const pillButtons = document.querySelectorAll('.pill-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const listingCards = document.querySelectorAll('.listings-grid .listing-card');

    // Function to filter listings based on search text and category
    function filterListings(searchTerm = '', selectedCategory = 'all') {
        const term = searchTerm.toLowerCase().trim();

        listingCards.forEach(card => {
            const title = card.querySelector('.listing-title').textContent.toLowerCase();
            const snippet = card.querySelector('.listing-snippet').textContent.toLowerCase();
            const category = card.getAttribute('data-category');

            const matchesSearch = title.includes(term) || snippet.includes(term);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                card.classList.add('animate-on-load');
            } else {
                card.style.display = 'none';
            }
        });

        // Scroll smoothly to explore section if search button was pressed
        const exploreSection = document.getElementById('explore');
        if (exploreSection && searchTerm) {
            exploreSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Hero Search Button Click
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const term = heroSearchInput ? heroSearchInput.value : '';
            const campus = heroCampusSelect ? heroCampusSelect.value : 'all';
            
            // Reset category pills to 'all' when performing custom search
            pillButtons.forEach(btn => btn.classList.remove('active'));
            const allPill = document.querySelector('.pill-btn[data-category="all"]');
            if (allPill) allPill.classList.add('active');

            filterListings(term, 'all');
            showToast(`Searching for "${term || 'all items'}" (${campus} campus)`);
        });
    }

    // Enter key trigger for search input
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                heroSearchBtn.click();
            }
        });
    }

    // Quick Search Tags Click
    searchTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagValue = tag.getAttribute('data-tag');
            if (heroSearchInput) heroSearchInput.value = tagValue;
            filterListings(tagValue, 'all');
            showToast(`Filtered by tag: ${tagValue}`);
        });
    });

    // Category Pill Buttons Filter
    pillButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            pillButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            if (heroSearchInput) heroSearchInput.value = ''; // clear search input
            filterListings('', category);
        });
    });

    // Campus Life Cards Click (Redirects & filters category)
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.getAttribute('data-filter');
            
            // Update pills
            pillButtons.forEach(b => {
                if (b.getAttribute('data-category') === filter) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });

            filterListings('', filter);
            
            const exploreSection = document.getElementById('explore');
            if (exploreSection) {
                exploreSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ==========================================
       4. MOCK DATA FOR ITEM DETAILS MODAL
       ========================================== */
    const itemsData = {
        "1": {
            title: "TI-84 Plus CE Graphing Calculator",
            owner: "Aarav M. • Block 4 (North Campus)",
            rating: "★ 4.9 (18 reviews)",
            price: "Free / 3 days",
            category: "Academics",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            description: "Essential for Calculus and Linear Algebra midterms. Clean, fully charged with fresh lithium-ion battery, and comes with sliding case and USB charging cable.",
            rules: "Must be returned clean and undamaged. Pickup at Block 4 common room."
        },
        "2": {
            title: "Manfrotto Compact Action Tripod",
            owner: "Rhea S. • Hostel C (Main Campus)",
            rating: "★ 5.0 (24 reviews)",
            price: "₹60 / day",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
            description: "Sturdy 5-section aluminum tripod with quick release smartphone clamp and fluid head. Perfect for college fest photography, YouTube videos, and timelapses.",
            rules: "Handle with care. Avoid dusty outdoor shoots without protective sleeve."
        },
        "3": {
            title: "Anker USB-C Multiport HDMI Adapter",
            owner: "Kabir K. • New Hostel (Tech Block)",
            rating: "★ 4.8 (12 reviews)",
            price: "Free / weekend",
            category: "Electronics",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
            description: "Reliable multiport hub featuring 4K HDMI out, 2x high-speed USB 3.0 ports, SD card reader, and 100W Power Delivery pass-through for presentations and laptop setups.",
            rules: "Return in original pouch. Do not pull out by the cable."
        },
        "4": {
            title: "Chemistry Lab Coat (Size M) + Goggles",
            owner: "Sneha P. • Girls Hostel",
            rating: "★ 4.9 (31 reviews)",
            price: "Free / lab session",
            category: "Academics",
            image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
            description: "Freshly laundered 100% heavy cotton lab coat with knee-length cut and two front pockets. Includes ANSI-approved anti-fog safety goggles.",
            rules: "Wash if chemical stains occur before returning."
        },
        "5": {
            title: "JBL Flip 6 Waterproof Bluetooth Speaker",
            owner: "Rohan V. • Block 2",
            rating: "★ 4.7 (45 reviews)",
            price: "₹100 / day",
            category: "Events & Fests",
            image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
            description: "Powerful portable wireless speaker delivering bold JBL Original Pro Sound. IP67 waterproof and dustproof rating for hostel room parties and outdoor club meets.",
            rules: "Do not submerge in salt water. Keep volume moderate past midnight."
        },
        "6": {
            title: "Quechua 40L Trekking & Travel Backpack",
            owner: "Tanvi M. • Block 1",
            rating: "★ 5.0 (15 reviews)",
            price: "₹80 / day",
            category: "Hostel Life",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
            description: "Ergonomic lightweight backpack with padded shoulder straps, waist belt, and multiple compartments. Perfect for weekend getaways and end-semester breaks.",
            rules: "Empty all items and shake clean of dirt before returning."
        }
    };

    /* ==========================================
       5. MODAL MANAGEMENT (Item Details & Auth)
       ========================================== */
    const itemModal = document.getElementById('item-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBodyContent = document.getElementById('modal-body-content');
    
    const authModal = document.getElementById('auth-modal');
    const authModalClose = document.getElementById('auth-modal-close');
    const loginBtn = document.getElementById('login-btn');
    const joinBtn = document.getElementById('join-btn');
    const ctaJoinBtn = document.getElementById('cta-join-btn');
    const authForm = document.getElementById('auth-form');
    const authModalTitle = document.getElementById('auth-modal-title');
    const authModalSubtitle = document.getElementById('auth-modal-subtitle');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitchLink = document.getElementById('auth-switch-link');
    const authSwitchText = document.getElementById('auth-switch-text');

    let isLoginMode = true;

    // Open Item Details Modal
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = btn.getAttribute('data-id');
            const item = itemsData[itemId];

            if (item && itemModal && modalBodyContent) {
                modalBodyContent.innerHTML = `
                    <div class="modal-item-grid">
                        <div>
                            <img src="${item.image}" alt="${item.title}" class="modal-item-img">
                        </div>
                        <div class="modal-item-info">
                            <span class="section-tag">${item.category}</span>
                            <h2>${item.title}</h2>
                            <div class="modal-item-meta">
                                <p><strong>Lender:</strong> ${item.owner}</p>
                                <p><strong>Rating:</strong> ${item.rating}</p>
                            </div>
                            <p class="modal-item-desc">${item.description}</p>
                            <p class="modal-item-desc" style="font-size: 0.85rem; color: var(--charcoal);"><strong>Borrowing Rule:</strong> ${item.rules}</p>
                            
                            <div class="modal-item-footer">
                                <div class="listing-price">
                                    <span class="price-val">${item.price.split('/')[0]}</span>
                                    <span class="price-unit">/ ${item.price.split('/')[1] || 'day'}</span>
                                </div>
                                <button class="btn btn-primary request-borrow-btn" data-title="${item.title}">Request Borrowing</button>
                            </div>
                        </div>
                    </div>
                `;

                // Bind click event to request borrow button inside modal
                const requestBorrowBtn = modalBodyContent.querySelector('.request-borrow-btn');
                if (requestBorrowBtn) {
                    requestBorrowBtn.addEventListener('click', () => {
                        itemModal.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        showToast(`Borrow request sent for "${item.title}"! Owner will contact you.`);
                    });
                }

                itemModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    // Close Item Modal
    if (modalClose && itemModal) {
        modalClose.addEventListener('click', () => {
            itemModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // Open Auth Modal (Log In / Join)
    function openAuthModal(login = true) {
        isLoginMode = login;
        if (authModalTitle && authModalSubtitle && authSubmitBtn) {
            if (isLoginMode) {
                authModalTitle.textContent = "Welcome back to Borrowly";
                authModalSubtitle.textContent = "Enter your college credentials to log in";
                authSubmitBtn.textContent = "Log In";
                authSwitchText.innerHTML = `Don't have an account? <a href="#" id="auth-switch-link">Join Borrowly</a>`;
            } else {
                authModalTitle.textContent = "Join Borrowly";
                authModalSubtitle.textContent = "Create your student account with college email";
                authSubmitBtn.textContent = "Create Account";
                authSwitchText.innerHTML = `Already have an account? <a href="#" id="auth-switch-link">Log In</a>`;
            }
            rebindSwitchLink();
        }
        if (authModal) {
            authModal.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }

    function rebindSwitchLink() {
        const newSwitchLink = document.getElementById('auth-switch-link');
        if (newSwitchLink) {
            newSwitchLink.addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal(!isLoginMode);
            });
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openAuthModal(true));
    }
    if (joinBtn) {
        joinBtn.addEventListener('click', () => openAuthModal(false));
    }
    if (ctaJoinBtn) {
        ctaJoinBtn.addEventListener('click', () => openAuthModal(false));
    }

    // Close Auth Modal
    if (authModalClose && authModal) {
        authModalClose.addEventListener('click', () => {
            authModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // Close Modals on Backdrop Click
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            itemModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Handle Auth Form Submission
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('college-email');
            const email = emailInput ? emailInput.value : '';

            if (email) {
                authModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
                showToast(isLoginMode ? `Welcome back, ${email}!` : `Account created successfully! Verification sent to ${email}`);
                authForm.reset();
            }
        });
    }

    /* ==========================================
       6. WISHLIST TOGGLE INTERACTION
       ========================================== */
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isSaved = btn.classList.toggle('saved');
            btn.textContent = isSaved ? '❤️' : '🤍';
            showToast(isSaved ? 'Added item to your campus wishlist' : 'Removed item from wishlist');
        });
    });

    /* ==========================================
       7. TOAST NOTIFICATION SYSTEM
       ========================================== */
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');

        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('active');

            setTimeout(() => {
                toast.classList.remove('active');
            }, 3500);
        }
    }

    /* ==========================================
       8. SCROLL-TRIGGERED REVEAL ANIMATIONS (IntersectionObserver)
       ========================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-load');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.step-card, .category-card, .listing-card, .story-grid, .safety-grid');
    revealElements.forEach(el => {
        observer.observe(el);
    });

});