var currentHeroImage = null;
var currentLogoImage = null;
var currentAboutImage = null;
var uploadedFiles = [];

document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    initLogin();
    initNavigation();
    initUploads();
    initColorPickers();
    loadAdminData();
});

function checkLogin() {
    var isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-container').style.display = 'flex';
    }
}

function initLogin() {
    var loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        if (username === 'apdoo' && password === '01147497465') {
            sessionStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('admin-container').style.display = 'flex';
            loadAdminData();
            showToast('تم تسجيل الدخول بنجاح');
        } else {
            showToast('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    });
}

function initNavigation() {
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            var tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
    });
    var activeNav = document.querySelector('[data-tab="' + tabName + '"]');
    if (activeNav) activeNav.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });
    var activeTab = document.getElementById('tab-' + tabName);
    if (activeTab) activeTab.classList.add('active');

    var titles = {
        dashboard: 'الرئيسية',
        general: 'الإعدادات العامة',
        colors: 'الألوان',
        hero: 'صورة الهيرو',
        logo: 'الشعار',
        services: 'الخدمات',
        products: 'المنتجات',
        portfolio: 'الأعمال',
        about: 'من نحن',
        contact: 'معلومات التواصل',
        files: 'رفع الملفات',
        messages: 'الرسائل'
    };
    var pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = titles[tabName] || '';
}

function initUploads() {
    setupUpload('hero-upload-area', 'hero-image-input', function(file) {
        readFile(file, function(dataUrl) {
            currentHeroImage = dataUrl;
            document.getElementById('hero-preview').innerHTML = '<img src="' + dataUrl + '" alt="Preview">';
        });
    });

    setupUpload('logo-upload-area', 'logo-image-input', function(file) {
        readFile(file, function(dataUrl) {
            currentLogoImage = dataUrl;
            document.getElementById('logo-preview').innerHTML = '<img src="' + dataUrl + '" alt="Preview">';
        });
    });

    setupUpload('about-upload-area', 'about-image-input', function(file) {
        readFile(file, function(dataUrl) {
            currentAboutImage = dataUrl;
            document.getElementById('about-preview').innerHTML = '<img src="' + dataUrl + '" alt="Preview">';
        });
    });

    setupUpload('files-upload-area', 'files-input', function(file) {
        readFile(file, function(dataUrl) {
            uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            uploadedFiles.push({
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                data: dataUrl
            });
            try {
                localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
            } catch(e) {
                console.warn('localStorage full, file not saved permanently');
            }
            renderFilesList();
        });
    });
}

function setupUpload(areaId, inputId, callback) {
    var area = document.getElementById(areaId);
    var input = document.getElementById(inputId);

    area.addEventListener('click', function() {
        input.click();
    });

    input.addEventListener('change', function() {
        if (this.files.length > 0) {
            callback(this.files[0]);
        }
    });

    area.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--admin-primary)';
        this.style.background = 'rgba(108, 99, 255, 0.1)';
    });

    area.addEventListener('dragleave', function() {
        this.style.borderColor = 'var(--admin-border)';
        this.style.background = '';
    });

    area.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--admin-border)';
        this.style.background = '';
        if (e.dataTransfer.files.length > 0) {
            callback(e.dataTransfer.files[0]);
        }
    });
}

function readFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function initColorPickers() {
    var colorIds = ['primary-color', 'secondary-color', 'bg-color', 'text-color', 'card-color', 'footer-color'];
    colorIds.forEach(function(id) {
        var input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                document.getElementById(id + '-value').textContent = this.value;
            });
        }
    });
}

