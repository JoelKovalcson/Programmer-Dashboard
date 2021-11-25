// Reference to DOM elements
var followingEl = document.getElementById("following");
var feedEl = document.getElementById("feed");

// localStorage key for page information
const storageString = "repoData";
// Holds previous storage for feed purposes
var prevStorage = [];
// Storage variable for followed repos
var storage = [];
// Storage to contain current feed display
var feed = [];


/* Modals */
// Modal Display
var modal = document.getElementById('simpleModal');
var modalBtn = document.getElementById('addFollow');
var modalForm = document.getElementById('searchForm');
var closeBtn = document.getElementById('closeBtn');

// Modal Input
var userSearch = document.getElementById('searchUser');
var repoSearch = document.getElementById("searchRepo");
var repoLink = document.getElementById('submitRepo');
let radioName = document.getElementById("radioName");
let radioLink = document.getElementById("radioLink");

/* Storage Functions */

export function setup() {
    loadStorage();
    prevStorage = storage;
    updateRepoData();
    saveStorage();
    updateDisplay();
}

function loadStorage() {
    try {
        storage = JSON.parse(localStorage.getItem(storageString));
        if(storage == null) storage = [];
        console.log(storage);
    }
    // If there is an error in the localStorage, just set an empty array
    catch {
        storage = [];
    }
}

function saveStorage() {
    if (storage != null) localStorage.setItem(storageString, JSON.stringify(storage));
}

function addRepo(repo) {
    let found = storage.find(r => {
        return r.fullName == repo.fullName
    });
    if (found == undefined) {
        storage.push(repo);
        saveStorage();
    } else {
        // The user entered a duplicate repository!
        // TODO: Handle this
    }
}

function removeRepo(repo) {
    storage = storage.filter(r => {
        return r.fullName != repo.fullName
    });
}

/* Feed and Repo Display */

function updateDisplay(updateFeed, repo = null) {
    refreshRepoDisplay();
    // Generate feed before this?
    refreshFeedDisplay();
}

function updateRepoData() {
    storage.forEach(repo => {
        let newRepo = getRepo(repo.owner, repo.name);
        // For every property in the repo, set it to the new value
        for (let key in newRepo) repo[key] = newRepo[key];
    });
}

function updateFeedData() {

}

function createRepoHTML(repo) {
    let container = document.createElement("div");
    let displayTitle = document.createElement("h3");
    let visitRepo = document.createElement("a");
    let updateTime = document.createElement("div");
    let watchers = document.createElement("div");
    let progLang = document.createElement("div");
    let forkCount = document.createElement("div");
    let openIssueCount = document.createElement("div");
    let subCount = document.createElement("div");
    let createdTime = document.createElement("div");
    let unfollowBtn = document.createElement("button");

    container.setAttribute("class", "panel-child");
    displayTitle.textContent = `${repo.name} (${repo.owner})`;
    visitRepo.textContent = "Visit this Repo";
    visitRepo.setAttribute("href", repo.svn_url);
    updateTime.textContent = `Time Updated: ${repo.updateTime}`;
    watchers.textContent = `Number of Watchers: ${repo.watchers}`;
    progLang.textContent = `Programming Language: ${repo.programLang}`;
    forkCount.textContent = `Number of Forks: ${repo.forks}`;
    openIssueCount.textContent = `Number of Issues: ${repo.issues}`;
    subCount.textContent = `Subscriber Count: ${repo.subs}`;
    createdTime.textContent = `Date Created: ${repo.bornDate}`;
    unfollowBtn.textContent = "Unfollow";
    unfollowBtn.setAttribute("class", "exitButton");
    // Add event listener to unfollow the repo when it's clicked
    unfollowBtn.addEventListener('click', unfollowRepo);

    container.append(displayTitle, watchers, progLang, forkCount, openIssueCount, subCount, updateTime, createdTime, unfollowBtn, visitRepo);
    return container;
}

function refreshRepoDisplay() {
    storage.sort((first, second) => {
        if (first.name < second.name) return -1;
        else if (first.name > second.name) return 1;
        else return 0;
    })
    storage.forEach(repo => {
        let repoHTML = createRepoHTML(repo);
        followingEl.appendChild(repoHTML);
    });
}

function refreshFeedDisplay() {
    // TODO
    feed.sort((first, second) => {
        if (first.name < second.name) return -1;
        else if (first.name > second.name) return 1;
        else return 0;
    })
    feed.forEach(repo => {
        let repoHTML = createRepoHTML(repo);
        followingEl.appendChild(repoHTML);
    });
}


/* Modal Helper Functions */

// Function to open modal
function openModal() {
    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
}

// Function to close outside window
function outsideClick(e) {
    if (e.target == modal) {
        closeModal();
    }
}

// Function to get user input from form submission
function getUserInput(event) {

    // Prevent form page refresh
    event.preventDefault();

    let ownerName;
    let repoName;

    if (radioName.checked) {

        // Take in user input 
        ownerName = userSearch.value.trim();

        // Need to replace spaces with hyphens for how repo names are stored
        repoName = repoSearch.value.trim().replace(/ /g, '-');


    } else if (radioLink.checked) {
        // Take in user input and separate string into arrays by ".com/"
        var link = repoLink.value;
        var linkArray = link.split(".com/");

        // Tester code to console.log(linkArray);
        // Split in array string by "/" revealing owner and repo name
        var linkArrayFinal = linkArray[1].split("/");

        // Tester code to console.log(linkArrayFinal); 
        ownerName = linkArrayFinal[0].trim();
        repoName = linkArrayFinal[1].trim();
    } else {
        // Neither one was selected, we can set one active by default
    }
    let foundRepo;
    // Owner name and repo name should be found by now
    getRepo(ownerName, repoName)
        .then((repo) => {
            if(repo) {
                foundRepo = repo;
                addRepo(repo);
                followingEl.appendChild(createRepoHTML(repo));
            }
    });
    // TODO: Need to update display after this, but just to add a single repo to list

    // Need to clear all 3 each time just to make sure user information is cleared out
    userSearch.value = "";
    repoSearch.value = "";
    repoLink.value = "";
    // Close modal manually after submit has been processed
    closeModal();
}

function unfollowRepo(event) {
    // TODO: Need to remove the repo from storage
}


/* Modal Event Listeners */
// Listen for open click
modalBtn.addEventListener('click', openModal);
// Listen for close click
closeBtn.addEventListener('click', closeModal);
// Listen for outside click
window.addEventListener('click', outsideClick);
// Listen for submit click
modalForm.addEventListener('submit', getUserInput);

/* API Requests */
function getRepo(owner, repo) {
    let url = `https://api.github.com/repos/${owner}/${repo}`
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            // Object containing info to be put in storage and displayed
            let repo = {
                fullName: data.full_name,
                name: data.name,
                link: data.svn_url,
                updateTime: data.updated_at,
                watchers: data.watchers_count,
                programLang: data.language,
                forks: data.forks_count,
                issues: data.open_issues_count,
                subs: data.subscribers_count,
                bornDate: data.created_at,
                owner: data.owner.login
            }
            return repo;
        })
        .catch(ex => {
            // There was an error getting the URL response.
            console.log("Error fetching repository from user-provided input.");
            console.log(ex);
            return _;
        });
}