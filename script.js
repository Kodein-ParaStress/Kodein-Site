// Initialize Three.js Scene
// DISABLED THREE.JS FOR PERFORMANCE
// The user reported freezing. The most likely culprit is WebGL rendering on a resource-constrained system
// or conflict with CSS animations.
// We will remove the 3D particles entirely to ensure smooth scrolling.
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer) canvasContainer.style.display = 'none';

// --- SCROLL BACKGROUND TRANSITION ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollY / maxScroll, 1);
    
    // Update Background Overlay Opacity (Space -> Sky)
    // 0% Scroll = 0 Opacity (Black Space)
    // 100% Scroll = 1 Opacity (Blue/Purple Sky)
    const overlay = document.getElementById('sky-overlay');
    if (overlay) {
        overlay.style.opacity = scrollPercent;
    }
    
    // Parallax Stars
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
        starsContainer.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
    
});

// --- STARS & SHOOTING STARS ---
const starsContainer = document.querySelector('.stars-container');
if (starsContainer) {
    // 1. Static Twinkling Stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
        star.style.setProperty('--opacity', `${0.5 + Math.random() * 0.5}`);
        starsContainer.appendChild(star);
    }

    // 2. Moon (added in HTML/CSS) - Just ensuring container exists

    // 3. Shooting Stars Loop
    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        
        // Random position (mostly top half)
        shootingStar.style.setProperty('--top', `${Math.random() * 45}%`);
        
        // Random delay (immediate for this interval instance)
        shootingStar.style.setProperty('--delay', '0s');
        
        starsContainer.appendChild(shootingStar);
        
        // Cleanup after animation
        setTimeout(() => {
            shootingStar.remove();
        }, 2600);
    }, 2200);
}

// animate();

// Resize Handler
/*
window.addEventListener('resize', () => {
    // Disabled
});
*/


// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
gsap.from('.glitch-title', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.5
});

gsap.from('.subtitle', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 1
});

gsap.from('.cta-container', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 1.5
});

// Video Section Reveal
gsap.from('.video-frame', {
    scrollTrigger: {
        trigger: '#presentation',
        start: 'top 80%',
    },
    duration: 1,
    scale: 0.8,
    opacity: 0,
    ease: 'back.out(1.7)'
});

// Feature Cards Stagger
gsap.from('.feature-card', {
    scrollTrigger: {
        trigger: '#features',
        start: 'top 70%',
    },
    duration: 0.8,
    opacity: 0,
    scale: 0.98,
    stagger: 0.2,
    ease: 'power3.out',
    clearProps: 'transform'
});

// Glitch Text Effect on Hover (Random Characters) - REMOVED
/* ... */

// HUD Clock
function updateHudTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const hudTime = document.getElementById('hud-time');
    if (hudTime) hudTime.innerText = timeString;
}
setInterval(updateHudTime, 1000);
updateHudTime();

