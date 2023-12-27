// ==UserScript==
// @name        potential Points
// @namespace   potential Points
// @match       https://moodle.bbbaden.ch/course/user.php*
// @match       https://moodle.bbbaden.ch/grade/report/user/index.php*
// @version     5.0.0
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
// ==/UserScript==


// ######################### SCRIPT INFO ##########################
const scriptHandler = GM_info.scriptHandler;

// ######################### DEBUG ##########################
const isDebugEnabled = false;

// debug functions for additional info

// SCRIPT
const SCRIPT_RUN = isDebugEnabled ? (value) => {console.log(`%c[SCRIPT INFO] %cfinished executing | %c${value}`, 'color: orange', 'color: inherit', 'color: green'); } : () => {};

const SCRIPT_INFO = isDebugEnabled ? (key, value) => {console.info(`%c[SCRIPT INFO] %c${key}%c: %c${value}`, 'color: blue;', 'color: inherit;', 'color: blue;', 'color: green;'); } : () => {};
const SCRIPT_INFO_RAW = isDebugEnabled ? (value) => {console.log(`%c[SCRIPT INFO] %c${value}`, 'color: blue', 'color: inherit'); } : () => {};


// CONFIG
const VALUE_READ = (variableName, value) => {console.debug(`%c[VALUE]%c read value of %c${variableName}%c from storage: %c${value}`, 'color: purple;', 'color: inherit;', 'color: blue;', 'color: inherit;', 'color: green'); };
const VALUE_READ_WARN = (variableName, expectedType) => {console.warn(`%c[VALUE]%c ${variableName} %cis not defined or does not match the expected type (%c${expectedType}%c) in storage.`, 'color: purple;', 'color: blue;', 'color: inherit;', 'color: red', 'color: inherit;'); };
const VALUE_READ_ERROR = (variableName, error) => {console.error(`%c[VALUE]%c An error occurred while trying to retrieve %c${variableName}%c value from storage: %c${error}`, 'color: purple;', 'color: inherit;', 'color: blue;', 'color: inherit;', 'color: red;'); };

const VALUE_INFO = isDebugEnabled ? (key, value) => {console.info(`%c[VALUE] %c${key}%c: %c${value}`, 'color: purple;', 'color: inherit;', 'color: purple;', 'color: green;'); } : () => {};
const VALUE_INFO_RAW = isDebugEnabled ? (value) => {console.log(`%c[VALUE] %c${value}`, 'color: purple', 'color: inherit'); } : () => {};

const DEBUG = isDebugEnabled ? console.log.bind(console, "[DEBUG]") : () => {};
const WARN = isDebugEnabled ? console.warn.bind(console, "[WARN]") : () => {};

const PERMISSION_MISSING = (PERMISSION_NAME) => {console.error(`%c[PERMISSION] %c${PERMISSION_NAME}`, 'color: red', 'color: blue'); };
const PERMISSION = isDebugEnabled ? console.info.bind(console, "%c[PERMISSION] %c", 'color: red', 'color: inherit') : () => {};

// const INFO = isDebugEnabled ? console.info.bind(console, "INFO:") : () => {};
// const ERROR = isDebugEnabled ? console.error.bind(console, "ERROR:") : () => {};
// const COUNT = isDebugEnabled ? console.count.bind(console) : () => {};


function printScriptInfo() {
    try {
        WARN("isDebugEnabled:", isDebugEnabled);
        SCRIPT_INFO_RAW("=".repeat(40));

        SCRIPT_INFO("website", location.href);
        SCRIPT_INFO("scriptHandler", GM_info.scriptHandler);

        if(scriptHandler == "violentmonkey")
        {
            SCRIPT_INFO("run-at", GM_info.script.runAt)
        }
        else if (scriptHandler == "tampermonkey") {
            SCRIPT_INFO("run_at", GM_info.script.options.run_at);
        }

        SCRIPT_INFO("script.version", GM_info.script.version);
        SCRIPT_INFO("isFirstPartyIsolation", GM_info.isFirstPartyIsolation);
        SCRIPT_INFO("injectInto", GM_info.injectInto);

        // URLs
        SCRIPT_INFO("downloadURL", GM_info.script.downloadURL);
        SCRIPT_INFO("updateURL", GM_info.script.updateURL);

        SCRIPT_INFO_RAW("=".repeat(40));
    }
    catch (error){
        console.error("[printScriptInfo] An error occurred:", error.message);
    }
}