function loadAdminData() {
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');

    if (settings.siteName) document.getElementById('site-name').value = settings.siteName;
    if (settings.heroTitle) document.getElementById('hero-title-input').value = settings.heroTitle;
    if (settings.heroDesc) document.getElementById('hero-desc-input').value = settings.heroDesc;
    if (settings.aboutDesc) document.getElementById('about-desc-input').value = settings.aboutDesc;

    if (settings.colors) {
        var c = settings.colors;
        if (c.primary) { document.getElementById('primary-color').value = c.primary; document.getElementById('primary-color-value').textContent = c.primary; }
        if (c.secondary) { document.getElementById('secondary-color').value = c.secondary; document.getElementById('secondary-color-value').textContent = c.secondary; }
        if (c.bg) { document.getElementById('bg-color').value = c.bg; document.getElementById('bg-color-value').textContent = c.bg; }
        if (c.text) { document.getElementById('text-color').value = c.text; document.getElementById('text-color-value').textContent = c.text; }
        if (c.card) { document.getElementById('card-color').value = c.card; document.getElementById('card-color-value').textContent = c.card; }
        if (c.footer) { document.getElementById('footer-color').value = c.footer; document.getElementById('footer-color-value').textContent = c.footer; }
    }

    if (settings.heroImage) {
        currentHeroImage = settings.heroImage;
        document.getElementById('hero-preview').innerHTML = '<img src="' + settings.heroImage + '" alt="Preview">';
    }

    if (settings.logoImage) {
        currentLogoImage = settings.logoImage;
        document.getElementById('logo-preview').innerHTML = '<img src="' + settings.logoImage + '" alt="Preview">';
    }

    if (settings.aboutImage) {
        currentAboutImage = settings.aboutImage;
        document.getElementById('about-preview').innerHTML = '<img src="' + settings.aboutImage + '" alt="Preview">';
    }

    if (settings.contact) {
        if (settings.contact.phone) document.getElementById('contact-phone-input').value = settings.contact.phone;
        if (settings.contact.email) document.getElementById('contact-email-input').value = settings.contact.email;
        if (settings.contact.address) document.getElementById('contact-address-input').value = settings.contact.address;
    }

    renderServicesList();
    renderProductsList();
    renderPortfolioList();
    renderFilesList();
    renderMessagesList();
    updateCounts();
}

function saveGeneralSettings() {
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings.siteName = document.getElementById('site-name').value;
    settings.heroTitle = document.getElementById('hero-title-input').value;
    settings.heroDesc = document.getElementById('hero-desc-input').value;
    settings.aboutDesc = document.getElementById('about-desc-input').value;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    showToast('تم حفظ الإعدادات بنجاح');
}

function saveColors() {
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings.colors = {
        primary: document.getElementById('primary-color').value,
        secondary: document.getElementById('secondary-color').value,
        bg: document.getElementById('bg-color').value,
        text: document.getElementById('text-color').value,
        card: document.getElementById('card-color').value,
        footer: document.getElementById('footer-color').value
    };
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    showToast('تم حفظ الألوان بنجاح');
}

function applyPreset(preset) {
    var presets = {
        purple: { primary: '#6C63FF', secondary: '#FF6584', bg: '#0a0a23', text: '#ffffff', card: '#1a1a3e', footer: '#050510' },
        blue: { primary: '#2196F3', secondary: '#00BCD4', bg: '#0a1929', text: '#ffffff', card: '#1a2a4a', footer: '#050d1a' },
        green: { primary: '#4CAF50', secondary: '#8BC34A', bg: '#0a1a0a', text: '#ffffff', card: '#1a3a1a', footer: '#050f05' },
        orange: { primary: '#FF9800', secondary: '#F44336', bg: '#1a0a0a', text: '#ffffff', card: '#3a1a1a', footer: '#0f0505' },
        dark: { primary: '#666666', secondary: '#999999', bg: '#121212', text: '#ffffff', card: '#1e1e1e', footer: '#0a0a0a' },
        red: { primary: '#E91E63', secondary: '#9C27B0', bg: '#1a0a14', text: '#ffffff', card: '#3a1a2e', footer: '#0f050a' }
    };

    var p = presets[preset];
    document.getElementById('primary-color').value = p.primary;
    document.getElementById('primary-color-value').textContent = p.primary;
    document.getElementById('secondary-color').value = p.secondary;
    document.getElementById('secondary-color-value').textContent = p.secondary;
    document.getElementById('bg-color').value = p.bg;
    document.getElementById('bg-color-value').textContent = p.bg;
    document.getElementById('text-color').value = p.text;
    document.getElementById('text-color-value').textContent = p.text;
    document.getElementById('card-color').value = p.card;
    document.getElementById('card-color-value').textContent = p.card;
    document.getElementById('footer-color').value = p.footer;
    document.getElementById('footer-color-value').textContent = p.footer;
}

