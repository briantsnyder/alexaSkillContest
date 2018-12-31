/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

// IMPORTANT: Please note that this template uses Dispay Directives,
// Display Interface for your skill should be enabled through the Amazon developer console
// See this screenshot - https://alexa.design/enabledisplay

const Alexa = require('ask-sdk-core');
const http = require('http');
const https = require("https");

/* INTENT HANDLERS */

//this is the entry to the app
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {


    //we're going to set the location in attributes
    const attributes = handlerInput.attributesManager.getSessionAttributes();


    //we need to make sure the device is notified if no address is given
    attributes.location = getLocation(handlerInput);

    return handlerInput.responseBuilder
      .speak(welcomeMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

const MoreInfoHandler = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return (request.type === "IntentRequest") &&
           (request.intent.name === "MoreInfoIntent" && attributes.state === "GUESSING" );

  },
  handle(handlerInput){

    const response = handlerInput.responseBuilder;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    return response.speak(`Successfully captured `+restaurants[attributes.counter])
                  .reprompt(`Uh oh`)
                  .getResponse();

  }
}

const YesHandler = {
  //set up slot to accept either "yes" or "no"
  canHandle(handlerInput){
    console.log("inside yes handler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    //need to make sure the beginIntent is fired first
    return request.type === 'IntentRequest' && request.intent.name === "YesIntent" && attributes.state === "GUESSING";
  },
  handle(handlerInput){

    const response = handlerInput.responseBuilder;
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    attributes.counter++;

    if( handlerInput.requestEnvelope.request.intent.slots.mui.value === "yes"){
      //maybe more elegant way to end??
      attributes.restaurant = restaurants[attributes.counter-1];
      return response.speak("Great! Shall I call "+attributes.restaurant+" for you?")
                     .getResponse();
    }

    var suggestion = suggestRestaurant(handlerInput);
    var speakOutput = "Gotcha. " + suggestion+test;
    var repromptOutput = suggestion;

    return response.speak(speakOutput)
                   .reprompt(repromptOutput)
                   .getResponse();
  }
}

//we'll need an array for name, type & extra info
//type may be the most difficult thing to implement

//test will be the new array for restaurants
var test;

const BeginHandler = {

  canHandle(handlerInput){
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return (request.intent.name === "BeginIntent" || request.intent.name === "AMAZON.StartOverIntent") &&
          request.type === 'IntentRequest';
  },
  handle(handlerInput){
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;
    attributes.state = "GUESSING";
    attributes.counter = 0;

    const query = 'maps/api/place/findplacefromtext/json?input=restaurant&inputtype=textquery&fields=formatted_address,name,opening_hours,rating&key='+key.key;
    //how to account for when people have bad internet connections?-> alexa voice to say 'loading'

    httpsGet(query, (theResult) => {
                console.log("received : " + theResult);
                //we'll need to be careful how we store it from here on out
                //putting it into arrays etc
                test = theResult;

            });

            var suggestion = suggestRestaurant(handlerInput);
            var speakOutput = suggestion;
            var repromptOutput = suggestion;

            return response.speak(speakOutput)
                           .reprompt(repromptOutput)
                           .getResponse();

  }
}

const RepeatHandler = {
  canHandle(handlerInput) {
    console.log("Inside RepeatHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return attributes.state === "GUESSING" &&
           request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.RepeatHandler';
  },
  handle(handlerInput) {
    console.log("Inside RepeatHandler - handle");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const question = getQuestion(attributes.counter, attributes.quizproperty, attributes.quizitem);

    return handlerInput.responseBuilder
      .speak(question)
      .reprompt(question)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    console.log("Inside HelpHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.HelpHandler';
  },
  handle(handlerInput) {
    console.log("Inside HelpHandler - handle");
    return handlerInput.responseBuilder
      .speak(helpMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    console.log("Inside ExitHandler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return request.type === `IntentRequest` && (
              request.intent.name === 'AMAZON.StopIntent' ||
              request.intent.name === 'AMAZON.PauseIntent' ||
              request.intent.name === 'AMAZON.CancelIntent'
           );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(exitSkillMessage)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput, error) {
    console.log("Inside ErrorHandler - handle");
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    return handlerInput.responseBuilder
      .speak(helpMessage)
      .reprompt(helpMessage)
      .getResponse();
  },
};

/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();

const welcomeMessage = `Welcome to You Choose!  I will help you choose a local restaurant to go to. Ask me to choose a restaurant`;
// const startQuizMessage = `OK.  I will ask you 10 questions about the United States. `;
const exitSkillMessage = `Enjoy your meal!`;
// const repromptSpeech = `Which other state or capital would you like to know about?`;
const helpMessage = `You can ask me to pick a restaurant of any type by saying, you choose a restaurant, or pick a specific type of restaurant by saying, you choose a blank restaurant. What would you like me to do?`;
const useCardsFlag = true;

/* HELPER FUNCTIONS */


//we'll have to find a way to automatically update this later
const restaurants = ["Amalfis", "Fedora", "TJs", "Chuckles"];

function suggestRestaurant(handlerInput){
    const attributes = handlerInput.attributesManager.getSessionAttributes();

    //this is where the major algorithm goes for recommending a restaurant
    //for now it is simply moving up an array
    var msg = "";

      if(attributes.counter > restaurants.length){
        msg += "You have run out of restaurants in the area. Might I suggest left-overs?";
      }else{
        msg += "What about "+restaurants[attributes.counter];
      }

    return msg;
}

const key = require("./key.json");

async function httpsGet(path, callback) {

      //error using ipbias in the api to find a location ==> we'll need to supply the location via an alexa location data-point

      //https://developer.amazon.com/docs/custom-skills/device-address-api.html
      //

      if(path !== "/v1/devices/*deviceId*/settings/address/countryAndPostalCode"){
        var options = {
            host: 'maps.googleapis.com',
            path: '/' + (path),
            method: 'GET',
        };
      }else{
        var options = {
            host: 'api.amazonalexa.com',
            path: '/' + (path),
            method: 'GET',
        };
      }


    var req = await https.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";

        //accept incoming data asynchronously
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });

        //return the data when streaming is complete
        res.on('end', () => {
            callback(responseString);
        });

    });
    req.end();
}

