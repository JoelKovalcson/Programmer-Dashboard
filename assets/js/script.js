import {getTrending} from "./modules/populate.js";
import {} from "./modules/following.js";

/* Feed */
var feed = document.getElementById("feeD");

/* Following */
var following = document.getElementById("following");

/* Popular */
var trending = document.getElementById("popular");

getTrending(trending);