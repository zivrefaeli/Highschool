const iframe = document.querySelector('iframe');
const divs = document.querySelector('nav > div').children;
const urls = ['introduction.html', 'all-my-sons.html', 'personal-parts.html'];

for (let i = 0; i < divs.length; i++) {
    divs.item(i).onclick = () => {
        iframe.src = urls[i];
    };
}