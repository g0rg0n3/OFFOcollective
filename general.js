function closeMenue(){
  if(document.getElementById('mobile_menue').className=='act'){
    document.getElementById('mobile_menue').className='';
    document.getElementById('navi').style.display='';
    document.getElementById('navi').style.zIndex='-1';
  }
}
function toggleMenue(){
  if(document.getElementById('mobile_menue').className=='act'){
    document.getElementById('mobile_menue').className='';
    document.getElementById('navi').style.display='none';
    document.getElementById('navi').style.zIndex='-1';            
  } else {
    document.getElementById('mobile_menue').className='act';
    document.getElementById('navi').style.display='block';
    document.getElementById('navi').style.zIndex='2';            
  }
}
function toggleDesc(id){
  if(document.getElementById('eventdesc'+id).style.display=='none'){
    document.getElementById('eventdesc'+id).style.display='block';
    document.getElementById('toggledesc'+id).innerHTML='Less';
  } else {
    document.getElementById('eventdesc'+id).style.display='none';
    document.getElementById('toggledesc'+id).innerHTML='More information';
  }
}

function slideSubOn(id){
  var infos = document.getElementsByClassName('info');   
  for(var i=0; i<infos.length; i++){
    infos[i].style.color='#000';      
      //infos[i].style.display='block';      
  }
}

function slideSubOff(id){
  var infos = document.getElementsByClassName('info');   
  for(var i=0; i<infos.length; i++){
    //infos[i].style.display='none';      
    infos[i].style.color='#FFF';      
  }
}

function slideNavOn(id){
  if (index[id] > 0)
    document.getElementById('prev'+id).style.display='block';
  if (index[id] < imagenum[id] -1)
    document.getElementById('next'+id).style.display='block';
  else
    document.getElementById('next'+id).style.display='none';  
}

function slideNavOff(id){
  document.getElementById('prev'+id).style.display='none';
  document.getElementById('next'+id).style.display='none';  
}