function saveHeroImage() {
    if (!currentHeroImage) {
        showToast('يرجى رفع صورة أولاً');
        return;
    }
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    settings.heroImage = currentHeroImage;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    showToast('تم حفظ صورة الهيرو بنجاح');
}

function deleteHeroImage() {
    currentHeroImage = null;
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    delete settings.heroImage;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    document.getElementById('hero-preview').innerHTML = '<p>لا توجد صورة مرفوعة</p>';
    showToast('تم حذف صورة الهيرو');
}

function saveLogo() {
    if (!currentLogoImage) {
        showToast('يرجى رفع شعار أولاً');
        return;
    }
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    settings.logoImage = currentLogoImage;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    showToast('تم حفظ الشعار بنجاح');
}

function deleteLogo() {
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    currentLogoImage = null;
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    delete settings.logoImage;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    document.getElementById('logo-preview').innerHTML = '<p>لا يوجد شعار مرفوع</p>';
    showToast('تم حذف الشعار');
}

function saveAboutImage() {
    if (!currentAboutImage) {
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
        showToast('يرجى رفع صورة أولاً');
        return;
    }
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings.aboutImage = currentAboutImage;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    showToast('تم حفظ الصورة بنجاح');
}
// إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    
function deleteAboutImage() {
    currentAboutImage = null;
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    delete settings.aboutImage;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    document.getElementById('about-preview').innerHTML = '<p>لا توجد صورة مرفوعة</p>';
    showToast('تم حذف الصورة');
}

function saveContactInfo() {
    var settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    // إرسال إشارة للموقع الرئيسي بتحديث البيانات
    localStorage.setItem('siteSettingsUpdated', new Date().getTime().toString());
    settings.contact = {
        phone: document.getElementById('contact-phone-input').value,
        email: document.getElementById('contact-email-input').value,
        address: document.getElementById('contact-address-input').value
    };
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    showToast('تم حفظ معلومات التواصل بنجاح');
}

function addService() {
    var name = document.getElementById('service-name').value;
    var icon = document.getElementById('service-icon').value;
    var desc = document.getElementById('service-desc').value;

    if (!name || !desc) {
        showToast('يرجى ملء جميع الحقول');
        return;
    }

    var services = JSON.parse(localStorage.getItem('services') || '[]');
    services.push({ name: name, icon: icon || 'fas fa-cog', desc: desc });
    localStorage.setItem('services', JSON.stringify(services));

    document.getElementById('service-name').value = '';
    document.getElementById('service-icon').value = '';
    document.getElementById('service-desc').value = '';

    renderServicesList();
    showToast('تم إضافة الخدمة بنجاح');
}

function renderServicesList() {
    var services = JSON.parse(localStorage.getItem('services') || '[]');
    var list = document.getElementById('services-list');

    if (services.length === 0) {
        list.innerHTML = '<p class="empty-msg">لا توجد خدمات مضافة</p>';
        return;
    }

    list.innerHTML = '';
    services.forEach(function(service, index) {
        list.innerHTML += '<div class="item-card">' +
            '<div class="item-info">' +
            '<h4><i class="' + service.icon + '" style="color:var(--admin-primary);margin-left:10px;"></i>' + service.name + '</h4>' +
            '<p>' + service.desc + '</p>' +
            '</div>' +
            '<div class="item-actions">' +
            '<button class="remove-btn" onclick="deleteService(' + index + ')"><i class="fas fa-trash"></i> حذف</button>' +
            '</div>' +
            '</div>';
    });
}

