// ================= CONEXIÓN SUPABASE =================
const SUPABASE_URL = "https://wtfwhuitnfrczfgeykyf.supabase.co";

const SUPABASE_KEY = "sb_publishable_XEk6p1w97t6o2xQvIgNZAA_ZFd25l1f";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
// ================= SISTEMA DE NAVEGACIÓN PRINCIPAL (SPA PANTALLAS) =================
const screens = document.querySelectorAll('.screen');

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.id === screenId) {
            screen.classList.add('active');
        }
    });
    // Siempre arrancar arriba del todo al cambiar de pantalla (evita que quede
    // una posición de scroll de la pantalla anterior "pisando" a la nueva)
    window.scrollTo(0, 0);
}

// Navegación entre pantallas de login
document.getElementById('go-to-login').addEventListener('click', () => showScreen('login-screen'));
document.getElementById('go-to-register').addEventListener('click', () => showScreen('register-screen'));
document.getElementById('go-to-login-from-reg').addEventListener('click', () => showScreen('login-screen'));
document.getElementById('back-to-login').addEventListener('click', () => showScreen('login-screen'));
document.getElementById('back-to-login-from-recover').addEventListener('click', () => showScreen('login-screen'));
document.getElementById('go-to-login-from-recover').addEventListener('click', () => showScreen('login-screen'));

// ================= ENRUTADOR DE SUBPÁGINAS DENTRO DEL DASHBOARD =================
const subpages = document.querySelectorAll('.dashboard-section');
const menuItems = document.querySelectorAll('.menu-item');
const bottomNavBtns = document.querySelectorAll('.nav-btn');
const pageTitle = document.getElementById('page-title');

function showSubPage(sectionId) {
    // Ocultar todas las subpáginas
    subpages.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === sectionId) {
            sec.classList.add('active');
        }
    });

    // Actualizar menú lateral
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === sectionId) {
            item.classList.add('active');
        }
    });

    // Actualizar menú inferior móvil
    bottomNavBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === sectionId) {
            btn.classList.add('active');
        }
    });

    // Cambiar título superior de la página
    const nameMap = {
        'sec-inicio': 'Inicio',
        'sec-ejemplares': 'Ejemplares',
        'sec-reproduccion': 'Reproducción',
        'sec-cuarentena': 'Cuarentena',
        'sec-vacunacion': 'Vacunación',
        'sec-nacimientos': 'Nacimientos',
        'sec-destetes': 'Destetes',
        'sec-pesajes': 'Pesajes',
        'sec-alimentacion': 'Alimentación',
        'sec-jaulas': 'Jaulas',
        'sec-reportes': 'Reportes',
        'sec-configuracion': 'Configuración'
    };
    pageTitle.textContent = nameMap[sectionId] || 'Panel de Control';
    
    // Cerrar sidebar y modales en móviles al navegar
    document.querySelector('.sidebar').classList.remove('active');
    moreMenuModal.classList.remove('active');
}

// Escuchar clicks del menú lateral
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        showSubPage(item.getAttribute('data-target'));
    });
});

// Escuchar clicks de la barra inferior
bottomNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.id === 'mobile-more-btn') return; // Se gestiona aparte para abrir el modal
        showSubPage(btn.getAttribute('data-target'));
    });
});

// Escuchar accesos rápidos del inicio
document.querySelectorAll('.quick-icon-btn, .action-tile').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-action') || btn.getAttribute('data-target');
        if (target) showSubPage(target);
    });
});

// ================= MENÚS MÓVILES (HAMBURGUESA Y "MÁS") =================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const moreMenuModal = document.getElementById('more-menu-modal');
const mobileMoreBtn = document.getElementById('mobile-more-btn');
const openMoreMobile = document.getElementById('open-more-mobile');
const closeMoreModal = document.getElementById('close-more-modal');

mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Cerrar sidebar si se hace clic fuera
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Abrir modal de opciones adicionales móviles
const openMoreMenu = () => moreMenuModal.classList.add('active');
if (mobileMoreBtn) mobileMoreBtn.addEventListener('click', openMoreMenu);
if (openMoreMobile) openMoreMobile.addEventListener('click', openMoreMenu);

closeMoreModal.addEventListener('click', () => {
    moreMenuModal.classList.remove('active');
});

// Configurar clicks en la lista del modal "Más"
document.querySelectorAll('.more-grid-item').forEach(item => {
    item.addEventListener('click', () => {
        showSubPage(item.getAttribute('data-target'));
    });
});

// ================= FECHA Y CONMUTADOR VER CONTRASEÑAS =================
function updateDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const today = new Date();
    let dateStr = today.toLocaleDateString('es-ES', options);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    dateElement.textContent = dateStr;
}

const toggleButtons = document.querySelectorAll('.password-toggle');
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.style.color = 'var(--primary)';
        } else {
            input.type = 'password';
            button.style.color = 'var(--text-muted)';
        }
    });
});

// ================= GESTIÓN DEL POPOVER DE PERFIL (ESCRITORIO) =================
const profileDropdownBtn = document.getElementById('profile-dropdown-btn');
const profilePopover = document.getElementById('profile-popover');

profileDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profilePopover.classList.toggle('active');
});

document.addEventListener('click', () => {
    profilePopover.classList.remove('active');
});

// ================= BASE DE DATOS DE USUARIOS (REGISTRO / LOGIN / SUPERADMIN) =================
// Esta es una base de datos simulada en el propio navegador (localStorage), ya que la
// aplicación no tiene un servidor backend. Todo lo que se registra queda guardado en
// este dispositivo/navegador. Para un uso en producción con varios dispositivos
// se recomienda migrar esto a una base de datos real en un servidor.
const USERS_DB_KEY = 'conejosapp_users_db';
const SUPERADMIN_EMAIL = 'admin@conejosapp.com';
const SUPERADMIN_PASSWORD = 'Admin2026#';

// Hash simple (NO es criptografía real) solo para no guardar la contraseña
// tal cual en el almacenamiento local. Con un backend real esto debe hacerse
// con bcrypt/argon2 en el servidor.
function hashPassword(password) {
    const str = 'conejosapp_salt::' + String(password);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36) + '_' + str.length;
}

function createUserRecord({ name, email, password, role = 'user', status = 'active', verified = false }) {
    return {
        id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        name,
        email,
        passwordHash: hashPassword(password),
        role,
        status,
        verified,
        createdAt: new Date().toISOString(),
        lastLoginAt: null
    };
}

// Carga la base de datos de usuarios, migra datos del sistema anterior (si existen)
// y garantiza que siempre exista una cuenta de Super Administrador.
function loadUsersDB() {
    let db = [];
    try {
        db = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
    } catch (e) {
        db = [];
    }

    // Migración desde el sistema de usuarios anterior (más simple e inestable)
    try {
        const legacy = JSON.parse(localStorage.getItem('conejos_users')) || [];
        let migrated = false;
        legacy.forEach(u => {
            if (u && u.email && !db.find(x => x.email === u.email.toLowerCase())) {
                db.push(createUserRecord({ name: u.name || 'Usuario', email: u.email.toLowerCase(), password: u.password || '' }));
                migrated = true;
            }
        });
        if (migrated || legacy.length) localStorage.removeItem('conejos_users');
    } catch (e) { /* nada que migrar */ }

    // Asegurar que exista la cuenta superadministradora
    if (!db.find(u => u.role === 'superadmin')) {
        db.push(createUserRecord({
            name: 'Super Administrador',
            email: SUPERADMIN_EMAIL,
            password: SUPERADMIN_PASSWORD,
            role: 'superadmin',
            status: 'active',
            verified: true
        }));
    }

    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    return db;
}

function saveUsersDB(db) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
}

// ================= REGISTRO E INICIO DE SESIÓN =================
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (!name) {
        alert('Ingresa tu nombre completo.');
        return;
    }
    if (!EMAIL_PATTERN.test(email)) {
        alert('Ingresa un correo electrónico válido.');
        return;
    }
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor verifica.');
        return;
    }

    const db = loadUsersDB();
    if (db.find(u => u.email === email)) {
        // Mensaje claro: el correo ya existe, así que debe cambiar/recuperar su contraseña
        alert('Ese correo electrónico ya está registrado. Debes cambiar tu contraseña para volver a ingresar: usa la opción "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión.');
        showScreen('login-screen');
        document.getElementById('login-email').value = email;
        return;
    }

    const newUser = createUserRecord({ name, email, password });
    newUser.lastLoginAt = new Date().toISOString();
    db.push(newUser);
    saveUsersDB(db);

    loginUser(newUser);
    registerForm.reset();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const db = loadUsersDB();
    const userObj = db.find(u => u.email === email);

    if (!userObj) {
        alert('No encontramos ninguna cuenta con ese correo electrónico. Verifica que esté bien escrito o regístrate.');
        return;
    }
    if (userObj.status === 'blocked') {
        alert('Esta cuenta fue bloqueada por un administrador. Comunícate con el responsable del criadero.');
        return;
    }
    if (userObj.passwordHash !== hashPassword(password)) {
        alert('La contraseña ingresada es incorrecta. Si no la recuerdas, usa "¿Olvidaste tu contraseña?" para cambiarla.');
        return;
    }

    userObj.lastLoginAt = new Date().toISOString();
    saveUsersDB(db);

    loginUser(userObj);
    loginForm.reset();
});

// --- Recuperar / cambiar contraseña (pantalla independiente) ---
const forgotPasswordLink = document.getElementById('forgot-password-link');
const resetPasswordForm = document.getElementById('reset-password-form');

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const currentEmail = document.getElementById('login-email').value.trim();
        document.getElementById('reset-email').value = currentEmail;
        showScreen('recover-screen');
    });
}

if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reset-email').value.trim().toLowerCase();
        const newPassword = document.getElementById('reset-new-password').value;
        const newPasswordConfirm = document.getElementById('reset-new-password-confirm').value;

        if (!EMAIL_PATTERN.test(email)) {
            alert('Ingresa un correo electrónico válido.');
            return;
        }
        if (newPassword.length < 6) {
            alert('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const db = loadUsersDB();
        const userObj = db.find(u => u.email === email);
        if (!userObj) {
            alert('No encontramos ninguna cuenta con ese correo electrónico.');
            return;
        }
        if (userObj.status === 'blocked') {
            alert('Esta cuenta está bloqueada. Comunícate con el administrador.');
            return;
        }

        userObj.passwordHash = hashPassword(newPassword);
        saveUsersDB(db);

        alert('Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión con la nueva contraseña.');
        showScreen('login-screen');
        resetPasswordForm.reset();
        document.getElementById('login-email').value = email;
    });
}

// --- Ya no existe el acceso como invitado: el contenido de la app nunca debe
// ser visible para usuarios que no iniciaron sesión. ---

function loginUser(user) {
    if (!user) return; // Ya no se admite un usuario "Invitado" implícito
    if (!user.name) user.name = user.email;

    localStorage.setItem('conejos_session', JSON.stringify(user));
    
    const shortName = user.name.split(' ')[0];
    
    // Rellenar datos en la interfaz
    const sidebarUser = document.getElementById('sidebar-user-name');
    if (sidebarUser) sidebarUser.textContent = shortName;
    
    document.querySelectorAll('.user-name-placeholder').forEach(el => el.textContent = shortName);
    
    const settingsName = document.getElementById('settings-name');
    if (settingsName) settingsName.value = user.name;
    const settingsEmail = document.getElementById('settings-email');
    if (settingsEmail) settingsEmail.value = user.email;

    // Mostrar el panel de Super Administrador solo si la sesión tiene ese rol
    const isSuperadmin = user.role === 'superadmin';
    document.querySelectorAll('.superadmin-only').forEach(el => {
        el.style.display = isSuperadmin ? '' : 'none';
    });
    const roleLabel = document.querySelector('.profile-widget .role');
    if (roleLabel) roleLabel.textContent = isSuperadmin ? 'Super Administrador' : (user.isGuest ? 'Invitado' : 'Administrador');

    loadUserAppData();
    if (isSuperadmin) renderAdminUsersTable();
    showScreen('app-dashboard');
    showSubPage('sec-inicio');
}

const settingsForm = document.getElementById('settings-form');
if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('settings-name').value.trim();
        if (!newName) return;

        const sessionStr = localStorage.getItem('conejos_session');
        if (!sessionStr) return;
        const session = JSON.parse(sessionStr);
        session.name = newName;
        localStorage.setItem('conejos_session', JSON.stringify(session));

        if (!session.isGuest) {
            const db = loadUsersDB();
            const dbUser = db.find(u => u.email === session.email);
            if (dbUser) {
                dbUser.name = newName;
                saveUsersDB(db);
            }
        }

        const shortName = newName.split(' ')[0];
        const sidebarUser = document.getElementById('sidebar-user-name');
        if (sidebarUser) sidebarUser.textContent = shortName;
        document.querySelectorAll('.user-name-placeholder').forEach(el => el.textContent = shortName);

        alert('Los cambios se guardaron correctamente.');
    });
}

