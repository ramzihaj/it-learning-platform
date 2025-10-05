const jsPDF = require('jspdf');
const doc = new jsPDF();
doc.text('Test', 10, 10);
console.log('jsPDF OK');