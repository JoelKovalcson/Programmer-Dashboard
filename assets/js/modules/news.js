var url = `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`
const storyBtn = document.getElementById("changeNews")
const newsModal = document.getElementById('newsModal');
const storyType = document.getElementById('storyType');
const closeNewsModal = document.getElementById('closeNewsModal');
const numberArticles = document.getElementById('numberArticles');
var news = document.getElementById("news");


export function getNews (newsEl,story = false) {
    if (story) {
        url = `https://hacker-news.firebaseio.com/v0/${story}.json?print=pretty`
    }
    fetch(url)
    .then(response => response.json())
    .then(data => {
        newsEl.innerHTML = "";
        let number = numberArticles.value
        for(var i = 0 ; i < number; i++) {
            let itemUrl = `https://hacker-news.firebaseio.com/v0/item/${data[i]}.json?print=pretty`
            fetch(itemUrl)
            .then(response => response.json())
            .then(data => {
            populateNews(data, newsEl)
            })
                
        }
    })
}

export function populateNews(data, newsEl) {
    
    let div = document.createElement("div")
    let h3 = document.createElement("h3")
    let a = document.createElement("a")
    div.setAttribute("class", "panel-child")
    h3.textContent = data.title
    a.textContent = "Visit this Article"
    a.setAttribute("href", data.url)
    a.setAttribute("target", "_blank")
    newsEl.appendChild(div)
    div.append(h3, a)
}

storyBtn.addEventListener("click", openNewsModal)
closeNewsModal.addEventListener("click", close)
window.addEventListener('click', outsideClick)
storyType.addEventListener("submit", getUserInput)

// Open news modal
function openNewsModal() {
    newsModal.style.display = "block"
}

// Close modal when X is clicked
function close() {
    newsModal.style.display = "none"
}

// Close modal when you click outside the modal
function outsideClick(event){
    if(event.target == newsModal){
        close();
    }
}

// Get user input from modal and pass it through the API call
function getUserInput(event) {
    let radioArray = document.querySelectorAll(".story")
    let story
    radioArray.forEach(radio => {
        if(radio.checked) {
            story = radio.getAttribute("id")
        }
    })
    getNews(news,story)
    event.preventDefault()
    close()
}