function slide(wrapper, items, prev, next, id) {

  posX1[id] = 0;
  posX2[id] = 0;
  posY1[id] = 0;
  posY2[id] = 0;
  posInitial[id];
  var slides = items.getElementsByClassName('slide');
  var prevcontainer = document.getElementsByClassName('prevcont');
  var nextcontainer = document.getElementsByClassName('nextcont');      

  imagenum[id] = slides.length;
  if(carousel) carouselSpace[id] = 2; else carouselSpace[id] = 0;
  if(!(index[id] > 0)) index[id] = 0;

  // display(wrapper==slider) auf FenstergrÃ¶ÃŸe anpassen
 if(!(window.innerWidth<670 && exhi)){    
  var bottomSpace = 88; // Abstand zum unteren Fensterrand
  var arrowSpace = 52;  // Platz fÃ¼r Pfeile
  var spaceH = window.innerHeight - document.getElementById('page').getBoundingClientRect().top - bottomSpace;


  var spaceW = window.innerWidth - (2*(document.getElementById('page').getBoundingClientRect().left + arrowSpace));

  if(spaceW > spaceH * displayRatio){
	wrapper.style.width = parseInt(spaceH * displayRatio) + 'px';
  } else {
    if(document.documentElement.getBoundingClientRect().height - window.innerHeight < 80)
      document.getElementsByClassName('eventimg')[0].style.height = parseInt(spaceH) + 'px';
     wrapper.style.width = parseInt(spaceW) + 'px';
  }
 }
    
  // Layout  (auf wrapper-Breite anpassen)
    var displayWidth = wrapper.offsetWidth;
  var displayHeight = Math.ceil(displayWidth / displayRatio);
  wrapper.style.height = parseInt(displayHeight) + 'px';
  items.style.width = parseInt(displayWidth * (imagenum[id]+carouselSpace[id])) + 'px';
  if(carousel) items.style.left = '-' + parseInt(displayWidth) + 'px';
  else items.style.left = '-'+(index[id]*displayWidth)+'px';
  for(var i=0; i<imagenum[id]; i++){
    slides[i].style.height = parseInt(displayHeight) + 'px';
    slides[i].style.width = parseInt(displayWidth) + 'px';     
    if(slides[i].parentNode.children.length==2){
	var infos = items.getElementsByClassName('info');
	if(infos[i].offsetWidth>parseInt(displayWidth)){
	    infos[i].style.width = parseInt(displayWidth) + 'px';
	}
    }
  }
  if(wrapper.style.height < slides[0].style.height)
    wrapper.style.height < slides[0].style.height;
  slideSize[id] = slides[0].offsetWidth;

  for(var i=0; i<nextcontainer.length; i++){
    prevcontainer[i].style.height = parseInt(displayHeight) + 'px';
    nextcontainer[i].style.height = parseInt(displayHeight) + 'px';
  }

  slideNavOn(id);

  // Clone first and last slide
  if(carousel){  
    var firstSlide = slides[0];
    var lastSlide = slides[imagenum[id] - 1];
    var cloneFirst = firstSlide.cloneNode(true);
    var cloneLast = lastSlide.cloneNode(true);    
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');
  }
 
  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  prev.addEventListener('click', function () { shiftSlide(-1) });
  next.addEventListener('click', function () { shiftSlide(1) });

  // Arrow events
  items.addEventListener('keyup', keyShift);
    
  // Transition events
  items.addEventListener('transitionend', checkIndex);


  function keyShift (e) {
    e = e || window.event;
    //e.preventDefault();
      
    if (e.keyCode == 37) {
      if(carousel || index[id] > 0) shiftSlide(-1);
    } else {
      if (e.keyCode == 39) {
        if(carousel || index[id] < imagenum[id] - 1) shiftSlide(1);
      }	
    }
  }
    
    
  function dragStart (e) {
    e = e || window.event;
    posInitial[id] = -(index[id] * slideSize[id]);//items.offsetLeft;  

    if (e.type == 'touchstart') {
      posX1[id] = e.touches[0].clientX;
      posY1[id] = e.touches[0].clientY;
    } else {
      e.preventDefault();	
      posX1[id] = e.clientX; posY1[id] = e.clientY;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction (e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2[id] = posX1[id] - e.touches[0].clientX;
      posX1[id] = e.touches[0].clientX;
      posY2[id] = posY1[id] - e.touches[0].clientY;
      posY1[id] = e.touches[0].clientY;
    } else {
      posX2[id] = posX1[id] - e.clientX;
      posX1[id] = e.clientX;
      posY2[id] = posY1[id] - e.clientY;
      posY1[id] = e.clientY;
    }
    if(Math.abs(posX2[id])>Math.abs(posY2[id])){  
      e.preventDefault();
	if(carousel || (!(index[id] == 0 && posX2[id] <= 0) && !(index[id] == imagenum[id] - 1 && posX2[id] > 0))){
	    items.style.left = (items.offsetLeft - posX2[id]) + "px";
	}
    }	
  }

  function dragEnd (e) {
    posFinal[id] = items.offsetLeft;
    if (posFinal[id] - posInitial[id] < -threshold) {
      if(carousel || index[id] < imagenum[id] - 1) shiftSlide(1, 'drag');
    } else if (posFinal[id] - posInitial[id] > threshold) {
      if(carousel || index[id] > 0) shiftSlide(-1, 'drag');
    } else {
	items.style.left = -(index[id] * slideSize[id]) + "px";//(posInitial[id]) + "px";
    }
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting');

    if (allowShift) {
      if (!action) { posInitial[id] = index[id] * slideSize[id]; /*posInitial[id] = items.offsetLeft; */}

      if (dir == 1) {
          items.style.left = -((index[id]+1) * slideSize[id]) + "px"; //(posInitial[id] - slideSize[id]) + "px";
        index[id]++;     
      } else if (dir == -1) {
        items.style.left = -((index[id]-1) * slideSize[id]) + "px"; //(posInitial[id] + slideSize[id]) + "px";
        index[id]--;     
      }
    };
    allowShift = false;
  }

  function checkIndex (){
    items.classList.remove('shifting');
    if(carousel){
      if (index[id] == -1) {
        items.style.left = -(imagenum[id] * slideSize[id]) + "px";
        index[id] = imagenum[id] - 1;
      }
      if (index[id] == imagenum[id]) {
        items.style.left = -(1 * slideSize[id]) + "px";
        index[id] = 0;
      }
    } else {
      if (index[id] == 0) {
        prev.style.display = "none";
	if(imagenum[id]==2) next.style.display = "block";
      } else {
        if (index[id] == imagenum[id] -1) {
          next.style.display = "none";
	  if(imagenum[id]==2) prev.style.display = "block";
        } else {
          prev.style.display = "block";
	  next.style.display = "block";
	}
      }
    }
    allowShift = true;
  }

}


function slideThumbs(wrapper, items, prev, next, id) {
    
  var posStart=0,posEnd=0;  
  posX1[id] = 0;
  posX2[id] = 0;
  posY1[id] = 0;
  posY2[id] = 0;
  posInitial[id];
  var slides = items.getElementsByClassName('slide');
  imagenum[id] = slides.length;
  if(carousel) carouselSpace[id] = 2; else carouselSpace[id] = 0;
  index[id] = 0;


  // Layout
  var displayWidth = wrapper.offsetWidth;
  var displayHeight = imgSquare;
  var fitimg = Math.floor(displayWidth/imgSquare);    
  var slideWidth = Math.ceil(imgSquare + (displayWidth - (fitimg * imgSquare)) / fitimg);
  wrapper.style.height = parseInt(displayHeight) + 'px';
  items.style.width = parseInt(imagenum[id]*slideWidth) + 'px';
  if(carousel) items.style.left = '-' + parseInt(displayWidth) + 'px';
  else items.style.left = '0px';
  for(var i=0; i<imagenum[id]; i++){
    slides[i].style.height = parseInt(displayHeight) + 'px';
    slides[i].style.width = parseInt(slideWidth) + 'px';
  }
  slideSize[id] = slideWidth;
  if(imagenum[id]>fitimg) next.style.display = "block";
    
    // Clone first and last slide
  if(carousel){  
    var firstSlide = slides[0];
    var lastSlide = slides[imagenum[id] - 1];
    var cloneFirst = firstSlide.cloneNode(true);
    var cloneLast = lastSlide.cloneNode(true);    
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');
  }

  if(imagenum[id]>fitimg){
  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  prev.addEventListener('click', function () { shiftSlide(-1) });
  next.addEventListener('click', function () { shiftSlide(1) });

  // Arrow events
  items.addEventListener('keyup', keyShift);
    
  // Transition events
  items.addEventListener('transitionend', checkIndex);
  } else {
      for(var i=0; i<imagenum[id]; i++){
	  slides[i].addEventListener('click', function () { showWorkClick(); },false); 
      }      
  }

    function showWorkClick (e) {
    e = e || window.event;

    if (e.type == 'touchstart') {
      pos = e.touches[0].clientX;      
    } else {
      pos = e.clientX;
    }	
    var clickindex = Math.floor((pos-wrapper.getBoundingClientRect().x) / slideSize[id]);
    var clickid = slides[index[id]+clickindex].id;
    var param = clickid.split(":");
    if(ismobile) /*if(window.innerWidth < 840)*/  
	/*document.location.href='index.php?l=la&w=m&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='work-m/'+param[1]+'/'+param[0]+'/'+param[2];		
    else
	/*document.location.href='index.php?l=la&w=a&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='work/'+param[1]+'/'+param[0]+'/'+param[2];	
  }

  function showWork (pos,e) {
    e = e || window.event;
    //e.preventDefault();
/*
    if (e.type == 'touchstart') {
      pos = e.touches[0].clientX;      
    } else {
      pos = e.clientX;
      }	*/
    var clickindex = Math.floor((pos-wrapper.getBoundingClientRect().x) / slideSize[id]);
    var clickid = slides[index[id]+clickindex].id;
    var param = clickid.split(":");
    if(ismobile) /*if(window.innerWidth < 840)*/  
	/*document.location.href='index.php?l=la&w=m&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='work-m/'+param[1]+'/'+param[0]+'/'+param[2];		
    else
	/*document.location.href='index.php?l=la&w=a&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='work/'+param[1]+'/'+param[0]+'/'+param[2];		
  }
    
  function keyShift (e) {
    e = e || window.event;
    //e.preventDefault();
      
    if (e.keyCode == 37) {
      if(carousel || index[id] > 0) shiftSlide(-1);
    } else {
      if (e.keyCode == 39) {
        if(carousel || index[id] < imagenum[id] - 1) shiftSlide(1);
      }	
    }
  }
    
    
  function dragStart (e) {  
    e = e || window.event;
    // e.preventDefault();
    posInitial[id] = -(index[id] * slideSize[id]); //items.offsetLeft;

    if (e.type == 'touchstart') {
      posX1[id] = e.touches[0].clientX;
      posY1[id] = e.touches[0].clientY;
    } else {
      posX1[id] = e.clientX; posY1[id] = e.clientY;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;      
    }
    posStart = posX1[id];  
  }

  function dragAction (e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2[id] = posX1[id] - e.touches[0].clientX;
      posX1[id] = e.touches[0].clientX;
      posY2[id] = posY1[id] - e.touches[0].clientY;
      posY1[id] = e.touches[0].clientY;
    } else {
      posX2[id] = posX1[id] - e.clientX;
      posX1[id] = e.clientX;
      posY2[id] = posY1[id] - e.clientY;
      posY1[id] = e.clientY;
    }
    //posEnd=posX1[id];
      
      if(Math.abs(posX2[id])>Math.abs(posY2[id])){
	e.preventDefault();  
	if(carousel || (!(index[id] == 0 && posX2[id] <= 0) && !(index[id] == imagenum[id] - 1 && posX2[id] > 0))) items.style.left = (items.offsetLeft - posX2[id]) + "px";
      }	  
  }

  function dragEnd (e) {

    if (e.type == 'touchmove')
      posEnd = e.touches[0].clientX;
    else
      posEnd = e.clientX;
      
    posFinal[id] = items.offsetLeft;
    if (posFinal[id] - posInitial[id] < -threshold) {
      if(carousel || index[id] < imagenum[id] - 1) shiftSlide(1, 'drag');
    } else if (posFinal[id] - posInitial[id] > threshold) {
      if(carousel || index[id] > 0) shiftSlide(-1, 'drag');
    } else {
      items.style.left = -(index[id] * slideSize[id]) + "px"; //(posInitial[id]) + "px";
    }
    document.onmouseup = null;
    document.onmousemove = null;
    var thres = 1;
    if(e.type == 'touchend') thres = 1;

    if(Math.abs(posFinal[id]-posInitial[id])<thres)
	if(Math.abs(posEnd-posStart)<thres) showWork(posX1[id]);

  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting');

    if (allowShift) {
	if (!action) { posInitial[id] = index[id] * slideSize[id]; /*posInitial[id] = items.offsetLeft;*/ }

      slidenum = fitimg;	
      if (dir == 1) {	    
	  if(index[id]+2*slidenum > imagenum[id]) slidenum = imagenum[id] - (index[id]+fitimg);
        items.style.left = -((index[id]+slidenum) * slideSize[id]) + "px"; //(posInitial[id] - slidenum*slideSize[id]) + "px";
        index[id]=index[id]+slidenum;     
      } else if (dir == -1) {
	if((index[id] - slidenum) < 0) slidenum = index[id];
        items.style.left = -((index[id]-slidenum) * slideSize[id]) + "px"; //(posInitial[id] + slidenum*slideSize[id]) + "px";
        index[id]=index[id]-slidenum;     
      }
    };
    allowShift = false;
  }

  function checkIndex (){
    items.classList.remove('shifting');
    if(carousel){
      if (index[id] == -1) {
        items.style.left = -(imagenum[id] * slideSize[id]) + "px";
        index[id] = imagenum[id] - 1;
      }
      if (index[id] == imagenum[id]) {
        items.style.left = -(1 * slideSize[id]) + "px";
        index[id] = 0;
      }
    } else {
      if (index[id] == 0) {
        prev.style.display = "none";
	if(imagenum[id]>fitimg) next.style.display = "block";
      } else {
        if ((index[id]+fitimg) == imagenum[id]) {
          next.style.display = "none";
	  if(imagenum[id]>fitimg) prev.style.display = "block";
        } else {
          prev.style.display = "block";
	  next.style.display = "block";
	}
      }
    }
    allowShift = true;
  }

}