// Logouts
function executeLogout() {
    localStorage.removeItem('conejos_session');
    showScreen('welcome-screen');
}
document.getElementById('logout-btn-desktop').addEventListener('click', executeLogout);
document.getElementById('logout-btn-mobile').addEventListener('click', executeLogout);

// ================= PANEL DE SUPERADMINISTRADOR =================
// Permite ver todos los usuarios registrados, bloquearlos/desbloquearlos,
// verificarlos y ver el perfil completo de cada uno.
function renderAdminUsersTable() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;

    const db = loadUsersDB();
    tbody.innerHTML = '';

    const sorted = db.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sorted.forEach(u => {
        const row = document.createElement('tr');
        const rabbitCount = getUserRabbitCount(u.email);
        const regDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-ES') : '—';
        const lastLogin = u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('es-ES') : 'Nunca';

        const statusBadge = u.status === 'blocked'
            ? '<span class="status-tag status-tratamiento">Bloqueado</span>'
            : '<span class="status-tag status-saludable">Activo</span>';
        const verifiedBadge = u.verified
            ? '<span class="status-tag status-saludable">Verificado</span>'
            : '<span class="status-tag status-gestacion">Sin verificar</span>';
        const roleLabel = u.role === 'superadmin' ? '👑 Superadmin' : 'Usuario';

        row.innerHTML = `
            <td>${escapeHTML(u.name)}</td>
            <td>${escapeHTML(u.email)}</td>
            <td>${roleLabel}</td>
            <td>${statusBadge}</td>
            <td>${verifiedBadge}</td>
            <td>${regDate}</td>
            <td>${lastLogin}</td>
            <td>${rabbitCount}</td>
            <td class="admin-actions-cell"></td>
        `;

        const actionsCell = row.querySelector('.admin-actions-cell');

        const viewBtn = document.createElement('button');
        viewBtn.type = 'button';
        viewBtn.className = 'btn btn-outline btn-sm';
        viewBtn.textContent = 'Ver perfil';
        viewBtn.addEventListener('click', () => openAdminProfileModal(u.id));
        actionsCell.appendChild(viewBtn);

        if (u.role !== 'superadmin') {
            const verifyBtn = document.createElement('button');
            verifyBtn.type = 'button';
            verifyBtn.className = 'btn btn-outline btn-sm';
            verifyBtn.style.marginLeft = '0.4rem';
            verifyBtn.textContent = u.verified ? 'Quitar verificación' : 'Verificar';
            verifyBtn.addEventListener('click', () => toggleUserField(u.id, 'verified', !u.verified));
            actionsCell.appendChild(verifyBtn);

            const blockBtn = document.createElement('button');
            blockBtn.type = 'button';
            blockBtn.className = 'btn btn-outline btn-sm';
            blockBtn.style.marginLeft = '0.4rem';
            blockBtn.style.color = u.status === 'blocked' ? 'var(--primary)' : 'var(--danger)';
            blockBtn.textContent = u.status === 'blocked' ? 'Desbloquear' : 'Bloquear';
            blockBtn.addEventListener('click', () => toggleUserField(u.id, 'status', u.status === 'blocked' ? 'active' : 'blocked'));
            actionsCell.appendChild(blockBtn);
        }

        tbody.appendChild(row);
    });

    const countEl = document.getElementById('admin-users-count');
    if (countEl) countEl.textContent = String(db.length);
}

function getUserRabbitCount(email) {
    try {
        return (JSON.parse(localStorage.getItem(`rabbits_${email}`)) || []).length;
    } catch (e) {
        return 0;
    }
}

function toggleUserField(userId, field, value) {
    const db = loadUsersDB();
    const u = db.find(x => x.id === userId);
    if (!u) return;
    u[field] = value;
    saveUsersDB(db);

    // Si se bloquea a un usuario que tiene sesión abierta en este navegador, se lo desconecta
    const sessionStr = localStorage.getItem('conejos_session');
    if (sessionStr) {
        try {
            const session = JSON.parse(sessionStr);
            if (session && session.email === u.email && field === 'status' && value === 'blocked') {
                localStorage.removeItem('conejos_session');
            }
        } catch (e) { /* ignorar */ }
    }

    renderAdminUsersTable();
}

function openAdminProfileModal(userId) {
    const db = loadUsersDB();
    const u = db.find(x => x.id === userId);
    if (!u) return;

    document.getElementById('admin-profile-name').textContent = u.name;
    document.getElementById('admin-profile-email').textContent = u.email;
    document.getElementById('admin-profile-role').textContent = u.role === 'superadmin' ? 'Super Administrador' : 'Usuario';
    document.getElementById('admin-profile-status').textContent = u.status === 'blocked' ? 'Bloqueado' : 'Activo';
    document.getElementById('admin-profile-verified').textContent = u.verified ? 'Sí' : 'No';
    document.getElementById('admin-profile-created').textContent = u.createdAt ? new Date(u.createdAt).toLocaleString('es-ES') : '—';
    document.getElementById('admin-profile-lastlogin').textContent = u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('es-ES') : 'Nunca';
    document.getElementById('admin-profile-rabbits').textContent = String(getUserRabbitCount(u.email));

    document.getElementById('admin-profile-modal').classList.add('active');
}

const closeAdminProfileModalBtn = document.getElementById('close-admin-profile-modal');
if (closeAdminProfileModalBtn) {
    closeAdminProfileModalBtn.addEventListener('click', () => {
        document.getElementById('admin-profile-modal').classList.remove('active');
    });
}

const adminUsersSearchInput = document.getElementById('admin-users-search');
if (adminUsersSearchInput) {
    adminUsersSearchInput.addEventListener('input', () => {
        const val = adminUsersSearchInput.value.trim().toLowerCase();
        document.querySelectorAll('#admin-users-tbody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
        });
    });
}

// ================= SIMULACIÓN REDES SOCIALES =================
const socialModal = document.getElementById('social-modal');
const modalLoading = document.getElementById('modal-loading');
const modalLoadingText = document.getElementById('modal-loading-text');
const modalAccountSelect = document.getElementById('modal-account-select');
const modalSocialHeaderBrand = document.getElementById('modal-social-header-brand');
const closeModalBtn = document.getElementById('close-modal-btn');

let currentSocialProvider = '';

document.getElementById('google-login').addEventListener('click', () => openSocialModal('Google'));
document.getElementById('facebook-login').addEventListener('click', () => openSocialModal('Facebook'));

function openSocialModal(provider) {
    currentSocialProvider = provider;
    socialModal.classList.add('active');
    modalLoading.style.display = 'flex';
    modalAccountSelect.style.display = 'none';
    modalLoadingText.textContent = `Conectando con ${provider}...`;

    if (provider === 'Google') {
        modalSocialHeaderBrand.innerHTML = `
            <svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            </svg>
        `;
    } else {
        modalSocialHeaderBrand.innerHTML = `
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669v11.854z"/>
            </svg>
        `;
    }

    setTimeout(() => {
        modalLoading.style.display = 'none';
        modalAccountSelect.style.display = 'block';
    }, 1200);
}

closeModalBtn.addEventListener('click', () => socialModal.classList.remove('active'));

document.querySelectorAll('.account-row').forEach(row => {
    row.addEventListener('click', () => {
        const name = row.getAttribute('data-name');
        const email = row.getAttribute('data-email');
        modalAccountSelect.style.display = 'none';
        modalLoading.style.display = 'flex';
        modalLoadingText.textContent = 'Iniciando sesión...';

        setTimeout(() => {
            socialModal.classList.remove('active');
            loginUser({ name, email, social: currentSocialProvider });
        }, 1000);
    });
});

// ================= GESTIÓN DE LA BASE DE DATOS Y ESTADOS DE CONEJOS =================
let state = {
    rabbits: [],
    breeding: [],
    quarantine: [],
    vaccines: [],
    cages: [],
    births: []
};

// Foto por defecto que se asigna a todos los ejemplares que se registran sin
// una foto propia. Es siempre la misma imagen (el logo/mascota de ConejosApp).
// Se mantiene STOCK_RABBIT_PHOTOS y la función getRandomStockPhoto() por
// compatibilidad con el resto del código, pero ya NO elige una foto al azar:
// siempre devuelve esta misma imagen fija.
const STOCK_RABBIT_PHOTOS = [
    'assets/default-rabbit.jpg'
];
const DEFAULT_RABBIT_PHOTO = STOCK_RABBIT_PHOTOS[0];

function getRandomStockPhoto() {
    // Antes elegía una foto al azar de un banco de imágenes; ahora siempre
    // se usa la misma foto fija. Si el dueño del criadero carga una foto real
    // desde el formulario, esa foto (currentPhotoDataUrl) se guarda en
    // rabbit.photo y tiene prioridad sobre esta foto por defecto.
    return DEFAULT_RABBIT_PHOTO;
}

// ID automático correlativo (C-0001, C-0002, ...) que se asigna a cada ejemplar
// a medida que se va agregando al criadero
let rabbitCodeCounter = 0;

function persistRabbitCodeCounter() {
    const session = JSON.parse(localStorage.getItem('conejos_session'));
    if (!session) return;
    localStorage.setItem(`rabbit_code_counter_${session.email}`, String(rabbitCodeCounter));
}

function getNextRabbitCode() {
    rabbitCodeCounter += 1;
    persistRabbitCodeCounter();
    return rabbitCodeCounter;
}

function formatRabbitCode(code) {
    if (!code) return '';
    return `C-${String(code).padStart(4, '0')}`;
}

// --- Jaulas: alta, listado y selector reutilizado en el alta/edición de ejemplares ---
const cageForm = document.getElementById('cage-form');
const cagesList = document.getElementById('cages-list');
const cageBulkForm = document.getElementById('cage-bulk-form');
const cageBulkPreview = document.getElementById('cage-bulk-preview');
const cageQRModal = document.getElementById('cage-qr-modal');
const cageQRTitle = document.getElementById('cage-qr-title');
const cageQRImageWrap = document.getElementById('cage-qr-image-wrap');
const closeCageQRModalBtn = document.getElementById('close-cage-qr-modal');
const printCageQRBtn = document.getElementById('print-cage-qr-btn');

function getCageById(id) {
    return state.cages.find(c => String(c.id) === String(id));
}

function cageBadgeHTML(rabbit) {
    const cage = rabbit.cage ? getCageById(rabbit.cage) : null;
    const label = cage ? cage.name : 'Sin jaula';
    return `<span class="cage-badge">🏠 ${escapeHTML(label)}</span>`;
}

// Genera un objeto QR a partir de un texto, probando el tamaño mínimo necesario
// (la librería vendorizada requiere indicar un "typeNumber" fijo entre 1 y 40).
function buildQRCode(text) {
    for (let typeNumber = 2; typeNumber <= 40; typeNumber += 1) {
        try {
            const qr = qrcode(typeNumber, 'M');
            qr.addData(text);
            qr.make();
            return qr;
        } catch (e) {
            // El texto no entra en este tamaño: se prueba con el siguiente
        }
    }
    return null;
}

// Texto codificado en el QR de cada jaula: identifica la app y el id de la
// jaula, para poder usarlo más adelante en funciones de escaneo.
function cageQRPayload(cage) {
    return `conejosapp:jaula:${cage.id}:${cage.name}`;
}

// Devuelve el <img> del QR de una jaula, listo para insertar en el DOM
// (tanto para la miniatura de la tabla como para el modal ampliado).
function cageQRImgTag(cage, cellSize, margin) {
    const qr = buildQRCode(cageQRPayload(cage));
    if (!qr) return '';
    return qr.createImgTag(cellSize, margin);
}

if (cageForm) {
    cageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cage-name').value.trim();
        const notes = document.getElementById('cage-notes').value.trim();
        if (!name) return;
        state.cages.unshift({ id: Date.now(), name, notes });
        saveStateAndRender('cages');
        cageForm.reset();
    });
}

// --- Generación automática de jaulas en lote (ej: A1, A2, A3...) ---
function buildBulkCageNames() {
    const prefix = document.getElementById('cage-bulk-prefix').value.trim();
    const start = Number(document.getElementById('cage-bulk-start').value);
    const end = Number(document.getElementById('cage-bulk-end').value);
    const padding = Number(document.getElementById('cage-bulk-padding').value);
    if (!prefix || isNaN(start) || isNaN(end) || end < start) return { prefix, names: [] };

    const names = [];
    for (let n = start; n <= end; n += 1) {
        const num = padding > 0 ? String(n).padStart(padding, '0') : String(n);
        names.push(`${prefix}${num}`);
    }
    return { prefix, names };
}

function updateCageBulkPreview() {
    if (!cageBulkPreview) return;
    const { names } = buildBulkCageNames();
    if (names.length === 0) {
        cageBulkPreview.textContent = '';
        return;
    }
    const preview = names.length <= 4 ? names.join(', ') : `${names[0]}, ${names[1]}, ... , ${names[names.length - 1]}`;
    cageBulkPreview.textContent = `Se generarán ${names.length} jaula${names.length === 1 ? '' : 's'}: ${preview}`;
}