// --- CYBER CURSOR & CLICK PARTICLES ---
const cursor = document.getElementById('cyber-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Hover Effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .feature-card, .logo, input');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// Click Explosion Effect
document.addEventListener('click', (e) => {
    // ... (Keep existing particle effect)
    const particleCount = 12;
    const colors = ['#3a86ff', '#7b2cbf', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('click-particle');
        
        // Random Position Spread
        const x = e.clientX;
        const y = e.clientY;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random Size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random Direction Vector
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--mx', `${tx}px`);
        particle.style.setProperty('--my', `${ty}px`);
        
        document.body.appendChild(particle);
        
        // Cleanup
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
});

// --- BLACK HOLE PARTICLE SYSTEM ---
const canvas = document.getElementById('blackhole-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let isMouseDown = false;

// Resize
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener('resize', resize);

// Mouse Tracking
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);

// Particle Class
class Particle {
    constructor() {
        this.reset();
        // Start at random positions initially
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    reset() {
        // Respawn at edges or random
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow drift
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        this.friction = 0.96; // Air resistance
        this.baseSpeed = Math.random() * 0.05 + 0.02; // Gravitational sensitivity
    }

    update() {
        // Vector to mouse (Black Hole Center)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        // Gravitational Pull - MUCH WEAKER
        // Force is inversely proportional to distance (but clamped to avoid infinity)
        // Reduced from 1000 to 200 for gentle pull
        let force = 200 / (distance * distance + 500); 
        
        // If mouse down (Repulse/Explode)
        if (isMouseDown) {
            force = -force * 8; // Stronger repulsion relative to attraction
        }

        // Apply Force
        let angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 2; // Reduced multiplier
        this.vy += Math.sin(angle) * force * 2;

        // Friction - Higher drag for smoother/slower movement
        this.vx *= 0.94; // Was 0.96
        this.vy *= 0.94;

        // Move
        this.x += this.vx;
        this.y += this.vy;
        
        // Gentle rotation around center if close? No, keep simple pull.

        // Respawn if out of bounds or sucked into singularity (too close)
        if (distance < 5 && !isMouseDown) {
            this.reset();
             const angle = Math.random() * Math.PI * 2;
             const dist = Math.max(canvas.width, canvas.height);
             this.x = mouse.x + Math.cos(angle) * dist;
             this.y = mouse.y + Math.sin(angle) * dist;
        }
        
        // Screen wrap
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            if (distance > Math.max(canvas.width, canvas.height)) {
                 this.reset();
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.shadowColor = "rgba(170, 220, 255, 0.95)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initParticles() {
    particles = [];
    // Reduced density significantly for cleaner look (from /3000 to /15000)
    const count = (window.innerWidth * window.innerHeight) / 15000; 
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animateBlackHole() {
    // Clear with trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Long trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateBlackHole);
}

resize();
animateBlackHole();

const layoutSyncState = { raf: 0, observer: null };

function syncFeatureCardSizes() {
    const grid = document.querySelector('.features-grid');
    const scam = document.querySelector('.features-grid .feature-card.scam');
    if (!grid || !scam) return { ok: false, reason: 'missing-grid-or-scam' };
    const cards = Array.from(grid.querySelectorAll('.feature-card'));
    if (!cards.length) return { ok: false, reason: 'missing-cards' };
    const targetWidth = Math.round(scam.offsetWidth);
    const targetHeight = Math.round(scam.offsetHeight);
    if (!targetWidth || !targetHeight) return { ok: false, reason: 'invalid-target-size' };
    let changed = 0;
    for (const card of cards) {
        if (card.style.transform) {
            card.style.removeProperty('transform');
            changed++;
        }
        if (card.classList.contains('systeme')) {
            const w = `${targetWidth}px`;
            if (card.style.width !== w) {
                card.style.width = w;
                changed++;
            }
            if (card.style.height !== 'auto') {
                card.style.height = 'auto';
                changed++;
            }
            if (card.style.minHeight) {
                card.style.removeProperty('min-height');
                changed++;
            }
            if (card.style.maxHeight) {
                card.style.removeProperty('max-height');
                changed++;
            }
            if (card.style.flex) {
                card.style.removeProperty('flex');
                changed++;
            }
            continue;
        }
        if (card === scam) continue;
        const w = `${targetWidth}px`;
        const h = `${targetHeight}px`;
        if (card.style.width !== w) {
            card.style.width = w;
            changed++;
        }
        if (card.style.height !== h) {
            card.style.height = h;
            changed++;
        }
        if (card.style.minHeight !== h) {
            card.style.minHeight = h;
            changed++;
        }
        if (card.style.maxHeight !== h) {
            card.style.maxHeight = h;
            changed++;
        }
        const flexValue = `0 0 ${w}`;
        if (card.style.flex !== flexValue) {
            card.style.flex = flexValue;
            changed++;
        }
        if (card.style.alignSelf !== 'flex-end') {
            card.style.alignSelf = 'flex-end';
            changed++;
        }
    }
    return { ok: true, targetWidth, targetHeight, changed };
}

function scheduleFeatureCardSync() {
    if (layoutSyncState.raf) cancelAnimationFrame(layoutSyncState.raf);
    layoutSyncState.raf = requestAnimationFrame(() => {
        layoutSyncState.raf = 0;
        syncFeatureCardSizes();
    });
}

function initFeatureCardSync() {
    scheduleFeatureCardSync();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleFeatureCardSync).catch(() => {});
    }
    window.addEventListener('resize', scheduleFeatureCardSync);
    if (window.ResizeObserver) {
        const grid = document.querySelector('.features-grid');
        if (grid) {
            layoutSyncState.observer = new ResizeObserver(() => scheduleFeatureCardSync());
            layoutSyncState.observer.observe(grid);
        }
    }
}

function runFeatureLayoutTests() {
    const rows = [];
    const push = (name, pass, detail) => rows.push({ test: name, pass, detail: detail || '' });
    const grid = document.querySelector('.features-grid');
    const scam = document.querySelector('.features-grid .feature-card.scam');
    push('grid-present', !!grid, grid ? 'ok' : 'missing');
    push('scam-present', !!scam, scam ? 'ok' : 'missing');
    if (!grid || !scam) {
        const report = { passed: 0, failed: rows.length, rows };
        window.__layoutTestReport = report;
        console.table(rows);
        return report;
    }

    const first = syncFeatureCardSizes();
    push('sync-success', !!first.ok, first.reason || `w:${first.targetWidth} h:${first.targetHeight}`);
    const cards = Array.from(grid.querySelectorAll('.feature-card'));
    const nonSystemCards = cards.filter(c => !c.classList.contains('systeme'));
    const targetW = Math.round(scam.getBoundingClientRect().width);
    const targetH = Math.round(scam.getBoundingClientRect().height);
    push('equal-width-nonsystem', nonSystemCards.every(c => Math.round(c.getBoundingClientRect().width) === targetW), `target:${targetW}`);
    push('equal-height-nonsystem', nonSystemCards.every(c => Math.round(c.getBoundingClientRect().height) === targetH), `target:${targetH}`);

    const oldInlineWidth = scam.style.width;
    scam.style.width = `${targetW + 18}px`;
    syncFeatureCardSizes();
    const resizedTargetW = Math.round(scam.getBoundingClientRect().width);
    push('resize-propagates-width', nonSystemCards.every(c => Math.round(c.getBoundingClientRect().width) === resizedTargetW), `target:${resizedTargetW}`);
    scam.style.width = oldInlineWidth;
    syncFeatureCardSizes();

    const list = scam.querySelector('.feature-list');
    let probe = null;
    if (list) {
        probe = document.createElement('li');
        probe.textContent = 'TEST_DYNAMIC_LAYOUT_LINE';
        list.appendChild(probe);
    }
    syncFeatureCardSizes();
    const expandedTargetH = Math.round(scam.getBoundingClientRect().height);
    push('content-growth-propagates-height', nonSystemCards.every(c => Math.round(c.getBoundingClientRect().height) === expandedTargetH), `target:${expandedTargetH}`);
    if (probe && list) list.removeChild(probe);
    syncFeatureCardSizes();

    const failed = rows.filter(r => !r.pass).length;
    const report = { passed: rows.length - failed, failed, rows };
    window.__layoutTestReport = report;
    console.table(rows);
    return report;
}

window.__layoutSizing = {
    syncFeatureCardSizes,
    scheduleFeatureCardSync,
    runFeatureLayoutTests
};

initFeatureCardSync();

if (window.location.search.includes('layout_test=1')) {
    setTimeout(() => runFeatureLayoutTests(), 200);
}

// --- 3D TILT EFFECT ON CARDS --- REMOVED
/*
const cards = document.querySelectorAll('.feature-card');
// ... removed
*/
// =========================================================
// --- TERMINAL ENGINE (PARASTRESS C2 v2.0) ---
// =========================================================

const termContent = document.getElementById('terminal-content');
const termInput = document.getElementById('terminal-input');
const rankIndicator = document.getElementById('rank-indicator');
const promptPrefix = document.getElementById('prompt-prefix');
const machineIdSpan = document.getElementById('machine-id');

// --- ÉTAT DU SYSTÈME ---
let termState = {
    loggedIn: false,
    currentPlan: "Guest",
    currentKey: "None",
    machineId: Math.floor(Math.random() * 1000000000)
};

const TERM_COLORS = {
    blue: '#0044ff', red: '#ff0000', green: '#00ff41',
    yellow: '#ffff00', white: '#ffffff', reset: '</span>'
};

// --- CONTENU DES MENUS ---
const BANNER_TEXT = `{BLUE}
              ..                                 
             .:..:.  .:-:...:--.                  
               .. .:..         .:-:               
                .:.               .-.::....       
                ...                 .-=-+=::=+.   
               ...                   .-:..=:.+:   
           ..::::.                   .=.-:.+.:*.  
        .......:                   .-=::+-:+:     {RED}Welcome to ParaStress ボットネット{BLUE}
      ..... .. :.            ..::--:-=--=-.       {RED}安価 de 大規模な 攻撃{BLUE}
      .. .:...:::......::---:..-==:=+-   .        {RED}t.me/paradoxtea1{BLUE}
       ........:::::::::::----::....=. .+*=      
             ......:......         :-     ..     
                  .::.         .--.  -*.         
            .::.     .:::::--::.   .==-+-        
             ..                      :=          
{RESET}`;

const NEWS_TEXT = `
{BLUE}[SYSTEM NEWS]{RESET}
{WHITE}- v3.0 Web Interface Online
- Cloud infrastructure Migrated to SSH
- New Multi-Layer methods added {RESET}
`;

// --- MOTEUR D'AFFICHAGE ---
async function termWrite(text, speed = 0) {
    if (!termContent) return;
    let html = text
        .replace(/{BLUE}/g, `<span style="color:${TERM_COLORS.blue}">`)
        .replace(/{RED}/g, `<span style="color:${TERM_COLORS.red}">`)
        .replace(/{GREEN}/g, `<span style="color:${TERM_COLORS.green}">`)
        .replace(/{YELLOW}/g, `<span style="color:${TERM_COLORS.yellow}">`)
        .replace(/{WHITE}/g, `<span style="color:${TERM_COLORS.white}">`)
        .replace(/{RESET}/g, '</span>');

    const line = document.createElement('div');
    termContent.appendChild(line);

    if (speed === 0) {
        line.innerHTML = html;
    } else {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        for (const child of temp.childNodes) {
            if (child.nodeType === 3) {
                for (const char of child.textContent) {
                    line.innerHTML += char;
                    termContent.scrollTop = termContent.scrollHeight;
                    await new Promise(r => setTimeout(r, speed));
                }
            } else {
                line.appendChild(child.cloneNode(true));
            }
        }
    }
    termContent.scrollTop = termContent.scrollHeight;
}

function updatePrompt() {
    let pColor = TERM_COLORS.green;
    if (termState.currentPlan === "Vip") pColor = TERM_COLORS.yellow;
    if (termState.currentPlan === "Root") pColor = TERM_COLORS.red;

    rankIndicator.innerText = `RANK: ${termState.currentPlan.toUpperCase()}`;
    rankIndicator.style.color = pColor;
    promptPrefix.innerHTML = `<span style="color:${TERM_COLORS.green}">┌──(user@ParaStress)─[<span style="color:${pColor}">${termState.currentPlan}</span>]<br>└──$</span>`;
}

// --- LOGIQUE DES COMMANDES ---
async function handleCommand(cmd, args) {
    switch (cmd) {
        case "!login":
            if (args.length > 0) {
                const key = args[0].toLowerCase();
                termState.loggedIn = true;
                termState.currentKey = args[0];

                if (key === "root") {
                    termState.currentPlan = "Root";
                } else if (key === "vip") {
                    termState.currentPlan = "Vip";
                } else {
                    termState.currentPlan = "Free";
                }

                termContent.innerHTML = ""; 
                await termWrite(BANNER_TEXT);
                await termWrite(NEWS_TEXT);
                await termWrite(`{GREEN}[+] Login successful. Rank: ${termState.currentPlan}{RESET}`);
                updatePrompt();
            } else {
                await termWrite("{RED}Usage: !login <key>{RESET}");
            }
            break;

        case "!help":
            const helpMenu = `
{BLUE}ParaStressBotnet - General Commands{RESET}
    !help           - Show this help menu                         [ {WHITE}All{RESET} ]
    !status         - Show your session and machine info          [ {WHITE}All{RESET} ]
    !rules          - Show infrastructure usage rules             [ {WHITE}All{RESET} ]
    !credits        - Show developers and social links            [ {WHITE}All{RESET} ]
    !resolve <url>  - Resolve a website domain to an IP           [ {WHITE}All{RESET} ]
    !geoip <ip>     - Get location and ISP info of an IP          [ {YELLOW}Vip{RESET} ]
    !lookup <url>   - Advanced DNS resolution and host lookup     [ {WHITE}All{RESET} ]
    !whois <ip>     - Get ISP and Organization data for an IP     [ {WHITE}All{RESET} ]
    !explain        - Interactive attack method education         [ {WHITE}All{RESET} ]
    !scan <ip>      - Full 65K real-time port discovery (v2.0)     [ {YELLOW}Vip{RESET} ]
    !webscan        - Extremely powerful & Aggressive scan         [ {YELLOW}Vip{RESET} ]

{BLUE}ParaStressBotnet@Methods - Network & Amplification (L3/L4){RESET}
    !udp            - Custom UDP Flood Payload                    [ Normal ]
    !tcp            - Custom TCP Flood Payload                    [ Normal ]
    !syn            - Custom SYN Flood Payload                    [ Normal ]
    !dns            - Custom Mixed DNS Amplification Payload      [ Normal ]
    !ntp            - Custom Mixed NTP Amplification Payload      [ Normal ]
    !std            - Custom STD Flood Payload                    [ Normal ]
    !vse            - Custom VSE Flood Payload                    [ Normal ]
    !ts3            - Layer 3 Security Payload Protocol Flood     [ {YELLOW}Vip{RESET}    ]
    !gre            - Layer 3 Generic routing Encapsulation Flood [ {YELLOW}Vip{RESET}    ]
    !cod            - Custom Mixed COD Flood Payload              [ Normal ]
    !ovh            - Custom Proxied OVH Handshake (OVH & 100UP)  [ {YELLOW}Vip{RESET}    ]
    !home           - Custom Mixed HOME Flood (Designed for Homes)[ {YELLOW}Vip{RESET}    ]
    !ldap           - Custom Mixed LDAP Amplification Payload      [ Normal ]
    !stun           - Custom Mixed STUN High GBPS/BYPASS Payload  [ {YELLOW}Vip{RESET}    ]
    !icmp           - Layer 3 ICMP Protocol Flood                 [ Normal ]
    !ssdp           - Custom Mixed SSDP-DNS Amplification Payload  [ Normal ]
    !game           - Custom Mixed GAME Flood Payload             [ {YELLOW}Vip{RESET}    ]
    !fivem          - Custom Mixed FIVEM Flood Payload            [ {YELLOW}Vip{RESET}    ]
    !stomp          - Randomized Flood Payload                    [ Normal ]
    !subnet         - Custom SUBNET Flood Payload                 [ {YELLOW}Vip{RESET}    ]
    !socket         - Custom SOCKET Flood Payload                 [ {YELLOW}Vip{RESET}    ]
    !iprand         - Layer 3 Multi Protocol Flood                [ {YELLOW}Vip{RESET}    ]
    !mix-amp        - Custom Mixed Amplification/Bypass Payload   [ {YELLOW}Vip{RESET}    ]
    !rainbow        - Custom Mixed Amp/Bypass (Designed for R6)   [ {YELLOW}Vip{RESET}    ]
    !discord        - Custom Mixed Payload (Designed for DISCORD) [ {YELLOW}Vip{RESET}    ]
    !chargen        - Custom Mixed CHARGEN Payload                [ Normal ]
    !ovh-amp        - Custom OVH Amplification (OVH & 100UP)      [ {YELLOW}Vip{RESET}    ]
    !udp-pps        - Custom UDP-PPS Payload                      [ Normal ]
    !tcp-xmas       - Custom TCP-XMAS Mixed Payload               [ Normal ]
    !tcp-hold       - Custom TCP-HOLD (Designed to Hold Servers)  [ {YELLOW}Vip{RESET}    ]
    !dominate       - Custom DOMINATE High GBPS/Amplification     [ {YELLOW}Vip{RESET}    ]
    !critical       - Custom Mixed Amplification Payload          [ {YELLOW}Vip{RESET}    ]
    !home-fuck      - Mixed Payload Designed To Bypass Homes      [ {YELLOW}Vip{RESET}    ]
    !home-hold      - Mixed Payload Designed To Hold Homes        [ {YELLOW}Vip{RESET}    ]
    !minecraft      - Custom Mixed Payload Designed For MINECRAFT [ {YELLOW}Vip{RESET}    ]
    !udp-bypass     - Custom UDP-BYPASS Mixed Payload             [ {YELLOW}Vip{RESET}    ]
    !tcp-bypass     - Custom TCP-BYPASS Mixed Payload             [ {YELLOW}Vip{RESET}    ]
    !tcp-blackboy   - Custom Mixed TCP Bypass/Amplification       [ {YELLOW}Vip{RESET}    ]

{BLUE}ParaStressBotnet@Methods - Application (L7){RESET}
    !tls            - Custom LAYER 7 TLS Method                   [ Normal ]
    !http           - Custom LAYER 7 HTTP Method                  [ Normal ]
    !https          - Custom LAYER 7 HTTPS Method                 [ Normal ]
    !browser        - Custom Mixed LAYER 7 BROWSER Method         [ {YELLOW}Vip{RESET}    ]
    !cloudflare     - Custom LAYER 7 CLOUDFLARE Method            [ {YELLOW}Vip{RESET}    ]
    !bypass         - HTTP/2 Bypass (Bypass Cache/Limits)         [ {YELLOW}Vip{RESET}    ]

{BLUE}System & Admin Controls{RESET}
    !clear          - Clear terminal and refresh banner/news      [ {WHITE}All{RESET} ]
    !stop           - Stop all running attack threads             [ {WHITE}All{RESET} ]
    !stpall         - A STOP All Attacks Command                  [ {RED}Root{RESET} ]
    !ping           - Check botnet heartbeats and latency         [ {YELLOW}Vip{RESET} ]
    !broadcast <msg>- Send global news via Discord Bot            [ {RED}Root{RESET} ]
    !logs           - View last 10 real-time system logs          [ {RED}Root{RESET} ]
    !adminhelp      - Show admin management commands              [ {RED}Root{RESET} ]
    !logout         - Exit current session                        [ {WHITE}All{RESET} ]
`;
            await termWrite(helpMenu, 0);
            break;

        case "!adminhelp":
            if (termState.currentPlan === "Root") {
                const adminHelpMenu = `
{RED}ParaStressBotnet - Administration Panel{RESET}
 {WHITE}Access Management Commands:{RESET}
    !edit <key> <plan>  - Generates and adds a key (Free/Vip/Root)    [ {RED}Root{RESET} ]
    !editall <plan>     - Modify all existing keys rank               [ {RED}Root{RESET} ]
    !del <key>          - Removes an existing key from the Cloud      [ {RED}Root{RESET} ]
    !blacklist <ID>     - Bans a machine from the system              [ {RED}Root{RESET} ]
    !unblacklist <ID>   - Unbans a machine from the system            [ {RED}Root{RESET} ]
                    
 {WHITE}Network Control Commands:{RESET}
    !ping               - Checks status and latency of active bots     [ {YELLOW}Vip/Root{RESET} ]
    !stop               - Immediately stops all ongoing attacks        [ {WHITE}All{RESET} ]
    !build              - (Dev) Provides link to download the client   [ {YELLOW}Vip/Root{RESET} ]
`;
                await termWrite(adminHelpMenu, 0);
            } else {
                await termWrite("{RED}[!] Access Denied: Root Rank Required.{RESET}");
            }
            break;

        case "!credits":
            const creditsText = `
{BLUE}============================================================
           {WHITE}PARASTRESS BOTNET INFRASTRUCTURE{BLUE}
============================================================{RESET}
{GREEN}[#]{WHITE} Lead Developer  : {GREEN}Topia{RESET}
{GREEN}[#]{WHITE} Infrastructure  : {WHITE}Cloud-Based Botnet C2{RESET}
{GREEN}[#]{WHITE} Version         : {WHITE}3.0.0{RESET}

{YELLOW}--- CONNECT WITH US ---{RESET}
{BLUE} > {WHITE}Discord      : {WHITE}https://discord.gg/dDsz47K6kM{RESET}
{BLUE} > {WHITE}Telegram     : {WHITE}https://t.me/paradoxtea1{RESET}
{BLUE} > {WHITE}Tiktok       : {WHITE}https://www.tiktok.com/@topiaaaaa_{RESET}

{BLUE}============================================================{RESET}`;
            await termWrite(creditsText, 0.5);
            break;

        case "!rules":
            const rulesText = `
    {RED}                   ⚠️ ParaStress Terms Of Service ⚠️{RESET}
    {WHITE}     Breaking the rules results in immediate suspension or ban. No exceptions.{RESET}

    {RED}🚫 Dstat Is Not Allowed{RESET}
    {WHITE}Dstat is not permitted. It shows misleading power values and often 
    ends up reducing the actual power of my botnet.{RESET}

    {RED}🤡 No Account Sharing Allowed{RESET}
    {WHITE}Anyone caught sharing their account will be permanently banned.{RESET}

    {RED}⚠️ No Attack Governament{RESET}
    {WHITE}No attacks on government related targets. Instant ban if violated.{RESET}

    {RED}🛡 Spamming is not tolerated{RESET}
    {WHITE}Repeatedly attacking the same target is allowed, but excessive flooding is not. 
    If abuse leads to complaints, we may banned and blacklist you from the service.{RESET}

    {RED}⌛ System Violation{RESET}
    {WHITE}Attempting to bypass any system, gain unauthorized access, or exploit 
    vulnerabilities will result in instant termination.{RESET}

    {RED}💬 No Staff Harassment{RESET}
    {WHITE}Disrespecting staff, harassment, threats, or making false accusations 
    will not be tolerated. Result: Blacklist and permanent ban.{RESET}

    {RED}💵 No Refunds{RESET}
    {WHITE}Refunds are not provided in any case.{RESET}

    {RED}❓ Lifetime Policy{RESET}
    {WHITE}The lifetime plan remains active for the entire duration of the project. 
    If the service is ever shut down and later reopens, all lifetime users 
    will regain access automatically.{RESET}

    {RED}⚠️ Terms of Service Change{RESET}
    {WHITE}By purchasing or using the service, you agree that the Terms of Service 
    may be changed at any time, without notice, and your continued use 
    constitutes automatic acceptance.{RESET}

    {RED}🎙 Staffs Rights{RESET}
    {WHITE}Staff reserves the right to suspend, ban, or blacklist any user 
    without detailed explanation.{RESET}

    {WHITE}By purchasing or using the service, you {GREEN}automatically accept all TOS.{RESET}
    {WHITE}For any questions or issues please enter the command {GREEN}!credits.{RESET}`;
            await termWrite(rulesText, 0.5);
            break;

        // --- SIMULATION DES MÉTHODES D'ATTAQUE ---
        case "!udp": case "!tcp": case "!syn": case "!dns": case "!ntp": case "!std": 
        case "!vse": case "!ts3": case "!gre": case "!cod": case "!ovh": case "!home": 
        case "!ldap": case "!stun": case "!icmp": case "!ssdp": case "!game": case "!fivem": 
        case "!stomp": case "!subnet": case "!socket": case "!iprand": case "!mix-amp": 
        case "!rainbow": case "!discord": case "!chargen": case "!ovh-amp": case "!udp-pps": 
        case "!tcp-xmas": case "!tcp-hold": case "!dominate": case "!critical": case "!home-fuck": 
        case "!home-hold": case "!minecraft": case "!udp-bypass": case "!tcp-bypass": 
        case "!tcp-blackboy": case "!tls": case "!http": case "!https": case "!browser": 
        case "!cloudflare": case "!bypass":
            if (args.length < 2) {
                await termWrite(`{RED}Usage: ${cmd} <IP/URL> <PORT/TIME>{RESET}`);
            } else {
                const target = args[0];
                const portOrTime = args[1];

                // 1. Simulation du lancement
                await termWrite(`{YELLOW}[*] Initializing ${cmd.toUpperCase()} attack...{RESET}`);
                await termWrite(`{BLUE}[SYSTEM] Connecting to Botnet API...{RESET}`);
                
                // Petit délai pour le réalisme
                setTimeout(async () => {
                    await termWrite(`{GREEN}[+] Attack successfully sent to ${target} on port/time ${portOrTime}!{RESET}`);
                    await termWrite(`{BLUE}[INFO] Strength: 1.2 Tbps / 450.000 PPS{RESET}`);
                    
                    // 2. Le message de redirection
                    const warningMsg = `
{RED}--------------------------------------------------{RESET}
{YELLOW}[!] ATTENTION: This is a demo interface.{RESET}
{WHITE}If you want to perform real-time attacks on this
infrastructure, you must join our official Discord
to purchase a valid access key.{RESET}

{BLUE}Link: {WHITE}https://discord.gg/dDsz47K6kM{RESET}
{RED}--------------------------------------------------{RESET}
`;
                    await termWrite(warningMsg, 0);
                }, 1000);
            }
            break;

        case "!explain":
            const explanations = {
                // GENERAL
                "help": "{BLUE}[Help]{RESET}\n{WHITE}Affiche le menu d'assistance global avec la liste de toutes les commandes et méthodes disponibles.{RESET}",
                "status": "{BLUE}[Status]{RESET}\n{WHITE}Affiche les détails de votre session, votre adresse IP, votre rang et l'état des serveurs du botnet.{RESET}",
                "rules": "{BLUE}[Rules]{RESET}\n{WHITE}Affiche les conditions d'utilisation de l'infrastructure pour éviter le bannissement.{RESET}",
                "credits": "{BLUE}[Credits]{RESET}\n{WHITE}Affiche les développeurs et les contributeurs du projet ParaStress.{RESET}",
                "resolve": "{BLUE}[Resolve]{RESET}\n{WHITE}Convertit un nom de domaine (URL) en adresse IP exploitable.{RESET}",
                "geoip": "{BLUE}[GeoIP]{RESET}\n{WHITE}Localise géographiquement une IP et identifie son fournisseur d'accès (ISP).{RESET}",
                "lookup": "{BLUE}[Lookup]{RESET}\n{WHITE}Effectue une recherche DNS avancée pour identifier les enregistrements MX, TXT et A d'une cible.{RESET}",
                "whois": "{BLUE}[Whois]{RESET}\n{WHITE}Récupère les informations d'enregistrement d'une organisation ou d'un bloc d'IP.{RESET}",
                "scan": "{BLUE}[Port Scan]{RESET}\n{WHITE}Scanne les 65535 ports d'une cible pour identifier les services ouverts en temps réel.{RESET}",
                "webscan": "{BLUE}[Web Scan]{RESET}\n{WHITE}Analyse agressive d'un site web pour détecter les CMS et les vulnérabilités de surface.{RESET}",

                // L3/L4 - NETWORK & AMPLIFICATION
                "udp": "{BLUE}[UDP Flood]{RESET}\n{WHITE}Custom UDP Flood Payload. Envoie des paquets massifs pour saturer la bande passante.{RESET}",
                "tcp": "{BLUE}[TCP Flood]{RESET}\n{WHITE}Custom TCP Flood Payload. Surcharge la pile réseau avec des segments TCP.{RESET}",
                "syn": "{BLUE}[SYN Flood]{RESET}\n{WHITE}Custom SYN Flood Payload. Épuise les ressources en laissant les connexions semi-ouvertes.{RESET}",
                "dns": "{BLUE}[DNS Amp]{RESET}\n{WHITE}Custom Mixed DNS Amplification. Utilise un facteur x50 pour saturer les liens domestiques.{RESET}",
                "ntp": "{BLUE}[NTP Amp]{RESET}\n{WHITE}Custom Mixed NTP Amplification. Exploite les serveurs de temps pour amplifier le trafic.{RESET}",
                "std": "{BLUE}[STD Flood]{RESET}\n{WHITE}Custom STD Flood Payload. Protocole standard de saturation de socket.{RESET}",
                "vse": "{BLUE}[VSE Flood]{RESET}\n{WHITE}Custom VSE Flood Payload. Cible les protocoles Valve Source Engine (Steam).{RESET}",
                "ts3": "{BLUE}[TS3 Shield]{RESET}\n{WHITE}Layer 3 Security Protocol Flood. Conçu pour déconnecter les serveurs TeamSpeak 3.{RESET}",
                "gre": "{BLUE}[GRE Flood]{RESET}\n{WHITE}Layer 3 Generic Routing Encapsulation. Inonde les tunnels GRE encapsulés.{RESET}",
                "cod": "{BLUE}[COD Flood]{RESET}\n{WHITE}Custom Mixed COD Flood. Payload spécifique aux serveurs Call of Duty.{RESET}",
                "ovh": "{BLUE}[OVH Handshake]{RESET}\n{WHITE}Custom Proxied OVH Handshake. Conçu pour bypass la protection OVH & 100UP.{RESET}",
                "home": "{BLUE}[Home Killer]{RESET}\n{WHITE}Custom Mixed HOME Flood. Conçu pour faire crash les routeurs résidentiels.{RESET}",
                "ldap": "{BLUE}[LDAP Amp]{RESET}\n{WHITE}Custom Mixed LDAP Amplification. Exploite le protocole d'annuaire pour l'amplification.{RESET}",
                "stun": "{BLUE}[STUN Bypass]{RESET}\n{WHITE}Custom Mixed STUN High GBPS. Utilise le protocole STUN pour un bypass massif.{RESET}",
                "icmp": "{BLUE}[ICMP Flood]{RESET}\n{WHITE}Layer 3 ICMP Protocol Flood. Inondation par requêtes ECHO (Ping).{RESET}",
                "ssdp": "{BLUE}[SSDP Amp]{RESET}\n{WHITE}Custom Mixed SSDP-DNS Amplification. Utilise l'UPNP pour amplifier l'attaque.{RESET}",
                "game": "{BLUE}[Game Flood]{RESET}\n{WHITE}Custom Mixed GAME Flood. Algorithme universel pour serveurs de jeux.{RESET}",
                "fivem": "{BLUE}[FiveM Flood]{RESET}\n{WHITE}Custom Mixed FIVEM Flood. Cible les ports et le trafic heartbeat de FiveM.{RESET}",
                "stomp": "{BLUE}[Stomp]{RESET}\n{WHITE}Randomized Flood Payload. Envoie des flux de données totalement aléatoires.{RESET}",
                "subnet": "{BLUE}[Subnet Flood]{RESET}\n{WHITE}Custom SUBNET Flood. Cible une plage d'IP entière au lieu d'un seul hôte.{RESET}",
                "socket": "{BLUE}[Socket Flood]{RESET}\n{WHITE}Custom SOCKET Flood. Tente d'épuiser les sockets disponibles sur la cible.{RESET}",
                "iprand": "{BLUE}[IP Rand]{RESET}\n{WHITE}Layer 3 Multi Protocol Flood. Aléatise l'IP source pour chaque paquet envoyé.{RESET}",
                "mix-amp": "{BLUE}[Mix-Amp]{RESET}\n{WHITE}Custom Mixed Amplification. Combine plusieurs vecteurs d'amplification (DNS/NTP).{RESET}",
                "rainbow": "{BLUE}[Rainbow R6]{RESET}\n{WHITE}Custom Mixed Amp/Bypass. Optimisé pour les serveurs Rainbow Six Siege.{RESET}",
                "discord": "{BLUE}[Discord RTC]{RESET}\n{WHITE}Custom Mixed Payload. Imite le trafic audio/vidéo des salons Discord.{RESET}",
                "chargen": "{BLUE}[Chargen Amp]{RESET}\n{WHITE}Custom Mixed CHARGEN Payload. Utilise le protocole de génération de caractères.{RESET}",
                "ovh-amp": "{BLUE}[OVH Amp]{RESET}\n{WHITE}Custom OVH Amplification. Spécifique à l'infra OVH et aux ports 100UP.{RESET}",
                "udp-pps": "{BLUE}[UDP PPS]{RESET}\n{WHITE}Custom UDP-PPS Payload. Optimisé pour un maximum de paquets par seconde.{RESET}",
                "tcp-xmas": "{BLUE}[TCP Xmas]{RESET}\n{WHITE}Custom TCP-XMAS Mixed. Active tous les flags TCP pour perturber les firewalls.{RESET}",
                "tcp-hold": "{BLUE}[TCP Hold]{RESET}\n{WHITE}Custom TCP-HOLD. Maintient les connexions ouvertes pour épuiser les ressources.{RESET}",
                "dominate": "{BLUE}[Dominate]{RESET}\n{WHITE}Custom DOMINATE High GBPS. Notre méthode la plus puissante en débit pur.{RESET}",
                "critical": "{BLUE}[Critical]{RESET}\n{WHITE}Custom Mixed Amplification. Mix agressif de vecteurs critiques.{RESET}",
                "home-fuck": "{BLUE}[Home Bypass]{RESET}\n{WHITE}Mixed Payload. Spécialement conçu pour bypasser les firewalls domestiques.{RESET}",
                "home-hold": "{BLUE}[Home Hold]{RESET}\n{WHITE}Mixed Payload. Maintient une saturation constante sur les liens résidentiels.{RESET}",
                "minecraft": "{BLUE}[Minecraft]{RESET}\n{WHITE}Custom Mixed Payload. Cible les protocoles BungeeCord et serveurs MC.{RESET}",
                "udp-bypass": "{BLUE}[UDP Bypass]{RESET}\n{WHITE}Custom UDP-BYPASS Mixed. Utilise des en-têtes complexes pour le bypass.{RESET}",
                "tcp-bypass": "{BLUE}[TCP Bypass]{RESET}\n{WHITE}Custom TCP-BYPASS Mixed. Simule des clients réels pour passer les filtres.{RESET}",
                "tcp-blackboy": "{BLUE}[TCP Blackboy]{RESET}\n{WHITE}Custom Mixed TCP Bypass. Algorithme de contournement propriétaire.{RESET}",

                // L7 - APPLICATION
                "tls": "{BLUE}[TLS Flood]{RESET}\n{WHITE}Custom LAYER 7 TLS. Surcharge le CPU via des handshakes SSL/TLS.{RESET}",
                "http": "{BLUE}[HTTP Flood]{RESET}\n{WHITE}Custom LAYER 7 HTTP. Requêtes GET/POST répétitives sur le port 80.{RESET}",
                "https": "{BLUE}[HTTPS Flood]{RESET}\n{WHITE}Custom LAYER 7 HTTPS. Requêtes sécurisées massives sur le port 443.{RESET}",
                "browser": "{BLUE}[Browser Sim]{RESET}\n{WHITE}Custom Mixed BROWSER Method. Simule des navigateurs (Chrome/Firefox/Safari).{RESET}",
                "cloudflare": "{BLUE}[Cloudflare Bypass]{RESET}\n{WHITE}Custom LAYER 7 Cloudflare. Tente de contourner le WAF et le Under Attack Mode.{RESET}",
                "bypass": "{BLUE}[HTTP/2 Bypass]{RESET}\n{WHITE}HTTP/2 Rapid Reset. Exploite les limites du protocole HTTP/2.{RESET}"
            };

            if (args.length === 0) {
                await termWrite("{YELLOW}Usage: !explain <method_name>{RESET}");
                await termWrite("{WHITE}To see all methods type !help {RESET}");
            } else {
                const method = args[0].toLowerCase().replace('!', '');
                if (explanations[method]) {
                    await termWrite(`\n{YELLOW}[DATABASE]: EXPLAINING ${method.toUpperCase()}{RESET}`);
                    await termWrite(explanations[method] + "\n", 0.001);
                } else {
                    await termWrite(`{RED}[!] Method '${method}' not found in ParaStress archives.{RESET}`);
                }
            }
            break;

        case "!status":
            if (!termState.loggedIn) {
                await termWrite("{RED}[!] Login required to view status.{RESET}");
                break;
            }

            // Simulation de calcul du temps restant (basé sur une session de 24h)
            const now = new Date();
            const hours = 23 - now.getHours();
            const minutes = 59 - now.getMinutes();
            const timeLeft = `${hours}h ${minutes}m`;

            // Simulation d'une IP locale/distante
            const userIP = "192.168.1." + Math.floor(Math.random() * 254);

            const statusBox = `
{BLUE}┌──────────────────────────────────────────────────────────┐{RESET}
{BLUE}│{WHITE}                PARA STRESS - SESSION STATUS              {BLUE}│{RESET}
{BLUE}├──────────────────────────────────────────────────────────┤{RESET}
{BLUE}│{WHITE}  ACCOUNT INFO                                            {BLUE}│{RESET}
{BLUE}│{WHITE}  > MACHINE ID : {GREEN}${termState.machineId}{RESET}
{BLUE}│{WHITE}  > RANK       : {WHITE}${termState.currentPlan.toUpperCase()}{RESET}
{BLUE}│{WHITE}  > SESSION IP : {YELLOW}${userIP}{RESET}
{BLUE}│{WHITE}  > EXPIRE IN  : {BLUE}${timeLeft}{RESET}
{BLUE}│{RESET}                                                          {BLUE}│{RESET}
{BLUE}│{WHITE}  INFRASTRUCTURE STATUS                                   {BLUE}│{RESET}
{BLUE}│{WHITE}  > NETWORK    : {GREEN}STABLE (100%){RESET}
{BLUE}│{WHITE}  > API NODES  : {GREEN}ONLINE [3/3]{RESET}
{BLUE}│{WHITE}  > BOT COUNT  : {YELLOW}953 Active Bots{RESET}
{BLUE}│{RESET}                                                          {BLUE}│{RESET}
{BLUE}│{WHITE}  CURRENT KEY  : {BLUE}${termState.currentKey}{RESET}
{BLUE}└──────────────────────────────────────────────────────────┘{RESET}`;
            
            await termWrite(statusBox, 0);
            break;

        case "!clear":
            termContent.innerHTML = "";
            await termWrite(BANNER_TEXT);
            break;

        case "!ping":
            if (termState.currentPlan === "Vip" || termState.currentPlan === "Root") {
                const pingStatus = `
{BLUE}[SYSTEM]{RESET} {WHITE}Checking Botnet Infrastructure...{RESET}
{GREEN}[+]{RESET} {WHITE}C2 Master Server: {GREEN}ONLINE {RESET}{BLUE}(12ms){RESET}
{GREEN}[+]{RESET} {WHITE}Layer 4 API:     {GREEN}ONLINE {RESET}{BLUE}(45ms){RESET}
{GREEN}[+]{RESET} {WHITE}Layer 7 API:     {GREEN}ONLINE {RESET}{BLUE}(38ms){RESET}
{YELLOW}[*]{RESET} {WHITE}Connected Bots:  {YELLOW}1,284 Active Bots{RESET}
`;
                await termWrite(pingStatus, 0.2);
            } else {
                await termWrite("{RED}[!] Access Denied: Vip or Root Rank Required.{RESET}");
            }
            break;

        case "!logout":
            termState.loggedIn = false;
            termState.currentPlan = "Guest";
            termState.currentKey = "None";
            await termWrite("{YELLOW}[*] Logged out.{RESET}");
            updatePrompt();
            break;

        case "!adminhelp":
            if (termState.currentPlan === "Admin") {
                const adminHelpMenu = `
{RED}ParaStressBotnet - Administration Panel{RESET}
 {WHITE}Access Management Commands:{RESET}
    !edit <key> <plan>  - Generates and adds a key (Free/Vip/Admin)    [ {RED}Admin{RESET} ]
    !editall <plan>     - Modify all existing keys rank               [ {RED}Admin{RESET} ]
    !del <key>          - Removes an existing key from the Cloud      [ {RED}Admin{RESET} ]
    !blacklist <ID>     - Bans a machine from the system              [ {RED}Admin{RESET} ]
    !unblacklist <ID>   - Unbans a machine from the system            [ {RED}Admin{RESET} ]
                    
 {WHITE}Network Control Commands:{RESET}
    !ping               - Checks status and latency of active bots     [ {YELLOW}Vip/Admin{RESET} ]
    !stop               - Immediately stops all ongoing attacks        [ {WHITE}All{RESET} ]
    !build              - (Dev) Provides link to download the client   [ {YELLOW}Vip/Admin{RESET} ]
                    
 {WHITE}Utilities:{RESET}
    !clear              - Clears the screen and refreshes news         [ {WHITE}All{RESET} ]
    !logout             - Logs out of the current session              [ {WHITE}All{RESET} ]
`;
                await termWrite(adminHelpMenu, 0);
            } else {
                await termWrite("{RED}[!] Access Denied: Admin Rank Required.{RESET}");
            }
            break;

        default:
            await termWrite(`{RED}[!] Unknown command: ${cmd}. Type !help{RESET}`);
    }
}

// --- INITIALISATION AVEC DETECTION DE SCROLL ---
const terminalSection = document.getElementById('presentation');
let bootStarted = false;

termInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const inputVal = termInput.value.trim();
        if (!inputVal) return;
        const args = inputVal.split(' ');
        const cmd = args.shift().toLowerCase();
        termInput.value = "";
        await termWrite(`{WHITE}> ${inputVal}{RESET}`);
        await handleCommand(cmd, args);
    }
});

async function boot() {
    if (bootStarted) return;
    bootStarted = true;
    if (machineIdSpan) machineIdSpan.innerText = termState.machineId;
    await termWrite(BANNER_TEXT, 0.5); 
    await termWrite("{YELLOW}Welcome. Please !login <key> to continue...{RESET}");
    updatePrompt();
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            boot();
            termInput.focus();
        }
    });
}, { threshold: 0.3 });

if (terminalSection) observer.observe(terminalSection);

document.addEventListener('keydown', (e) => {
    if (bootStarted && document.activeElement !== termInput) {
        const rect = terminalSection.getBoundingClientRect();
        // Vérifie si la section est visible dans le viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            termInput.focus();
        }
    }
});