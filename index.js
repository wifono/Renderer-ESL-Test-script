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

const generateRandomData = () => ({
  '@page': '1',
  '@preload': '1',
  '@skipOnEqualImage': '1',
  '@template': 'NORMAL_V01.xsl',
  '@labelId': `D${Math.floor(1000000 + Math.random() * 9000000)}`,
  '@taskPriority': 'HIGH',
  Article: {
    Label: {
      width: 360,
      height: 184,
      Store4Color: 1,
      isRed: 1,
    },
    store: `222`,
    itemid: `2222`,
    name: '*DOBRÁ VODA MIN.NP MALINA',
    shortname: '*DOBRÁ Voda Min',
    pricevalue: (10 + Math.random() * 100).toFixed(2),
    priceunittext: `1 l = 20 Kč`,
  },
});

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
        sendRequestsInBatches(100, 25000, 60, 5); // Batch size: 50, Max images: 15k, Max time: 1 min, Delay: 1s
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