if (cageBulkForm) {
    ['cage-bulk-prefix', 'cage-bulk-start', 'cage-bulk-end', 'cage-bulk-padding'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCageBulkPreview);
    });

    cageBulkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const { names } = buildBulkCageNames();
        if (names.length === 0) {
            alert('Revisa el prefijo y el rango: el número final debe ser mayor o igual al inicial.');
            return;
        }
        if (names.length > 300) {
            alert('Por las dudas, generá como máximo 300 jaulas por vez.');
            return;
        }
        const notes = document.getElementById('cage-bulk-notes').value.trim();

        // Evita duplicar jaulas que ya existan con el mismo nombre (sin importar mayúsculas)
        const existingNames = new Set(state.cages.map(c => c.name.toLowerCase()));
        let created = 0;
        let skipped = 0;
        names.forEach((name, i) => {
            if (existingNames.has(name.toLowerCase())) {
                skipped += 1;
                return;
            }
            state.cages.push({ id: Date.now() + i, name, notes });
            existingNames.add(name.toLowerCase());
            created += 1;
        });

        saveStateAndRender('cages');
        cageBulkForm.reset();
        document.getElementById('cage-bulk-start').value = 1;
        document.getElementById('cage-bulk-end').value = 10;
        updateCageBulkPreview();

        let msg = `Se generaron ${created} jaula${created === 1 ? '' : 's'} con su código QR.`;
        if (skipped > 0) msg += ` Se omitieron ${skipped} porque ya existían.`;
        alert(msg);
    });

    updateCageBulkPreview();
}

// --- Modal para ver / imprimir el código QR de una jaula ---
function openCageQRModal(cageId) {
    const cage = getCageById(cageId);
    if (!cage || !cageQRModal) return;
    cageQRTitle.textContent = `Jaula ${cage.name}`;
    const imgTag = cageQRImgTag(cage, 6, 12);
    cageQRImageWrap.innerHTML = imgTag || '<p class="empty-dose-text">No se pudo generar el código QR.</p>';
    cageQRModal.classList.add('active');
}

if (closeCageQRModalBtn) {
    closeCageQRModalBtn.addEventListener('click', () => cageQRModal.classList.remove('active'));
}
if (printCageQRBtn) {
    printCageQRBtn.addEventListener('click', () => window.print());
}

function renderCages() {
    if (!cagesList) return;
    if (state.cages.length === 0) {
        cagesList.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Todavía no registraste ninguna jaula.</td></tr>`;
    } else {
        cagesList.innerHTML = '';
        state.cages.forEach(cage => {
            const occupants = state.rabbits.filter(r => String(r.cage) === String(cage.id)).length;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHTML(cage.name)}</strong></td>
                <td>${escapeHTML(cage.notes || '-')}</td>
                <td>${occupants}</td>
                <td><button type="button" class="cage-qr-thumb" title="Ver código QR"></button></td>
                <td>
                    <button class="btn btn-outline btn-sm view-cage-qr-btn">Ver QR</button>
                    <button class="btn btn-outline btn-sm delete-cage-btn">Eliminar</button>
                </td>
            `;
            // El thumbnail se genera de forma diferida para no trabar el render de tablas grandes
            const thumbBtn = tr.querySelector('.cage-qr-thumb');
            thumbBtn.innerHTML = cageQRImgTag(cage, 2, 4);
            thumbBtn.addEventListener('click', () => openCageQRModal(cage.id));

            tr.querySelector('.view-cage-qr-btn').addEventListener('click', () => openCageQRModal(cage.id));

            tr.querySelector('.delete-cage-btn').addEventListener('click', () => {
                if (occupants > 0 && !confirm(`Esta jaula tiene ${occupants} ejemplar(es) asignado(s). ¿Eliminarla igualmente?`)) return;
                state.cages = state.cages.filter(c => c.id !== cage.id);
                saveStateAndRender('cages');
            });
            cagesList.appendChild(tr);
        });
    }
    populateCageSelect();
}

// Rellena el selector de jaulas del formulario de alta/edición de ejemplar
function populateCageSelect() {
    const select = document.getElementById('modal-rabbit-cage');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">Sin asignar</option>' +
        state.cages.map(c => `<option value="${c.id}">${escapeHTML(c.name)}</option>`).join('');
    if (state.cages.some(c => String(c.id) === current)) select.value = current;
}

// --- Modales para Ejemplares (Registrar y Editar) ---
const addRabbitModal = document.getElementById('add-rabbit-modal');
const openAddRabbitBtn = document.getElementById('open-add-rabbit-modal');
const floatingAddBtn = document.getElementById('floating-add-btn');
const closeAddRabbitModalBtn = document.getElementById('close-add-rabbit-modal');
const addRabbitForm = document.getElementById('add-rabbit-form');
const addRabbitModalTitle = document.getElementById('add-rabbit-modal-title');
const addRabbitModalSubtitle = document.getElementById('add-rabbit-modal-subtitle');
const addRabbitSubmitBtn = document.getElementById('add-rabbit-submit-btn');
const modalRabbitIdField = document.getElementById('modal-rabbit-id');

// Foto: elementos del formulario
const modalRabbitPhotoInput = document.getElementById('modal-rabbit-photo');
const modalRabbitPhotoPreview = document.getElementById('modal-rabbit-photo-preview');
const modalRabbitPhotoPlaceholder = document.getElementById('modal-rabbit-photo-placeholder');
const modalRabbitPhotoRemoveBtn = document.getElementById('modal-rabbit-photo-remove');
let currentPhotoDataUrl = null; // Foto (base64) que se guardará junto al conejo

// editingRabbitId: null = alta de un ejemplar nuevo, número = edición de un ejemplar existente
let editingRabbitId = null;

// Abre el modal en modo "Registrar" (nuevo ejemplar) o "Editar" (ejemplar existente)
const openRabbitModal = (rabbitId = null) => {
    editingRabbitId = rabbitId;
    addRabbitForm.reset();
    setPhotoPreview(null);

    if (rabbitId) {
        const rabbit = getRabbitById(rabbitId);
        if (!rabbit) return;

        addRabbitModalTitle.textContent = 'Editar Ejemplar';
        addRabbitModalSubtitle.textContent = 'Actualizar los datos de este conejo';
        addRabbitSubmitBtn.textContent = 'Guardar cambios';

        modalRabbitIdField.value = rabbit.id;
        document.getElementById('modal-rabbit-name').value = rabbit.name || '';
        document.getElementById('modal-rabbit-breed').value = rabbit.breed || '';
        document.getElementById('modal-rabbit-status').value = rabbit.status || 'Saludable';
        document.getElementById('modal-rabbit-gender').value = rabbit.gender || 'Macho';
        document.getElementById('modal-rabbit-birthdate').value = rabbit.birthDate || '';
        document.getElementById('modal-rabbit-weight').value = (rabbit.weight !== null && rabbit.weight !== undefined) ? rabbit.weight : '';
        setPhotoPreview(rabbit.photo || null);
        populateCageSelect();
        document.getElementById('modal-rabbit-cage').value = rabbit.cage || '';
    } else {
        addRabbitModalTitle.textContent = 'Registrar Ejemplar';
        addRabbitModalSubtitle.textContent = 'Añadir nuevo conejo al inventario';
        addRabbitSubmitBtn.textContent = 'Aceptar';
        modalRabbitIdField.value = '';
        populateCageSelect();
    }

    // Los selectores de madre/padre se rellenan después de fijar editingRabbitId
    // para poder excluir al propio ejemplar (y no permitir que sea su propio progenitor)
    populateParentSelects();
    if (rabbitId) {
        const rabbit = getRabbitById(rabbitId);
        document.getElementById('modal-rabbit-mother').value = rabbit.motherId || '';
        document.getElementById('modal-rabbit-father').value = rabbit.fatherId || '';
    }

    addRabbitModal.classList.add('active');
};

if (openAddRabbitBtn) openAddRabbitBtn.addEventListener('click', () => openRabbitModal());
if (floatingAddBtn) floatingAddBtn.addEventListener('click', () => openRabbitModal());

closeAddRabbitModalBtn.addEventListener('click', () => {
    addRabbitModal.classList.remove('active');
    editingRabbitId = null;
});

// Muestra la vista previa de la foto (o el ícono por defecto si no hay foto)
function setPhotoPreview(dataUrl) {
    currentPhotoDataUrl = dataUrl || null;
    if (dataUrl) {
        modalRabbitPhotoPreview.src = dataUrl;
        modalRabbitPhotoPreview.style.display = 'block';
        modalRabbitPhotoPlaceholder.style.display = 'none';
        modalRabbitPhotoRemoveBtn.style.display = 'inline-flex';
    } else {
        modalRabbitPhotoPreview.src = '';
        modalRabbitPhotoPreview.style.display = 'none';
        modalRabbitPhotoPlaceholder.style.display = 'flex';
        modalRabbitPhotoRemoveBtn.style.display = 'none';
    }
}

// Cargar la foto elegida como imagen (base64) para guardarla junto al conejo
modalRabbitPhotoInput.addEventListener('change', () => {
    const file = modalRabbitPhotoInput.files && modalRabbitPhotoInput.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
});

modalRabbitPhotoRemoveBtn.addEventListener('click', () => {
    modalRabbitPhotoInput.value = '';
    setPhotoPreview(null);
});

// Formulario guardar ejemplar (registrar nuevo o guardar cambios de uno existente)
addRabbitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('modal-rabbit-name').value.trim();
    const breed = document.getElementById('modal-rabbit-breed').value.trim();
    const status = document.getElementById('modal-rabbit-status').value;
    const gender = document.getElementById('modal-rabbit-gender').value;
    const birthDate = document.getElementById('modal-rabbit-birthdate').value || null;
    const weightVal = document.getElementById('modal-rabbit-weight').value;
    const weight = weightVal !== '' ? Number(weightVal) : null;
    const motherVal = document.getElementById('modal-rabbit-mother').value;
    const fatherVal = document.getElementById('modal-rabbit-father').value;
    const cageVal = document.getElementById('modal-rabbit-cage').value;

    if (editingRabbitId) {
        // Editar ejemplar ya cargado
        const rabbit = getRabbitById(editingRabbitId);
        if (rabbit) {
            rabbit.name = name;
            rabbit.breed = breed;
            rabbit.status = status;
            rabbit.gender = gender;
            rabbit.birthDate = birthDate;
            rabbit.weight = weight;
            rabbit.motherId = motherVal ? Number(motherVal) : null;
            rabbit.fatherId = fatherVal ? Number(fatherVal) : null;
            rabbit.cage = cageVal || null;
            rabbit.photo = currentPhotoDataUrl || rabbit.photo || getRandomStockPhoto();
        }
    } else {
        // Registrar nuevo ejemplar
        const newRabbit = {
            id: Date.now(),
            code: getNextRabbitCode(),
            name,
            breed,
            status,
            gender,
            birthDate,
            weight,
            // Si no se subió una foto propia, se asigna una foto de conejo aleatoria
            photo: currentPhotoDataUrl || getRandomStockPhoto(),
            motherId: motherVal ? Number(motherVal) : null,
            fatherId: fatherVal ? Number(fatherVal) : null,
            cage: cageVal || null,
            weaned: true
        };
        state.rabbits.unshift(newRabbit);
    }

    saveStateAndRender('rabbits');
    addRabbitModal.classList.remove('active');
    addRabbitForm.reset();
    setPhotoPreview(null);
    editingRabbitId = null;
});

// Rellena los selectores de "Madre" y "Padre" del alta/edición de ejemplar con los ejemplares existentes
// Si se está editando un ejemplar, se excluye a sí mismo y a sus propios descendientes para
// evitar vínculos de parentesco imposibles (ej: ser su propio padre/madre)
function populateParentSelects() {
    const motherSelect = document.getElementById('modal-rabbit-mother');
    const fatherSelect = document.getElementById('modal-rabbit-father');

    const excluded = new Set();
    if (editingRabbitId) {
        excluded.add(editingRabbitId);
        state.rabbits.forEach(r => {
            if (r.motherId === editingRabbitId || r.fatherId === editingRabbitId) excluded.add(r.id);
        });
    }

    const mothers = state.rabbits.filter(r => r.gender === 'Hembra' && !excluded.has(r.id));
    const fathers = state.rabbits.filter(r => r.gender === 'Macho' && !excluded.has(r.id));

    motherSelect.innerHTML = '<option value="">Desconocida / Externa</option>' +
        mothers.map(r => `<option value="${r.id}">${escapeHTML(r.name)}</option>`).join('');

    fatherSelect.innerHTML = '<option value="">Desconocido / Externo</option>' +
        fathers.map(r => `<option value="${r.id}">${escapeHTML(r.name)}</option>`).join('');
}

// ================= PARENTESCO Y CONTROL DE CONSANGUINIDAD =================
function getRabbitById(id) {
    return state.rabbits.find(r => r.id === id) || null;
}

