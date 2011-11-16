//REMOKU
//A. Cassidy Napoli
//Copyright 2011 
//Licensed: NEW BSD

////////////////////////
//BEGIN HELPER FUNCTIONS

function dbg(log){
	if (console.log) console.log(log);
	else alert (log);	
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

//END HELPER FUNCTIONS
//////////////////////



///////////////////////////
//BEGIN DISCOVERY FUNCTIONS

var rokuFound = false;
var lastOctet = 1;
var address   = "";
var rokus     = [];
var rokuCount = 2;
var canceled = false;
var cancel;


function useRoku(){
	rokuAddress = document.getElementById('rokuselect').options[document.getElementById('rokuselect').selectedIndex].value;
	createCookie("rokuAddress", rokuAddress, 365);
}

function manualAdd(){
	address = document.getElementById('maddress').value;
	try
	{
		rokus = readCookie("rokus").split(",");
	}
	catch(err)
	{
		rokus = [];
	}
	if (address!=null){
	if(!include(rokus,address))rokus.push(address);
	var rokupicker = "<form>Control this Roku: <select id='rokuselect' onchange='useRoku();'>";
	createCookie("rokus", rokus.join(","), 365);
	if (rokus.length==1){rokuAddress = rokus[0];createCookie("rokuAddress",rokus[0],365);}
		while(rokus.length>0){
			var r = rokus.shift();
			if(rokuAddress==r){
				rokupicker +=  "<option selected=selected>" + r + "</option>"//TODOHERE
			}else{
				rokupicker +=  "<option>" + r + "</option>"
			}
		}
		rokupicker +="<select></form>";
		document.getElementById('rokus').innerHTML=rokupicker;
	}
}	
	
function findRokus(){
	var ifr = document.getElementById('rokuscanframe');
	ifr.onload = loadedframe;
	if (lastOctet<255 && rokus.length != document.getElementById('num').value && cancel!=true){
		rokuFound = false;
		address = document.getElementById('octet1').value + 
		"." + document.getElementById('octet2').value +
		"." + document.getElementById('octet3').value + 
		"." + lastOctet;
		ifr.src = "http://" + address +":8060/query/apps";
		setTimeout('checkRokuLoadResult()',750);
	}else{
		lastOctet = 1;
		ifr.src = "about:blank";
		createCookie("rokus", rokus.join(","), 365);
		var rokupicker = "<form>Control this Roku: <select id='rokuselect' onchange='useRoku();'>";
		if (rokus.length==1){rokuAddress = rokus[0]; createCookie("rokuAddress",rokus[0],365);}
		while(rokus.length>0){
			var r = rokus.shift();
			if(rokuAddress==r){
				rokupicker +=  "<option selected=selected>" + r + "</option>"//TODOHERE
			}else{
				if (r!="")rokupicker +=  "<option>" + r + "</option>"
			}
		}
		rokupicker +="<select></form>";
		document.getElementById('rokus').innerHTML=rokupicker;
		cancel=false;
		document.getElementById('scanforroku').innerHTML="Scan";
		canceled = false;
		return true;
		}
}

function loadedframe(){
	rokuFound = true;
}

function checkRokuLoadResult(){
	var result 
	if (rokuFound == true ){
	 result = "Found: " + address + "<br>";
	 if(!include(rokus,address))rokus.push(address);
	} else {
	 result = "Not found: " + address + "<br>";
	}
	document.getElementById('rokus').innerHTML=result + "Total found: " + rokus.length;
	lastOctet++;
	findRokus();
}

function Scan(){
	if(canceled==false){
		document.getElementById('scanforroku').innerHTML="Cancel Scan";
		cancel = false
		canceled = true;
		findRokus();
		}
	else{
		canceled = false;
		cancel = true;
		document.getElementById('scanforroku').innerHTML="Scan";
		}
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
	if(localStorage)localStorage.setItem('apps', JSON.stringify(apps));
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
	rokuAddress = readCookie("rokuAddress");
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
			screenArray[i].style.visibility = "visible";
			screenArray[i].style.display = "block";
		} else {
			screenArray[i].style.visibility = "hidden";
			screenArray[i].style.display = "none";
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

var remoteButtons;
var rokupostframe = document.createElement("iframe");
var rokutextframe = document.createElement("iframe");
var rokuscanframe = document.createElement("iframe");
var rokupostform = document.createElement("form");
var rokutextform = document.createElement("form");

var rokuAddress;

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
var screenArray = new Array(); 

window.onload = function(){
	window.scrollTo(0, 1);
	rokuAddress = readCookie("rokuAddress");
	try{
		var apps = JSON.parse(localStorage.getItem('apps'))
	}catch(err){
		apps = [];	
	}
	if(localStorage)_rmAppsCB(apps);
	try
	{
		rokus = readCookie("rokus").split(",");
	}
	catch(err)
	{
		rokus = [];
	}
	if (rokus.length>0){
		if (rokus[0]=="")rokus.shift();
		var rokupicker = "<form>Control this Roku: <select id='rokuselect' onchange='useRoku();'>";
			while(rokus.length>0){
				var r = rokus.shift();
				if(rokuAddress==r){
					rokupicker +=  "<option selected=selected>" + r + "</option>"//TODOHERE
				}else{
					if(r!="")rokupicker +=  "<option>" + r + "</option>";
				}
			}
			rokupicker +="</select></form><!--br><a href='http://"+rokuAddress+":8060/query/apps' target='_blank'>Load Apps</a -->";
			document.getElementById('rokus').innerHTML=rokupicker;
	}

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
		
	rokuscanframe.name="rokuscanframe"
	rokuscanframe.id="rokuscanframe";
	rokuscanframe.style.visibility="hidden";
	rokuscanframe.style.display="none";
	rokuscanframe.src="about:blank";
	rokuscanframe = document.body.appendChild(rokuscanframe);

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
	
	addRokuButton = document.getElementById("addroku");
	addRokuButton.onclick = manualAdd;

	scanForRokuButton = document.getElementById("scanforroku");
	scanForRokuButton.onclick = Scan;
	
}

//Hide iPhone URL bar
addEventListener("load", function(){setTimeout(hideURLbar, 100);}, false);
function hideURLbar(){
    window.scrollTo(0, 1);
	}

//END INITIALIZATION
////////////////////
