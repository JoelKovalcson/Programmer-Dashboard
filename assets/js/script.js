// import {getTrending} from "./modules/populate.js";
import * as following from "./modules/following.js";
import {feed} from "./modules/feed.js";
import * as news from "./modules/news.js";

/* Feed */
var feedEl = document.getElementById("feed");

/* Following */
var followingEl = document.getElementById("following");

/* Popular */
var newsEl = document.getElementById("popular");

feed.setup(feedEl, following);

following.setFeed(feed);
news.getNews(newsEl)