// Recorre el árbol genealógico de un ejemplar (madre/padre, abuelos, etc.)
// Devuelve un Map<id, {rabbit, gen}> con la generación mínima a la que aparece cada ancestro
function getAncestors(rabbitId, maxGen = 4) {
    const map = new Map();

    function walk(id, gen) {
        if (!id || gen > maxGen) return;
        const rabbit = getRabbitById(id);
        if (!rabbit) return;
        if (!map.has(id) || map.get(id).gen > gen) {
            map.set(id, { rabbit, gen });
        }
        walk(rabbit.motherId, gen + 1);
        walk(rabbit.fatherId, gen + 1);
    }

    const root = getRabbitById(rabbitId);
    if (root) {
        walk(root.motherId, 1);
        walk(root.fatherId, 1);
    }
    return map;
}

// Verifica el riesgo de consanguinidad entre dos ejemplares candidatos a cruzarse
// Devuelve { level: 'alto' | 'medio' | 'bajo' | 'desconocido', message }
function checkKinship(idA, idB) {
    if (!idA || !idB) {
        return { level: 'desconocido', message: 'Selecciona la madre y el padre para verificar el parentesco.' };
    }
    if (idA === idB) {
        return { level: 'alto', message: 'Es el mismo ejemplar. No es posible registrar este cruce.' };
    }

    const a = getRabbitById(idA);
    const b = getRabbitById(idB);
    if (!a || !b) {
        return { level: 'desconocido', message: 'No se encontró información de uno de los ejemplares seleccionados.' };
    }

    // Relación directa: uno es padre/madre del otro
    if (a.motherId === idB || a.fatherId === idB || b.motherId === idA || b.fatherId === idA) {
        return { level: 'alto', message: 'Relación directa: uno de los ejemplares es padre o madre del otro. No se recomienda este cruce.' };
    }

    // Hermanos (comparten uno o ambos progenitores)
    const sameMother = a.motherId && b.motherId && a.motherId === b.motherId;
    const sameFather = a.fatherId && b.fatherId && a.fatherId === b.fatherId;
    if (sameMother && sameFather) {
        return { level: 'alto', message: 'Son hermanos completos (misma madre y mismo padre). Alto riesgo de consanguinidad.' };
    }
    if (sameMother || sameFather) {
        return { level: 'alto', message: 'Son medios hermanos (comparten un progenitor). Alto riesgo de consanguinidad.' };
    }

    // Ancestros en común más allá de los padres (abuelos, etc.)
    const ancA = getAncestors(idA);
    const ancB = getAncestors(idB);
    const common = [];
    ancA.forEach((valA, id) => {
        if (ancB.has(id)) {
            common.push({ rabbit: valA.rabbit, gen: valA.gen + ancB.get(id).gen });
        }
    });

    if (common.length > 0) {
        const detalle = common.map(c => `${c.rabbit.name} (a ${c.gen} generaciones de distancia)`).join(', ');
        return { level: 'medio', message: `Comparten ancestro(s) en común: ${detalle}. Se recomienda precaución.` };
    }

    return { level: 'bajo', message: 'No se detectó parentesco entre estos ejemplares según los registros. Cruce compatible.' };
}

// ================= EDAD Y PESO ESPERADO SEGÚN RAZA =================

// Peso adulto de referencia (kg) por raza. La búsqueda es flexible: no distingue
// mayúsculas/minúsculas ni acentos y admite coincidencia parcial del nombre de la raza.
const BREED_ADULT_WEIGHTS = [
    { match: 'neozelandes', kg: 4.5 },
    { match: 'californiano', kg: 4.5 },
    { match: 'mariposa', kg: 4 },
    { match: 'papillon', kg: 4 },
    { match: 'gigante de flandes', kg: 6 },
    { match: 'chinchilla', kg: 3 },
    { match: 'angora', kg: 3.5 },
    { match: 'cabeza de leon', kg: 1.7 },
    { match: 'leones', kg: 1.7 },
    { match: 'ariete', kg: 5 },
    { match: 'belier', kg: 5 },
    { match: 'mini rex', kg: 1.8 },
    { match: 'rex', kg: 4 },
    { match: 'holandes', kg: 2.3 }
];
const DEFAULT_ADULT_WEIGHT_KG = 3.5;

// Curva de crecimiento aproximada: fracción del peso adulto alcanzado según la edad en semanas.
// Se interpola linealmente entre los puntos.
const GROWTH_CURVE = [
    { weeks: 0, fraction: 0.02 },
    { weeks: 2, fraction: 0.08 },
    { weeks: 4, fraction: 0.20 },
    { weeks: 6, fraction: 0.35 },
    { weeks: 8, fraction: 0.50 },
    { weeks: 10, fraction: 0.62 },
    { weeks: 12, fraction: 0.72 },
    { weeks: 16, fraction: 0.85 },
    { weeks: 20, fraction: 0.92 },
    { weeks: 24, fraction: 0.96 },
    { weeks: 30, fraction: 0.99 },
    { weeks: 36, fraction: 1.0 }
];

function normalizeBreedText(text) {
    return (text || '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar acentos
}

function getAdultWeightForBreed(breed) {
    const normalized = normalizeBreedText(breed);
    const found = BREED_ADULT_WEIGHTS.find(b => normalized.includes(b.match));
    return found ? found.kg : DEFAULT_ADULT_WEIGHT_KG;
}

// Calcula la edad en días a partir de la fecha de nacimiento (string YYYY-MM-DD)
function getAgeInDays(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate + 'T00:00:00');
    if (isNaN(birth.getTime())) return null;
    const diffMs = Date.now() - birth.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

// Convierte la edad en días a un texto legible en español
function formatAgeText(days) {
    if (days === null) return 'Edad desconocida';
    if (days < 7) return `${days} día${days === 1 ? '' : 's'}`;
    const weeks = Math.floor(days / 7);
    if (weeks < 8) return `${weeks} semana${weeks === 1 ? '' : 's'}`;
    const months = Math.floor(days / 30.44);
    if (months < 24) return `${months} mes${months === 1 ? '' : 'es'} (${weeks} semanas)`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return `${years} año${years === 1 ? '' : 's'}${remMonths > 0 ? ` y ${remMonths} mes${remMonths === 1 ? '' : 'es'}` : ''}`;
}

// Interpola la curva de crecimiento para obtener la fracción del peso adulto según la edad en semanas
function getGrowthFraction(weeks) {
    if (weeks <= GROWTH_CURVE[0].weeks) return GROWTH_CURVE[0].fraction;
    for (let i = 0; i < GROWTH_CURVE.length - 1; i++) {
        const a = GROWTH_CURVE[i];
        const b = GROWTH_CURVE[i + 1];
        if (weeks >= a.weeks && weeks <= b.weeks) {
            const ratio = (weeks - a.weeks) / (b.weeks - a.weeks);
            return a.fraction + (b.fraction - a.fraction) * ratio;
        }
    }
    return 1.0; // Adulto (más allá del último punto de la curva)
}

// Calcula el peso esperado (kg) para la raza y edad indicadas
function getExpectedWeight(breed, ageDays) {
    if (ageDays === null) return null;
    const weeks = ageDays / 7;
    const adultWeight = getAdultWeightForBreed(breed);
    const fraction = getGrowthFraction(weeks);
    return Math.round(adultWeight * fraction * 100) / 100;
}

// ================= FICHA DE EJEMPLAR (DETALLE + ÁRBOL GENEALÓGICO) =================
const rabbitDetailModal = document.getElementById('rabbit-detail-modal');
const closeRabbitDetailBtn = document.getElementById('close-rabbit-detail-modal');
const editRabbitFromDetailBtn = document.getElementById('edit-rabbit-from-detail-btn');
const detailTabsBar = document.getElementById('detail-tabs');
const detailTabContent = document.getElementById('detail-tab-content');
const detailObservationsInput = document.getElementById('detail-observations-input');
const saveObservationsBtn = document.getElementById('save-observations-btn');
const observationsSavedMsg = document.getElementById('observations-saved-msg');
let currentDetailRabbitId = null;

closeRabbitDetailBtn.addEventListener('click', () => {
    rabbitDetailModal.classList.remove('active');
});

// Botón "Editar" dentro de la ficha: cierra el detalle y abre el formulario de edición
editRabbitFromDetailBtn.addEventListener('click', () => {
    if (!currentDetailRabbitId) return;
    rabbitDetailModal.classList.remove('active');
    openRabbitModal(currentDetailRabbitId);
});

// Cambia de pestaña dentro de la ficha del conejo (Información, Salud, Reproducción, etc.)
function switchDetailTab(tabName) {
    detailTabsBar.querySelectorAll('.detail-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    detailTabContent.querySelectorAll('.detail-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.getAttribute('data-panel') === tabName);
    });
    // Al cambiar de pestaña, arrancar arriba del todo dentro de esa pestaña
    detailTabContent.scrollTop = 0;
}

detailTabsBar.querySelectorAll('.detail-tab').forEach(tab => {
    tab.addEventListener('click', () => switchDetailTab(tab.getAttribute('data-tab')));
});

// Guarda las observaciones/notas del ejemplar que se está viendo
saveObservationsBtn.addEventListener('click', () => {
    if (!currentDetailRabbitId) return;
    const rabbit = getRabbitById(currentDetailRabbitId);
    if (!rabbit) return;
    rabbit.observations = detailObservationsInput.value.trim();
    saveStateAndRender('rabbits');
    observationsSavedMsg.style.display = 'block';
    setTimeout(() => { observationsSavedMsg.style.display = 'none'; }, 2000);
});

// Genera un "chip" de parentesco. Si el ejemplar existe en el inventario, el chip es
// clicable y al tocarlo abre la ficha de ese familiar (madre, padre, abuelos, etc.)
function pedigreeChip(rabbit) {
    if (!rabbit) return `<span class="pedigree-chip unknown">Desconocido / Externo</span>`;
    return `<span class="pedigree-chip linked" data-rabbit-id="${rabbit.id}">${escapeHTML(rabbit.name)}</span>`;
}

function openRabbitDetail(rabbitId) {
    const rabbit = getRabbitById(rabbitId);
    if (!rabbit) return;
    currentDetailRabbitId = rabbit.id;

    let statusClass = 'status-saludable';
    if (rabbit.status === 'Gestación') statusClass = 'status-gestacion';
    if (rabbit.status === 'Tratamiento') statusClass = 'status-tratamiento';

    document.getElementById('detail-rabbit-name').innerHTML = `${escapeHTML(rabbit.name)}<span class="rabbit-id-tag">${formatRabbitCode(rabbit.code)}</span>`;
    const statusEl = document.getElementById('detail-rabbit-status');
    statusEl.textContent = rabbit.status;
    statusEl.className = `status-tag ${statusClass}`;
    document.getElementById('detail-rabbit-meta').textContent = `${rabbit.breed} • ${rabbit.gender}`;

    // Foto del ejemplar
    const photoEl = document.getElementById('detail-rabbit-photo');
    if (rabbit.photo) {
        photoEl.src = rabbit.photo;
        photoEl.style.display = 'block';
    } else {
        photoEl.src = '';
        photoEl.style.display = 'none';
    }

    // Edad, peso actual y peso esperado para su edad y raza
    const ageDays = getAgeInDays(rabbit.birthDate);
    const ageText = formatAgeText(ageDays);
    const expectedWeight = getExpectedWeight(rabbit.breed, ageDays);

    const statsRow = document.getElementById('detail-stats-row');
    let statsHtml = `
        <div class="detail-stat-box">
            <span class="stat-label">Edad</span>
            <span class="stat-value">${escapeHTML(ageText)}</span>
        </div>
    `;

    if (rabbit.weight !== null && rabbit.weight !== undefined && rabbit.weight !== '') {
        let weightClass = '';
        if (expectedWeight !== null) {
            const diffRatio = (rabbit.weight - expectedWeight) / expectedWeight;
            if (diffRatio < -0.15) weightClass = 'weight-low';
            else if (diffRatio > 0.15) weightClass = 'weight-high';
            else weightClass = 'weight-ok';
        }
        statsHtml += `
            <div class="detail-stat-box ${weightClass}">
                <span class="stat-label">Peso actual</span>
                <span class="stat-value">${rabbit.weight} kg</span>
            </div>
        `;
    }

    if (expectedWeight !== null) {
        statsHtml += `
            <div class="detail-stat-box">
                <span class="stat-label">Peso esperado</span>
                <span class="stat-value">~${expectedWeight} kg</span>
            </div>
        `;
    }

    statsRow.innerHTML = statsHtml;

    // Datos adicionales: jaula, fecha de nacimiento y código
    const infoExtra = document.getElementById('detail-info-extra');
    const cageRabbit = rabbit.cage ? getCageById(rabbit.cage) : null;
    infoExtra.innerHTML = `
        <div class="detail-info-row">
            <span>Código</span>
            <span>${formatRabbitCode(rabbit.code)}</span>
        </div>
        <div class="detail-info-row">
            <span>Fecha de nacimiento</span>
            <span>${rabbit.birthDate || 'Sin registrar'}</span>
        </div>
        <div class="detail-info-row">
            <span>Jaula</span>
            <span>${cageRabbit ? escapeHTML(cageRabbit.name) : 'Sin asignar'}</span>
        </div>
    `;

    const mother = rabbit.motherId ? getRabbitById(rabbit.motherId) : null;
    const father = rabbit.fatherId ? getRabbitById(rabbit.fatherId) : null;
    const maternalGrandmother = mother && mother.motherId ? getRabbitById(mother.motherId) : null;
    const maternalGrandfather = mother && mother.fatherId ? getRabbitById(mother.fatherId) : null;
    const paternalGrandmother = father && father.motherId ? getRabbitById(father.motherId) : null;
    const paternalGrandfather = father && father.fatherId ? getRabbitById(father.fatherId) : null;

    const tree = document.getElementById('detail-pedigree-tree');
    tree.innerHTML = `
        <div>
            <div class="pedigree-gen-label">Padres</div>
            <div class="pedigree-row">
                ${pedigreeChip(mother)}
                ${pedigreeChip(father)}
            </div>
        </div>
        <div>
            <div class="pedigree-gen-label">Abuelos</div>
            <div class="pedigree-row">
                ${pedigreeChip(maternalGrandmother)}
                ${pedigreeChip(maternalGrandfather)}
                ${pedigreeChip(paternalGrandmother)}
                ${pedigreeChip(paternalGrandfather)}
            </div>
        </div>
    `;

    // Al tocar un familiar (chip clicable) se abre su propia ficha
    tree.querySelectorAll('.pedigree-chip.linked').forEach(chip => {
        chip.addEventListener('click', () => {
            const relativeId = Number(chip.getAttribute('data-rabbit-id'));
            openRabbitDetail(relativeId);
        });
    });

    renderRabbitDoses(rabbit.id);
    renderRabbitBreeding(rabbit);
    renderRabbitHealth(rabbit);
    renderRabbitHistory(rabbit);

    // Observaciones guardadas para este ejemplar
    detailObservationsInput.value = rabbit.observations || '';
    observationsSavedMsg.style.display = 'none';

    // La ficha siempre arranca en la pestaña "Información"
    switchDetailTab('info');

    rabbitDetailModal.classList.add('active');
}

