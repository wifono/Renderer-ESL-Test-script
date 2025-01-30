const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const IMAGES_FOLDER = './images';
if (!fs.existsSync(IMAGES_FOLDER)) fs.mkdirSync(IMAGES_FOLDER);

const LOG_FILE = './errors.log';
const REPORTS_FOLDER = './reports';
if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '');
if (!fs.existsSync(REPORTS_FOLDER)) fs.mkdirSync(REPORTS_FOLDER);

let isRunning = false;
let totalImagesSaved = 0;
let totalErrors = 0;
const errorSummary = [];

const generateRandomData = () => {
  const templates = ['PECIVO_V01', 'NORMAL_V01', 'MASO_V01'];

  const randomTemplate =
    templates[Math.floor(Math.random() * templates.length)];

  switch (randomTemplate) {
    case 'NORMAL_V01':
      return {
        '@labelId': `D${Math.floor(1000000 + Math.random() * 9000000)}`,
        '@page': 0,
        '@preload': false,
        '@skipOnEqualImage': false,
        '@taskPriority': 'HIGH',
        '@template': 'NORMAL_V01.xsl',
        Article: {
          Label: {
            Store4Color: 1,
            StoreAScan: 1,
            height: '184',
            isRed: 0,
            isYellow: 1,
            type: 'GRAPHIC_2_6_YEL_NFC_N',
            width: '360',
          },
          _details: {
            ArtComm1: {
              name: 'Základní popis: ',
              value:
                'Rýže dlouhozrnná loupaná ve varných sáčcích.\nBalení obsahuje 8 sáčků.\nSypká a nadýchaná.\nSnadné otevírání sáčku.',
            },
            Conditions: {
              name: 'Podmínky: ',
              value: 'Skladujte v suchu.\n',
            },
            Ingredients: {
              name: 'Složení: ',
              value: 'Rýže dlouhozrnná loupaná.\n',
            },
            NutriCarbo: {
              name: 'Sacharidy: ',
              value: '23,4 g',
            },
            NutriFat: {
              name: 'Tuky: ',
              value: '0,1 g',
            },
            NutriKCAL: {
              name: 'Energie kcal: ',
              value: '121 kcal',
            },
            NutriKJ: {
              name: 'Energie kJ: ',
              value: '448 kJ',
            },
            NutriPortion: {
              name: 'Porce: ',
              value: '100 g',
            },
            NutriProtein: {
              name: 'Bílkoviny: ',
              value: '2,7 g',
            },
            NutriSalt: {
              name: 'Sůl: ',
              value: '0 g',
            },
            NutriSatFat: {
              name: 'Nenasycené mastné kyseliny: ',
              value: '0 g',
            },
            NutriSugar: {
              name: 'z toho cukry: ',
              value: '0,1 g',
            },
          },
          _selposition: 'zxd048 B / 4 / 02 / 2Sv',
          _traceable: {
            produceraddress: {
              value: 'Mělnická 133, 277 32, Byšice, Česká republika',
            },
            producertext: {
              value: 'Výrobce: Vitana, a.s.',
            },
            store: {
              value: '195',
            },
          },
          allergens: '',
          codesdescription: '20296377 • 8593837254774',
          commname1: 'Vitana Rýže dlouhozrnná',
          commname2: '',
          cottext1: 'perlivé víno/dosyc.oxidem uhličitým',
          cottext2: 'artartarstraarstar arstarstrstarstrats',
          cottext3: '',
          creditse: '2',
          creditsh: '0',
          defaultean: '20457167',
          department: '1030120040010',
          description1: '',
          description2: '',
          empties2text: '',
          emptiestext: '',
          epop: '03B87788C396',
          itemid: '20296377',
          legalclassif: '',
          maxqtytext: '',
          name: 'MINERALKA PERLIVA 1,5L',
          nutriscore: '',
          pludescription: '',
          price2discount: '',
          price2glyph: '',
          price2old: '',
          price2points: '0',
          price2text: '',
          price2unittext: '',
          price2value: '0',
          pricediscount: '',
          priceeudiscount: '',
          priceeumadiscount: '',
          priceeutext: '48,90',
          priceglyph: 'O',
          priceold: '69,90',
          pricetext: (10 + Math.random() * 100).toFixed(2),
          priceunittext: '1 kg = 61,13 Kč',
          pricevalue: '48.9',
          productglyph1: '',
          productglyph2: '',
          productglyph3: '',
          repletext: 'D',
          shortname: 'VITANA RÝŽE VS 800G',
          store: '195',
          suppliertext: 'ORKLA FOODS ČESKO A SLOVENSKO A.S.',
          template: 'NORMAL_V01',
          ts: '2024-09-20 10:15:53',
          volumetext: '800 g',
        },
      };

    case 'MASO_V01':
      return {
        '@labelId': `D${Math.floor(1000000 + Math.random() * 9000000)}`,
        '@page': 0,
        '@preload': false,
        '@skipOnEqualImage': false,
        '@taskPriority': 'HIGH',
        '@template': 'MASO_V01.xsl',
        Article: {
          Label: {
            Store4Color: 1,
            StoreAScan: 1,
            height: '122',
            isRed: 0,
            isYellow: 1,
            type: 'GRAPHIC_4_2_YEL_NFC_N',
            width: '250',
          },
          _details: {
            Conditions: {
              name: 'Podmínky: ',
              value: 'Skladujte při teplotě 0°C až 4°C\n',
            },
            Ingredients: {
              name: 'Složení: ',
              value: 'Hovězí zadní bez kosti\nUrčeno k tepelné úpravě\n',
            },
            SaleDays: {
              name: 'Dnů prodeje: ',
              value: '1',
            },
          },
          _selposition: 'zxf019 A / 3 / 02 / 1So',
          _traceable: {
            beeftypecz: {
              list: 'beef_category',
              maxlength: '',
              name: 'Kategorie: ',
              required: true,
              value: 'Kategorie: Array',
            },
            cutapprovalnumber: {
              list: false,
              maxlength: '20',
              name: '',
              required: true,
              value: '321',
            },
            lotnumber: {
              list: false,
              maxlength: '20',
              name: 'Identifikační číslo: ',
              required: true,
              value: 'Identifikační číslo: 422',
            },
            originfullorbirth: {
              list: 'country_origin',
              maxlength: '',
              name: 'Narozeno v: ',
              required: true,
              value: 'Narozeno v: Array',
            },
            produceraddress: {
              value: 'Radlická 520/117, 158 00 Praha 5',
            },
            producertext: {
              value: 'Výrobce: SAVENCIA Fromage & Dairy C',
            },
            slaughtapprovalnumber: {
              list: false,
              maxlength: '20',
              name: '',
              required: true,
              value: '123',
            },
            store: {
              value: '195',
            },
          },
          allergens: '',
          codesdescription: '26044743 • 8594159203655',
          commname1: 'Hovězí zadní b.k.',
          commname2: 'test',
          cottext1: '',
          cottext2: '',
          cottext3: '',
          creditse: '0',
          creditsh: '0',
          defaultean: '26044743',
          department: '4010010020010',
          description1: '',
          description2: '',
          empties2text: '',
          emptiestext: '',
          epop: '0764DADEC692',
          itemid: '26044743',
          legalclassif: 'Výsekové maso hovězí',
          maxqtytext: '',
          name: 'HOVĚZÍ ZADNÍ B.K PP',
          nutriscore: '',
          pludescription: '0753',
          price2discount: '',
          price2glyph: '',
          price2old: '',
          price2points: '0',
          price2text: '',
          price2unittext: '',
          price2value: '0',
          pricediscount: '-27 %',
          priceeudiscount: '',
          priceeumadiscount: '',
          priceeutext: '0,00',
          priceglyph: 'P',
          priceold: '329rb',
          pricetext: (10 + Math.random() * 100).toFixed(2),
          priceunittext: 'cena za 1 kg',
          pricevalue: '239',
          productglyph1: '',
          productglyph2: '',
          productglyph3: '',
          repletext: '',
          shortname: 'HOVĚZÍ ZADNÍ B.K',
          store: '195',
          suppliertext: 'MASO UZENINY POLIČKA, A.S.',
          template: 'MASO_V01',
          ts: '2024-09-20 10:23:16',
          volumetext: '1 kg',
        },
      };
    case 'PECIVO_V01':
      return {
        '@labelId': `D${Math.floor(1000000 + Math.random() * 9000000)}`,
        '@page': 0,
        '@preload': false,
        '@skipOnEqualImage': false,
        '@taskPriority': 'HIGH',
        '@template': 'PECIVO_V01.xsl',
        Article: {
          Label: {
            Store4Color: 1,
            StoreAScan: 1,
            height: '300',
            isRed: 1,
            isYellow: 1,
            type: 'GRAPHIC_6_0_YEL_NFC_N',
            width: '400',
          },
          _details: {
            ArtComm1: {
              name: 'Základní popis: ',
              value: 'Bio banány, 4 ks v balení.',
            },
            ArtComm2: {
              name: 'Další popis: ',
              value:
                'Země původu se může lišit dle dodávky. Možné země původu: Kolumbie, Ekvádor, Mexiko, Kostarika, Dominikásnká republika. ',
            },
            SaleDays: {
              name: 'Dnů prodeje: ',
              value: '0',
            },
          },
          _selposition: 't53820 H / 2P/ 04 / 1Sv',
          _traceable: {
            bioproduction: {
              list: false,
              maxlength: '30',
              name: 'Zemědělská produkce: ',
              required: true,
              value: 'Zemědělská produkce: EU/mimo EU',
            },
            originfullorbirth: {
              list: 'country_origin',
              maxlength: '',
              name: 'Země původu: ',
              required: true,
              value: 'Země původu: Array',
            },
            produceraddress: {
              value: 'Měchnov 33, 257 26 Divišov',
            },
            producertext: {
              value: 'Distributor: BAKKER s.r.o.',
            },
            store: {
              value: '195',
            },
          },
          allergens: '',
          codesdescription: '20457167 • 8590681000625',
          commname1: 'Bio Banány',
          commname2: "Nature's Promise",
          cottext1: 'běžné pečivo pšeničné',
          cottext2: 'ze zmrazeného polotovaru',
          cottext3: '1278',
          creditse: '1',
          creditsh: '0',
          defaultean: '20457167',
          department: '4060010020010',
          description1: '',
          description2: '',
          empties2text: '',
          emptiestext: '',
          epop: '053B8776C89E',
          itemid: '20457167',
          legalclassif: '',
          maxqtytext: '',
          name: 'NP BIO BANÁNY',
          nutriscore: '',
          pludescription: '9999',
          price2discount: '',
          price2glyph: '',
          price2old: '',
          price2points: '0',
          price2text: '',
          price2unittext: '',
          price2value: '0',
          pricediscount: '-20%',
          priceeudiscount: '',
          priceeumadiscount: '',
          priceeutext: '0,00',
          priceglyph: 'O',
          priceold: '999rb',
          pricetext: (10 + Math.random() * 100).toFixed(2),
          priceunittext: 'cena za 1 kg',
          pricevalue: '39.9',
          productglyph1: 'É',
          productglyph2: '',
          productglyph3: '',
          repletext: '',
          shortname: 'NP BIO BANÁNY',
          store: '195',
          suppliertext: 'BAKKER, S.R.O.',
          template: 'PECIVO_V01',
          ts: '2024-09-20 10:23:13',
          volumetext: '1 kg',
        },
      };

    default:
      throw new Error('Unknown template');
  }
};

