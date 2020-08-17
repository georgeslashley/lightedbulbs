//Global variables
var counter = 0;
const body = document.getElementById('body');
var modes = ['hasard', 'purple', 'red', 'green', 'yellow'];

var timeP = document.getElementById('timePlayed');
var timeW = document.getElementById('timeWon');
var timeL = document.getElementById('timeLost');


//This function is called to display the menu
function menuShows(){
    const menuBtn = document.getElementById('menuBtn');
    const menuSect = document.getElementById('transDiv');
    
    menuBtn.addEventListener('click', () => {
        menuSect.classList.add('showed');
    });
    
    window.addEventListener('click', (e) => {
        if(e.target == menuSect){
            menuSect.classList.remove('showed');
        }
    });
}
menuShows();


//This function is called to change the dark mode
function switchMode(){
    const switchBtn = document.getElementById('swithBtn');
    
    switchBtn.addEventListener('click', () => {
        let cond = body.classList.contains('dark');
        if(cond){
            body.classList.remove('dark');
            localStorage.removeItem('darkTheme');
        }else{
            body.classList.add('dark');
            localStorage.setItem('darkTheme', true);
        }
    });
}
switchMode();


//This function is called to change the game mode
function levelSelect(){
    var levels = document.getElementsByClassName('colorChoice');
    var indic = document.getElementById('difChoice');
    
    for(let i = 0; i <= 4; i++){
        levels[i].addEventListener('click', () => {
            //changing the mode name in the DOM
            levels[i].classList.add('active');
            body.classList.add(modes[i]);
            
            for(let j = 0; j != i; j++){
                levels[j].classList.remove('active');
                body.classList.remove(modes[j]);
            }
            for(let k = 4; k != i; k--){
                levels[k].classList.remove('active');
                body.classList.remove(modes[k]);
            }
            
            //changing the mode title on the interface
            if(i == 0){
                indic.textContent = "identique";
            }else{
                let frenchCol = ['mauve', 'rouge', 'verte', 'jaune'];
                indic.textContent = frenchCol[i-1];
            }
        });
    }
}
levelSelect();


//This function is called when user's playing
function playing(){
    var bulbsDiv = document.getElementsByClassName('bulbBox');
    var boltBtns = document.getElementsByClassName('boltBtn');
    var bulbs = document.getElementsByClassName('bulbIc');
    
    var gameRes = document.getElementById('endGameComment');
    var replayBtn = document.getElementById('restartBtn');
    
    var colors = ["purple", "red", "green", "yellow"];
    
    var comments = ["Ooops ! Peut-etre la prochaine fois ?",
                   "Hoora ! Vous avez allume toutes les ampoules."];
    
    var difMenu = document.getElementById('difContent');
    
    //Some general functions
    //When user win
    function win(){
        gameRes.classList.add('displayed');
        gameRes.textContent = comments[1];
        replayBtn.classList.add('displayed');
        
        difMenu.classList.remove('disabled');
        
        timeP.textContent = parseInt(timeP.innerHTML) + 1;
        timeW.textContent = parseInt(timeW.innerHTML) + 1;
        
        localStorage.setItem('timePlayed', parseInt(timeP.innerHTML));
        localStorage.setItem('timeWon', parseInt(timeW.innerHTML));
    }
    
    //When user lose
    function lose(){
        gameRes.classList.add('displayed');
        gameRes.textContent = comments[0];
        replayBtn.classList.add('displayed');
        
        bulbsDiv[counter-1].classList.add('wrong');
        
        difMenu.classList.remove('disabled');
        
        timeP.textContent = parseInt(timeP.innerHTML) + 1;
        timeL.textContent = parseInt(timeL.innerHTML) + 1;
        
        localStorage.setItem('timePlayed', parseInt(timeP.innerHTML));
        localStorage.setItem('timeLost', parseInt(timeL.innerHTML));
    }
    
    //Disable the boltBtns either user win or lose
    function disableBtns(){
        for(let w = 0; w <= 3; w++){
            boltBtns[w].classList.add('disabled');
        }
    }
    
    function randomColor(){
        bulbsDiv[counter-1].classList.add(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    //This function is called to determine which color is used by the user on difficulty colors mode. The reason why a parameter is used. -tint-
    function colorLevel(tint){
        if(!bulbsDiv[counter-1].classList.contains(colors[tint])){
            lose();
            disableBtns();
        }else{
            if(bulbsDiv[0].classList.contains(colors[tint]) && bulbsDiv[1].classList.contains(colors[tint]) && bulbsDiv[2].classList.contains(colors[tint]) && bulbsDiv[3].classList.contains(colors[tint])){
                win();
                disableBtns();
             }
        }
    }
    
    //The game starts when the user clicks on a bolt button. No matter what button it is.
    for(let i = 0; i <= 3; i++){
        boltBtns[i].addEventListener('click', () => {
            counter++;
            
            //Prevent the user from changing the game level while playing
            difMenu.classList.add('disabled');
            
            if(body.classList.contains('hasard')){
                    randomColor();
                    
                    if(bulbsDiv[counter-1].className != bulbsDiv[counter-2].className){
                        lose();
                        disableBtns();
                    }else{
                        let rdmClass = bulbsDiv[0].className;
                        if(bulbsDiv[1].className == rdmClass && bulbsDiv[2].className == rdmClass && bulbsDiv[3].className == rdmClass){
                            win();
                            disableBtns();
                        }
                    }
            }
            
            if(body.classList.contains('purple')){
                randomColor();
                
                colorLevel(0);
            }
            
            if(body.classList.contains('red')){
                randomColor();
                
                colorLevel(1);
            }
            
            if(body.classList.contains('green')){
                randomColor();
                
                colorLevel(2);
            }
            
            if(body.classList.contains('yellow')){
                randomColor();
                
                colorLevel(3);
            }
        });
    }
    
    //Restarting the game
    replayBtn.addEventListener('click', () => {
        counter = 0;
        
        for(let i = 0; i <= 3; i++){
            bulbsDiv[i].className = "bulbBox";
            boltBtns[i].classList.remove('disabled');
        }
        
        replayBtn.classList.remove('displayed');
        gameRes.textContent = "";
        gameRes.classList.remove('displayed');
    });
                                  
}
playing();


//This function stores game's data
function storage(){
    //About themes
    let themeOn = localStorage.getItem('darkTheme');
    if(themeOn == null){
        body.classList.remove('dark');
    }else{
        body.classList.add('dark');
    }
    
    //About scores
    let scoreP = localStorage.getItem('timePlayed');
    if(scoreP == null){
        timeP.textContent = 0;
    }else{
        timeP.textContent = scoreP;
    }
    
    let scoreW = localStorage.getItem('timeWon');
    if(scoreW == null){
        timeW.textContent = 0;
    }else{
        timeW.textContent = scoreW;
    }
    
    let scoreL = localStorage.getItem('timeLost');
    if(scoreL == null){
        timeL.textContent = 0;
    }else{
        timeL.textContent = scoreL;
    }
    
    //Resetting the game's data
    var resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        //Clearing the data in the backend
        window.localStorage.clear();
        
        //Clearing the datas on the frontend
        body.classList.remove('dark');
        
        timeP.textContent = 0;
        timeW.textContent = 0;
        timeL.textContent = 0;
    });
}
storage();