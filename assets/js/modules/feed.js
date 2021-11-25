const storageString = "gh-at-a-glance/feed";


var mainElement = null;
var storage = null;
var following = null;

export function setup(el = null, f = null) {
    mainElement = el;
    following = f;
    storage = JSON.parse(localStorage.getItem(storageString));
    updateFeed();
}

export function saveStorage() {
    localStorage.setItem(storageString, JSON.stringify(this.storage.current));
}

export function updateFeed() {
    let prev_repos;
    try {
        prev_repos = JSON.parse(JSON.stringify(following.getFollowing()));
    } catch {
        prev_repos = null;
    }
    following.updateAllRepos();
    let cur_repos;
    try {
        cur_repos = JSON.parse(JSON.stringify(following.getFollowing()));
    } catch {
        cur_repos = null;
    }

    // Might need to clear feed at some point or setup pages?
    // this.mainElement.innerHTML = "";

    if (storage === null) return;
    if (storage.length == 0) return;
    // For now, each item is a repo, so make a new section for each repo's changes
    storage.forEach(item => {
        // Generate Div structure and append
        let itemDiv = document.createElement("div");
        // TODO

        // mainElement.append(itemDiv);
    });
}