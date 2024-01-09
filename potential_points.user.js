// ==UserScript==
// @name        potential Points
// @namespace   potential Points
// @match       https://moodle.bbbaden.ch/course/user.php*
// @match       https://moodle.bbbaden.ch/grade/report/user/index.php*
// @version     6.0.3
//
// @downloadURL https://github.com/BBBaden-Moodle-userscripts/potential-Points/raw/main/potential_points.user.js
// @updateURL   https://github.com/BBBaden-Moodle-userscripts/potential-Points/raw/main/potential_points.user.js
// @homepageURL https://github.com/BBBaden-Moodle-userscripts/potential-Points
// @supportURL  https://github.com/BBBaden-Moodle-userscripts/potential-Points/issues
//
// @description potential Points for moodle.bbbaden
// @author      black-backdoor
//
// @icon        https://github.com/BBBaden-Moodle-userscripts/potential-Points/raw/main/icon.svg
//
// @run-at      document-end
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_info
//
// @require     https://github.com/BBBaden-Moodle-userscripts/potentialPointsExtractLib/raw/main/extract-v1.lib.user.js
// ==/UserScript==


// ----------------- CONFIG -----------------
// color if cell is empty
const colorEmpty = 'rgba(255, 0, 0, 0.4)';

// Colors for Percentage
const colorRed  = 'rgba(255, 0, 0, 0.4)';
const colorOrange = 'rgba(255, 165, 0, 0.5)';
const colorYellow = 'rgba(255, 255, 0, 0.5)';
const colorGreen = 'rgba(0, 255, 0, 0.2)'


const WarningIconEmpty = "https://github.com/BBBaden-Moodle-userscripts/potential-Points/raw/main/warning.svg";  // ICON if cell is empty


// ----------------- LOAD TABLES -----------------
var table = document.querySelector('.table-responsive').children[0];
var textTable = MyTableUtils.convertHtmlTableToTextTable(table);
var htmlTable = MyTableUtils.convertHtmlTableToHtmlElementsTable(table);

if (textTable.length !== htmlTable.length) {
    console.warn("textTable and htmlTable do not have the same length");
    console.warn("textTable.length: ", textTable.length);
    console.warn("htmlTable.length: ", htmlTable.length);
}

// ----------------- BASIC INFO -----------------
const module_name = MyTableUtils.getModuleTitle(textTable);
const table_columns = MyTableUtils.getTableColumns(textTable);
// ----------------------------------------------

// console.log(textTable);

// Highlight empty cells by changing there icon
function changeIcon (icon, iconURL) {
    icon.src = iconURL;
    icon.classList.add("icon-warning");
    icon.style.width='50px';
    icon.style.height='50px';
}

function colorRow (htmlTableRow, color) {
    htmlTableRow.forEach(cell => {
        cell.style.backgroundColor = color;
    });
}

function colorPercentage (htmlTableRow, percentage) {
    if (percentage == 100) {
        colorRow(htmlTableRow, colorGreen);
    } else if (percentage > 60) {
        colorRow(htmlTableRow, colorYellow);
    } else if (percentage > 30) {
        colorRow(htmlTableRow, colorOrange);
    } else {
        colorRow(htmlTableRow, colorRed);
    }
}

function processRow (textRow) {
    const index = textTable.indexOf(textRow);
    const processedRow = MyTableUtils.porcesseRow(textRow);
    if (processedRow.empty) {
        // Highlight empty cells by changing there icon & background color
        colorRow(htmlTable[index], colorEmpty);
        const icon = MyTableUtils.getIconElement(htmlTable[index]);
        changeIcon(icon, WarningIconEmpty);
    }
    colorPercentage(htmlTable[index], processedRow.erreicht_punkte_prozentsatz);
}

function changeTitleColor (htmlTableRow) {
    const type = MyTableUtils.getTypeElement(htmlTableRow);
    const title = MyTableUtils.getNameElement(htmlTableRow);

    type.style.color = "gray";
    title.style.color = "black";
}


textTable.forEach(textRow => {
    if (textRow[1] == undefined || textRow[0] == "" ||
        String(textRow[0]).includes("HZ") || String(textRow[0]).includes("Nicht bewertet") ||
        String(textRow[0]).includes("Bewertungsaspekt") || String(textRow[0]).includes("Kurs gesamt")
    ) return;

    // console.log(MyTableUtils.porcesseRow(textRow).name, MyTableUtils.porcesseRow(textRow), textRow);
    processRow(textRow);
});
