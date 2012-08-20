    addEventListener("DOMContentLoaded", function load(event){
	var channel = localStorage['channel'];
    switch(channel){
		case 'beta':
		  document.getElementById('remokuFrame').setAttribute('src','http://remoku.tv/beta');
		  break;
		case 'dev':
		  document.getElementById('remokuFrame').setAttribute('src','http://remoku.tv/dev');
		  break;
		case 'prev':
		  document.getElementById('remokuFrame').setAttribute('src','http://remoku.tv/prev');
		  break;
		default:
		  document.getElementById('remokuFrame').setAttribute('src','http://remoku.tv/');
		  console.log("stable");
	    }
		   if(localStorage['height']!=='undefined'){
			   document.body.style.height=localStorage['height']+'px';
		     document.getElementsByTagName('html')[0].style.height=localStorage['height']+'px';
		     //document.getElementById('remokuFrame').style.height=localStorage['height']+'px';
	    }
		   if(localStorage['width']!=='undefined'){
			   document.body.style.width=localStorage['width']+'px';
		     document.getElementsByTagName('html')[0].style.width=localStorage['width']+'px';
		     //document.getElementById('remokuFrame').style.width=localStorage['width']+'px';
	    }
	});  
	
	