function printScriptValues() {
    try {
        VALUE_INFO_RAW("=".repeat(40));

        const allKeys = GM_listValues();
        for (const key of allKeys) {
            VALUE_INFO(key, GM_getValue(key));
        }

        VALUE_INFO_RAW("=".repeat(40));
    } catch (error) {
        console.error("[isDebugEnabled] An error occurred:", error.message);
    }
}

if(isDebugEnabled){
    printScriptInfo();
    printScriptValues();
}

// check_permissions
const requiredPermissions = ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"];
const scriptPermissions = GM_info?.script?.grant;
PERMISSION("Required Permissions:", requiredPermissions);
PERMISSION("Script Permissions:", scriptPermissions);

// Using a for...of loop to check for missing permissions
for (const requiredPermission of requiredPermissions) {
    if (!scriptPermissions.includes(requiredPermission)) {
        PERMISSION_MISSING(requiredPermission);
    }
}




// ######################### CONFIG #########################
const colorEmpty = '#fff';
const colorRed  = 'rgba(255, 0, 0, 0.4)';
const colorOrange = 'rgba(255, 165, 0, 0.5)';
const colorYellow = 'rgba(255, 255, 0, 0.5)';
const colorGreen = 'rgba(0, 255, 0, 0.2)';

// ###### SETINGS ###### DO NOT CHANGE ######
const headerText = "Prozentsatz";
const perfectScoreText = "100,00 %";


// ######################### READ CONFIG #########################
// function to read a variable from storage with default value and type check
function readVariableFromStorageWithDefault(variableName, defaultValue, expectedType) {
    try {
        const storedValue = GM_getValue(variableName, defaultValue);
        VALUE_READ(variableName, defaultValue);


        if (typeof storedValue !== 'undefined' && typeof storedValue === expectedType) {
            return storedValue;
        } else {
            VALUE_READ_WARN(variableName, expectedType);
            return defaultValue; // Return the default value if it's not defined or doesn't match the expected type
        }

    } catch (error) {
        VALUE_READ_ERROR(variableName, error);
        return defaultValue; // Return the default value in case of an error
    }
}

const isGreenBackgroundEnabled = readVariableFromStorageWithDefault("isGreenBackgroundEnabled", true, "boolean");
const isNothingShown = readVariableFromStorageWithDefault("isNothingShown", true, "boolean");
const isQuizHighlightEnabled = readVariableFromStorageWithDefault("isQuizHighlightEnabled", false, "boolean");

SCRIPT_RUN("READ CONFIG");
// ################################################################

// Select all img elements on the page
const imgElements = document.querySelectorAll('img');

// Define the URL to match
const targetUrl = 'https://moodle.bbbaden.ch/theme/image.php/lambda/quiz/1698066571/monologo?filtericon=1';


function HighlightQuiz (){
  if(isQuizHighlightEnabled) {
      try {
          // Loop through the img elements and check their src attribute
          imgElements.forEach((img) => {
            if (img.getAttribute('src') === targetUrl) {

              // Create an h1 element
              const h1Element = document.createElement('h1');
              h1Element.textContent = 'Q';

              // Add the h1 element to the parent of the matching img element
              const parentElement = img.parentElement;
              parentElement.appendChild(h1Element);

              img.remove();
            }
          });
      } catch (error) {
          console.error("[HighlightQuiz]: ", error);
      }

  } else {
      WARN("[HighlightQuiz] run but isQuizHighlightEnabled is off");
  }
}


