// GitHub API Endpoint
// Temporarily set to a fixed repository and username
// var owner = "JoelKovalcson";
// var repo =  "GitHub-At-A-Glance";
// const url = `https://api.github.com/repos/${owner}/${repo}`;

/* Modals */
var modal = document.getElementById('simpleModal');
var modalBtn = document.getElementById('addFollow');
var modalForm = document.getElementById('searchForm');
var closeBtn = document.getElementById('closeBtn');
// Receive user input
var repoSearch = document.getElementById('searchUser');
var repoLink = document.getElementById('submitRepo');
// Remove following repo
var unfollowBtn = document.querySelector('.exitButton');

/* Event Handlers */
// Function to open modal
function openModal(){
    modal.style.display = 'block';
}
// Function to close modal
function closeModal(){
    modal.style.display = 'none';
}
// Function to close outside window
function outsideClick(e){
    if(e.target == modal){
        closeModal();
    }
}
function getUserInput(event) {
    
    // Might need this?
    event.preventDefault();

    if (repoSearch.value) {
        /* NEED TO FIX THIS PART
        let foundRepo_1 = repoSearch.value;
        let foundOwner_1 = "";
        getRepo(following, foundOwner_1, foundRepo_1); 

        IS REPOSITORY NAME ENOUGH? 
        WHAT IF DIFFERENT USER HAS A NAME SIMILAR TO
        REPO THAT WAS SEARCHED?
        ADD MODAL ASKING IF USER IS KNOWN?

        */
    }
    else if (repoLink.value) {
        // Take in user input and separate string into arrays by ".com/"
        var link = repoLink.value;
        var linkArray = link.split(".com/");
        
        // Tester code to console.log(linkArray);
        // Split in array string by "/" revealing owner and repo name
        var linkArrayFinal = linkArray[1].split("/");
        
        // Tester code to console.log(linkArrayFinal); 
        let foundOwner = linkArrayFinal[0].trim();
        let foundRepo = linkArrayFinal[1].trim();
        getRepo(following, foundOwner, foundRepo);

        // Clear data field
        repoLink.value = "";
    }
    else {
        alert("Invalid entry. Please Try Again")
    }
    
     
    closeModal();
    
}

function unfollowRepo(event) {
    // event.preventDefault()
    // event.target.closest("div.panel-child").remove();
}

/* API Requests */
function getRepo(followingEl, owner, repo) { 
    var url = `https://api.github.com/repos/${owner}/${repo}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            let a = document.createElement("a");
            let x = document.createElement("button")
            div.setAttribute("class", "panel-child");
            h3.textContent = data.name;
            a.textContent = "Visit this Repo";
            a.setAttribute("href", data.svn_url);
            x.textContent = "Unfollow";
            x.setAttribute("class", "exitButton");
            followingEl.appendChild(div);
            div.append(h3, x, a);
        })
        .catch(ex => console.log("error"));
}

/* Event Listeners */
// Listen for open click
modalBtn.addEventListener('click', openModal);
// Listen for close click
closeBtn.addEventListener('click', closeModal);
// Listen for outside click
window.addEventListener('click', outsideClick);
// Listen for submit click
modalForm.addEventListener('submit', getUserInput);
// Listen for unfollowClick
unfollowBtn.addEventListener('click', unfollowRepo);