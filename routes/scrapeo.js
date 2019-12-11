/*

const baseUrlCines = 'https://www.filmaffinity.com/es/theaters.php?';
let arrCines = [];

const insertTheater = (pCine) => {
    console.log(pCine)
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `cines` (nombre, direccion, ciudad, web, urlhorario) VALUES (?, ?, ?, ?, ?)', [pCine.nombre, pCine.direccion, pCine.ciudad, pCine.web, pCine.urlhorario], (err, res) => {
            if (err) reject(err)
            console.log('el insert', res)
            resolve(res)
        });
    });
}




(async () => {

    console.log('HOLA QUE ASE')
    const response = await axios.get(baseUrlCines)
    const $ = cheerio.load(response.data);
    const urlProvincias = $('.states li a');

    let arrUrlsProvincias = [];

    for (i = 0; i < urlProvincias.length; i++) {
        console.log('entra en el for', i)
        const url = urlProvincias[i].attribs.href;
        // const numCines = numCinesProvincia[i].children[0].data

        arrUrlsProvincias.push(url)

    }
    console.log(arrUrlsProvincias)
})

let arrUrlsProvincias = [
    'https://www.filmaffinity.com/es/theaters.php?state=ES-C',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-AB',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-A',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-AL',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-VI',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-O',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-AV',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-BA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-B',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-BI',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-BU',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CC',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-S',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CS',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CE',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CR',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CO',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-CU',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-SS',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-GI',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-GR',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-GU',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-H',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-HU',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-PM',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-J',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-LO',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-GC',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-LE',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-L',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-LU',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-M',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-MA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-ML',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-MU',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-NA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-OR',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-P',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-PO',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-SA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-TF',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-SG',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-SE',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-SO',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-T',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-TE',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-TO',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-V',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-VA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-ZA',
    'https://www.filmaffinity.com/es/theaters.php?state=ES-Z'
];

let arrUrlCines = [];

(async () => {

    let i = 0;
    setInterval(async function () {
        if (i < arrUrlsProvincias.length) {

            const response = await axios.get(arrUrlsProvincias[i])
            const $ = cheerio.load(response.data);
            const cines = $('a.theater-data')

            let j = 0;
            setInterval(async function () {
                if (j < cines.length) {
                    console.log('HOLA desde mi bucle 2', cines[j].attribs.href)

                    getCinema(cines[j].attribs.href)
                    j++
                }
            }, 2000)
            i++
        }

    }, 2000);

    console.log('el array final', arrUrlCines)
})()



async function getCinema(pUrl) {

    const response = await axios.get(pUrl)

    const $ = cheerio.load(response.data);

    const nombre = $('#main-title')
    const direccion = $('.street div')
    const ciudad = $('.street a')
    const web = $('.th-data div ul li a')

    const cine = {
        nombre: nombre[0].children[0].data,
        direccion: direccion[0].children[0].data,
        ciudad: ciudad[0].children[0].data,
        web: web[0].attribs.href,
        urlhorario: pUrl
    }

    insertTheater(cine)
        .then(result => {
            console.log('RESULTADO', result);
        })
        .catch(err => {
            console.log('error en route');
        });

} */