function getLocation(handlerInput){

  //need to find the address from the alexa api
    var device = handlerInput.System.device.deviceId;
    console.log(device);
    var path = "/v1/devices/"+device+"/settings/address/countryAndPostalCode";



  //need to return the zipcode from the alexa api
  //via binary search


}


// returns true if the skill is running on a device with a display (show|spot)
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}

function getBadAnswer(item) {
  return `I'm sorry. ${item} is not something I know very much about in this skill. ${helpMessage}`;
}

function getCurrentScore(score, counter) {
  return `Your current score is ${score} out of ${counter}. `;
}

function getFinalScore(score, counter) {
  return `Your final score is ${score} out of ${counter}. `;
}

function getCardTitle(item) {
  return item.StateName;
}

function getSmallImage(item) {
  return `https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/${item.Abbreviation}._TTH_.png`;
}

function getLargeImage(item) {
  return `https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/${item.Abbreviation}._TTH_.png`;
}

function getImage(height, width, label) {
  return imagePath.replace("{0}", height)
    .replace("{1}", width)
    .replace("{2}", label);
}

function getBackgroundImage(label, height = 1024, width = 600) {
  return backgroundImagePath.replace("{0}", height)
    .replace("{1}", width)
    .replace("{2}", label);
}

function getSpeechDescription(item) {
  return `${item.StateName} is the ${item.StatehoodOrder}th state, admitted to the Union in ${item.StatehoodYear}.  The capital of ${item.StateName} is ${item.Capital}, and the abbreviation for ${item.StateName} is <break strength='strong'/><say-as interpret-as='spell-out'>${item.Abbreviation}</say-as>.  I've added ${item.StateName} to your Alexa app.  Which other state or capital would you like to know about?`;
}

function formatCasing(key) {
  return key.split(/(?=[A-Z])/).join(' ');
}

function getQuestion(counter, property, item) {
  return `Here is your ${counter}th question.  What is the ${formatCasing(property)} of ${item.StateName}?`;
}

