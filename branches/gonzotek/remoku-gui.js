//REMOKU
//A. Cassidy Napoli
//Copyright 2011 
//Licensed: NEW BSD

////////////////////////
//BEGIN HELPER FUNCTIONS

if (!Array.unique) Array.prototype.unique = function() {
	    var o = {}, i, l = this.length, r = [];
	    for(i=0; i<l;i+=1) o[this[i]] = this[i];
	    for(i in o) r.push(o[i]);
	    return r;
};

function dbg(log){
	if (console.log) console.log(log);
	//else alert (log);
	dbgOut.innerHTML += log + "<br>";	
}

//function: include(array, obj)

//include([1,2,3,4], 3); // true
//include([1,2,3,4], 6); // undefined
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}


/* function name: getElementByClass
* purpose: gets all elements based off of a class
* input: String, String (optional)
* output: none
* http://www.actiononline.biz/web/code/how-to-getelementsbyclass-in-javascript-the-code/
*/
function getElementsByClass(theClass, classType)
{
	//pulls the elements based off of their tag
	//if one is not specified, it will pull everything
	var allHTMLTags=document.getElementsByTagName((classType?classType:'*'));

	//temp array that is going to grab our elements
	var returnerArray = new Array();

	//go through the main array of elements
	for (var i=0; i<allHTMLTags.length; i++)
	{
		//if the element is within the class we want
		//we will add it to our array
		if (allHTMLTags[i].className==theClass)
		{
		returnerArray.push(allHTMLTags[i]);
		}
	}

	//send the array back to the calling function
	return returnerArray;
}


function stopFindRokus() {
    if (window.stop) {
        window.stop();
    }
    else if (document.execCommand) {
        document.execCommand("Stop", false);
    }   
}
//Use following javascript function to get domain from URL.
//Example url: http://192.168.1.3:8060/query/icon/11
//Example return: 192.168.1.3
function getDomainFromUrl(url) {
	return url.match(/:\/\/(.[^/]+)\:/)[1];
}

//END HELPER FUNCTIONS
//////////////////////



///////////////////////////
//BEGIN DISCOVERY FUNCTIONS

function updateSelect() {
	while (rokuSelect.length>0){
		rokuSelect.remove(rokuSelect.length -1);
	}
	
	rokus  = scannedRokus.concat(manualRokus).unique();
	
	for (i=0;i<rokus.length;i++) {
		if(rokus[i]!=null){
			if(rokus.length==1){
				rokuAddress=rokus[i];
				localStorage.setItem('rokuAddress', rokuAddress);
			}
			var rokuSelected = rokuAddress==rokus[i] ? true : false;
			rokuSelect.options[i] = new Option(rokus[i], rokus[i], rokuSelected, rokuSelected);
		}
	}
}

function addRoku(){
	manualRokus.push(manualInput.value);
	manualRokus = manualRokus.unique();
	localStorage.setItem('manualRokus', manualRokus.join(","));
	buildManualRokusMenu();
	updateSelect();
	return false;
}

function removeRoku(){
	try{
		var removedRoku = manualSelect[manualSelect.selectedIndex].value;
	}
	catch(err){
		//dbg(err);
	}
	//dbg(removedRoku);
	for (i = 0; i<manualRokus.length;i++){
		if(removedRoku==manualRokus[i])manualRokus.splice(i,1);
		}
	manualRokus = manualRokus.unique();
	localStorage.setItem('manualRokus', manualRokus.join(","));
	buildManualRokusMenu();
	updateSelect();
	return false;
}

function buildManualRokusMenu(){
	while (manualSelect.length>0){
		manualSelect.remove(manualSelect.length - 1);
	}
	manualRokus = manualRokus.unique();
	for (i = 0; i<manualRokus.length; i++){
		var rokuSelected = rokuAddress==manualRokus[i] ? true : false;
		//alert(manualRokus[i]);
		manualSelect.options[i] = new Option(manualRokus[i], manualRokus[i], rokuSelected);
	}
}