function deleteService(index) {
    var services = JSON.parse(localStorage.getItem('services') || '[]');
    services.splice(index, 1);
    localStorage.setItem('services', JSON.stringify(services));
    renderServicesList();
    showToast('تم حذف الخدمة');
}

function addProduct() {
    var name = document.getElementById('product-name').value;
    var price = document.getElementById('product-price').value;
    var desc = document.getElementById('product-desc').value;
    var imageInput = document.getElementById('product-image-input');

    if (!name || !price || !desc) {
        showToast('يرجى ملء جميع الحقول');
        return;
    }

    var saveProduct = function(imageData) {
        var products = JSON.parse(localStorage.getItem('products') || '[]');
        products.push({ name: name, price: price, desc: desc, image: imageData || null });
        localStorage.setItem('products', JSON.stringify(products));

        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-desc').value = '';
        imageInput.value = '';

        renderProductsList();
        updateCounts();
        showToast('تم إضافة المنتج بنجاح');
    };

    if (imageInput.files.length > 0) {
        readFile(imageInput.files[0], function(dataUrl) {
            saveProduct(dataUrl);
        });
    } else {
        saveProduct(null);
    }
}

function renderProductsList() {
    var products = JSON.parse(localStorage.getItem('products') || '[]');
    var list = document.getElementById('products-list');

    if (products.length === 0) {
        list.innerHTML = '<p class="empty-msg">لا توجد منتجات مضافة</p>';
        return;
    }

    list.innerHTML = '';
    products.forEach(function(product, index) {
        var imgHtml = product.image
            ? '<img src="' + product.image + '" alt="' + product.name + '">'
            : '<div style="width:60px;height:60px;background:var(--admin-primary);border-radius:10px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-box" style="color:white;"></i></div>';

        list.innerHTML += '<div class="item-card">' +
            imgHtml +
            '<div class="item-info">' +
            '<h4>' + product.name + '</h4>' +
            '<p>' + product.desc + '</p>' +
            '<p style="color:var(--admin-secondary);font-weight:bold;">' + product.price + '</p>' +
            '</div>' +
            '<div class="item-actions">' +
            '<button class="remove-btn" onclick="deleteProduct(' + index + ')"><i class="fas fa-trash"></i> حذف</button>' +
            '</div>' +
            '</div>';
    });
}

function deleteProduct(index) {
    var products = JSON.parse(localStorage.getItem('products') || '[]');
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProductsList();
    updateCounts();
    showToast('تم حذف المنتج');
}

function addPortfolio() {
    var name = document.getElementById('portfolio-name').value;
    var category = document.getElementById('portfolio-category').value;
    var desc = document.getElementById('portfolio-desc').value;
    var imageInput = document.getElementById('portfolio-image-input');

    if (!name || !category || !desc) {
        showToast('يرجى ملء جميع الحقول');
        return;
    }

    var saveItem = function(imageData) {
        var portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
        portfolio.push({ name: name, category: category, desc: desc, image: imageData || null });
        localStorage.setItem('portfolio', JSON.stringify(portfolio));

        document.getElementById('portfolio-name').value = '';
        document.getElementById('portfolio-category').value = '';
        document.getElementById('portfolio-desc').value = '';
        imageInput.value = '';

        renderPortfolioList();
        updateCounts();
        showToast('تم إضافة المشروع بنجاح');
    };

    if (imageInput.files.length > 0) {
        readFile(imageInput.files[0], function(dataUrl) {
            saveItem(dataUrl);
        });
    } else {
        saveItem(null);
    }
}

