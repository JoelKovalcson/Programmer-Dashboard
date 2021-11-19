var owner = "JoelKovalcson"
var repo =  "GitHub-At-A-Glance"
const url = `https://api.github.com/repos/${owner}/${repo}`
 

export function getRepo(followingEl, owner, repo) { 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let div = document.createElement("div")
            let h3 = document.createElement("h3")
            let a = document.createElement("a")
            div.setAttribute("class", "panel-child")
            h3.textContent = data.name
            a.textContent = "Visit this Repo"
            a.setAttribute("href", data.svn_url)
            followingEl.appendChild(div)
            div.append(h3, a)
        })
        .catch(ex => console.log("error")) 
}

