document.addEventListener('DOMContentLoaded', async function () {
    if (getQueryParameter('language')) {
        language = getQueryParameter('language')
        changeLanguage(language);
    } else {
        setLanguageBasedOnBrowser()
    }
    
    applyColorScheme(); // service worker

    const flagDiv = document.getElementById('flagDiv');
    const flagMenu = document.getElementById('flagMenu');
    
    flagDiv.addEventListener('click', () => {
        flagMenu.style.display = flagMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!flagDiv.contains(event.target)) {
            flagMenu.style.display = 'none';
        }
    });
});

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setQueryParameter(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

var selectedFlag = document.getElementById('selectedFlag')
var brFlag = document.getElementById('brOption')
var usFlag = document.getElementById('usOption')
var esFlag = document.getElementById('esOption')
var frFlag = document.getElementById('frOption')

brFlag.addEventListener('click', function() {
    changeLanguage('pt');
});

usFlag.addEventListener('click', function() {
    changeLanguage('en');
});

esFlag.addEventListener('click', function() {
    changeLanguage('es');
});

frFlag.addEventListener('click', function() {
    changeLanguage('fr');
});


let selectedLanguage = 'en';

function changeLanguage(language) {
    // Atualiza o valor do idioma selecionado na variável global
    selectedLanguage = language;

    const elementsToTranslate = document.querySelectorAll('[id]');
    // Feche o simulador para evitar elementos dinâmicos não traduzidos
    setElementContent(language);
    setQueryParameter('language', language);

    var selectedFlag = document.getElementById('selectedFlag')

    if (language === 'en') {
        selectedFlag.src = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f1fa-1f1f8.svg'
        selectedFlag.alt = 'EN Flag'
    } else if (language === 'es') {
        selectedFlag.src = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f1ea-1f1f8.svg'
        selectedFlag.alt = 'ES Flag'
    } else if (language === 'fr') {
        selectedFlag.src = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f1eb-1f1f7.svg'
        selectedFlag.alt = 'FR Flag'
    } else if (language === 'pt') {
        selectedFlag.src = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f1e7-1f1f7.svg'
        selectedFlag.alt = 'BR Flag'
    }

    elementsToTranslate.forEach(element => {
        const key = element.id;
        if (translations[selectedLanguage][key]) {
            if (element.querySelector('span')) {
                // Tratamento especial para elementos com span
                element.firstChild.textContent = translations[selectedLanguage][key];
            } else {
                // Para outros elementos
                element.textContent = translations[selectedLanguage][key];
            }
        }
    });
}

function setLanguageBasedOnBrowser() {
    const userLanguage = navigator.language || navigator.userLanguage;
    if (userLanguage === 'pt-BR' || userLanguage === 'pt-PT') {
        changeLanguage('pt');
    } else if (userLanguage === 'es') {
        changeLanguage('es');
    } else if (userLanguage === 'fr') {
        changeLanguage('fr');
    } else {
        changeLanguage('en');
    }
}


function setElementContent(selectedLanguage) {
    document.getElementById('flagDiv').title = translations[selectedLanguage]['flagDivTitle'];
    document.getElementById('developerNameLabel').title = translations[selectedLanguage]['developerNameTitle'];
    document.getElementById('bmac2Label').title = translations[selectedLanguage]['bmac2LabelTitle'];
    document.getElementById('github_icon').title = translations[selectedLanguage]['githubIconTitle'];
}

function copyUrl() {
    // Obtém a URL atual do navegador
    var url = window.location.href;

    // Cria um elemento de input para inserir a URL
    var inputElement = document.createElement('input');
    inputElement.style.position = 'fixed';
    inputElement.style.opacity = 0;
    inputElement.value = url;
    document.body.appendChild(inputElement);

    // Seleciona o texto dentro do input
    inputElement.select();

    // Executa o comando de cópia
    document.execCommand('copy');

    // Remove o elemento de input
    document.body.removeChild(inputElement);

    // Alerta ou mensagem de confirmação opcional
    notification(translations[selectedLanguage]['copySuccessful']);
}

/*  ************************ */

function notification(customMessage) {
    const notification_div = document.getElementById("notification");
    const message = document.getElementById("notification-message");
    message.textContent = customMessage;
    notification_div.style.opacity = 1;
    notification_div.classList.remove("hidden");

    setTimeout(() => {
        notification_div.style.opacity = 0;
        setTimeout(() => {
            notification_div.classList.add("hidden");
            message.textContent = ''
            message.style = ''
        }, 500);
    }, 4000); // Tempo de exibição
};

// Função para formatar a data no formato dd/mm/yyyy
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


function hasRequiredParameters() {
    const requiredParams = [
        'initial_value', 
        'monthly_value', 
        'term', 
        'yield', 
        'description', 
        'yd',
        'taxes'
    ];

    const urlParams = new URLSearchParams(window.location.search);
    for (let param of requiredParams) {
        if (!urlParams.has(param)) {
            return false;
        }
    }

    // Extraindo os valores dos parâmetros
    const initialValue = parseFloat(urlParams.get('initial_value'));
    const monthlyValue = parseFloat(urlParams.get('monthly_value'));
    const term = parseInt(urlParams.get('term'), 10);
    const yieldRate = parseFloat(urlParams.get('yield'));
    const description = String(urlParams.get('description'));
    const rent_description = String(urlParams.get('yd'))
    const taxes = String(urlParams.get('taxes'));

    // Chama a função calcularInvestimento com os parâmetros extraídos
    calcularInvestimento(initialValue, monthlyValue, term, yieldRate, description, rent_description, taxes);
    return true;
}

document.getElementById('search_bar_content').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch()
    }
});

