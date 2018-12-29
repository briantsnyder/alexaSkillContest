/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

// IMPORTANT: Please note that this template uses Dispay Directives,
// Display Interface for your skill should be enabled through the Amazon developer console
// See this screenshot - https://alexa.design/enabledisplay

const Alexa = require('ask-sdk-core');

/* INTENT HANDLERS */

//this is the entry to the app
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput) {
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

//my function:
const YesHandler = {
  //set up slot to accept either "yes" or "no"
  canHandle(handlerInput){
    console.log("inside yes handler");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    //is the issue the attributes state?

    return request.type === 'IntentRequest' && request.intent.name === "YesIntent";
  },
  handle(handlerInput){

    //some error here is preventing us from being able to go through
    // quesetion is when does it break??

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
    var speakOutput = "Gotcha. " + suggestion;
    var repromptOutput = suggestion;

    return response.speak(speakOutput)
                   .reprompt(repromptOutput)
                   .getResponse();
  }
}

const BeginHandler = {

  //why isn't this being activated in the first place???

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

    var suggestion = suggestRestaurant(handlerInput);
    var speakOutput = suggestion;
    var repromptOutput = suggestion;

    return response.speak(speakOutput)
                   .reprompt(repromptOutput)
                   .getResponse();

  }
}

const MainHandler = {
  canHandle(handlerInput){
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;

    return request.intent.name === ""
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
// const imagePath = "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/{0}x{1}/{2}._TTH_.png";
// const backgroundImagePath = "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/{0}x{1}/{2}._TTH_.png"
// const speechConsCorrect = ['Booya', 'All righty', 'Bam', 'Bazinga', 'Bingo', 'Boom', 'Bravo', 'Cha Ching', 'Cheers', 'Dynomite', 'Hip hip hooray', 'Hurrah', 'Hurray', 'Huzzah', 'Oh dear.  Just kidding.  Hurray', 'Kaboom', 'Kaching', 'Oh snap', 'Phew','Righto', 'Way to go', 'Well done', 'Whee', 'Woo hoo', 'Yay', 'Wowza', 'Yowsa'];
// const speechConsWrong = ['Argh', 'Aw man', 'Blarg', 'Blast', 'Boo', 'Bummer', 'Darn', "D'oh", 'Dun dun dun', 'Eek', 'Honk', 'Le sigh', 'Mamma mia', 'Oh boy', 'Oh dear', 'Oof', 'Ouch', 'Ruh roh', 'Shucks', 'Uh oh', 'Wah wah', 'Whoops a daisy', 'Yikes'];
const data = [
  {StateName: 'Alabama', Abbreviation: 'AL', Capital: 'Montgomery', StatehoodYear: 1819, StatehoodOrder: 22},
  {StateName: 'Alaska', Abbreviation: 'AK', Capital: 'Juneau', StatehoodYear: 1959, StatehoodOrder: 49},
  {StateName: 'Arizona', Abbreviation: 'AZ', Capital: 'Phoenix', StatehoodYear: 1912, StatehoodOrder: 48},
  {StateName: 'Arkansas', Abbreviation: 'AR', Capital: 'Little Rock', StatehoodYear: 1836, StatehoodOrder: 25},
  {StateName: 'California', Abbreviation: 'CA', Capital: 'Sacramento', StatehoodYear: 1850, StatehoodOrder: 31},
  {StateName: 'Colorado', Abbreviation: 'CO', Capital: 'Denver', StatehoodYear: 1876, StatehoodOrder: 38},
  {StateName: 'Connecticut', Abbreviation: 'CT', Capital: 'Hartford', StatehoodYear: 1788, StatehoodOrder: 5},
  {StateName: 'Delaware', Abbreviation: 'DE', Capital: 'Dover', StatehoodYear: 1787, StatehoodOrder: 1},
  {StateName: 'Florida', Abbreviation: 'FL', Capital: 'Tallahassee', StatehoodYear: 1845, StatehoodOrder: 27},
  {StateName: 'Georgia', Abbreviation: 'GA', Capital: 'Atlanta', StatehoodYear: 1788, StatehoodOrder: 4},
  {StateName: 'Hawaii', Abbreviation: 'HI', Capital: 'Honolulu', StatehoodYear: 1959, StatehoodOrder: 50},
  {StateName: 'Idaho', Abbreviation: 'ID', Capital: 'Boise', StatehoodYear: 1890, StatehoodOrder: 43},
  {StateName: 'Illinois', Abbreviation: 'IL', Capital: 'Springfield', StatehoodYear: 1818, StatehoodOrder: 21},
  {StateName: 'Indiana', Abbreviation: 'IN', Capital: 'Indianapolis', StatehoodYear: 1816, StatehoodOrder: 19},
  {StateName: 'Iowa', Abbreviation: 'IA', Capital: 'Des Moines', StatehoodYear: 1846, StatehoodOrder: 29},
  {StateName: 'Kansas', Abbreviation: 'KS', Capital: 'Topeka', StatehoodYear: 1861, StatehoodOrder: 34},
  {StateName: 'Kentucky', Abbreviation: 'KY', Capital: 'Frankfort', StatehoodYear: 1792, StatehoodOrder: 15},
  {StateName: 'Louisiana', Abbreviation: 'LA', Capital: 'Baton Rouge', StatehoodYear: 1812, StatehoodOrder: 18},
  {StateName: 'Maine', Abbreviation: 'ME', Capital: 'Augusta', StatehoodYear: 1820, StatehoodOrder: 23},
  {StateName: 'Maryland', Abbreviation: 'MD', Capital: 'Annapolis', StatehoodYear: 1788, StatehoodOrder: 7},
  {StateName: 'Massachusetts', Abbreviation: 'MA', Capital: 'Boston', StatehoodYear: 1788, StatehoodOrder: 6},
  {StateName: 'Michigan', Abbreviation: 'MI', Capital: 'Lansing', StatehoodYear: 1837, StatehoodOrder: 26},
  {StateName: 'Minnesota', Abbreviation: 'MN', Capital: 'St. Paul', StatehoodYear: 1858, StatehoodOrder: 32},
  {StateName: 'Mississippi', Abbreviation: 'MS', Capital: 'Jackson', StatehoodYear: 1817, StatehoodOrder: 20},
  {StateName: 'Missouri', Abbreviation: 'MO', Capital: 'Jefferson City', StatehoodYear: 1821, StatehoodOrder: 24},
  {StateName: 'Montana', Abbreviation: 'MT', Capital: 'Helena', StatehoodYear: 1889, StatehoodOrder: 41},
  {StateName: 'Nebraska', Abbreviation: 'NE', Capital: 'Lincoln', StatehoodYear: 1867, StatehoodOrder: 37},
  {StateName: 'Nevada', Abbreviation: 'NV', Capital: 'Carson City', StatehoodYear: 1864, StatehoodOrder: 36},
  {StateName: 'New Hampshire', Abbreviation: 'NH', Capital: 'Concord', StatehoodYear: 1788, StatehoodOrder: 9},
  {StateName: 'New Jersey', Abbreviation: 'NJ', Capital: 'Trenton', StatehoodYear: 1787, StatehoodOrder: 3},
  {StateName: 'New Mexico', Abbreviation: 'NM', Capital: 'Santa Fe', StatehoodYear: 1912, StatehoodOrder: 47},
  {StateName: 'New York', Abbreviation: 'NY', Capital: 'Albany', StatehoodYear: 1788, StatehoodOrder: 11},
  {StateName: 'North Carolina', Abbreviation: 'NC', Capital: 'Raleigh', StatehoodYear: 1789, StatehoodOrder: 12},
  {StateName: 'North Dakota', Abbreviation: 'ND', Capital: 'Bismarck', StatehoodYear: 1889, StatehoodOrder: 39},
  {StateName: 'Ohio', Abbreviation: 'OH', Capital: 'Columbus', StatehoodYear: 1803, StatehoodOrder: 17},
  {StateName: 'Oklahoma', Abbreviation: 'OK', Capital: 'Oklahoma City', StatehoodYear: 1907, StatehoodOrder: 46},
  {StateName: 'Oregon', Abbreviation: 'OR', Capital: 'Salem', StatehoodYear: 1859, StatehoodOrder: 33},
  {StateName: 'Pennsylvania', Abbreviation: 'PA', Capital: 'Harrisburg', StatehoodYear: 1787, StatehoodOrder: 2},
  {StateName: 'Rhode Island', Abbreviation: 'RI', Capital: 'Providence', StatehoodYear: 1790, StatehoodOrder: 13},
  {StateName: 'South Carolina', Abbreviation: 'SC', Capital: 'Columbia', StatehoodYear: 1788, StatehoodOrder: 8},
  {StateName: 'South Dakota', Abbreviation: 'SD', Capital: 'Pierre', StatehoodYear: 1889, StatehoodOrder: 40},
  {StateName: 'Tennessee', Abbreviation: 'TN', Capital: 'Nashville', StatehoodYear: 1796, StatehoodOrder: 16},
  {StateName: 'Texas', Abbreviation: 'TX', Capital: 'Austin', StatehoodYear: 1845, StatehoodOrder: 28},
  {StateName: 'Utah', Abbreviation: 'UT', Capital: 'Salt Lake City', StatehoodYear: 1896, StatehoodOrder: 45},
  {StateName: 'Vermont', Abbreviation: 'VT', Capital: 'Montpelier', StatehoodYear: 1791, StatehoodOrder: 14},
  {StateName: 'Virginia', Abbreviation: 'VA', Capital: 'Richmond', StatehoodYear: 1788, StatehoodOrder: 10},
  {StateName: 'Washington', Abbreviation: 'WA', Capital: 'Olympia', StatehoodYear: 1889, StatehoodOrder: 42},
  {StateName: 'West Virginia', Abbreviation: 'WV', Capital: 'Charleston', StatehoodYear: 1863, StatehoodOrder: 35},
  {StateName: 'Wisconsin', Abbreviation: 'WI', Capital: 'Madison', StatehoodYear: 1848, StatehoodOrder: 30},
  {StateName: 'Wyoming', Abbreviation: 'WY', Capital: 'Cheyenne', StatehoodYear: 1890, StatehoodOrder: 44},
];

// const states = {
//   START: `_START`,
//   QUIZ: `_QUIZ`,
// };

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

  // There's a possibility that we might get duplicate answers
  // 8 states were founded in 1788
  // 4 states were founded in 1889
  // 3 states were founded in 1787
  // to prevent duplicates we need avoid index collisions and take a sample of
  // 8 + 4 + 1 = 13 answers (it's not 8+4+3 because later we take the unique
  // we only need the minimum.)
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