// getQuestionWithoutOrdinal returns the question without the ordinal and is
// used for the echo show.
function getQuestionWithoutOrdinal(property, item) {
  return "What is the " + formatCasing(property).toLowerCase() + " of "  + item.StateName + "?";
}

function getAnswer(property, item) {
  switch (property) {
    case 'Abbreviation':
      return `The ${formatCasing(property)} of ${item.StateName} is <say-as interpret-as='spell-out'>${item[property]}</say-as>. `;
    default:
      return `The ${formatCasing(property)} of ${item.StateName} is ${item[property]}. `;
  }
}

function getRandom(min, max) {
  return Math.floor((Math.random() * ((max - min) + 1)) + min);
}

function askQuestion(handlerInput) {
  console.log("I am in askQuestion()");
  //GENERATING THE RANDOM QUESTION FROM DATA
  const random = getRandom(0, data.length - 1);
  const item = data[random];
  const propertyArray = Object.getOwnPropertyNames(item);
  const property = propertyArray[getRandom(1, propertyArray.length - 1)];

  //GET SESSION ATTRIBUTES
  const attributes = handlerInput.attributesManager.getSessionAttributes();

  //SET QUESTION DATA TO ATTRIBUTES
  attributes.selectedItemIndex = random;
  attributes.quizItem = item;
  attributes.quizProperty = property;
  attributes.counter += 1;

  //SAVE ATTRIBUTES
  handlerInput.attributesManager.setSessionAttributes(attributes);

  const question = getQuestion(attributes.counter, property, item);
  return question;
}

function compareSlots(slots, value) {
  for (const slot in slots) {
    if (Object.prototype.hasOwnProperty.call(slots, slot) && slots[slot].value !== undefined) {
      if (slots[slot].value.toString().toLowerCase() === value.toString().toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

function getItem(slots) {
  const propertyArray = Object.getOwnPropertyNames(data[0]);
  let slotValue;

  for (const slot in slots) {
    if (Object.prototype.hasOwnProperty.call(slots, slot) && slots[slot].value !== undefined) {
      slotValue = slots[slot].value;
      for (const property in propertyArray) {
        if (Object.prototype.hasOwnProperty.call(propertyArray, property)) {
          const item = data.filter(x => x[propertyArray[property]]
            .toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
          if (item.length > 0) {
            return item[0];
          }
        }
      }
    }
  }
  return slotValue;
}

function getSpeechCon(type) {
  if (type) return `<say-as interpret-as='interjection'>${speechConsCorrect[getRandom(0, speechConsCorrect.length - 1)]}! </say-as><break strength='strong'/>`;
  return `<say-as interpret-as='interjection'>${speechConsWrong[getRandom(0, speechConsWrong.length - 1)]} </say-as><break strength='strong'/>`;
}


function getTextDescription(item) {
  let text = '';

  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      text += `${formatCasing(key)}: ${item[key]}\n`;
    }
  }
  return text;
}

function getAndShuffleMultipleChoiceAnswers(currentIndex, item, property) {
  return shuffle(getMultipleChoiceAnswers(currentIndex, item, property));
}

// This function randomly chooses 3 answers 2 incorrect and 1 correct answer to
// display on the screen using the ListTemplate. It ensures that the list is unique.
function getMultipleChoiceAnswers(currentIndex, item, property) {

  // insert the correct answer first
  let answerList = [item[property]];

  let count = 0
  let upperBound = 12

  let seen = new Array();
  seen[currentIndex] = 1;

  while (count < upperBound) {
    let random = getRandom(0, data.length - 1);

    // only add if we haven't seen this index
    if ( seen[random] === undefined ) {
      answerList.push(data[random][property]);
      count++;
    }
  }

  // remove duplicates from the list.
  answerList = answerList.filter((v, i, a) => a.indexOf(v) === i)
  // take the first three items from the list.
  answerList = answerList.slice(0, 3);
  return answerList;
}

// This function takes the contents of an array and randomly shuffles it.
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while ( 0 !== currentIndex ) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/* LAMBDA SETUP */
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    MoreInfoHandler,
    BeginHandler,
    // QuizAnswerHandler,
    RepeatHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    YesHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
