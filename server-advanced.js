const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shafra_db';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname));

// ==================== قاعدة البيانات ====================

// الاتصال بـ MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ متصل بـ MongoDB'))
.catch(err => console.error('❌ خطأ في الاتصال:', err));

// ==== Schema الإعدادات ====
const settingsSchema = new mongoose.Schema({
    siteName: String,
    heroTitle: String,
    heroDesc: String,
    aboutDesc: String,
    colors: {
        primary: String,
        secondary: String,
        bg: String,
        text: String,
        card: String,
        footer: String
    },
    heroImage: String,
    logoImage: String,
    aboutImage: String,
    contact: {
        phone: String,
        email: String,
        address: String
    },
    updatedAt: { type: Date, default: Date.now }
});

const SiteSettings = mongoose.model('SiteSettings', settingsSchema);

// ==== Schema الخدمات ====
const serviceSchema = new mongoose.Schema({
    name: String,
    icon: String,
    desc: String,
    createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

// ==== Schema المنتجات ====
const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    desc: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// ==== Schema المشاريع ====
const portfolioSchema = new mongoose.Schema({
    name: String,
    category: String,
    desc: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// ==== Schema الرسائل ====
const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ==== Schema الملفات ====
const fileSchema = new mongoose.Schema({
    name: String,
    size: String,
    type: String,
    data: String,
    createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// ==================== WebSocket Events ====================

io.on('connection', (socket) => {
    console.log(`🔗 متصل جديد: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`🔌 قطع الاتصال: ${socket.id}`);
    });
});

// ==================== API Endpoints ====================

// جلب جميع البيانات
app.get('/api/data', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        const services = await Service.find();
        const products = await Product.find();
        const portfolio = await Portfolio.find();
        const messages = await Message.find();
        const files = await File.find();

        res.json({
            siteSettings: settings,
            services,
            products,
            portfolio,
            messages,
            files
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== الإعدادات ==========

app.get('/api/settings', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne() || {};
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        
        if (settings) {
            Object.assign(settings, req.body);
            settings.updatedAt = new Date();
        } else {
            settings = new SiteSettings({
                ...req.body,
                updatedAt: new Date()
            });
        }

        await settings.save();

        // بث التحديث على جميع العملاء
        io.emit('settings-updated', settings);

        res.json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== الخدمات ==========

app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const services = req.body;
        
        // حذف جميع الخدمات القديمة
        await Service.deleteMany({});
        
        // إضافة الخدمات الجديدة
        const newServices = await Service.insertMany(services);
        
        // بث التحديث
        io.emit('services-updated', newServices);
        
        res.json({ success: true, data: newServices });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== المنتجات ==========

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const products = req.body;
        
        await Product.deleteMany({});
        const newProducts = await Product.insertMany(products);
        
        io.emit('products-updated', newProducts);
        
        res.json({ success: true, data: newProducts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== المشاريع ==========

app.get('/api/portfolio', async (req, res) => {
    try {
        const portfolio = await Portfolio.find();
        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/portfolio', async (req, res) => {
    try {
        const portfolio = req.body;
        
        await Portfolio.deleteMany({});
        const newPortfolio = await Portfolio.insertMany(portfolio);
        
        io.emit('portfolio-updated', newPortfolio);
        
        res.json({ success: true, data: newPortfolio });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== الرسائل ==========

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const messages = req.body;
        
        await Message.deleteMany({});
        const newMessages = await Message.insertMany(messages);
        
        io.emit('messages-updated', newMessages);
        
        res.json({ success: true, data: newMessages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== الملفات ==========

app.get('/api/files', async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/files', async (req, res) => {
    try {
        const files = req.body;
        
        await File.deleteMany({});
        const newFiles = await File.insertMany(files);
        
        io.emit('files-updated', newFiles);
        
        res.json({ success: true, data: newFiles });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== تشغيل الخادم ==========

server.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`📄 الموقع الرئيسي: http://localhost:${PORT}/index.html`);
    console.log(`🔐 لوحة التحكم: http://localhost:${PORT}/admin.html`);
    console.log(`🗄️  قاعدة البيانات: ${MONGODB_URI}`);
    console.log(`${'='.repeat(50)}\n`);
});

module.exports = { io };