// ===== Pestaña "Reproducción": montas y camadas donde el ejemplar participa =====
function renderRabbitBreeding(rabbit) {
    const section = document.getElementById('detail-breeding-section');
    if (!section) return;

    const asParent = state.breeding
        .filter(b => b.motherId === rabbit.id || b.fatherId === rabbit.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const asMotherBirths = state.births
        .filter(b => b.motherId === rabbit.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = `<div class="pedigree-gen-label">Montas registradas</div>`;
    if (asParent.length === 0) {
        html += `<p class="empty-dose-text">Este ejemplar todavía no participó en ninguna monta registrada.</p>`;
    } else {
        html += `<div class="dose-list">` + asParent.map(b => `
            <div class="dose-item">
                <div>
                    <span class="dose-name">${escapeHTML(b.mother)} × ${escapeHTML(b.father)}</span><br>
                    <span class="dose-date">Monta: ${b.date} • Parto estimado: ${b.estBirth}</span>
                </div>
                <span class="status-tag ${b.status === 'Pendiente' ? 'status-gestacion' : 'status-saludable'}">${escapeHTML(b.status)}</span>
            </div>
        `).join('') + `</div>`;
    }

    if (rabbit.gender === 'Hembra') {
        html += `<div class="pedigree-gen-label">Camadas paridas</div>`;
        if (asMotherBirths.length === 0) {
            html += `<p class="empty-dose-text">Todavía no hay camadas registradas para esta hembra.</p>`;
        } else {
            html += `<div class="dose-list">` + asMotherBirths.map(b => {
                const live = b.liveCount !== undefined ? b.liveCount : (b.count || 0);
                const dead = b.deadCount || 0;
                const liveText = `${live} vivo${live === 1 ? '' : 's'}`;
                const deadText = dead > 0 ? ` • ${dead} muerto${dead === 1 ? '' : 's'}` : '';
                return `
                <div class="dose-item">
                    <div>
                        <span class="dose-name">${liveText}${deadText}</span><br>
                        <span class="dose-date">${b.date}${b.notes ? ' • ' + escapeHTML(b.notes) : ''}</span>
                    </div>
                </div>
            `;
            }).join('') + `</div>`;
        }
    }

    section.innerHTML = html;
}

// ===== Pestaña "Salud": estado actual + historial de cuarentena/tratamientos =====
function renderRabbitHealth(rabbit) {
    const section = document.getElementById('detail-health-section');
    if (!section) return;

    const records = state.quarantine
        .filter(q => q.rabbitId === rabbit.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    let statusClass = 'status-saludable';
    if (rabbit.status === 'Gestación') statusClass = 'status-gestacion';
    if (rabbit.status === 'Tratamiento') statusClass = 'status-tratamiento';

    let html = `
        <div class="detail-info-row" style="margin-bottom:1.2rem;">
            <span>Estado actual</span>
            <span class="status-tag ${statusClass}">${escapeHTML(rabbit.status)}</span>
        </div>
        <div class="pedigree-gen-label">Historial de cuarentena y tratamientos</div>
    `;

    if (records.length === 0) {
        html += `<p class="empty-dose-text">Este ejemplar no tiene ingresos a cuarentena registrados.</p>`;
    } else {
        html += `<div class="dose-list">` + records.map(q => `
            <div class="dose-item">
                <div>
                    <span class="dose-name">${escapeHTML(q.reason || 'Sin motivo especificado')}</span><br>
                    <span class="dose-date">${q.date}${q.treatment ? ' • ' + escapeHTML(q.treatment) : ''}</span>
                </div>
            </div>
        `).join('') + `</div>`;
    }

    section.innerHTML = html;
}

// ===== Pestaña "Historial": línea de tiempo con todos los eventos del ejemplar =====
function renderRabbitHistory(rabbit) {
    const section = document.getElementById('detail-history-section');
    if (!section) return;

    const events = [];

    if (rabbit.birthDate) {
        events.push({ icon: '🐰', title: 'Nacimiento', date: rabbit.birthDate });
    }

    state.quarantine.filter(q => q.rabbitId === rabbit.id).forEach(q => {
        events.push({ icon: '🛡️', title: `Cuarentena: ${q.reason || 'Sin motivo especificado'}`, date: q.date });
    });

    state.vaccines.filter(v => v.rabbitId === rabbit.id && v.type === 'aplicada').forEach(v => {
        events.push({ icon: '💉', title: `Vacuna aplicada: ${v.vaccine}`, date: v.date });
    });

    state.breeding.filter(b => b.motherId === rabbit.id || b.fatherId === rabbit.id).forEach(b => {
        events.push({ icon: '❤️', title: `Monta: ${b.mother} × ${b.father}`, date: b.date });
    });

    state.births.filter(b => b.motherId === rabbit.id).forEach(b => {
        const live = b.liveCount !== undefined ? b.liveCount : (b.count || 0);
        const dead = b.deadCount || 0;
        const deadText = dead > 0 ? ` · ${dead} nacido${dead === 1 ? '' : 's'} muerto${dead === 1 ? '' : 's'}` : '';
        events.push({ icon: '🐣', title: `Parto: ${live} gazapo${live === 1 ? '' : 's'} vivo${live === 1 ? '' : 's'}${deadText}`, date: b.date });
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (events.length === 0) {
        section.innerHTML = `<p class="empty-dose-text">Todavía no hay eventos registrados para este ejemplar.</p>`;
        return;
    }

    section.innerHTML = `<div class="history-timeline">` + events.map(e => `
        <div class="history-item">
            <span class="history-icon">${e.icon}</span>
            <div>
                <span class="history-title">${escapeHTML(e.title)}</span>
                <span class="history-date">${e.date}</span>
            </div>
        </div>
    `).join('') + `</div>`;
}
function saveStateAndRender(type) {
    const session = JSON.parse(localStorage.getItem('conejos_session'));
    if (!session) return;

    localStorage.setItem(`${type}_${session.email}`, JSON.stringify(state[type]));

    if (type === 'rabbits') { renderRabbits(); renderWeaningMothers(); renderBirthMothers(); }
    if (type === 'breeding') renderBreeding();
    if (type === 'quarantine') renderQuarantine();
    if (type === 'vaccines') renderVaccines();
    if (type === 'cages') { renderCages(); renderRabbits(); }
    if (type === 'births') { renderBirthMothers(); renderWeaningMothers(); renderBirths(); }
    
    // Actualizar métricas del Dashboard
    updateDashboardMetrics();
}

function loadUserAppData() {
    const session = JSON.parse(localStorage.getItem('conejos_session'));
    if (!session) return;

    // Migración única: elimina cualquier dato de ejemplo que haya quedado guardado
    // en cuentas creadas antes de esta actualización (conejos, montas, cuarentena y
    // vacunas de muestra). Se ejecuta una sola vez por cuenta.
    const migrationKey = `conejos_empty_account_migration_${session.email}`;
    if (!localStorage.getItem(migrationKey)) {
        localStorage.removeItem(`rabbits_${session.email}`);
        localStorage.removeItem(`breeding_${session.email}`);
        localStorage.removeItem(`quarantine_${session.email}`);
        localStorage.removeItem(`vaccines_${session.email}`);
        localStorage.removeItem(`cages_${session.email}`);
        localStorage.removeItem(`births_${session.email}`);
        localStorage.setItem(migrationKey, '1');
    }

    // Cada cuenta nueva arranca completamente vacía: sin ejemplares, montas,
    // cuarentenas ni vacunas de ejemplo precargadas.
    state.rabbits = JSON.parse(localStorage.getItem(`rabbits_${session.email}`)) || [];

    // Migración: asigna foto por defecto y código automático a ejemplares guardados
    // previamente que aún no los tengan (compatibilidad con datos ya existentes)
    let maxExistingCode = 0;
    state.rabbits.forEach(r => {
        if (!r.photo) r.photo = getRandomStockPhoto();
        if (r.code) maxExistingCode = Math.max(maxExistingCode, r.code);
        if (r.weaned === undefined) r.weaned = true; // ejemplares ya existentes se consideran destetados
    });
    state.rabbits.forEach(r => {
        if (!r.code) {
            maxExistingCode += 1;
            r.code = maxExistingCode;
        }
    });

    const storedCounter = Number(localStorage.getItem(`rabbit_code_counter_${session.email}`)) || 0;
    rabbitCodeCounter = Math.max(storedCounter, maxExistingCode);

    state.breeding = JSON.parse(localStorage.getItem(`breeding_${session.email}`)) || [];
    state.quarantine = JSON.parse(localStorage.getItem(`quarantine_${session.email}`)) || [];
    state.vaccines = JSON.parse(localStorage.getItem(`vaccines_${session.email}`)) || [];
    state.cages = JSON.parse(localStorage.getItem(`cages_${session.email}`)) || [];
    state.births = JSON.parse(localStorage.getItem(`births_${session.email}`)) || [];

    renderRabbits();
    renderBreeding();
    renderQuarantine();
    renderVaccines();
    renderCages();
    renderBirthMothers();
    renderBirths();
    renderWeaningMothers();
    updateDashboardMetrics();
}

// --- Renderizar Tarjetas de Conejos (Ejemplares) ---
const rabbitsGrid = document.getElementById('rabbits-grid');
let activeFilter = 'Todos';

function renderRabbits() {
    rabbitsGrid.innerHTML = '';
    
    // Los gazapos recién nacidos (weaned === false) solo viven en el historial
    // reproductivo de la madre y en la pantalla de Destetes: pasan a integrar el
    // plantel activo (este listado) recién cuando son destetados.
    let filtered = state.rabbits.filter(r => r.weaned !== false);
    if (activeFilter !== 'Todos') {
        filtered = filtered.filter(r => r.status === activeFilter);
    }

    // Filtrar por barra de búsqueda si tiene contenido
    const searchVal = document.getElementById('global-search').value.trim().toLowerCase();
    if (searchVal) {
        filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(searchVal) || 
            r.breed.toLowerCase().includes(searchVal)
        );
    }

    if (filtered.length === 0) {
        rabbitsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                No se encontraron ejemplares con los criterios seleccionados.
            </div>
        `;
        return;
    }

    filtered.forEach((rabbit, index) => {
        const card = document.createElement('div');
        card.className = 'rabbit-card';

        let statusClass = 'status-saludable';
        if (rabbit.status === 'Gestación') statusClass = 'status-gestacion';
        if (rabbit.status === 'Tratamiento') statusClass = 'status-tratamiento';

        const genderIcon = rabbit.gender === 'Macho' ? '♂️' : rabbit.gender === 'Hembra' ? '♀️' : '🐰';
        // Usa la foto propia del conejo si fue cargada; si no, la foto fija por defecto
        const photoUrl = rabbit.photo || DEFAULT_RABBIT_PHOTO;

        const mother = rabbit.motherId ? getRabbitById(rabbit.motherId) : null;
        const father = rabbit.fatherId ? getRabbitById(rabbit.fatherId) : null;
        const parentsLine = `Madre: <strong>${mother ? escapeHTML(mother.name) : 'Desconocida'}</strong> · Padre: <strong>${father ? escapeHTML(father.name) : 'Desconocido'}</strong>`;

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${photoUrl}" alt="Conejo">
                <span class="card-tag status-tag ${statusClass}">${rabbit.status}</span>
            </div>
            <div class="card-body">
                <div class="rabbit-meta">
                    <span class="name">${escapeHTML(rabbit.name)}<span class="rabbit-id-tag">${formatRabbitCode(rabbit.code)}</span></span>
                    <span class="gender-badge">${genderIcon}</span>
                </div>
                <div class="rabbit-details-list">
                    <span>Raza: <strong>${escapeHTML(rabbit.breed)}</strong></span>
                    <span>Categoría: <strong>${rabbit.gender}</strong></span>
                </div>
                ${cageBadgeHTML(rabbit)}
                <p class="rabbit-parents-line">${parentsLine}</p>
                <div class="card-actions">
                    <button class="btn btn-outline btn-sm view-rabbit-btn">Ver ficha</button>
                    <button class="btn btn-outline btn-sm edit-rabbit-btn">Editar</button>
                    <button class="btn btn-outline btn-sm delete-rabbit-btn">Eliminar</button>
                </div>
            </div>
        `;

        card.querySelector('.view-rabbit-btn').addEventListener('click', () => {
            openRabbitDetail(rabbit.id);
        });

        card.querySelector('.edit-rabbit-btn').addEventListener('click', () => {
            openRabbitModal(rabbit.id);
        });

        card.querySelector('.delete-rabbit-btn').addEventListener('click', () => {
            if (confirm(`¿Estás seguro de eliminar a ${rabbit.name}?`)) {
                state.rabbits = state.rabbits.filter(r => r.id !== rabbit.id);
                saveStateAndRender('rabbits');
            }
        });

        rabbitsGrid.appendChild(card);
    });

    // Mantener sincronizados los selectores que dependen de la lista de ejemplares
    populateParentSelects();
    populateBreedingSelects();
    populateVaccineRabbitSelect();
    renderVaccineRabbitsGrid();
}

// Filtros
document.querySelectorAll('.filter-group .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-group .btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        renderRabbits();
    });
});

