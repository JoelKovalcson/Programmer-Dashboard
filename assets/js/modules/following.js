// Reference to feed module
var feed;
// Set feed object to use in this file
export function setFeed(f) {feed = f}

// Reference to following DOM element
var followingEl;
// Set the DOM element for following
export function setFollowing(el) {followingEl = el}

// Storage variable for followed repos
var storage = null;

export function getFollowing() {
    return storage;
}

export function updateAllRepos() {
    if(storage === null) return;
    if(storage.length == 0) return;
    storage.forEach(repo => {
        // TODO
    });
}

/* Modals */
var modal = document.getElementById('simpleModal');
var modalBtn = document.getElementById('addFollow');
var modalForm = document.getElementById('searchForm');
var closeBtn = document.getElementById('closeBtn');
// Receive user input
var repoSearch = document.getElementById('searchUser');
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
        console.log(foundOwner, foundRepo);
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
    let url = `https://api.github.com/repos/${owner}/${repo}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let div = document.createElement("div");
            let h3 = document.createElement("h3");
            let a = document.createElement("a");
            let feat_1 = document.createElement("div");
            let feat_2 = document.createElement("div");
            let feat_3 = document.createElement("div");
            let feat_4 = document.createElement("div");
            let feat_5 = document.createElement("div");
            let feat_6 = document.createElement("div");
            let feat_7 = document.createElement("div");
            let x = document.createElement("button");

            // Info to be dispalyed in following section per each repo
            let updateTime = `${data.updated_at}`; 
            let watchers = `${data.watchers_count}`; 
            let programLang= `${data.language}`; 
            let forks = `${data.forks_count}`; 
            let issues = `${data.open_issues_count}`; 
            let subs = `${data.subscribers_count}`; 
            let bornDate = `${data.created_at}`;


            div.setAttribute("class", "panel-child");
            h3.textContent = data.name;
            a.textContent = "Visit this Repo";
            a.setAttribute("href", data.svn_url);
            feat_1.textContent = `Time Updated: ${updateTime}`;
            feat_2.textContent = `Number of Watchers: ${watchers}`;
            feat_3.textContent = `Programming Language: ${programLang}`;
            feat_4.textContent = `Number of Forks: ${forks}`;
            feat_5.textContent = `Number of Issues: ${issues}`;
            feat_6.textContent = `Subscriber Count: ${subs}`;
            feat_7.textContent = `Date Created: ${bornDate}`;          
            x.textContent = "Unfollow";
            x.setAttribute("class", "exitButton");
            followingEl.appendChild(div);
            div.append(h3, feat_1, feat_2, feat_3, feat_4, feat_5, feat_6, feat_7, x, a);


            
            
            // Remove following repo
            var unfollowBtn = document.querySelector('.exitButton');
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
// Listen for unfollowClick (added)
// unfollowBtn.addEventListener('click', unfollowRepo);