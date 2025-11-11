/**
 * VISOUND - JavaScript Principal
 * Gerencia interatividade, navegação e formulário
 */

// ============================================
// MENU MOBILE
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// NAVEGAÇÃO SUAVE
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar links que apontam para #
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================

const contatoForm = document.getElementById('contatoForm');
const formMessage = document.getElementById('formMessage');

if (contatoForm) {
    contatoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar formulário
        if (!validarFormulario()) {
            mostrarMensagem('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }
        
        // Coletar dados do formulário
        const formData = new FormData(contatoForm);
        
        try {
            // Enviar para o servidor PHP
            const response = await fetch('process_contact.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                mostrarMensagem('Mensagem enviada com sucesso! Obrigado por entrar em contato.', 'success');
                contatoForm.reset();
            } else {
                mostrarMensagem(data.message || 'Erro ao enviar mensagem. Tente novamente.', 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
        }
    });
}

/**
 * Validar formulário
 */
function validarFormulario() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const assunto = document.getElementById('assunto').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    
    // Validar nome
    if (nome.length < 3) {
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Validar assunto
    if (assunto === '') {
        return false;
    }
    
    // Validar mensagem
    if (mensagem.length < 10) {
        return false;
    }
    
    return true;
}

/**
 * Mostrar mensagem de sucesso/erro
 */
function mostrarMensagem(texto, tipo) {
    formMessage.textContent = texto;
    formMessage.className = `form-message ${tipo}`;
    formMessage.style.display = 'block';
    
    // Scroll para a mensagem
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remover mensagem após 5 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ============================================
// EFEITOS DE SCROLL
// ============================================

// Adicionar classe ao navbar quando scrollar
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
});

// ============================================
// ANIMAÇÃO DE ENTRADA (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar cards e elementos
document.querySelectorAll('.extensao-card, .deficiencia-card, .credito-card, .tutorial-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// VALIDAÇÃO DE CAMPOS EM TEMPO REAL
// ============================================

const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const assuntoSelect = document.getElementById('assunto');
const mensagemInput = document.getElementById('mensagem');

if (nomeInput) {
    nomeInput.addEventListener('blur', () => {
        if (nomeInput.value.trim().length < 3) {
            nomeInput.style.borderColor = '#ff6b6b';
        } else {
            nomeInput.style.borderColor = '#e0e0e0';
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff6b6b';
        } else {
            emailInput.style.borderColor = '#e0e0e0';
        }
    });
}

if (mensagemInput) {
    mensagemInput.addEventListener('blur', () => {
        if (mensagemInput.value.trim().length < 10) {
            mensagemInput.style.borderColor = '#ff6b6b';
        } else {
            mensagemInput.style.borderColor = '#e0e0e0';
        }
    });
}

// ============================================
// ACESSIBILIDADE - NAVEGAÇÃO POR TECLADO
// ============================================

// Permitir navegação por teclado nos cards
document.querySelectorAll('.extensao-card, .deficiencia-card, .credito-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            card.click();
        }
    });
});

// ============================================
// DETECÇÃO DE PREFERÊNCIA DE TEMA
// ============================================

// Verificar preferência do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Ouvir mudanças de preferência
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
});

// ============================================
// LOG DE INICIALIZAÇÃO
// ============================================

console.log('Visound - Site carregado com sucesso!');

/**
 * VISOUND - Painel de Acessibilidade
 * Gerencia tema, tamanho de fonte e zoom
 */

// ============================================
// ELEMENTOS DO DOM
// ============================================

const accessibilityToggle = document.getElementById('accessibilityToggle');
const accessibilityContent = document.getElementById('accessibilityContent');
const accessibilityClose = document.getElementById('accessibilityClose');

const themeLightBtn = document.getElementById('themeLightBtn');
const themeDarkBtn = document.getElementById('themeDarkBtn');

const fontIncreaseBtn = document.getElementById('fontIncreaseBtn');
const fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
const fontSizeControl = document.getElementById('fontSizeControl');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');

const zoomIncreaseBtn = document.getElementById('zoomIncreaseBtn');
const zoomDecreaseBtn = document.getElementById('zoomDecreaseBtn');
const zoomControl = document.getElementById('zoomControl');
const zoomDisplay = document.getElementById('zoomDisplay');

const resetAccessibilityBtn = document.getElementById('resetAccessibilityBtn');

// ============================================
// VARIÁVEIS DE ESTADO
// ============================================

