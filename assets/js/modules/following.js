// GitHub API Endpoint
// Temporarily set to a fixed repository and username
var owner = "JoelKovalcson";
var repo =  "GitHub-At-A-Glance";
const url = `https://api.github.com/repos/${owner}/${repo}`;

/* Modals */
var modal = document.getElementById('simpleModal');
var modalBtn = document.getElementById('addFollow');
var modalForm = document.getElementById('searchForm');
var closeBtn = document.getElementById('closeBtn');
// Receive user input
var repoSearch = document.getElementById('searchRepo');
var repoLink = document.getElementById('submitRepo');

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
    // console.log(repoSearch.value);
    // console.log(repoLink.value);
    event.preventDefault(); // Might need this?
    closeModal();
    // getRepo(following, owner, repo);
}

/* API Requests */
function getRepo(followingEl, owner, repo) { 
    // var url = `https://api.github.com/repos/${owner}/${repo}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            let a = document.createElement("a");
            div.setAttribute("class", "panel-child");
            h3.textContent = data.name;
            a.textContent = "Visit this Repo";
            a.setAttribute("href", data.svn_url);
            followingEl.appendChild(div);
            div.append(h3, a);
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