function loadedImage() {
	var URL = this.src;
	scannedRokus.push(getDomainFromUrl(URL));
	
	if(scannedRokus.length<=rokuCount){
		localStorage.setItem('scannedRokus', scannedRokus.join(","));
		updateSelect();
	}
	if (scannedRokus.length>=rokuCount) {
		scanButton.innerHTML="Scan";
		scanning = false;
		stopFindRokus();
		}
}


function findRokus() {
	scannedRokus = new Array;
	setRokuCount();
	if(!scanning){
		this.innerHTML="Stop";
		scanning = true;
		var images = [];
		for (i = 1; i < 255; i++) {
			images[i] = new Image();
			var URL = "http://" + myNetwork + "." + i + ":8060/query/icon/11";
			images[i].onload = loadedImage;
			images[i].src = URL;
		}
	}
	else{
		scanning = false;
		this.innerHTML="Scan";
		stopFindRokus();
	}
}

function setMyNetwork() {
	myNetwork = [octet1.value,octet2.value,octet3.value].join(".");
	localStorage.setItem('myNetwork', myNetwork);
}

function setRokuCount() {
	rokuCount = numField.value;
	localStorage.setItem('rokuCount', rokuCount);
}

function setRokuAddress(){
	rokuAddress = this.options[this.selectedIndex].value;
	localStorage.setItem('rokuAddress', rokuAddress);
	}

function firstSetup(){
	for(i=0;i<screenArray.length;i++){
		screenArray[i].setAttribute("class", "hidden");
		}
	firstSetupScreen.setAttribute("class", "visible")
	//var setup = confirm("It looks like you haven't used Remoku before. Would you like to begin by scanning for Rokus?");
	//if(setup){
	//	rokuCount = prompt ("Ok, how many Rokus do you own?", "1");
	//	myAddress = prompt ("Thanks, last question. What is the network base address. If you're not sure, try the suggested network", "192.168.1");
	//	alert  ("Great, now press ok and your network will be scanned for Rokus.");
	//	numField.value = rokuCount;
	//	findRokus();
 	//}
}

//END DISCOVERY FUNCTIONS
/////////////////////////

////////////////////
//BEGIN ROKU SPECIFIC CODE


/* function name: rokupost
*  purpose: send a post request to a roku via a hidden form
*  input: String, String
*  output: none
*/
function rokupost(action, param){
	var rokupost = document.getElementById('rokupost');
	rokupost.setAttribute("action", "http://" + rokuAddress + ":8060/" + action + "/" + param);
	rokupost.submit();
	return false;
}

function rokulaunch(id){
	rokupost("launch",id);
	}


function nextQuery(){
	var rokutext =  document.getElementById('rokutext');
	var text = document.getElementById("textentry").value;
	if(text){
		var letter = text.slice(0,1);
		rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "LIT_" + escape(letter));
		rokutext.submit();
		text = text.slice(1);
		document.getElementById("textentry").value = text
		return false;
		}
	}
function delayNextQuery(){
	setTimeout('nextQuery()',200);
	}

function rokuText(){
	var rokutext =  document.getElementById('rokutext');
	var text = document.getElementById("textentry").value;
	if(text){
		var letter = text.slice(0,1);
		text = text.slice(1);
		rokutext.setAttribute("action", "http://" + rokuAddress + ":8060/" + "keypress" + "/" + "LIT_" + escape(letter));
		rokutext.submit();
		document.getElementById("textentry").value = text
		}
	}	
	
function delayLoadIcons(){
	if(appidarray) var appid = appidarray.shift();
	if(appid)document.getElementById("app"+appid).src = 'http://' + rokuAddress +':8060/query/icon/' + appid;	
	}


function loadRokuImages(){
	setTimeout('delayLoadIcons()',50);
	}

		
