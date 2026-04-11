// MyAI-Tool Bluetooth Demo - Web Bluetooth API
// Works in Chrome/Edge. Serve over HTTPS or localhost.

const scanBtn = document.getElementById('scanBtn');
const connectBtn = document.getElementById('connectBtn');
const devicesList = document.getElementById('devices');
const status = document.getElementById('status');
let deviceCache = [];

function updateStatus(msg, type = 'info') {
    status.textContent = msg;
    status.style.background = type === 'success' ? '#00ff88' : 
                             type === 'error' ? '#ff4444' : '#444';
    status.style.color = 'white';
}

scanBtn.addEventListener('click', async () => {
    try {
        updateStatus('Requesting Bluetooth permission...');
        const options = {
            acceptAllDevices: true,
            optionalServices: ['battery_service', 'device_information']
        };
        deviceCache = await navigator.bluetooth.requestDevice(options);
        updateStatus(`Found ${deviceCache.length} device(s)!`, 'success');
        
        devicesList.innerHTML = '';
        deviceCache.forEach((device, i) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <strong>${device.name || 'Unnamed'}</strong> (ID: ${device.id.slice(-8)})<br>
                <small>${device.gatt?.connected ? 'Connected' : 'Disconnected'}</small>
            `;
            div.onclick = () => connectDevice(device);
            devicesList.appendChild(div);
        });
        
        connectBtn.disabled = false;
    } catch (err) {
        updateStatus(`Error: ${err.message}`, 'error');
    }
});

connectBtn.addEventListener('click', () => {
    if (deviceCache.length > 0) {
        connectDevice(deviceCache[0]);
    }
});

async function connectDevice(device) {
    try {
        updateStatus(`Connecting to ${device.name || device.id}...`);
        const server = await device.gatt.connect();
        updateStatus(`Connected! Services: ${server.getPrimaryServices().length}`, 'success');
        
        // Demo: Read Battery Level if available
        const battery = server.getPrimaryService('battery_service');
        if (battery) {
            const level = await battery.getCharacteristic('battery_level').readValue();
            const batteryPct = level.getUint8(0);
            updateStatus(`Battery: ${batteryPct}%`);
        }
        
        // List services
        const services = await server.getPrimaryServices();
        console.log('Services:', services.map(s => s.uuid));
        
    } catch (err) {
        updateStatus(`Connection failed: ${err.message}`, 'error');
    }
}

// Theme Toggle
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

themeIcon.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

// Smooth scroll for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
});

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// PWA-like install prompt (optional)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

