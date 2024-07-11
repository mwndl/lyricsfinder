document.addEventListener('DOMContentLoaded', async function () {
    hasRequiredParameters()

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

    // funções do player de preview
    const player = document.getElementById('player');
    const audio = document.getElementById('audio');
    const playIcon = document.getElementById('play_icon');
    const pauseIcon = document.getElementById('pause_icon');

    player.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
    audio.addEventListener('ended', function() {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });

    // reload no titulo
    const topTitle = document.getElementById('topTitle');
    topTitle.addEventListener('click', function() {
        removeQueryParameter('query')
        location.reload(); 
    });
});


function removeQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(param);
    
    // Replace the current URL without the specified parameter
    const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    history.replaceState(null, '', newUrl);
}

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
    document.getElementById('search_bar_content').placeholder = translations[selectedLanguage]['searchPlaceholder'];
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
        'query', 
    ];

    const urlParams = new URLSearchParams(window.location.search);
    for (let param of requiredParams) {
        if (!urlParams.has(param)) {
            return false;
        }
    }

    content = getQueryParameter('query')
    if (content !== null) {
        handleSearch(content)
    }
    return true;
}

function copyContent(id) {
    var element = document.getElementById(id);
    var content = element.textContent.trim(); // Obtém o conteúdo da div, removendo espaços em branco

    if (content !== "-") {
        // Copia o conteúdo para a área de transferência
        navigator.clipboard.writeText(content)
            .then(() => {
                notification(translations[selectedLanguage]['copySuccess']);
            })
            .catch(err => {
                notification(translations[selectedLanguage]['copyFailed']);
                console.error('Erro ao copiar: ', err);
            });
    }
}

document.getElementById('search_examples').addEventListener('click', function() {
    document.getElementById('search_bar_content').focus();
});


let publicToken = '8KuA9GwNbaJYvTD8U6h64beb6d6dd56c'


document.getElementById('search_bar_content').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchButton()
    }
});

function searchButton() {
    const content = document.getElementById('search_bar_content').value.trim();
    handleSearch(content)
}


function handleSearch(content) {

    if (content === '') { return }

    // Verificar se é um ID do Spotify
    const spotifyIdRegex = /^(?:https:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/)?([a-zA-Z0-9]{22})(?:\?[^\/]+)?$/;

    // Verificar se é um ISRC
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;

    // Verificar se é um Abstrack (número entre 2 e 10 dígitos)
    const abstrackRegex = /^\d{2,10}$/;

    showLoader()

    if (spotifyIdRegex.test(content)) {
        const spotifyId = content.match(spotifyIdRegex)[1]; // Captura o ID do Spotify
        searchSpotifyId(spotifyId);
        setQueryParameter('query', spotifyId)
    } else if (isrcRegex.test(content)) {
        document.getElementById('search_bar_content').value = ''
        searchByIsrc(content);
        setQueryParameter('query', content)
    } else if (abstrackRegex.test(content)) {
        document.getElementById('search_bar_content').value = ''
        searchByAbstrack(content);
        setQueryParameter('query', content)
    } else {
        document.getElementById('search_bar_content').value = ''
        searchByText(content);
        setQueryParameter('query', content)
    }
}

