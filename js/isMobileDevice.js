/*

	isMobileDevice.js

	https://github.com/code-for-coffee
	Last Updated 3/17/13
	james [at] codeforcoffee [dot] org

	Released under GPL.
	http://www.gnu.org/licenses/gpl.html

	This script will detect if a user is on a mobile device.

	New! Updated screen size based on:
	http://gs.statcounter.com/#resolution-na-monthly-201212-201302

*/


function isMobileDevice() {
// test window widght/height first
if(window.innerWidth <= 1023 && window.innerHeight <= 767) {
	// user is on a low resolution device
	// Check type of device
	if (browser.match(/Android/i) ||
		browser.match(/Bada/i) ||
		browser.match(/BlackBerry/i) ||
		browser.match(/BB10/i) ||
		browser.match(/Firefox OS/i) ||
		browser.match(/Kindle/i) ||
		browser.match(/iPad/i) ||
		browser.match(/iPhone/i) ||
		browser.match(/iPod/i) ||
		browser.match(/Maemo/i) ||
		browser.match(/Meego/i) ||
		browser.match(/Symbian/i) ||
		browser.match(/Ubuntu Touch/i) ||
		browser.match(/webOS/i) ||
		browser.match(/Windows CE/i) ||
		browser.match(/Windows Phone/i) ||
		browser.match(/Windows RT/i) ){

		// return that the device is mobile
		return userAgentOnMobile = true;
		console.log('User Agent is mobile');
		}
		else {
		// user is on a standard resolution device (not "mobile")
		console.log('User Agent is not mobile');
		return userAgentOnMobile = false;
		}
	}
}