let currentTheme = localStorage.getItem('visound-theme') || 'light';
let currentFontSize = parseInt(localStorage.getItem('visound-font-size')) || 100;
let currentZoom = parseInt(localStorage.getItem('visound-zoom')) || 100;

// ============================================
// INICIALIZAÇÃO
// ============================================

function initAccessibility() {
    // Aplicar preferências salvas
    applyTheme(currentTheme);
    applyFontSize(currentFontSize);
    applyZoom(currentZoom);

    // Atualizar displays
    updateFontSizeDisplay();
    updateZoomDisplay();

    // Adicionar event listeners
    setupEventListeners();
}

// ============================================
// GERENCIAMENTO DO PAINEL
// ============================================

accessibilityToggle.addEventListener('click', () => {
    const isVisible = accessibilityContent.style.display !== 'none';
    accessibilityContent.style.display = isVisible ? 'none' : 'block';
});

accessibilityClose.addEventListener('click', () => {
    accessibilityContent.style.display = 'none';
});

// Fechar painel ao clicar fora
document.addEventListener('click', (e) => {
    const panel = document.getElementById('accessibilityPanel');
    if (!panel.contains(e.target) && accessibilityContent.style.display !== 'none') {
        accessibilityContent.style.display = 'none';
    }
});

// ============================================
// GERENCIAMENTO DE TEMA
// ============================================

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeDarkBtn.classList.add('active');
        themeLightBtn.classList.remove('active');
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeLightBtn.classList.add('active');
        themeDarkBtn.classList.remove('active');
    }

    currentTheme = theme;
    localStorage.setItem('visound-theme', theme);
}

themeLightBtn.addEventListener('click', () => {
    applyTheme('light');
});

themeDarkBtn.addEventListener('click', () => {
    applyTheme('dark');
});

// ============================================
// GERENCIAMENTO DE TAMANHO DE FONTE
// ============================================

function applyFontSize(size) {
    const percentage = size / 100;
    document.documentElement.style.fontSize = (16 * percentage) + 'px';
    currentFontSize = size;
    localStorage.setItem('visound-font-size', size);
    updateFontSizeDisplay();
}

function updateFontSizeDisplay() {
    fontSizeDisplay.textContent = currentFontSize + '%';
    fontSizeControl.value = currentFontSize;
}

fontIncreaseBtn.addEventListener('click', () => {
    if (currentFontSize < 150) {
        applyFontSize(currentFontSize + 10);
    }
});

fontDecreaseBtn.addEventListener('click', () => {
    if (currentFontSize > 80) {
        applyFontSize(currentFontSize - 10);
    }
});

fontSizeControl.addEventListener('input', (e) => {
    applyFontSize(parseInt(e.target.value));
});

// ============================================
// GERENCIAMENTO DE ZOOM
// ============================================

function applyZoom(zoom) {
    document.body.style.zoom = (zoom / 100);
    currentZoom = zoom;
    localStorage.setItem('visound-zoom', zoom);
    updateZoomDisplay();
}

function updateZoomDisplay() {
    zoomDisplay.textContent = currentZoom + '%';
    zoomControl.value = currentZoom;
}

zoomIncreaseBtn.addEventListener('click', () => {
    if (currentZoom < 200) {
        applyZoom(currentZoom + 10);
    }
});

zoomDecreaseBtn.addEventListener('click', () => {
    if (currentZoom > 80) {
        applyZoom(currentZoom - 10);
    }
});

zoomControl.addEventListener('input', (e) => {
    applyZoom(parseInt(e.target.value));
});

// ============================================
// RESTAURAR PADRÕES
// ============================================

resetAccessibilityBtn.addEventListener('click', () => {
    if (confirm('Deseja restaurar todas as configurações de acessibilidade para o padrão?')) {
        applyTheme('light');
        applyFontSize(100);
        applyZoom(100);
        
        // Fechar painel
        accessibilityContent.style.display = 'none';
    }
});

// ============================================
// SETUP DE EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Suporte a atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Alt + A para abrir/fechar painel
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            const isVisible = accessibilityContent.style.display !== 'none';
            accessibilityContent.style.display = isVisible ? 'none' : 'block';
            accessibilityToggle.focus();
        }
    });
}

// ============================================
// DETECÇÃO DE PREFERÊNCIA DO SISTEMA
// ============================================

// Verificar preferência do sistema ao carregar
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (!localStorage.getItem('visound-theme')) {
        applyTheme('dark');
    }
}

// Ouvir mudanças de preferência do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('visound-theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// ============================================
// INICIALIZAR AO CARREGAR
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}

console.log('Painel de Acessibilidade carregado com sucesso!');