function searchSpotifyId(id) {
    document.getElementById('search_bar_content').value = '';
    console.log('Pesquisar Spotify ID:', id);

    // URL da API com o ID dinâmico
    const url = `https://datamatch-backend.onrender.com/songmatch/id?content=${id}&token=${publicToken}&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Verifica o status da resposta e lança um erro personalizado
                if (response.status === 429) {
                    throw new Error('Erro 429: Muitas requisições. Tente novamente mais tarde.');
                }
                if (response.status === 404) {
                    throw new Error('Erro 404: Não encontrado.');
                }
                if (response.status === 401) {
                    throw new Error('Erro 401: Não autorizado.');
                }
                if (response.status === 400) {
                    throw new Error('Erro 400: Requisição inválida.');
                }
                if (response.status === 500) {
                    throw new Error('Erro 500: Erro interno do servidor.');
                }
                throw new Error('Erro desconhecido ao fazer a requisição.');
            }
            return response.json(); // Converte a resposta em JSON se estiver tudo ok
        })
        .then(data => {

            spotifyData = data.message.body.spotify;
            musixmatchData = data.message.body.musixmatch;

            setSpotifyData(spotifyData, musixmatchData)
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
            hideLoader()

            // Notificação de erro específica para cada código de status
            let errorMessage;
            console.log("Error message: " + error.message)
            switch (error.message) {
                case 'Erro 429: Muitas requisições. Tente novamente mais tarde.':
                    errorMessage = translations[selectedLanguage]['error429'];
                    break;
                case 'Erro 404: Não encontrado.':
                    errorMessage = translations[selectedLanguage]['error404'];
                    break;
                case 'Erro 401: Não autorizado.':
                    errorMessage = translations[selectedLanguage]['error401'];
                    break;
                case 'Erro 400: Requisição inválida.':
                    errorMessage = translations[selectedLanguage]['error400'];
                    break;
                case 'Erro 500: Erro interno do servidor.':
                    errorMessage = translations[selectedLanguage]['error500'];
                    break;
                default:
                    errorMessage = translations[selectedLanguage]['somethingWentWrong1'];
                    break;
            }

            // Exibir notificação de erro
            notification(errorMessage);
        });
}

function searchByIsrc(isrc) {
    document.getElementById('search_bar_content').value = ''
    console.log('Pesquisar ISRC:', isrc);

    // URL da API com o ID dinâmico
    const url = `https://datamatch-backend.onrender.com/songmatch/isrc?content=${isrc}&token=${publicToken}&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Verifica o status da resposta e lança um erro personalizado
                if (response.status === 429) {
                    throw new Error('Erro 429: Muitas requisições. Tente novamente mais tarde.');
                }
                if (response.status === 404) {
                    throw new Error('Erro 404: Não encontrado.');
                }
                if (response.status === 401) {
                    throw new Error('Erro 401: Não autorizado.');
                }
                if (response.status === 400) {
                    throw new Error('Erro 400: Requisição inválida.');
                }
                if (response.status === 500) {
                    throw new Error('Erro 500: Erro interno do servidor.');
                }
                throw new Error('Erro desconhecido ao fazer a requisição.');
            }
            return response.json(); // Converte a resposta em JSON se estiver tudo ok
        })
        .then(data => {

            spotifyData = data.message.body.spotify;
            musixmatchData = data.message.body.musixmatch;

            setSpotifyData(spotifyData, musixmatchData)

        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
            hideLoader()

            // Notificação de erro específica para cada código de status
            let errorMessage;
            console.log("Error message: " + error.message)
            switch (error.message) {
                case 'Erro 429: Muitas requisições. Tente novamente mais tarde.':
                    errorMessage = translations[selectedLanguage]['error429'];
                    break;
                case 'Erro 404: Não encontrado.':
                    errorMessage = translations[selectedLanguage]['error404'];
                    break;
                case 'Erro 401: Não autorizado.':
                    errorMessage = translations[selectedLanguage]['error401'];
                    break;
                case 'Erro 400: Requisição inválida.':
                    errorMessage = translations[selectedLanguage]['error400'];
                    break;
                case 'Erro 500: Erro interno do servidor.':
                    errorMessage = translations[selectedLanguage]['error500'];
                    break;
                default:
                    errorMessage = translations[selectedLanguage]['somethingWentWrong1'];
                    break;
            }

            // Exibir notificação de erro
            notification(errorMessage);
        });
}