let publicToken = '8KuA9GwNbaJYvTD8U6h64beb6d6dd56c'

function handleSearch() {
    const content = document.getElementById('search_bar_content').value.trim();
    if (content === '') { return }

    // Verificar se é um ID do Spotify
    const spotifyIdRegex = /^(?:https:\/\/open\.spotify\.com\/(?:intl-pt\/)?track\/)?([a-zA-Z0-9]{22})(?:\?si=[a-zA-Z0-9]+)?$/;

    // Verificar se é um ISRC
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;

    // Verificar se é um Abstrack (número entre 2 e 10 dígitos)
    const abstrackRegex = /^\d{2,10}$/;

    if (spotifyIdRegex.test(content)) {
        const spotifyId = content.match(spotifyIdRegex)[1]; // Captura o ID do Spotify
        searchSpotifyId(spotifyId);
    } else if (isrcRegex.test(content)) {
        document.getElementById('search_bar_content').value = ''
        searchByIsrc(content);
    } else if (abstrackRegex.test(content)) {
        document.getElementById('search_bar_content').value = ''
        searchByAbstrack(content);
    } else {
        document.getElementById('search_bar_content').value = ''
        searchByText(content);
    }
}

function searchSpotifyId(id) {
    document.getElementById('search_bar_content').value = '';
    console.log('Pesquisar Spotify ID:', id);

    // URL da API com o ID dinâmico
    const url = `https://datamatch-backend.onrender.com/new-lyricsfinder/search?track_id=${id}&token=${publicToken}&background_mode=1&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            console.log('Dados recebidos da API:', data);
            // Aqui você pode manipular os dados recebidos conforme necessário
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
        });
}

function searchByIsrc(isrc) {
    document.getElementById('search_bar_content').value = ''
    console.log('Pesquisar ISRC:', isrc);

    // URL da API com o ID dinâmico
    const url = `https://datamatch-backend.onrender.com/new-lyricsfinder/search?track_isrc=${isrc}&token=${publicToken}&background_mode=1&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            console.log('Dados recebidos da API:', data);
            // Aqui você pode manipular os dados recebidos conforme necessário
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
        });
}

function searchByAbstrack(abstrack) {
    document.getElementById('search_bar_content').value = ''
    console.log('Pesquisar Abstrack:', abstrack);

        // URL da API com o ID dinâmico
        const url = `https://datamatch-backend.onrender.com/new-lyricsfinder/search?abstrack=${abstrack}&token=${publicToken}&background_mode=1&mxm_data=1`;

        // Fazendo a requisição para a API
        fetch(url)
            .then(response => response.json()) // Converte a resposta em JSON
            .then(data => {
                console.log('Dados recebidos da API:', data);
                // Aqui você pode manipular os dados recebidos conforme necessário
            })
            .catch(error => {
                console.error('Erro ao fazer a requisição:', error);
            });
}

function searchByText(text) {
    document.getElementById('search_bar_content').value = ''
    console.log('Pesquisar por texto:', text);

    // URL da API com o ID dinâmico
    const url = `https://datamatch-backend.onrender.com/new-lyricsfinder/search?query=${text}&token=${publicToken}&background_mode=1&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            console.log('Dados recebidos da API:', data);
            // Aqui você pode manipular os dados recebidos conforme necessário
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
        });
}









/* DISABLE PINCH AND ZOOM */

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function (e) {
    e.preventDefault();
});

/* SERVICE WORKER */

// Detectar o esquema de cores do usuário e aplicar a cor de fundo correspondente
function applyColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // O usuário prefere tema escuro
        document.documentElement.style.setProperty('--background-color', '#181818');
        document.documentElement.style.setProperty('--theme_color', '#181818');
    } else {
        // O usuário prefere tema claro
        document.documentElement.style.setProperty('--background-color', '#fafafa');
        document.documentElement.style.setProperty('--theme_color', '#181818');
    }
}

// Ouvir por mudanças na preferência de esquema de cores
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyColorScheme);

function registerServiceWorker() {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);

            // Verificar se existe um Service Worker esperando para ser ativado
            if (registration.waiting) {
                updateServiceWorker(registration);
                return;
            }

            // Verificar se existe um Service Worker instalando
            if (registration.installing) {
                trackInstalling(registration.installing);
                return;
            }

            // Ouvir mudanças no estado do Service Worker
            registration.addEventListener('updatefound', () => {
                trackInstalling(registration.installing);
            });
        }).catch(error => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
}

function trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
            updateServiceWorker(worker);
        }
    });
}

function updateServiceWorker(worker) {
    worker.postMessage({ type: 'SKIP_WAITING' });
}

navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
}
