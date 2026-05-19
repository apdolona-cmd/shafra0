const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'site-data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname));

// تحميل البيانات من الملف
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('خطأ في قراءة البيانات:', err);
    }
    return {
        siteSettings: {},
        services: [],
        products: [],
        portfolio: [],
        messages: [],
        uploadedFiles: []
    };
}

// حفظ البيانات في الملف
function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('خطأ في حفظ البيانات:', err);
        return false;
    }
}

// الحصول على جميع البيانات
app.get('/api/data', (req, res) => {
    const data = loadData();
    res.json(data);
});

// حفظ إعدادات الموقع
app.post('/api/settings', (req, res) => {
    const data = loadData();
    data.siteSettings = req.body;
    if (saveData(data)) {
        res.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' });
    } else {
        res.status(500).json({ success: false, message: 'خطأ في الحفظ' });
    }
});

// الحصول على إعدادات الموقع
app.get('/api/settings', (req, res) => {
    const data = loadData();
    res.json(data.siteSettings);
});

// حفظ الخدمات
app.post('/api/services', (req, res) => {
    const data = loadData();
    data.services = req.body;
    if (saveData(data)) {
        res.json({ success: true, message: 'تم حفظ الخدمات بنجاح' });
    } else {
        res.status(500).json({ success: false, message: 'خطأ في الحفظ' });
    }
});

// الحصول على الخدمات
app.get('/api/services', (req, res) => {
    const data = loadData();
    res.json(data.services);
});

// حفظ المنتجات
app.post('/api/products', (req, res) => {
    const data = loadData();
    data.products = req.body;
    if (saveData(data)) {
        res.json({ success: true, message: 'تم حفظ المنتجات بنجاح' });
    } else {
        res.status(500).json({ success: false, message: 'خطأ في الحفظ' });
    }
});

// الحصول على المنتجات
app.get('/api/products', (req, res) => {
    const data = loadData();
    res.json(data.products);
});

// حفظ المشاريع
app.post('/api/portfolio', (req, res) => {
    const data = loadData();
    data.portfolio = req.body;
    if (saveData(data)) {
        res.json({ success: true, message: 'تم حفظ المشاريع بنجاح' });
    } else {
        res.status(500).json({ success: false, message: 'خطأ في الحفظ' });
    }
});

// الحصول على المشاريع
app.get('/api/portfolio', (req, res) => {
    const data = loadData();
    res.json(data.portfolio);
});

// حفظ الرسائل
app.post('/api/messages', (req, res) => {
    const data = loadData();
    data.messages = req.body;
    if (saveData(data)) {
        res.json({ success: true, message: 'تم حفظ الرسائل بنجاح' });
    } else {
        res.status(500).json({ success: false, message: 'خطأ في الحفظ' });
    }
});

// الحصول على الرسائل
app.get('/api/messages', (req, res) => {
    const data = loadData();
    res.json(data.messages);
});

// حفظ الملفات
app.post('/api/files', (req, res) => {
    const data = loadData();
    data.uploadedFiles = req.body;
    if (saveData(data)) {
        res.json({ success: true, message: 'تم حفظ الملفات بنجاح' });
    } else {
        res.status(500).json({ success: false, message: 'خطأ في الحفظ' });
    }
});

// الحصول على الملفات
app.get('/api/files', (req, res) => {
    const data = loadData();
    res.json(data.uploadedFiles);
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`📄 الموقع الرئيسي: http://localhost:${PORT}/index.html`);
    console.log(`🔐 لوحة التحكم: http://localhost:${PORT}/admin.html`);
    console.log(`✅ البيانات تُحفظ في: ${DATA_FILE}`);
});