function searchByAbstrack(abstrack) {
    document.getElementById('search_bar_content').value = ''
    console.log('Pesquisar Abstrack:', abstrack);

        // URL da API com o ID dinâmico
        const url = `https://datamatch-backend.onrender.com/songmatch/abstrack?content=${abstrack}&token=${publicToken}&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Verifica o status da resposta e lança um erro personalizado
                if (response.status === 429) {
                    throw new Error('Erro 429: Muitas requisições. Tente novamente mais tarde.');
                }
                if (response.status === 404) {
                    throw new Error('Erro 404: Não encontrado.');
                }
                if (response.status === 401) {
                    throw new Error('Erro 401: Não autorizado.');
                }
                if (response.status === 400) {
                    throw new Error('Erro 400: Requisição inválida.');
                }
                if (response.status === 500) {
                    throw new Error('Erro 500: Erro interno do servidor.');
                }
                throw new Error('Erro desconhecido ao fazer a requisição.');
            }
            return response.json(); // Converte a resposta em JSON se estiver tudo ok
        })
        .then(data => {

            spotifyData = data.message.body.spotify;
            musixmatchData = data.message.body.musixmatch;

            setSpotifyData(spotifyData, musixmatchData)
            
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
            hideLoader()

            // Notificação de erro específica para cada código de status
            let errorMessage;
            console.log("Error message: " + error.message)
            switch (error.message) {
                case 'Erro 429: Muitas requisições. Tente novamente mais tarde.':
                    errorMessage = translations[selectedLanguage]['error429'];
                    break;
                case 'Erro 404: Não encontrado.':
                    errorMessage = translations[selectedLanguage]['error404'];
                    break;
                case 'Erro 401: Não autorizado.':
                    errorMessage = translations[selectedLanguage]['error401'];
                    break;
                case 'Erro 400: Requisição inválida.':
                    errorMessage = translations[selectedLanguage]['error400'];
                    break;
                case 'Erro 500: Erro interno do servidor.':
                    errorMessage = translations[selectedLanguage]['error500'];
                    break;
                default:
                    errorMessage = translations[selectedLanguage]['somethingWentWrong1'];
                    break;
            }

            // Exibir notificação de erro
            notification(errorMessage);
        });
}

function searchByText(text) {
    document.getElementById('search_bar_content').value = '';
    console.log('Pesquisar por texto:', text);

    // URL da API com o ID dinâmico
    const url = `https://datamatch-backend.onrender.com/songmatch/search?content=${text}&token=${publicToken}&mxm_data=1`;

    // Fazendo a requisição para a API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Verifica o status da resposta e lança um erro personalizado
                if (response.status === 429) {
                    throw new Error('Erro 429: Muitas requisições. Tente novamente mais tarde.');
                }
                if (response.status === 404) {
                    throw new Error('Erro 404: Não encontrado.');
                }
                if (response.status === 401) {
                    throw new Error('Erro 401: Não autorizado.');
                }
                if (response.status === 400) {
                    throw new Error('Erro 400: Requisição inválida.');
                }
                if (response.status === 500) {
                    throw new Error('Erro 500: Erro interno do servidor.');
                }
                throw new Error('Erro desconhecido ao fazer a requisição.');
            }
            return response.json(); // Converte a resposta em JSON se estiver tudo ok
        })
        .then(data => {
            spotifyData = data.message.body.spotify;
            musixmatchData = data.message.body.musixmatch;

            setSpotifyData(spotifyData, musixmatchData)

            document.getElementById('search_icon').style.display = 'block'
            document.getElementById('loader').style.display = 'none'

        })
        .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
            hideLoader()

            // Notificação de erro específica para cada código de status
            let errorMessage;
            console.log("Error message: " + error.message)
            switch (error.message) {
                case 'Erro 429: Muitas requisições. Tente novamente mais tarde.':
                    errorMessage = translations[selectedLanguage]['error429'];
                    break;
                case 'Erro 404: Não encontrado.':
                    errorMessage = translations[selectedLanguage]['error404'];
                    break;
                case 'Erro 401: Não autorizado.':
                    errorMessage = translations[selectedLanguage]['error401'];
                    break;
                case 'Erro 400: Requisição inválida.':
                    errorMessage = translations[selectedLanguage]['error400'];
                    break;
                case 'Erro 500: Erro interno do servidor.':
                    errorMessage = translations[selectedLanguage]['error500'];
                    break;
                default:
                    errorMessage = translations[selectedLanguage]['somethingWentWrong1'];
                    break;
            }

            // Exibir notificação de erro
            notification(errorMessage);
        });
}