function renderPortfolioList() {
    var portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    var list = document.getElementById('portfolio-list');

    if (portfolio.length === 0) {
        list.innerHTML = '<p class="empty-msg">لا توجد أعمال مضافة</p>';
        return;
    }

    list.innerHTML = '';
    portfolio.forEach(function(item, index) {
        var imgHtml = item.image
            ? '<img src="' + item.image + '" alt="' + item.name + '">'
            : '<div style="width:60px;height:60px;background:var(--admin-primary);border-radius:10px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-briefcase" style="color:white;"></i></div>';

        list.innerHTML += '<div class="item-card">' +
            imgHtml +
            '<div class="item-info">' +
            '<h4>' + item.name + '</h4>' +
            '<p>' + item.desc + '</p>' +
            '<span style="background:var(--admin-primary);padding:3px 10px;border-radius:15px;font-size:0.8rem;">' + item.category + '</span>' +
            '</div>' +
            '<div class="item-actions">' +
            '<button class="remove-btn" onclick="deletePortfolio(' + index + ')"><i class="fas fa-trash"></i> حذف</button>' +
            '</div>' +
            '</div>';
    });
}

function deletePortfolio(index) {
    var portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    portfolio.splice(index, 1);
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    renderPortfolioList();
    updateCounts();
    showToast('تم حذف المشروع');
}

function renderFilesList() {
    var files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    var list = document.getElementById('files-list');

    if (files.length === 0) {
        list.innerHTML = '<p class="empty-msg">لا توجد ملفات مرفوعة</p>';
        return;
    }

    list.innerHTML = '';
    files.forEach(function(file, index) {
        var icon = 'fas fa-file';
        if (file.type.includes('image')) icon = 'fas fa-file-image';
        else if (file.type.includes('pdf')) icon = 'fas fa-file-pdf';
        else if (file.type.includes('video')) icon = 'fas fa-file-video';
        else if (file.type.includes('zip') || file.type.includes('rar')) icon = 'fas fa-file-archive';

        list.innerHTML += '<div class="file-item">' +
            '<i class="' + icon + '"></i>' +
            '<span class="file-name">' + file.name + '</span>' +
            '<span class="file-size">' + file.size + '</span>' +
            '<button class="delete-file" onclick="deleteFile(' + index + ')"><i class="fas fa-trash"></i></button>' +
            '</div>';
    });
}

function deleteFile(index) {
    var files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    files.splice(index, 1);
    localStorage.setItem('uploadedFiles', JSON.stringify(files));
    renderFilesList();
    showToast('تم حذف الملف');
}

function renderMessagesList() {
    var messages = JSON.parse(localStorage.getItem('messages') || '[]');
    var list = document.getElementById('messages-list');

    if (messages.length === 0) {
        list.innerHTML = '<p class="empty-msg">لا توجد رسائل</p>';
        return;
    }

    list.innerHTML = '';
    messages.forEach(function(msg, index) {
        list.innerHTML += '<div class="message-card">' +
            '<div class="message-header">' +
            '<h4>' + msg.name + '</h4>' +
            '<span>' + msg.date + '</span>' +
            '</div>' +
            '<p class="message-email"><i class="fas fa-envelope" style="margin-left:5px;"></i>' + msg.email + '</p>' +
            '<p><strong>الموضوع:</strong> ' + msg.subject + '</p>' +
            '<p>' + msg.message + '</p>' +
            '<button class="message-delete" onclick="deleteMessage(' + index + ')"><i class="fas fa-trash"></i> حذف</button>' +
            '</div>';
    });
}

function deleteMessage(index) {
    var messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    renderMessagesList();
    updateCounts();
    showToast('تم حذف الرسالة');
}

function updateCounts() {
    var products = JSON.parse(localStorage.getItem('products') || '[]');
    var portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    var messages = JSON.parse(localStorage.getItem('messages') || '[]');

    var productCount = document.getElementById('product-count');
    var portfolioCount = document.getElementById('portfolio-count');
    var msgCount = document.getElementById('msg-count');

    if (productCount) productCount.textContent = products.length;
    if (portfolioCount) portfolioCount.textContent = portfolio.length;
    if (msgCount) msgCount.textContent = messages.length;
}

function showToast(message) {
    var toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}
