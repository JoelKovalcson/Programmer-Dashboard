//Get modal element
var modal = document.getElementById('simpleModal');

//Get modal button
var modalBtn = document.getElementById('modalBtn');

//Get close buttom
var closeBtn = document.getElementById('closeBtn');

//Listen for open click
modalBtn.addEventListener('click', openModal);

//Listen for close click
if (closeBtn){
closeBtn.addEventListener('click', closeModal);
}

//Listen for outside click
window.addEventListener('click', outsideClick);

//Function to open modal
function openModal(){
    modal.style.display = 'block';
}

//Function to close modal
function closeModal(){
    modal.style.display = 'none';
}

//Function to close outside window
function outsideClick(e){
    if(e.target == modal){
    modal.style.display = 'none';
    }
}

//Receive user input
var submitBtn = document.getElementById('btnSubmit');
var repoSearch = document.getElementById('searchRepo');
var repoLink = document.getElementById('submitRepo');

function getUserInput(event) {
    //event.preventDefault()
console.log(repoSearch.value)
}

submitBtn.addEventListener('submit', getUserInput())