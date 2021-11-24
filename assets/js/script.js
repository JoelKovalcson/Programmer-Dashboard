// import {getTrending} from "./modules/populate.js";
import {} from "./modules/following.js";
import {feed} from "./modules/feed.js";
import {getNews} from "./modules/news.js";

/* Feed */
var feedEl = document.getElementById("feed");

/* Following */
var following = document.getElementById("following");

/* Popular */
var news = document.getElementById("popular");


feed.setup(feedEl);
news.getNews()