function getBackgroundColorForPercentage(percentage) {
    // return a color based on the input percentage
    if (percentage < 1) {
        return colorRed;
    } else if (percentage < 50) {
        return colorOrange;
    } else if (percentage < 99) {
        return colorYellow;
    } else {
        //console.warn("[getBackgroundColorForPercentage] color for :", percentage, "% not defined");
        if(isNothingShown){
            return colorRed;
        }
        return colorEmpty;
    }
}


var backgroundColor = '';

// Get all <tr> elements on the webpage (tableRow)
const tableRowElements = document.getElementsByTagName('tr');
DEBUG("tableRowElements:", tableRowElements);

// Iterate through each tableRow element
for (const tableRow of tableRowElements) {
    DEBUG("tableRow:", tableRow);

    // Get all child elements of the current tableRow
    const tableRow_childElements = tableRow.children; // Use .children to get all child elements

    let isChanged = false;

    if(isGreenBackgroundEnabled){
        backgroundColor = colorGreen;
    } else {
        backgroundColor = '';
    }

    // Iterate through each child element within the <tr>
    for (const tableRow_childElement of tableRow_childElements) {

        // Check if the current child element has the class "column-percentage"
        if (tableRow_childElement.classList.contains('column-percentage')) {
            // Check if the text content of the child element is not "100,00 %"

            // skip the first row in table (header)
            const innerText = tableRow_childElement.innerText;
            if (innerText === headerText){
                DEBUG("'", headerText, "' detected", innerText);
                continue;
            }

            if (tableRow_childElement.textContent.trim() !== perfectScoreText) {
            const textContent = tableRow_childElement.textContent.trim(); // Extract the text content of the child element

                // set color of items
                if (!textContent.includes("-")) {
                    isChanged = true;
                    const percentage = parseFloat(textContent);
                    //console.log("Float Value:", percentage.toFixed(2));

                    backgroundColor = getBackgroundColorForPercentage(percentage);

                } else {
                    if(isNothingShown){
                        backgroundColor = colorRed;
                    } else {
                        backgroundColor = colorEmpty;
                    }
                    isChanged = true;
                }
            } else {
                // it is not !== 100,00% what is it? 100,00%
                if(isGreenBackgroundEnabled){
                    backgroundColor = colorGreen;
                    isChanged = true;
                }
            }
        }
    }

    //check if the item dosn't belong to a grade (Handlungsziel)
    const tableRow_childClass_baggt = tableRow.getElementsByClassName("baggt");
    DEBUG("tableRow_childClass_baggt", tableRow_childClass_baggt)

    if (isChanged && tableRow_childClass_baggt.length < 1) {
        // loop through each column
        for (let k = 0; k < tableRow_childElements.length; k++)
        {
            const tableRow_childElement = tableRow_childElements[k];
            tableRow_childElement.style.backgroundColor = backgroundColor;
        }

    }
}

SCRIPT_RUN("main()");
// ################################################################


// ###################### CHANGE TEXT COLOR #######################
// COLOR ELEMENTS FOR BETTER VISUALITY

const gradeItemHeaders = document.querySelectorAll('.gradeitemheader');

// Loop through each element and set the color to black with !important
gradeItemHeaders.forEach(function(header) {
    header.style.setProperty('color', 'black', 'important');
});

const customElements = document.querySelectorAll('.d-block.text-uppercase.small.dimmed_text');


customElements.forEach(function(element) {
    // Loop through each element and set the color to darkgray with !important
    element.style.setProperty('color', 'darkgray', 'important');
});

SCRIPT_RUN("CHANGE TEXT COLOR");
// ################################################################

if(isQuizHighlightEnabled){
    HighlightQuiz();
    SCRIPT_RUN("CHANGE QUIZ ICON");
}


SCRIPT_RUN("script");
