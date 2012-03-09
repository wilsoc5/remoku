function setChannel(){
    switch(widget.preferences.channel){
		case 'beta':
		  document.getElementById('betaButton').setAttribute('checked','true');
		  break;
		case 'dev':
		  document.getElementById('devButton').setAttribute('checked','true');
		  break;
		case 'prev':
		  document.getElementById('prevButton').setAttribute('checked','true');
		  break;
		default:
		  document.getElementById('stableButton').setAttribute('checked','true');
	    }
	}
	
addEventListener("load", function load(event){  
	 document.getElementById('betaButton').onclick = function(){widget.preferences.channel = this.value;};
	 document.getElementById('devButton').onclick = function(){widget.preferences.channel = this.value;};
	 document.getElementById('prevButton').onclick = function(){widget.preferences.channel = this.value;};
	 document.getElementById('stableButton').onclick = function(){widget.preferences.channel = this.value;};
	 setChannel();
},false);  