function _rmAppsCB(apps){
	if(localStorage){
		localStorage.setItem('apps', JSON.stringify(apps));
	}
	var list = "";
	var applist = document.getElementById("applist");
    appidarray = new Array();
	for (app in apps){
		var htmlitem = "<li><a href='#" + apps[app].id + "' onclick='rokulaunch(" + apps[app].id + ");'>" +
		"<img class='icons' id='app" + apps[app].id + "' onload='loadRokuImages()' > " + 
		apps[app].name + "</></li>"; 
		list += htmlitem;
		appidarray.push( apps[app].id);
		}
	applist.innerHTML = list;
	appid = appidarray.shift();
	var dt = new Date();
	if(appid!=null)document.getElementById("app"+appid).src = 'http://' + rokuAddress +':8060/query/icon/' + appid;
		
}
	
function rokuApps(){
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://"+ rokuAddress +":88/apps.js";
	document.body.appendChild(script);
}

function launchRemoku(){
	rokulaunch("dev");
	}

//END ROKU SPECIFIC CODE
////////////////////////


//////////////
//GUI BINDINGS
function btnDown(){
	lastBtn = this.id;
	rokupost("keydown",this.id);
}
function btnUp(){
	rokupost("keyup",lastBtn);
}

function activateButton(){
	var activeBtn = this.id;
	for(i=0;i<navArray.length;i++){
		if (activeBtn == navArray[i].id){
			navArray[i].setAttribute("class", "active nav");
			screenArray[i].setAttribute("class", "visible");
		} else {
			screenArray[i].setAttribute("class", "hidden");
			navArray[i].setAttribute("class", "nav");
		}
	}
	setTimeout(hideURLbar, 100);
}

function textOnOff(){
	textScreen = document.getElementById("text");
	if (this.getAttribute("class")=="nav") {
		this.setAttribute("class", "active nav");
		textScreen.style.visibility = "visible";
		textScreen.style.display = "block";
	} else {
		this.setAttribute("class", "nav");
		textScreen.style.visibility = "hidden";
		textScreen.style.display = "none";
	}
	setTimeout(hideURLbar, 100);
}

//END GUI BINDINGS
//////////////////

//////////////////////
//BEGIN INITIALIZATION

var rokuSelect;
var myNetwork;
var octet1;
var octet2;
var octet3;
var scanButton;
var removeButton;
var addButton;
var scanning = false;
var foundRokus = 0;
var rokuAddress;
var rokus = [];
var rokuCount;
var numField;
var manualInput;
var manualSelect;

var scannedRokus = [];
var manualRokus = [];

var dbgOut;

var remoteButtons;
var rokupostframe = document.createElement("iframe");
var rokutextframe = document.createElement("iframe");
var rokuscanframe = document.createElement("iframe");
var rokupostform = document.createElement("form");
var rokutextform = document.createElement("form");

var trasmitText = "";

var appidarray = [];

var loadAppsButton;
var startAppsButton;
var scanForRokuButton;
var addRokuButton;

var navRemote;
var navText;	
var navApps;
var navConfig;
var navArray = new Array();

var remoteScreen;
var configScreen;
var textScreen;
var appsScreen;
var firstSetupScreen;
var screenArray = new Array(); 