// Buscador
document.getElementById('global-search').addEventListener('input', () => {
    // Si no estamos en la sección de ejemplares, ir a ella para ver resultados
    const activeSec = document.querySelector('.dashboard-section.active');
    if (activeSec && activeSec.id !== 'sec-ejemplares') {
        showSubPage('sec-ejemplares');
    }
    renderRabbits();
});

// --- Reproducción Logic ---
const breedingForm = document.getElementById('breeding-form');
const breedingList = document.getElementById('breeding-list');
const breedMotherSelect = document.getElementById('breed-mother');
const breedFatherSelect = document.getElementById('breed-father');
const kinshipBox = document.getElementById('kinship-check-box');
const kinshipTitle = document.getElementById('kinship-title');
const kinshipMessage = document.getElementById('kinship-message');

// Rellena la grilla de hembras disponibles y el selector de padres (machos) del formulario de reproducción
const breedingMothersGrid = document.getElementById('breeding-mothers-grid');
const breedingFormCard = document.getElementById('breeding-form-card');
const breedingSelectedMotherLabel = document.getElementById('breeding-selected-mother-label');

function populateBreedingSelects() {
    const mothers = state.rabbits.filter(r => r.gender === 'Hembra');
    const fathers = state.rabbits.filter(r => r.gender === 'Macho');

    const currentFather = breedFatherSelect.value;

    if (breedingMothersGrid) {
        if (mothers.length === 0) {
            breedingMothersGrid.innerHTML = `<p class="empty-dose-text">Todavía no hay hembras registradas.</p>`;
        } else {
            breedingMothersGrid.innerHTML = mothers.map(r => miniRabbitCardHTML(r, breedMotherSelect.value)).join('');
            breedingMothersGrid.querySelectorAll('.mini-rabbit-card').forEach(card => {
                card.addEventListener('click', () => {
                    const rabbit = getRabbitById(Number(card.getAttribute('data-rabbit-id')));
                    breedMotherSelect.value = card.getAttribute('data-rabbit-id');
                    breedingMothersGrid.querySelectorAll('.mini-rabbit-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    breedingFormCard.style.display = 'block';
                    breedingSelectedMotherLabel.textContent = `Registrando reproducción para: ${rabbit.name}`;
                    renderKinshipCheck();
                });
            });
        }
    }

    breedFatherSelect.innerHTML = '<option value="" disabled>Selecciona el padre (Macho)</option>' +
        (fathers.length ? fathers.map(r => `<option value="${r.id}">${escapeHTML(r.name)}</option>`).join('')
                        : '<option value="" disabled>No hay machos registrados</option>');

    if (fathers.some(r => String(r.id) === currentFather)) breedFatherSelect.value = currentFather;
}

// Muestra el resultado del chequeo de consanguinidad en un cuadro de alerta
function renderKinshipCheck() {
    const motherId = breedMotherSelect.value ? Number(breedMotherSelect.value) : null;
    const fatherId = breedFatherSelect.value ? Number(breedFatherSelect.value) : null;

    if (!motherId || !fatherId) {
        kinshipBox.style.display = 'none';
        return null;
    }

    const result = checkKinship(motherId, fatherId);

    const levelConfig = {
        alto: { cls: 'alert-danger', title: '⚠️ Riesgo alto de consanguinidad' },
        medio: { cls: 'alert-warning', title: '⚠️ Riesgo moderado, revisa el parentesco' },
        bajo: { cls: 'alert-success', title: '✅ Cruce compatible' },
        desconocido: { cls: 'alert-warning', title: 'Verificando parentesco' }
    };
    const cfg = levelConfig[result.level] || levelConfig.desconocido;

    kinshipBox.style.display = 'flex';
    kinshipBox.className = `alert-box ${cfg.cls}`;
    kinshipTitle.textContent = cfg.title;
    kinshipMessage.textContent = result.message;

    return result;
}

breedMotherSelect.addEventListener('change', renderKinshipCheck);
breedFatherSelect.addEventListener('change', renderKinshipCheck);

breedingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const motherId = Number(breedMotherSelect.value);
    const fatherId = Number(breedFatherSelect.value);
    const dateVal = document.getElementById('breed-date').value;

    const result = checkKinship(motherId, fatherId);
    if (result.level === 'alto') {
        const confirmar = confirm(
            `${result.message}\n\n¿Deseás registrar este cruce de todas formas? No se recomienda por el riesgo de consanguinidad.`
        );
        if (!confirmar) return;
    }

    const motherRabbit = getRabbitById(motherId);
    const fatherRabbit = getRabbitById(fatherId);

    // Calcular fecha parto estimado (+31 días)
    const dateObj = new Date(dateVal);
    dateObj.setDate(dateObj.getDate() + 31);
    const estBirth = dateObj.toISOString().split('T')[0];

    const newBreeding = {
        id: Date.now(),
        motherId,
        fatherId,
        mother: motherRabbit ? motherRabbit.name : 'Desconocida',
        father: fatherRabbit ? fatherRabbit.name : 'Desconocido',
        date: dateVal,
        estBirth,
        status: 'Pendiente'
    };

    state.breeding.unshift(newBreeding);
    saveStateAndRender('breeding');
    breedingForm.reset();
    breedMotherSelect.value = '';
    breedingFormCard.style.display = 'none';
    kinshipBox.style.display = 'none';
    populateBreedingSelects();
});

function renderBreeding() {
    breedingList.innerHTML = '';
    if (state.breeding.length === 0) {
        breedingList.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No hay montas registradas.</td></tr>`;
        return;
    }

    state.breeding.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHTML(item.mother)}</strong></td>
            <td>${escapeHTML(item.father)}</td>
            <td>${item.date}</td>
            <td>${item.estBirth}</td>
            <td><span class="status-tag status-gestacion">${item.status}</span></td>
        `;
        breedingList.appendChild(tr);
    });
}

// --- Cuarentena Logic ---
const quarantineForm = document.getElementById('quarantine-form');
const quarantineList = document.getElementById('quarantine-list');
const quarantineRabbitsGrid = document.getElementById('quarantine-rabbits-grid');
const quarantineFormCard = document.getElementById('quarantine-form-card');
const quarantineSelectedLabel = document.getElementById('quarantine-selected-label');
const quarRabbitIdField = document.getElementById('quar-rabbit-id');

function renderQuarantineRabbitsGrid() {
    if (!quarantineRabbitsGrid) return;
    if (state.rabbits.length === 0) {
        quarantineRabbitsGrid.innerHTML = `<p class="empty-dose-text">Todavía no hay ejemplares registrados.</p>`;
        return;
    }
    quarantineRabbitsGrid.innerHTML = state.rabbits.map(r => {
        const card = miniRabbitCardHTML(r);
        // Marca visualmente a los que ya están en cuarentena
        return r.status === 'Tratamiento' ? card.replace('mini-rabbit-card ', 'mini-rabbit-card selected ') : card;
    }).join('');

    quarantineRabbitsGrid.querySelectorAll('.mini-rabbit-card').forEach(card => {
        card.addEventListener('click', () => {
            const rabbitId = Number(card.getAttribute('data-rabbit-id'));
            const rabbit = getRabbitById(rabbitId);
            if (!rabbit) return;

            if (rabbit.status === 'Tratamiento') {
                // Ya está en cuarentena: dar de alta directamente
                if (confirm(`¿Dar de alta a ${rabbit.name} de cuarentena?`)) {
                    state.quarantine = state.quarantine.filter(q => q.rabbitId !== rabbitId);
                    rabbit.status = 'Saludable';
                    saveStateAndRender('rabbits');
                    saveStateAndRender('quarantine');
                }
            } else {
                // Abrir el formulario para ingresarlo a cuarentena
                quarRabbitIdField.value = rabbitId;
                quarantineSelectedLabel.textContent = `Ingresando a cuarentena: ${rabbit.name}`;
                quarantineFormCard.style.display = 'block';
            }
        });
    });
}

quarantineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rabbitId = Number(quarRabbitIdField.value);
    const rabbit = getRabbitById(rabbitId);
    if (!rabbit) {
        alert('Selecciona un ejemplar de la grilla de arriba.');
        return;
    }
    const reason = document.getElementById('quar-reason').value.trim();
    const treatment = document.getElementById('quar-treatment').value.trim();

    const newQuar = {
        id: Date.now(),
        rabbitId,
        rabbit: rabbit.name,
        reason,
        treatment,
        date: new Date().toISOString().split('T')[0]
    };

    state.quarantine.unshift(newQuar);
    rabbit.status = 'Tratamiento';
    saveStateAndRender('rabbits');
    saveStateAndRender('quarantine');
    quarantineForm.reset();
    quarantineFormCard.style.display = 'none';
    quarRabbitIdField.value = '';
});

function renderQuarantine() {
    quarantineList.innerHTML = '';
    renderQuarantineRabbitsGrid();
    if (state.quarantine.length === 0) {
        quarantineList.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No hay conejos en cuarentena.</td></tr>`;
        return;
    }

    state.quarantine.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${escapeHTML(item.rabbit)}</strong></td>
            <td>${escapeHTML(item.reason)}</td>
            <td>${escapeHTML(item.treatment)}</td>
            <td>${item.date}</td>
            <td><button class="btn btn-outline btn-sm release-btn">Dar de alta</button></td>
        `;
        tr.querySelector('.release-btn').addEventListener('click', () => {
            state.quarantine = state.quarantine.filter(q => q.id !== item.id);
            const rabbit = getRabbitById(item.rabbitId);
            if (rabbit) { rabbit.status = 'Saludable'; saveStateAndRender('rabbits'); }
            saveStateAndRender('quarantine');
        });
        quarantineList.appendChild(tr);
    });
}

// --- Nacimientos / Registrar Partos ---
const birthMothersGrid = document.getElementById('birth-mothers-grid');
const birthFormCard = document.getElementById('birth-form-card');
const birthSelectedMotherLabel = document.getElementById('birth-selected-mother-label');
const birthMotherIdField = document.getElementById('birth-mother-id');
const birthForm = document.getElementById('birth-form');
const birthGazaposCard = document.getElementById('birth-gazapos-card');
const birthGazaposSubtitle = document.getElementById('birth-gazapos-subtitle');
const birthGazaposList = document.getElementById('birth-gazapos-list');
const birthsList = document.getElementById('births-list');

