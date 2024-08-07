// Importación de módulos necesarios

const axios = require('axios');

const qs = require('querystring');

const cheerio = require('cheerio');

// Función para convertir un video de YouTube a MP3

const ytmp3 = async (url) => {

    // Definición de constantes y variables necesarias

    const parameters = {

        'url': url,

        'format': 'mp3',

        'lang': 'en'

    };

    // Hacer una solicitud POST a la URL de conversión con los parámetros necesarios

    const conversionResponse = await axios.post('https://s64.notube.net/recover_weight.php', qs.stringify(parameters));

    // Obtener el token de la respuesta de la solicitud de conversión

    const token = conversionResponse.data.token;

    // Hacer una solicitud GET a la URL de descarga usando el token obtenido

    const downloadPageResponse = await axios.get('https://notube.net/en/download?token=' + token);

    // Cargar el contenido de la página de descarga en cheerio para facilitar la manipulación del DOM

    const $ = cheerio.load(downloadPageResponse.data);

    // Extraer el título del video y el enlace de descarga de la página de descarga

    const result = {

        'title': $('#breadcrumbs-section h2').text(),

        'download': $('#breadcrumbs-section #downloadButton').attr('href')

    };

    return result;

};

// Exportar la función ytmp3 para su uso en otros módulos

module.exports = ytmp3;