const logError = (message) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
  errorSummary.push(message);
  totalErrors++;
};

const saveImage = (buffer, labelId) => {
  const filePath = path.join(IMAGES_FOLDER, `${labelId}.png`);
  fs.writeFileSync(filePath, buffer);
  totalImagesSaved++;
  console.log(`Image saved: ${filePath}`);
};

const sendRequest = async (data) => {
  const url = 'http://10.90.1.78:3334/service/task/preview/image';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const buffer = await response.buffer();
    saveImage(buffer, data['@labelId']);
  } catch (error) {
    const errorMessage = `Request failed for labelId ${data['@labelId']}: ${error.message}`;
    console.error(errorMessage);
    logError(errorMessage);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendBatchOfRequests = async (batchSize) => {
  console.log(`Starting batch of ${batchSize} requests...`);
  const promises = Array.from({ length: batchSize }).map(() =>
    sendRequest(generateRandomData())
  );
  await Promise.all(promises);
};

const createReport = (
  testNumber,
  totalTime,
  totalImages,
  totalErrors,
  errorSummary
) => {
  const reportFileName = path.join(
    REPORTS_FOLDER,
    `Performance_Test_${testNumber}.txt`
  );

  const reportContent =
    `Performance Test ${testNumber}\n` +
    `Date: ${new Date().toLocaleString()}\n` +
    `---------------------------------------------\n` +
    `Total Time: ${totalTime.toFixed(2)} seconds\n` +
    `Total Images Processed: ${totalImages}\n` +
    `Total Images Saved: ${totalImagesSaved}\n` +
    `Total Errors: ${totalErrors}\n` +
    `---------------------------------------------\n` +
    `Error Summary:\n` +
    errorSummary.join('\n') +
    '\n';

  fs.writeFileSync(reportFileName, reportContent);
  console.log(`\nReport saved: ${reportFileName}`);
};

const sendRequestsInBatches = async (
  batchSize,
  maxImages,
  maxTime,
  delayBetweenBatches
) => {
  const totalBatches = Math.ceil(maxImages / batchSize);
  const startTime = Date.now();
  let testNumber = fs.readdirSync(REPORTS_FOLDER).length + 1;

  for (
    let batchIndex = 0;
    batchIndex < totalBatches && isRunning;
    batchIndex++
  ) {
    const elapsedTime = (Date.now() - startTime) / 1000;
    if (elapsedTime >= maxTime) {
      console.log(`Time limit (${maxTime} seconds) reached.`);
      break;
    }

    console.log(
      `\n--- Sending batch ${batchIndex + 1} of ${batchSize} requests ---`
    );
    await sendBatchOfRequests(batchSize);

    if (batchIndex < totalBatches - 1) {
      console.log(`Waiting ${delayBetweenBatches} ms before the next batch...`);
      await delay(delayBetweenBatches);
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;
  createReport(testNumber, totalTime, maxImages, totalErrors, errorSummary);
  console.log(
    `\nAll requests completed. Total time: ${totalTime.toFixed(2)} seconds.`
  );
  console.log(`Total images saved: ${totalImagesSaved}`);
  console.log(`Total errors: ${totalErrors}`);
};

rl.on('line', (input) => {
  const command = input.trim().toLowerCase();

  switch (command) {
    case 'start':
      if (isRunning) {
        console.log('Sending is already running.');
      } else {
        console.log('Starting request sending...');
        isRunning = true;
        totalImagesSaved = 0;
        totalErrors = 0;
        errorSummary.length = 0;
        sendRequestsInBatches(100, 25000, 60, 3); // Batch size: 50, Max images: 15k, Max time: 1 min, Delay: 1s
      }
      break;

    case 'stop':
      if (!isRunning) {
        console.log('Sending is already stopped.');
      } else {
        console.log('Stopping request sending...');
        isRunning = false;
      }
      break;

    default:
      console.log('Unknown command. Use "start" to begin or "stop" to halt.');
      break;
  }
});

console.log('Enter "start" to begin sending requests or "stop" to halt.');