function setSpotifyData(spotifyData, musixmatchData) {
    hideLoader()

    const trackImage = document.getElementById('track_image')

    const trackName = document.getElementById('track_name')
    const trackArtist = document.getElementById('artist_list')
    const trackAlbum = document.getElementById('album_name')
    const trackDuration = document.getElementById('track_duration')

    const trackReleased = document.getElementById('track_released_date')
    const trackPosition1 = document.getElementById('track_position_content')
    const trackPosition2 = document.getElementById('album_total_content')
    const trackPopularity = document.getElementById('track_popularity_number')

    const albumType1 = document.getElementById('albumLabel1')
    const albumType2 = document.getElementById('singleLabel')
    const albumType3 = document.getElementById('compilationLabel')
    
    const trackMarkets = document.getElementById('track_markets_total')

    const trackSpId = document.getElementById('track_sp_id')
    const trackIsrc = document.getElementById('track_isrc_code')
    const trackAbstrack = document.getElementById('track_abstrack')

    const trackMxmLyrics = document.getElementById('track_mxm_lyrics')
    const trackMxmArtist = document.getElementById('track_mxm_artist')
    const trackMxmAlbum = document.getElementById('track_mxm_album')

    const trackLyricsStat = document.getElementById('track_lyrics_stat')
    const trackLinesyncStat = document.getElementById('track_linesync_stat')
    const trackWordsyncStat = document.getElementById('track_wordsync_stat')

    const openLyrics = document.getElementById('openLyricsLabel')
    const openStudio = document.getElementById('openStudioLabel')

    const previewPlayer = document.getElementById('player')
    const audioPlayer = document.getElementById('audio');
    const playIcon = document.getElementById('play_icon');
    const pauseIcon = document.getElementById('pause_icon');

    const trackId = spotifyData.track_data.track_id;
    const albumImage = spotifyData.album_data.images[0].url;

    document.getElementById('search_examples').style.display = 'none';
    document.getElementById('sp_container').style.display = 'block';

    trackImage.src = albumImage;

    /* Track name */
        const track = spotifyData.track_data;
        trackName.textContent = ''
        const trackLink = document.createElement('a');
        trackLink.href = `https://open.spotify.com/track/${track.track_id}`;
        trackLink.textContent = track.track_name;
        trackLink.target = "_blank";

        trackName.appendChild(trackLink);

    /* Artist name */
        const artists = spotifyData.artists_data.artists;
        trackArtist.textContent = ''
        artists.forEach((artist, index) => {
            const artistLink = document.createElement('a');
            artistLink.href = `https://open.spotify.com/artist/${artist.artist_id}`;
            artistLink.textContent = artist.name;
            artistLink.target = "_blank";
        
            trackArtist.appendChild(artistLink);
        
            if (index < artists.length - 1) {
                const separator = document.createTextNode(', ');
                trackArtist.appendChild(separator);
            }
        });

    /* Album name */
        const album = spotifyData.album_data;
        trackAlbum.textContent = ''
        const albumLink = document.createElement('a');
        albumLink.href = `https://open.spotify.com/album/${album.album_id}`;
        albumLink.textContent = album.album_name;
        albumLink.target = "_blank";

        trackAlbum.appendChild(albumLink);

    /* Track duration */
        let durationMs = spotifyData.track_data.duration_ms;
        let minutes = Math.floor(durationMs / 60000);
        let seconds = ((durationMs % 60000) / 1000).toFixed(0);
        let formattedDuration = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        trackDuration.textContent = formattedDuration;
    /* *********** */

    trackReleased.textContent = spotifyData.album_data.release_date; // lançada em DD/MM/YYYY

    trackPosition1.textContent = spotifyData.track_data.disc_position
    trackPosition2.textContent = spotifyData.album_data.total_tracks

    trackPopularity.textContent = `${spotifyData.track_data.popularity}%`; // popularidade de xx%

    if (spotifyData.album_data.album_type === 'album') {
        albumType1.style.display = 'inline' // album
        albumType2.style.display = 'none' // single
        albumType3.style.display = 'none' // compilation
        
    } else if (spotifyData.album_data.album_type === 'single') {
        albumType1.style.display = 'none'
        albumType2.style.display = 'inline'
        albumType3.style.display = 'none'

    } else if (spotifyData.album_data.album_type === 'compilation') {
        albumType1.style.display = 'none'
        albumType2.style.display = 'none'
        albumType3.style.display = 'inline'

    }
    
    const availableMarkets = spotifyData.track_data.available_markets;
    const numCountries = availableMarkets.length;
    trackMarkets.textContent = numCountries;

    trackSpId.textContent = trackId;
    trackIsrc.textContent = spotifyData.track_data.isrc;
    trackAbstrack.textContent = musixmatchData.track_data.commontrack_id;

    trackMxmLyrics.textContent = `http://mxmt.ch/t/${musixmatchData.track_data.lyrics_id}`;
    trackMxmArtist.textContent = `http://mxmt.ch/a/${musixmatchData.artist_data.artist_id}`;
    trackMxmAlbum.textContent = `http://mxmt.ch/r/${musixmatchData.album_data.album_id}`;

    trackMxmLyrics.title = musixmatchData.track_data.track_name;
    trackMxmArtist.title = musixmatchData.artist_data.artist_name;
    trackMxmAlbum.title = musixmatchData.album_data.album_name;

    if (musixmatchData.track_data.stats.has_lyrics === 1) {
        trackLyricsStat.className = 'status-1 status-blue'
    } else {
        trackLyricsStat.className = 'status-1 status-gray'
    }
    
    if (musixmatchData.track_data.stats.has_line_sync === 1) {
        trackLinesyncStat.className = 'status-1 status-blue'
    } else {
        trackLinesyncStat.className = 'status-1 status-gray'
    }
    
    if (musixmatchData.track_data.stats.has_word_sync === 1) {
        trackWordsyncStat.className = 'status-1 status-blue'
    } else {
        trackWordsyncStat.className = 'status-1 status-gray'
    }

    if (spotifyData.track_data.preview_url !== null) {
        previewPlayer.style.display = 'flex'
        playIcon.style.display = 'block'
        pauseIcon.style.display = 'none'
        audioPlayer.src = spotifyData.track_data.preview_url
    } else {
        previewPlayer.style.display = 'none'
        playIcon.style.display = 'block'
        pauseIcon.style.display = 'none'
        audioPlayer.src = '#'
    }

    openLyrics.setAttribute('data-link', `http://mxmt.ch/t/${musixmatchData.track_data.lyrics_id}`);
    openStudio.setAttribute('data-link', `https://curators.musixmatch.com/tool?commontrack_id=${musixmatchData.track_data.commontrack_id}&mode=edit`);

}

function openLyrics() {
    const link = document.getElementById('openLyricsLabel').getAttribute('data-link');
    window.open(link, '_blank');
}

function openStudio() {
    const link = document.getElementById('openStudioLabel').getAttribute('data-link');
    window.open(link, '_blank');
}

function showLoader() {
    document.getElementById('search_icon').style.display = 'none'
    document.getElementById('loader').style.display = 'block'
}

function hideLoader() {
    document.getElementById('search_icon').style.display = 'block'
    document.getElementById('loader').style.display = 'none'
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
