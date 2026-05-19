document.addEventListener('DOMContentLoaded', function() {
    loadSiteSettings();
    initNavigation();
    initScrollEffects();
    initContactForm();
    initNewsletterForm();
    initCounters();
    
    // مراقبة التغييرات في localStorage (عندما يقوم الأدمن بالتعديلات)
    window.addEventListener('storage', function(e) {
        if (e.key === 'siteSettingsUpdated' || e.key === 'siteSettings') {
            console.log('تم اكتشاف تغييرات في الإعدادات، جاري التحديث...');
            loadSiteSettings();
        }
    });
});

function loadSiteSettings() {
    console.log('جاري تحميل إعدادات الموقع من localStorage...');
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');

    if (settings.siteName) {
        document.getElementById('logo-text').textContent = settings.siteName;
        document.getElementById('site-title').textContent = settings.siteName + ' - شركة برمجيات';
        document.getElementById('footer-logo').textContent = settings.siteName;
        document.getElementById('footer-copy').innerHTML = '&copy; 2026 ' + settings.siteName + '. جميع الحقوق محفوظة';
    }

    if (settings.heroTitle) {
        document.getElementById('hero-title').textContent = settings.heroTitle;
    }

    if (settings.heroDesc) {
        document.getElementById('hero-desc').textContent = settings.heroDesc;
    }

    if (settings.aboutDesc) {
        document.getElementById('about-desc').textContent = settings.aboutDesc;
    }

    if (settings.heroImage) {
        const heroImg = document.getElementById('hero-img');
        heroImg.src = settings.heroImage;
        heroImg.style.display = 'block';
        document.getElementById('hero-placeholder').style.display = 'none';
    }

    if (settings.logoImage) {
        const logoImg = document.getElementById('logo-img');
        logoImg.src = settings.logoImage;
        logoImg.style.display = 'block';
        document.getElementById('logo-text').style.display = 'none';
    }

    if (settings.aboutImage) {
        const aboutImg = document.getElementById('about-img');
        aboutImg.src = settings.aboutImage;
        aboutImg.style.display = 'block';
        document.getElementById('about-placeholder').style.display = 'none';
    }

    if (settings.colors) {
        const root = document.documentElement;
        const colors = settings.colors;
        if (colors.primary) root.style.setProperty('--primary-color', colors.primary);
        if (colors.secondary) root.style.setProperty('--secondary-color', colors.secondary);
        if (colors.bg) root.style.setProperty('--bg-color', colors.bg);
        if (colors.text) root.style.setProperty('--text-color', colors.text);
        if (colors.card) root.style.setProperty('--card-color', colors.card);
        if (colors.footer) root.style.setProperty('--footer-color', colors.footer);
    }

    if (settings.contact) {
        if (settings.contact.phone) document.getElementById('contact-phone').textContent = settings.contact.phone;
        if (settings.contact.email) document.getElementById('contact-email').textContent = settings.contact.email;
        if (settings.contact.address) document.getElementById('contact-address').textContent = settings.contact.address;
    }

    loadProducts();
    loadPortfolio();
    loadServices();
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const grid = document.getElementById('services-grid');

    if (services.length > 0) {
        grid.innerHTML = '';
        services.forEach(function(service) {
            grid.innerHTML += '<div class="service-card">' +
                '<div class="service-icon"><i class="' + service.icon + '"></i></div>' +
                '<h3>' + service.name + '</h3>' +
                '<p>' + service.desc + '</p>' +
                '</div>';
        });
    }
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const grid = document.getElementById('products-grid');

    if (products.length > 0) {
        grid.innerHTML = '';
        products.forEach(function(product) {
            var imageHtml = product.image
                ? '<img src="' + product.image + '" alt="' + product.name + '">'
                : '<i class="fas fa-box"></i>';

            grid.innerHTML += '<div class="product-card">' +
                '<div class="product-image">' + imageHtml + '</div>' +
                '<div class="product-info">' +
                '<h3>' + product.name + '</h3>' +
                '<p>' + product.desc + '</p>' +
                '<div class="product-price">' + product.price + '</div>' +
                '</div>' +
                '</div>';
        });
    }
}

function loadPortfolio() {
    const portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    const grid = document.getElementById('portfolio-grid');

    if (portfolio.length > 0) {
        grid.innerHTML = '';
        portfolio.forEach(function(item) {
            var imageHtml = item.image
                ? '<img src="' + item.image + '" alt="' + item.name + '">'
                : '<i class="fas fa-briefcase"></i>';

            grid.innerHTML += '<div class="portfolio-card">' +
                '<div class="portfolio-image">' + imageHtml +
                '<div class="portfolio-overlay"><i class="fas fa-eye"></i></div>' +
                '</div>' +
                '<div class="portfolio-info">' +
                '<h3>' + item.name + '</h3>' +
                '<p>' + item.desc + '</p>' +
                '<span class="portfolio-category">' + item.category + '</span>' +
                '</div>' +
                '</div>';
        });
    }
}

function initNavigation() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-links a').forEach(function(l) {
                l.classList.remove('active');
            });
            this.classList.add('active');
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        var scrollY = window.pageYOffset;
        sections.forEach(function(section) {
            var sectionHeight = section.offsetHeight;
            var sectionTop = section.offsetTop - 100;
            var sectionId = section.getAttribute('id');
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href="#' + sectionId + '"]')?.classList.add('active');
            }
        });
    });
}

function initScrollEffects() {
    var scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

function initContactForm() {
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var inputs = form.querySelectorAll('input, textarea');
            var message = {
                name: inputs[0].value,
                email: inputs[1].value,
                subject: inputs[2].value,
                message: inputs[3].value,
                date: new Date().toLocaleDateString('ar-EG')
            };

            var messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.unshift(message);
            localStorage.setItem('messages', JSON.stringify(messages));

            form.reset();
            showToast('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
        });
    }
}

function initNewsletterForm() {
    var form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.reset();
            showToast('تم الاشتراك في النشرة البريدية بنجاح!');
        });
    }
}

function initCounters() {
    var counters = document.querySelectorAll('.stat-number');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var counter = entry.target;
                var target = parseInt(counter.getAttribute('data-target'));
                var duration = 2000;
                var step = target / (duration / 16);
                var current = 0;

                var timer = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 16);

                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

function showToast(message) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#4CAF50;color:white;padding:15px 25px;border-radius:10px;z-index:9999;animation:slideIn 0.3s ease;';
    toast.innerHTML = '<i class="fas fa-check-circle" style="margin-left:10px;"></i>' + message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