window.onload = function(){
	window.scrollTo(0, 1);
	dbgOut = document.getElementById("dbgOut");
	if(localStorage.getItem)dbg("localStorage supported");
	dbg(navigator.appName);
	dbg(navigator.userAgent);
	rokuSelect = document.getElementById("rokus");
	rokuSelect.onchange = setRokuAddress;
	
	scannedRokus = localStorage.getItem('scannedRokus') ? localStorage.getItem('scannedRokus').split(",") : [];
	octet1 = document.getElementById('octet1');
	octet2 = document.getElementById('octet2');
	octet3 = document.getElementById('octet3');
	octet1.onchange = setMyNetwork;
	octet2.onchange = setMyNetwork;
	octet3.onchange = setMyNetwork;
	
	myNetwork = localStorage.getItem('myNetwork') ? localStorage.getItem('myNetwork') : "192.168.1";
	var octets = myNetwork.split(".");
	octet1.value=octets[0];
	octet2.value=octets[1];
	octet3.value=octets[2];

	rokuCount = localStorage.getItem('rokuCount') ? localStorage.getItem('rokuCount') : "1";
	numField = document.getElementById('num');
	numField.value = rokuCount;
	numField.onchange = setRokuCount;
	
	scanButton = document.getElementById('scanforroku');
	scanButton.onclick = findRokus;
	
	rokuAddress = localStorage.getItem('rokuAddress');
	manualInput = document.getElementById('maddress');
	manualSelect = document.getElementById('manualrokus');
	manualRokus = localStorage.getItem('manualRokus') ? localStorage.getItem('manualRokus').split(",") : [];
	removeButton = document.getElementById('removeroku');
	removeButton.onclick = removeRoku;
	addButton = document.getElementById('addroku');
	addButton.onclick = addRoku;
	if(manualRokus.length>0) buildManualRokusMenu();
	updateSelect();
	try{
		var apps = JSON.parse(localStorage.getItem('apps'))
	}catch(err){
		apps = [];	
	}
	if(apps.length>0)_rmAppsCB(apps);
	
	rokupostframe.name="rokuresponse"
	rokupostframe.id="rokuresponse";
	rokupostframe.style.visibility="hidden";
	rokupostframe.style.display="none";
	rokupostframe = document.body.appendChild(rokupostframe);

	rokutextframe.name="rokutextresponse"
	rokutextframe.id="rokutextresponse";
	rokutextframe.style.visibility="hidden";
	rokutextframe.style.display="none";
	rokutextframe.onload = delayNextQuery;
	rokutextframe = document.body.appendChild(rokutextframe);
	
	rokupostform.style.visibility="hidden";
	rokupostform.style.display="none";
	rokupostform.id="rokupost";
	rokupostform.method="post";
	rokupostform.target="rokuresponse";
	rokupostform = document.body.appendChild(rokupostform);
	
	rokutextform.style.visibility="hidden";
	rokutextform.style.display="none";
	rokutextform.id="rokutext";
	rokutextform.method="post";
	rokutextform.target="rokutextresponse";
	rokutextform = document.body.appendChild(rokutextform);
	
	
	remoteButtons = getElementsByClass("link");
	for(var i=0; i<remoteButtons.length; i++){
		remoteButtons[i].onmousedown = btnDown;
		remoteButtons[i].ontouchstart = btnDown;
		remoteButtons[i].onmouseup = btnUp;
		remoteButtons[i].ontouchend = btnUp;
	}
	
	
	remoteScreen = document.getElementById("remote");
	configScreen = document.getElementById("config");
	textScreen = document.getElementById("text");
	appsScreen = document.getElementById("apps");
	firstSetupScreen = document.getElementById("firstsetup");
	screenArray = [remoteScreen,appsScreen,configScreen];
	
	navRemote = document.getElementById("navremote");
	navText = document.getElementById("navtext");
	navApps   = document.getElementById("navapps");
	navConfig = document.getElementById("navconfig");
    navArray = [navRemote,navApps,navConfig];
    
	navRemote.onclick = activateButton;
	navText.onclick = textOnOff;
	navApps.onclick = activateButton;
	navConfig.onclick = activateButton;
	
	sendTextBtn = document.getElementById("sendtext");
	sendTextBtn.onclick = rokuText;
	
	loadAppsButton = document.getElementById("loadapps");
	loadAppsButton.onclick = rokuApps;

	startAppsButton = document.getElementById("startremoku");
	startAppsButton .onclick = launchRemoku;
	if(!rokuAddress) {
		 firstSetup();
	 }

	
}

//Hide iPhone URL bar
addEventListener("load", function(){setTimeout(hideURLbar, 100);}, false);
function hideURLbar(){
    window.scrollTo(0, 1);
	}

//END INITIALIZATION
////////////////////
