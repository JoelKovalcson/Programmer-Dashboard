const url = `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`


export function getNews (url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        for(var i = 0 ; i < data.length; i++) {
            if(i < 25) {
                let itemUrl = `https://hacker-news.firebaseio.com/v0/item/${element[i]}.json?print=pretty`
                fetch(itemUrl)
                .then(response => response.json())
                .then(data => {
                    populateNews(data)
                })
            }    
        }
    })
}

export function populateNews(data) {
    let div = document.createElement("div")
    let h3 = document.createElement("h3")
    let a = document.createElement("a")
    div.setAttribute("class", "panel-child")
    h3.textContent = data.title
    a.textContent = "Visit this Article"
    a.setAttribute("href", data.url)
    popularEl.appendChild(div)
    div.append(h3, a)
}

getNews()