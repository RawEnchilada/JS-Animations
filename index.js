import { updateOnScroll,triggerOnScroll, Style, Options } from "./src/scroll-animation";

function elementTop(selector){
    const element = document.querySelector(selector);
    const top = element.getBoundingClientRect().top+window.scrollY-window.innerHeight;
    return (top / document.body.scrollHeight);
}

function elementBottom(selector){
    const element = document.querySelector(selector);
    const bottom = element.getBoundingClientRect().bottom+window.scrollY-window.innerHeight;
    return (bottom / document.body.scrollHeight);
}

function elementHeight(selector){
    const element = document.querySelector(selector);
    const height = element.getBoundingClientRect().height;
    return (height / document.body.scrollHeight);
}

export {
    updateOnScroll,
    triggerOnScroll,
    Style,
    Options,
    elementTop,
    elementBottom,
    elementHeight,
};

