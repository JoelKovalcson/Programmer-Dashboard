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
    // Load localStorage
    loadStorage();
    // Set prevStorage to that local storage
    setPrevStorage();
    // Get new data from APIs
    updateRepoData().then(() => {
        // Save new data to localStorage
        saveStorage();
        // Updated differences to feed array
        updateFeedData();
        // Display all data
        updateDisplay();
    });
}

function setPrevStorage() {
    prevStorage = [];
    for (let i in storage) {
        let obj = {};
        for (let key in storage[i]) {
            obj[key] = storage[i][key];
        }
        prevStorage.push(obj);
    }
}

function loadStorage() {
    try {
        storage = JSON.parse(localStorage.getItem(storageString));
        if (storage == null) storage = [];
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
        return true;
    } else {
        // The user entered a duplicate repository!
        // TODO: Handle this
        return false;
    }
}

function removeRepo(repo) {
    storage = storage.filter(r => {
        return r.fullName != repo.fullName
    });
    feed = feed.filter(r => {
        return r.fullName != repo.fullName
    });
}

/* Feed and Repo Display */

// Data update functions
async function updateRepoData() {
    for (let i in storage) {
        let newRepo = await getRepo(storage[i].owner, storage[i].name);
        // For every property in the repo, set it to the new value    
        for (let key in newRepo) storage[i][key] = newRepo[key];
    }
}

function updateFeedData() {
    prevStorage.forEach(repo => {
        let fullName = repo.fullName;
        // Find the repo in the current storage
        let foundStorage = storage.find(r => {
            return r.fullName == fullName;
        });
        // If it's found, then we get differences
        if (foundStorage != undefined) {
            // Initialize differences to being an empty object
            let modified = false;
            let diffR = {};
            // Look through every key
            for (let key in foundStorage) {
                // If they value doesn't match, add it to the diff object
                if (foundStorage[key] != repo[key]) {
                    diffR[key] = `${repo[key]} -> ${foundStorage[key]}`;
                    modified = true;
                }
                // Make sure full name, owner, name, and svn_url is added regardless of changes to keep track of object
                else if (key == "fullName") diffR[key] = repo[key];
                else if (key == "name") diffR[key] = repo[key];
                else if (key == "owner") diffR[key] = repo[key];
                else if (key == "svn_url") diffR[key] = repo[key];
            }

            // Then look for an existing object in the feed
            let foundFeed = feed.find(r => {
                return r.fullName == fullName;
            });
            // If there are no differences
            if (!modified) {
                // Remove item from feed if it exists
                if (foundFeed != undefined) {
                    feed = feed.filter(r => {
                        return r.fullName != fullName;
                    });
                }
            }
            // There were differences
            else {
                // If an existing feed 
                if (foundFeed != undefined) {
                    // Modify the feed item with new values
                    for (let key in foundFeed) {
                        // If the property exists in the new diff
                        if (diffR[key] != undefined) {
                            // Change the value
                            foundFeed[key] = diffR[key];
                        }
                        // The value doesn't exist
                        else {
                            // Delete it from the feed item
                            delete foundFeed[key];
                        }
                    }
                }
                // If there is no existing feed, just add it
                else {
                    feed.push(diffR);
                }
            }
        }
    });
}

// Display and helper functions
function updateDisplay(updateFeed, repo = null) {
    refreshRepoDisplay();
    // Generate feed before this?
    refreshFeedDisplay();
}

function refreshRepoDisplay() {
    storage.sort((first, second) => {
        if (first.name < second.name) return -1;
        else if (first.name > second.name) return 1;
        else return 0;
    });
    followingEl.innerHTML = "";
    storage.forEach(repo => {
        let repoHTML = createRepoHTML(repo);
        followingEl.appendChild(repoHTML);
    });
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
    // unfollowBtn.addEventListener('click', unfollowRepo);
    $(container).on("click", ".exitButton", unfollowRepo);

    container.append(displayTitle, watchers, progLang, forkCount, openIssueCount, subCount, updateTime, createdTime, unfollowBtn, visitRepo);
    return container;
}

function createFeedHTML(repo) {
    let container = document.createElement("div");
    container.setAttribute("class", "panel-child");

    let displayTitle = document.createElement("h3");
    displayTitle.textContent = `${repo.name} (${repo.owner})`;
    container.append(displayTitle);

    let watchers;
    let progLang;
    let forkCount;
    let openIssueCount;
    let subCount;
    let updateTime;
    // Optional items if they changed
    if (repo.watchers != undefined) {
        watchers = document.createElement("div");
        watchers.textContent = `Number of Watchers: ${repo.watchers}`;
        container.append(watchers);
    }
    if (repo.programLang != undefined) {
        progLang = document.createElement("div");
        progLang.textContent = `Programming Language: ${repo.programLang}`;
        container.append(progLang);
    }
    if (repo.forks != undefined) {
        forkCount = document.createElement("div");
        forkCount.textContent = `Number of Forks: ${repo.forks}`;
        container.append(forkCount);
    }
    if (repo.issues != undefined) {
        openIssueCount = document.createElement("div");
        openIssueCount.textContent = `Number of Issues: ${repo.issues}`;
        container.append(openIssueCount);
    }
    if (repo.subs != undefined) {
        subCount = document.createElement("div");
        subCount.textContent = `Subscriber Count: ${repo.subs}`;
        container.append(subCount);
    }
    if (repo.updateTime != undefined) {
        updateTime = document.createElement("div");
        updateTime.textContent = `Time Updated: ${repo.updateTime}`;
        container.append(updateTime);
    }

    // Always included
    let visitRepo = document.createElement("a");
    visitRepo.textContent = "Visit this Repo";
    visitRepo.setAttribute("href", repo.svn_url);

    container.append(visitRepo);
    return container;
}

function refreshFeedDisplay() {
    feed.sort((first, second) => {
        if (first.name < second.name) return -1;
        else if (first.name > second.name) return 1;
        else return 0;
    })
    feed.forEach(repo => {
        feedEl.innerHTML = "";
        let repoHTML = createFeedHTML(repo);
        feedEl.appendChild(repoHTML);
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
            if (repo) {
                foundRepo = repo;
                if(addRepo(repo)) followingEl.appendChild(createRepoHTML(repo));
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

    let removeThis = $(event.target).parent();
    
    let repoName = removeThis.children("h3").text();
    // Repo-Name (Owner) -> Owner/Repo-Name
    repoName = repoName.split(' ');
    repoName = `${repoName[1].substring(1, repoName[1].length-1)}/${repoName[0]}`;

    let repo = {
        fullName: repoName
    };
    removeRepo(repo);
    saveStorage();
    updateDisplay();
}



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
                updateTime: moment(data.updated_at).format("MMMM Do YYYY, h:mm:ss a"),
                watchers: data.watchers_count,
                programLang: data.language,
                forks: data.forks_count,
                issues: data.open_issues_count,
                subs: data.subscribers_count,
                bornDate: moment(data.created_at).format("MMMM Do YYYY, h:mm:ss a"),
                owner: data.owner.login
            }
            return repo;
        })
        .catch(ex => {
            // There was an error getting the URL response.
            console.log("Error fetching repository from user-provided input.");
            console.log(ex);
            return;
        });
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

