# CafeMedia Code Challenge - Klepper's Solution

## Setup Instructions
1. Download the repository
1. Change into the correct directory
1. From the terminal, run ```npm install```
1. Run ```npm audit fix --force``` as many times as necessary to resolve any security vulnurabilities
1. Start the server using ```npm run server```
1. Open Chrome and go to http://127.0.0.1:8080/

## Code Walkthrough

### **index.html**
The instruction section of HTML was removed.

The CSS was moved into ```main.css``` file.

The script section in the header was modified as follows:
- Timing-related constants were added
- The header ad was not loading, so I replaced the unit path to one taken from a Google tutorial
- Event listeners were added for the ```impressionViewable``` and ```slotRenderEnded``` events
- Timeouts were added to those two events in order to make the header ad unsticky
- Initial ad loading was disabled so that ads can be placed into the DOM; this obligates us to refresh the ads in the ```onPageLoaded``` function in ```main.js``` (see below)

Note: It would be better to move more of this code to an external JS file.

An ```onload``` event was added to the body tag, calling a function defined in ```main.js```.


### **main.css**
Added borders around the ads:
- Green for the header ad
- Blue for all the ads inserted into the DOM


### **main.js**
Constants are added to control the maximum number of ads to be displayed (not counting header ad), and the unit path prefix.

Next, a utility function called ```containsOnlyImage``` is defined - it tests to see whether a paragraph tag has a child image tag, and only that one image tag.

All the good stuff happens in the ```onPageLoaded``` function! The DOM tree within the **article** tag is traversed once(!) during which the following checks are performed:
- The ```containsOnlyImage``` function is called to see whether an can be placed below the current paragraph
- The (non-header) ads are spaced so that no two will be visible to the user at one time. This is determined using the browser window's inner height at the time the page loads
- At most 9 ads are displayed

Assuming these checks are all passed:
- A new div element is created with id of 'ad0', 'ad1', etc.
- The appropriate ```googletag.display``` function is pushed into the ```cmd``` array
- A corresponding slot is added to GPT
- Finally, the ads are loaded via a GPT refresh command.