function renderBirthMothers() {
    if (!birthMothersGrid) return;
    const mothers = state.rabbits.filter(r => r.gender === 'Hembra' && r.weaned !== false);
    if (mothers.length === 0) {
        birthMothersGrid.innerHTML = `<p class="empty-dose-text">Todavía no hay hembras registradas.</p>`;
        return;
    }
    birthMothersGrid.innerHTML = mothers.map(r => miniRabbitCardHTML(r, birthMotherIdField.value)).join('');
    birthMothersGrid.querySelectorAll('.mini-rabbit-card').forEach(card => {
        card.addEventListener('click', () => {
            const rabbit = getRabbitById(Number(card.getAttribute('data-rabbit-id')));
            if (!rabbit) return;
            birthMotherIdField.value = rabbit.id;
            birthSelectedMotherLabel.textContent = `Registrando parto de: ${rabbit.name}`;
            birthFormCard.style.display = 'block';
            birthGazaposCard.style.display = 'none';
            birthMothersGrid.querySelectorAll('.mini-rabbit-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
}

if (birthForm) {
    birthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const motherId = Number(birthMotherIdField.value);
        const mother = getRabbitById(motherId);
        if (!mother) {
            alert('Selecciona una madre de la grilla de arriba.');
            return;
        }
        const date = document.getElementById('birth-date').value;
        const liveCount = Number(document.getElementById('birth-live-count').value) || 0;
        const deadCount = Number(document.getElementById('birth-dead-count').value) || 0;
        const notes = document.getElementById('birth-notes').value.trim();
        if (liveCount < 1 && deadCount < 1) {
            alert('Ingresa al menos una cría nacida viva o muerta.');
            return;
        }

        // Busca el padre a partir de la última monta registrada para esta madre (si existe)
        const lastBreeding = state.breeding.find(b => b.motherId === motherId);
        const fatherId = lastBreeding ? lastBreeding.fatherId : null;

        const birthId = Date.now();
        const gazapoIds = [];
        // Solo los gazapos nacidos vivos generan un ejemplar propio en el sistema
        for (let i = 0; i < liveCount; i++) {
            const gazapoId = birthId + i + 1;
            state.rabbits.unshift({
                id: gazapoId,
                code: getNextRabbitCode(),
                name: `Gazapo de ${mother.name} #${i + 1}`,
                breed: mother.breed,
                status: 'Saludable',
                gender: 'Gazapo', // Sexo por defecto: "Sin asignar", editable más adelante
                birthDate: date,
                weight: null,
                photo: null,
                motherId: mother.id,
                fatherId: fatherId,
                cage: mother.cage || null,
                weaned: false,
                birthId: birthId,
                color: null
            });
            gazapoIds.push(gazapoId);
        }

        // El parto queda registrado únicamente en el historial reproductivo de la madre
        // (state.births); los gazapos recién nacidos no ingresan al listado de conejos
        // vivos hasta que sean destetados (ver flag "weaned").
        state.births.unshift({ id: birthId, motherId, fatherId, date, liveCount, deadCount, notes, gazapoIds });
        saveStateAndRender('rabbits');
        saveStateAndRender('births');

        birthForm.reset();
        birthFormCard.style.display = 'none';
        if (gazapoIds.length > 0) {
            renderBirthGazaposEditor(birthId);
        } else {
            birthGazaposCard.style.display = 'none';
        }
    });
}

// Muestra, de a un gazapo por vez (carrusel), el formulario para completar sus datos
// individuales. Funciona igual en computadoras y en dispositivos móviles porque
// siempre renderiza una única tarjeta, sin depender de una grilla de varias columnas.
let currentBirthEditor = null; // { birthId, index }

function renderBirthGazaposEditor(birthId) {
    const birth = state.births.find(b => b.id === birthId);
    if (!birth || !birthGazaposCard || birth.gazapoIds.length === 0) return;

    birthGazaposCard.style.display = 'block';
    currentBirthEditor = { birthId, index: 0 };
    renderCurrentGazapoStep();
}

function renderCurrentGazapoStep() {
    if (!currentBirthEditor || !birthGazaposList) return;
    const birth = state.births.find(b => b.id === currentBirthEditor.birthId);
    if (!birth) return;

    const total = birth.gazapoIds.length;
    const index = currentBirthEditor.index;
    const g = getRabbitById(birth.gazapoIds[index]);
    if (!g) return;

    birthGazaposSubtitle.textContent = `Cría ${index + 1} de ${total}. Completa los datos de cada una antes de continuar:`;

    birthGazaposList.innerHTML = `
        <div class="card glass gazapo-edit-card" data-gazapo-id="${g.id}">
            <div class="rabbit-input-grid">
                <div class="input-with-label">
                    <label class="label-heading">Identificación</label>
                    <input type="text" class="gazapo-name" value="${escapeHTML(g.name)}">
                </div>
                <div class="input-with-label">
                    <label class="label-heading">Sexo</label>
                    <select class="gazapo-gender">
                        <option value="Gazapo" ${g.gender === 'Gazapo' ? 'selected' : ''}>Sin asignar</option>
                        <option value="Macho" ${g.gender === 'Macho' ? 'selected' : ''}>♂️ Macho</option>
                        <option value="Hembra" ${g.gender === 'Hembra' ? 'selected' : ''}>♀️ Hembra</option>
                    </select>
                </div>
                <div class="input-with-label">
                    <label class="label-heading">Color</label>
                    <input type="text" class="gazapo-color" placeholder="Ej: Blanco, Gris" value="${g.color ? escapeHTML(g.color) : ''}">
                </div>
                <div class="input-with-label">
                    <label class="label-heading">Observaciones</label>
                    <input type="text" class="gazapo-notes" placeholder="Opcional" value="${g.notes ? escapeHTML(g.notes) : ''}">
                </div>
            </div>
            <div class="gazapo-carousel-nav">
                <button type="button" class="btn btn-outline btn-sm" id="gazapo-prev-btn" ${index === 0 ? 'disabled' : ''}>← Anterior</button>
                <span class="gazapo-progress-text">${index + 1} / ${total}</span>
                <button type="button" class="btn btn-primary btn-sm" id="gazapo-save-next-btn">${index === total - 1 ? 'Guardar y finalizar' : 'Guardar y siguiente →'}</button>
            </div>
        </div>
    `;

    const card = birthGazaposList.querySelector('.gazapo-edit-card');

    function saveCurrentGazapo() {
        g.name = card.querySelector('.gazapo-name').value.trim() || g.name;
        g.gender = card.querySelector('.gazapo-gender').value;
        g.color = card.querySelector('.gazapo-color').value.trim() || null;
        g.notes = card.querySelector('.gazapo-notes').value.trim() || null;
        saveStateAndRender('rabbits');
    }

    const prevBtn = card.querySelector('#gazapo-prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            saveCurrentGazapo();
            currentBirthEditor.index = Math.max(0, index - 1);
            renderCurrentGazapoStep();
        });
    }

    card.querySelector('#gazapo-save-next-btn').addEventListener('click', () => {
        saveCurrentGazapo();
        if (index < total - 1) {
            currentBirthEditor.index = index + 1;
            renderCurrentGazapoStep();
        } else {
            birthGazaposCard.style.display = 'none';
            currentBirthEditor = null;
            alert('Datos de todas las crías guardados correctamente.');
        }
    });
}

function renderBirths() {
    if (!birthsList) return;
    if (state.births.length === 0) {
        birthsList.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No hay partos registrados.</td></tr>`;
        return;
    }
    birthsList.innerHTML = state.births.map(b => {
        const mother = getRabbitById(b.motherId);
        // Compatibilidad con partos guardados antes de separar vivos/muertos
        const live = b.liveCount !== undefined ? b.liveCount : (b.count || 0);
        const dead = b.deadCount || 0;
        return `
            <tr>
                <td><strong>${mother ? escapeHTML(mother.name) : 'Desconocida'}</strong></td>
                <td>${b.date}</td>
                <td>${live}</td>
                <td>${dead}</td>
                <td>${b.notes ? escapeHTML(b.notes) : '-'}</td>
            </tr>
        `;
    }).join('');
}

// --- Destetes ---
const weaningMothersGrid = document.getElementById('weaning-mothers-grid');
const weaningDetailCard = document.getElementById('weaning-detail-card');
const weaningMotherTitle = document.getElementById('weaning-mother-title');
const weaningKitsGrid = document.getElementById('weaning-kits-grid');
const confirmWeaningBtn = document.getElementById('confirm-weaning-btn');
let selectedWeaningMotherId = null;

function getPendingKits(motherId) {
    return state.rabbits.filter(r => r.motherId === motherId && r.weaned === false);
}

function renderWeaningMothers() {
    if (!weaningMothersGrid) return;
    const mothers = state.rabbits.filter(r => r.gender === 'Hembra' && getPendingKits(r.id).length > 0);

    if (mothers.length === 0) {
        weaningMothersGrid.innerHTML = `<p class="empty-dose-text">No hay madres con crías pendientes de destete por el momento.</p>`;
        weaningDetailCard.style.display = 'none';
        return;
    }

    weaningMothersGrid.innerHTML = mothers.map(r => {
        const pending = getPendingKits(r.id).length;
        const photoUrl = r.photo || DEFAULT_RABBIT_PHOTO;
        return `
            <button type="button" class="mini-rabbit-card ${r.id === selectedWeaningMotherId ? 'selected' : ''}" data-rabbit-id="${r.id}">
                <img src="${photoUrl}" alt="${escapeHTML(r.name)}">
                <div class="mini-info">
                    <span class="mini-name">${escapeHTML(r.name)}</span>
                    <span class="mini-code">${formatRabbitCode(r.code)}</span>
                    <span class="mini-age">${pending} gazapo${pending === 1 ? '' : 's'} pendiente${pending === 1 ? '' : 's'} de destete</span>
                    ${cageBadgeHTML(r)}
                </div>
            </button>
        `;
    }).join('');

    weaningMothersGrid.querySelectorAll('.mini-rabbit-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedWeaningMotherId = Number(card.getAttribute('data-rabbit-id'));
            renderWeaningMothers();
            renderWeaningDetail();
        });
    });

    // Si la madre seleccionada ya no tiene pendientes (se acaba de destetar), cerrar el detalle
    if (selectedWeaningMotherId && getPendingKits(selectedWeaningMotherId).length === 0) {
        selectedWeaningMotherId = null;
        weaningDetailCard.style.display = 'none';
    }
}

function renderWeaningDetail() {
    if (!selectedWeaningMotherId) {
        weaningDetailCard.style.display = 'none';
        return;
    }
    const mother = getRabbitById(selectedWeaningMotherId);
    const kits = getPendingKits(selectedWeaningMotherId);
    if (!mother || kits.length === 0) {
        weaningDetailCard.style.display = 'none';
        return;
    }
    weaningDetailCard.style.display = 'block';
    weaningMotherTitle.textContent = `Crías de ${mother.name}`;
    weaningKitsGrid.innerHTML = kits.map(k => miniRabbitCardHTML(k)).join('');
}

if (confirmWeaningBtn) {
    confirmWeaningBtn.addEventListener('click', () => {
        if (!selectedWeaningMotherId) return;
        const kits = getPendingKits(selectedWeaningMotherId);
        if (kits.length === 0) return;
        if (!confirm(`¿Registrar el destete de ${kits.length} cría(s)? Pasarán al listado de conejos activos.`)) return;
        kits.forEach(k => { k.weaned = true; });
        selectedWeaningMotherId = null;
        saveStateAndRender('rabbits');
    });
}

// --- Vacunación Logic ---
const vaccineForm = document.getElementById('vaccine-form');
const vaccineList = document.getElementById('vaccine-list');
const vacRabbitSelect = document.getElementById('vac-rabbit');
const vacTypeSelect = document.getElementById('vac-type');
const vacDateLabel = document.getElementById('vac-date-label');
const vacDateInput = document.getElementById('vac-date');
const vacNextWrapper = document.getElementById('vac-next-wrapper');
const vacNextDateInput = document.getElementById('vac-next-date');
const vaccineRabbitsGrid = document.getElementById('vaccine-rabbits-grid');

// Calcula cuántos días faltan (o pasaron) para una fecha dada. Negativo = ya pasó.
function daysUntil(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Texto y clase visual de la cuenta regresiva para una próxima dosis
function countdownBadge(dateStr) {
    const diff = daysUntil(dateStr);
    if (diff === null) return { text: '-', cls: '' };
    if (diff < 0) return { text: `Atrasada ${Math.abs(diff)} día${Math.abs(diff) === 1 ? '' : 's'}`, cls: 'late' };
    if (diff === 0) return { text: 'Hoy', cls: 'soon' };
    if (diff <= 7) return { text: `En ${diff} día${diff === 1 ? '' : 's'}`, cls: 'soon' };
    return { text: `En ${diff} días`, cls: 'ok' };
}

// Genera el HTML de una tarjeta compacta de conejo (foto, nombre, ID, edad y jaula).
// Se reutiliza en Vacunación, Reproducción, Cuarentena y Destetes para mantener
// exactamente el mismo estilo visual en toda la aplicación.
function miniRabbitCardHTML(r, selectedId) {
    const ageText = formatAgeText(getAgeInDays(r.birthDate));
    const photoUrl = r.photo || DEFAULT_RABBIT_PHOTO;
    const cage = r.cage ? getCageById(r.cage) : null;
    const isSelected = selectedId !== undefined && String(r.id) === String(selectedId);
    return `
        <button type="button" class="mini-rabbit-card ${isSelected ? 'selected' : ''}" data-rabbit-id="${r.id}">
            <img src="${photoUrl}" alt="${escapeHTML(r.name)}">
            <div class="mini-info">
                <span class="mini-name">${escapeHTML(r.name)}</span>
                <span class="mini-code">${formatRabbitCode(r.code)}</span>
                <span class="mini-age">${escapeHTML(ageText)}</span>
                <span class="mini-cage">🏠 ${cage ? escapeHTML(cage.name) : 'Sin jaula'}</span>
            </div>
        </button>
    `;
}

// Rellena el selector de ejemplar del formulario de vacunación con todos los conejos
function populateVaccineRabbitSelect() {
    const current = vacRabbitSelect.value;
    vacRabbitSelect.innerHTML = '<option value="" disabled' + (current ? '' : ' selected') + '>Selecciona el ejemplar</option>' +
        state.rabbits.map(r => `<option value="${r.id}">${escapeHTML(r.name)} (${formatRabbitCode(r.code)})</option>`).join('');
    if (state.rabbits.some(r => String(r.id) === current)) vacRabbitSelect.value = current;
}

// Dibuja la grilla de "Ejemplares Registrados" con foto y edad, para elegir rápido a quién vacunar
function renderVaccineRabbitsGrid() {
    if (!vaccineRabbitsGrid) return;
    if (state.rabbits.length === 0) {
        vaccineRabbitsGrid.innerHTML = `<p class="empty-dose-text">Todavía no hay ejemplares registrados.</p>`;
        return;
    }

    vaccineRabbitsGrid.innerHTML = state.rabbits.map(r => miniRabbitCardHTML(r, vacRabbitSelect.value)).join('');

    vaccineRabbitsGrid.querySelectorAll('.mini-rabbit-card').forEach(card => {
        card.addEventListener('click', () => {
            vacRabbitSelect.value = card.getAttribute('data-rabbit-id');
            vaccineRabbitsGrid.querySelectorAll('.mini-rabbit-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
}

// Alterna la interfaz según si la vacuna se va a "Programar" a futuro o "Aplicar hoy"
function updateVaccineTypeUI() {
    if (vacTypeSelect.value === 'aplicada') {
        vacDateLabel.textContent = 'Fecha de aplicación';
        vacDateInput.value = new Date().toISOString().split('T')[0];
        vacNextWrapper.style.display = 'flex';
    } else {
        vacDateLabel.textContent = 'Fecha programada';
        vacNextWrapper.style.display = 'none';
        vacNextDateInput.value = '';
    }
}
vacTypeSelect.addEventListener('change', updateVaccineTypeUI);
updateVaccineTypeUI();

vaccineForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rabbitId = Number(vacRabbitSelect.value);
    const vaccine = document.getElementById('vac-name').value.trim();
    const type = vacTypeSelect.value; // 'programada' | 'aplicada'
    const date = vacDateInput.value;
    const nextDoseDate = type === 'aplicada' && vacNextDateInput.value ? vacNextDateInput.value : null;

    if (!rabbitId) {
        alert('Selecciona el ejemplar a vacunar.');
        return;
    }

    const newVac = {
        id: Date.now(),
        rabbitId,
        vaccine,
        type,
        date,
        nextDoseDate
    };

    state.vaccines.unshift(newVac);
    saveStateAndRender('vaccines');
    vaccineForm.reset();
    updateVaccineTypeUI();
    renderVaccineRabbitsGrid();
});

function renderVaccines() {
    vaccineList.innerHTML = '';
    if (state.vaccines.length === 0) {
        vaccineList.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No hay vacunas registradas.</td></tr>`;
        return;
    }

    state.vaccines.forEach(item => {
        const rabbit = getRabbitById(item.rabbitId);
        const rabbitName = rabbit ? rabbit.name : 'Ejemplar eliminado';
        const rabbitPhoto = rabbit ? (rabbit.photo || getRandomStockPhoto()) : '';

        let statusText = 'Aplicada';
        let statusClass = 'status-aplicada';
        if (item.type === 'programada') {
            const diff = daysUntil(item.date);
            if (diff !== null && diff < 0) {
                statusText = 'Atrasada';
                statusClass = 'status-atrasada';
            } else {
                statusText = 'Programada';
                statusClass = 'status-programada';
            }
        }

        let nextDoseHtml = '<span style="color:var(--text-muted);">-</span>';
        if (item.type === 'programada') {
            const badge = countdownBadge(item.date);
            nextDoseHtml = `<span class="dose-countdown ${badge.cls}">${badge.text}</span>`;
        } else if (item.nextDoseDate) {
            const badge = countdownBadge(item.nextDoseDate);
            nextDoseHtml = `${item.nextDoseDate} <span class="dose-countdown ${badge.cls}">${badge.text}</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    ${rabbit ? `<img src="${rabbitPhoto}" alt="${escapeHTML(rabbitName)}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : ''}
                    <strong>${escapeHTML(rabbitName)}</strong>
                </div>
            </td>
            <td>${escapeHTML(item.vaccine)}</td>
            <td><span class="status-tag ${statusClass}">${statusText}</span></td>
            <td>${item.date}</td>
            <td>${nextDoseHtml}</td>
            <td><button class="delete-btn remove-vaccine-btn" title="Eliminar registro">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button></td>
        `;
        tr.querySelector('.remove-vaccine-btn').addEventListener('click', () => {
            state.vaccines = state.vaccines.filter(v => v.id !== item.id);
            saveStateAndRender('vaccines');
        });
        vaccineList.appendChild(tr);
    });
}

// Dibuja, dentro de la ficha del conejo, las dosis ya dadas y las próximas dosis con cuenta regresiva
function renderRabbitDoses(rabbitId) {
    const section = document.getElementById('detail-vaccine-section');
    if (!section) return;

    const records = state.vaccines.filter(v => v.rabbitId === rabbitId);
    const givenDoses = records
        .filter(v => v.type === 'aplicada')
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Próximas dosis: vacunas programadas a futuro/hoy + refuerzos con próxima dosis definida
    const upcomingDoses = [];
    records.forEach(v => {
        if (v.type === 'programada') {
            upcomingDoses.push({ vaccine: v.vaccine, date: v.date });
        }
        if (v.type === 'aplicada' && v.nextDoseDate) {
            upcomingDoses.push({ vaccine: `${v.vaccine} (refuerzo)`, date: v.nextDoseDate });
        }
    });
    upcomingDoses.sort((a, b) => new Date(a.date) - new Date(b.date));

    let html = `<div class="pedigree-gen-label">Dosis dadas</div>`;
    if (givenDoses.length === 0) {
        html += `<p class="empty-dose-text">Todavía no se registraron dosis aplicadas.</p>`;
    } else {
        html += `<div class="dose-list">` + givenDoses.map(v => `
            <div class="dose-item">
                <div>
                    <span class="dose-name">${escapeHTML(v.vaccine)}</span><br>
                    <span class="dose-date">${v.date}</span>
                </div>
            </div>
        `).join('') + `</div>`;
    }

    html += `<div class="pedigree-gen-label">Próximas dosis</div>`;
    if (upcomingDoses.length === 0) {
        html += `<p class="empty-dose-text">No hay próximas dosis programadas.</p>`;
    } else {
        html += `<div class="dose-list">` + upcomingDoses.map(v => {
            const badge = countdownBadge(v.date);
            return `
                <div class="dose-item">
                    <div>
                        <span class="dose-name">${escapeHTML(v.vaccine)}</span><br>
                        <span class="dose-date">${v.date}</span>
                    </div>
                    <span class="dose-countdown ${badge.cls}">${badge.text}</span>
                </div>
            `;
        }).join('') + `</div>`;
    }

    section.innerHTML = html;
}

// --- Actualización de Métricas del Dashboard ---
function updateDashboardMetrics() {
    // Solo cuenta como "plantel activo" a los ejemplares ya destetados
    // (los gazapos recién nacidos no forman parte de estas métricas todavía)
    const activeRabbits = state.rabbits.filter(r => r.weaned !== false);

    // 1. Total ejemplares activos
    const totalRabbits = activeRabbits.length;
    document.querySelectorAll('.metric-card')[0].querySelector('h3').textContent = totalRabbits;
    
    // 2. Reproducciones este mes
    const totalBreeding = state.breeding.length;
    document.querySelectorAll('.metric-card')[1].querySelector('h3').textContent = totalBreeding;

    // 3. Vacunaciones programadas
    const totalVaccines = state.vaccines.length;
    document.querySelectorAll('.metric-card')[2].querySelector('h3').textContent = totalVaccines;

    // 4. Cuarentenas activas
    const totalQuarantine = state.quarantine.length;
    document.querySelectorAll('.metric-card')[3].querySelector('h3').textContent = totalQuarantine;

    // 5. Actualizar el Donut Chart del Dashboard (Machos, Hembras, Gazapos)
    const machos = activeRabbits.filter(r => r.gender === 'Macho').length;
    const hembras = activeRabbits.filter(r => r.gender === 'Hembra').length;
    const gazapos = activeRabbits.filter(r => r.gender === 'Gazapo').length;
    const crecimiento = Math.max(0, totalRabbits - (machos + hembras + gazapos));

    // Refrescar el número del centro
    document.querySelector('.donut-center .number').textContent = totalRabbits;

    // Actualizar leyenda
    const legendItems = document.querySelectorAll('.legend-item');
    if (legendItems.length >= 4) {
        legendItems[0].querySelector('.val').textContent = machos;
        legendItems[1].querySelector('.val').textContent = hembras;
        legendItems[2].querySelector('.val').textContent = gazapos;
        legendItems[3].querySelector('.val').textContent = crecimiento;
    }

    // Calcular porcentajes y ajustar el Donut SVG
    const svgCircles = document.querySelectorAll('.donut-chart circle');
    if (svgCircles.length >= 5 && totalRabbits > 0) {
        const pMachos = (machos / totalRabbits) * 100;
        const pHembras = (hembras / totalRabbits) * 100;
        const pGazapos = (gazapos / totalRabbits) * 100;
        const pCrecimiento = (crecimiento / totalRabbits) * 100;

        // Machos:
        svgCircles[1].setAttribute('stroke-dasharray', `${pMachos} ${100 - pMachos}`);
        svgCircles[1].setAttribute('stroke-dashoffset', '100');

        // Hembras:
        svgCircles[2].setAttribute('stroke-dasharray', `${pHembras} ${100 - pHembras}`);
        svgCircles[2].setAttribute('stroke-dashoffset', `${100 - pMachos}`);

        // Gazapos:
        svgCircles[3].setAttribute('stroke-dasharray', `${pGazapos} ${100 - pGazapos}`);
        svgCircles[3].setAttribute('stroke-dashoffset', `${100 - pMachos - pHembras}`);

        // Crecimiento:
        svgCircles[4].setAttribute('stroke-dasharray', `${pCrecimiento} ${100 - pCrecimiento}`);
        svgCircles[4].setAttribute('stroke-dashoffset', `${100 - pMachos - pHembras - pGazapos}`);
    }
}

// Evitar inyección de código
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ================= GESTIÓN DEL SERVICE WORKER (PWA) =================
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA elección: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });
}

window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
});

// ================= INICIALIZACIÓN DE LA APLICACIÓN =================
window.addEventListener('load', () => {
    try {
        updateDate();
    } catch(e) { console.error("Error al actualizar la fecha:", e); }
    
    setInterval(() => {
        try {
            updateDate();
        } catch(e) {}
    }, 60000);

    let activeSession = null;
    try {
        const sessionStr = localStorage.getItem('conejos_session');
        if (sessionStr && sessionStr !== "undefined") {
            activeSession = JSON.parse(sessionStr);
        }
    } catch (e) {
        console.error("Error al cargar la sesión activa:", e);
        localStorage.removeItem('conejos_session');
    }

    if (activeSession && activeSession.name) {
        // Si la cuenta fue bloqueada o eliminada desde que se guardó la sesión, se cierra la sesión
        const db = loadUsersDB();
        const dbUser = db.find(u => u.email === activeSession.email);
        if (!dbUser) {
            localStorage.removeItem('conejos_session');
            showScreen('welcome-screen');
            return;
        }
        if (dbUser.status === 'blocked') {
            localStorage.removeItem('conejos_session');
            showScreen('welcome-screen');
            alert('Tu cuenta fue bloqueada por un administrador.');
            return;
        }
        loginUser(dbUser);
    } else {
        showScreen('welcome-screen');
    }
});


// ================= PRUEBA SUPABASE =================

async function probarSupabase(){

    const { data, error } = await supabaseClient
        .from("conejos")
        .select("*");

    if(error){
        console.log("Error Supabase:", error);
    } else {
        console.log("Supabase conectado:", data);
    }

}

probarSupabase();