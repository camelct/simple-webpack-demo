import "./style/div-css.css";
import "./style/div-less.less";
import "./style/bg-css.css";

import test55kPng from "./assets/test-55K.png";
import test1040KPng from "./assets/test-1040K.png";
import { format } from "utils";

const divEl1 = document.createElement("div");
divEl1.textContent = "div1";
divEl1.classList.add("div1");
document.body.append(divEl1);

const divEl2 = document.createElement("div");
divEl2.textContent = "div2";
divEl2.classList.add("div2");
document.body.append(divEl2);

const imgEl1 = document.createElement("img");
imgEl1.src = test55kPng;
document.body.append(imgEl1);

const imgEl2 = document.createElement("img");
imgEl2.src = test1040KPng;
document.body.append(imgEl2);

const divBg = document.createElement("div");
divBg.classList.add("img-bg");
document.body.append(divBg);

console.log("format", format("123"));