function slideExhi(wrapper, items, prev, next, id) {

  var posStart=0,posEnd=0;      
  posX1[id] = 0;
  posX2[id] = 0;
  posY1[id] = 0;
  posY2[id] = 0;
  posInitial[id];
  var slides = items.getElementsByClassName('slide');
  var prevcontainer = document.getElementsByClassName('prevcont');
  var nextcontainer = document.getElementsByClassName('nextcont');      

  imagenum[id] = slides.length;
  if(carousel) carouselSpace[id] = 2; else carouselSpace[id] = 0;
  if(!(index[id] > 0)) index[id] = 0;

  // display(wrapper==slider) auf FenstergrÃ¶ÃŸe anpassen
/* if(!(window.innerWidth<670 && exhi)){    
  var bottomSpace = 88; // Abstand zum unteren Fensterrand
  var arrowSpace = 52;  // Platz fÃ¼r Pfeile
  var spaceH = window.innerHeight - document.getElementById('page').getBoundingClientRect().top - bottomSpace;


  var spaceW = window.innerWidth - (2*(document.getElementById('page').getBoundingClientRect().left + arrowSpace));

  if(spaceW > spaceH * displayRatio){
	wrapper.style.width = parseInt(spaceH * displayRatio) + 'px';
  } else {
    if(document.documentElement.getBoundingClientRect().height - window.innerHeight < 80)
      document.getElementsByClassName('eventimg')[0].style.height = parseInt(spaceH) + 'px';
     wrapper.style.width = parseInt(spaceW) + 'px';
  }
 }
*/    
  // Layout  (auf wrapper-Breite anpassen)
    var displayWidth = wrapper.offsetWidth;
  var displayHeight = Math.ceil(displayWidth / displayRatio);
  wrapper.style.height = parseInt(displayHeight) + 'px';
  items.style.width = parseInt(displayWidth * (imagenum[id]+carouselSpace[id])) + 'px';
  if(carousel) items.style.left = '-' + parseInt(displayWidth) + 'px';
  else items.style.left = '-'+(index[id]*displayWidth)+'px';
  for(var i=0; i<imagenum[id]; i++){
    slides[i].style.height = parseInt(displayHeight) + 'px';
    slides[i].style.width = parseInt(displayWidth) + 'px';     
    if(slides[i].parentNode.children.length==2){
	var infos = items.getElementsByClassName('info');
	if(infos[i].offsetWidth>parseInt(displayWidth)){
	    infos[i].style.width = parseInt(displayWidth) + 'px';
	}
    }
  }
  if(wrapper.style.height < slides[0].style.height)
    wrapper.style.height < slides[0].style.height;
  slideSize[id] = slides[0].offsetWidth;

  for(var i=0; i<nextcontainer.length; i++){
    prevcontainer[i].style.height = parseInt(displayHeight) + 'px';
    nextcontainer[i].style.height = parseInt(displayHeight) + 'px';
    //if(window.innerWidth > 840)
    //  prevcontainer[i].parentElement.style.height = parseInt(displayHeight) + 'px';
  }

  slideNavOn(id);

  // Clone first and last slide
  if(carousel){  
    var firstSlide = slides[0];
    var lastSlide = slides[imagenum[id] - 1];
    var cloneFirst = firstSlide.cloneNode(true);
    var cloneLast = lastSlide.cloneNode(true);    
    items.appendChild(cloneFirst);
    items.insertBefore(cloneLast, firstSlide);
    wrapper.classList.add('loaded');
  }

  if(imagenum[id]>1){       
  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  prev.addEventListener('click', function () { shiftSlide(-1) });
  next.addEventListener('click', function () { shiftSlide(1) });

  // Arrow events
  items.addEventListener('keyup', keyShift);
    
  // Transition events
  items.addEventListener('transitionend', checkIndex);
  } else {
      for(var i=0; i<imagenum[id]; i++){
	  slides[i].addEventListener('click', function () { showWorkClick(); },false); 
      }      
  }

    
  function showWorkClick (e) {
    e = e || window.event;

    if (e.type == 'touchstart') {
      pos = e.touches[0].clientX;      
    } else {
      pos = e.clientX;
    }	
    var clickindex = Math.floor((pos-wrapper.getBoundingClientRect().x) / slideSize[id]);
    var clickid = slides[index[id]+clickindex].id;
    var param = clickid.split(":");
    if(ismobile) /*if(window.innerWidth < 840)*/  
	/*document.location.href='index.php?l=la&w=n&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='exhibition-m/'+param[1]+'/'+param[0]+'/'+param[2];	
    else
	/*document.location.href='index.php?l=la&w=e&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='exhibition/'+param[1]+'/'+param[0]+'/'+param[2];	
  }

  function showWork (pos,e) {
    e = e || window.event;
    //e.preventDefault();

    var clickindex = Math.floor((pos-wrapper.getBoundingClientRect().x) / slideSize[id]);
    var clickid = slides[index[id]+clickindex].id;
    var param = clickid.split(":");
    if(ismobile) /*if(window.innerWidth < 840)*/
	/*document.location.href='index.php?l=la&w=n&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='exhibition-m/'+param[1]+'/'+param[0]+'/'+param[2];		
    else
	/*document.location.href='index.php?l=la&w=e&id='+param[0]+'&cat='+param[1]+'&pos='+param[2];*/
      document.location.href='exhibition/'+param[1]+'/'+param[0]+'/'+param[2];		
  }
 

  function keyShift (e) {
    e = e || window.event;
    //e.preventDefault();
      
    if (e.keyCode == 37) {
      if(carousel || index[id] > 0) shiftSlide(-1);
    } else {
      if (e.keyCode == 39) {
        if(carousel || index[id] < imagenum[id] - 1) shiftSlide(1);
      }	
    }
  }
    
    
  function dragStart (e) {
    e = e || window.event;
    posInitial[id] = -(index[id] * slideSize[id]);//items.offsetLeft;  

    if (e.type == 'touchstart') {
      posX1[id] = e.touches[0].clientX;
      posY1[id] = e.touches[0].clientY;
    } else {
      e.preventDefault();	
      posX1[id] = e.clientX; posY1[id] = e.clientY;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
    posStart = posX1[id];  
  }

  function dragAction (e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2[id] = posX1[id] - e.touches[0].clientX;
      posX1[id] = e.touches[0].clientX;
      posY2[id] = posY1[id] - e.touches[0].clientY;
      posY1[id] = e.touches[0].clientY;
    } else {
      posX2[id] = posX1[id] - e.clientX;
      posX1[id] = e.clientX;
      posY2[id] = posY1[id] - e.clientY;
      posY1[id] = e.clientY;
    }
    if(Math.abs(posX2[id])>Math.abs(posY2[id])){  
      e.preventDefault();
	if(carousel || (!(index[id] == 0 && posX2[id] <= 0) && !(index[id] == imagenum[id] - 1 && posX2[id] > 0))){
	    items.style.left = (items.offsetLeft - posX2[id]) + "px";
	}
    }	
  }

  function dragEnd (e) {
    if (e.type == 'touchmove')
      posEnd = e.touches[0].clientX;
    else
      posEnd = e.clientX;

    posFinal[id] = items.offsetLeft;
    if (posFinal[id] - posInitial[id] < -threshold) {
      if(carousel || index[id] < imagenum[id] - 1) shiftSlide(1, 'drag');
    } else if (posFinal[id] - posInitial[id] > threshold) {
      if(carousel || index[id] > 0) shiftSlide(-1, 'drag');
    } else {
	items.style.left = -(index[id] * slideSize[id]) + "px";//(posInitial[id]) + "px";
    }
    document.onmouseup = null;
    document.onmousemove = null;
    var thres = 1;
    if(e.type == 'touchend') thres = 1;

    if(Math.abs(posFinal[id]-posInitial[id])<thres)
	if(Math.abs(posEnd-posStart)<thres) showWork(posX1[id]);
  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting');

    if (allowShift) {
      if (!action) { posInitial[id] = index[id] * slideSize[id]; /*posInitial[id] = items.offsetLeft; */}

      if (dir == 1) {
          items.style.left = -((index[id]+1) * slideSize[id]) + "px"; //(posInitial[id] - slideSize[id]) + "px";
        index[id]++;     
      } else if (dir == -1) {
        items.style.left = -((index[id]-1) * slideSize[id]) + "px"; //(posInitial[id] + slideSize[id]) + "px";
        index[id]--;     
      }
    };
    allowShift = false;
  }

  function checkIndex (){
    items.classList.remove('shifting');
    if(carousel){
      if (index[id] == -1) {
        items.style.left = -(imagenum[id] * slideSize[id]) + "px";
        index[id] = imagenum[id] - 1;
      }
      if (index[id] == imagenum[id]) {
        items.style.left = -(1 * slideSize[id]) + "px";
        index[id] = 0;
      }
    } else {
      if (index[id] == 0) {
        prev.style.display = "none";
	if(imagenum[id]==2) next.style.display = "block";
      } else {
        if (index[id] == imagenum[id] -1) {
          next.style.display = "none";
	  if(imagenum[id]==2) prev.style.display = "block";
        } else {
          prev.style.display = "block";
	  next.style.display = "block";
	}
      }
    }
    allowShift = true;
  }

}





