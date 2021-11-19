const url = "https://api.trending-github.com/github/repositories"

export function getTrending(popularEl) { 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let div = document.createElement("div")
                let h3 = document.createElement("h3")
                let a = document.createElement("a")
                div.setAttribute("class", "panel-child")
                h3.textContent = element.name
                a.textContent = "Visit this Repo"
                a.setAttribute("href", element.url)
                popularEl.appendChild(div)
                div.append(h3, a)

            });
        })
        .catch(ex => console.log("error")) 
}

