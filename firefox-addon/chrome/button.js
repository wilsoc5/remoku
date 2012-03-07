Components.utils.import("resource://gre/modules/Services.jsm");
if (typeof remoku == "undefined") {  
  var remoku = {  
    init : function() {  
	    var firstrun = Services.prefs.getBoolPref("extensions.remoku.installed");
		var curVersion = "1.4";
		if (!firstrun) {
		  Services.prefs.setBoolPref("extensions.remoku.installed", true);
		    remoku.installButton("nav-bar", "remoku-button-1");
		    remoku.installButton("addon-bar", "remoku-button-1");
		} else {
		  try {
		    var installedVersion = Services.prefs.getCharPref("extensions.remoku.installedVersion");
		    if (curVersion > installedVersion) {
		      Services.prefs.setCharPref("extensions.remoku.installedVersion", curVersion);
		    }
		  } catch (err) {
		  }
		}
   },
	installButton : function(toolbarId, id, afterId){
		if (!document.getElementById(id)) {
        var toolbar = document.getElementById(toolbarId);
        var before = null;
        if (afterId) {
            let elem = document.getElementById(afterId);
            if (elem && elem.parentNode == toolbar)
                before = elem.nextElementSibling;
        }
        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");
        if (toolbarId == "addon-bar")
            toolbar.collapsed = false;
    	}	
	},
	channel : ""
  };  
};

window.addEventListener("load", remoku.init, false);
