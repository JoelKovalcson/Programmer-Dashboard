const storageString = "gh-at-a-glance/feed";

export let feed = {
    mainElement: null,
    storage: null,
    setup: function(el = null) {
        this.mainElement = el;
        this.storage = JSON.parse(localStorage.getItem(storageString));
        this.updateFeed();
    },
    saveStorage: function() {
        localStorage.setItem(storageString, JSON.stringify(this.storage.current));
    },
    addFeed: function(item) {
        this.storage.push(item);
        this.updateFeed();
    },
    removeFeed: function(item) {
        // TODO 
    },
    updateFeed: function() {
        // Clear Feed
        this.mainElement.innerHTML = "";
        // Generate section for each item if there's something different
        if(this.storage == null) return;
        this.storage.forEach(item => {
            // Generate Div structure and append
            let itemDiv = document.createElement("div");
            
            this.mainElement.append(itemDiv);
        });
    }
}