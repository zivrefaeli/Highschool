const background = document.querySelector('canvas.background');
const projects = document.querySelector('div.projects');
const paths = [
    '/src/pages/wheel.html',
    '/src/pages/empty.html',
    '/src/pages/empty.html',
    '/src/pages/module-f.html'
];

function loadFile(path) {
    let paths = window.location.href.split('/');
    paths.pop();
    window.location.href = paths.join('/') + path;
}

window.onload = () => {
    Particles.init({
        selector: '.background',
        connectParticles: true,
        maxParticles: 70,
        color: '#bdbdbd'
    });
    background.width = background.clientWidth;
    background.height = background.clientHeight;
};

for (let i = 0; i < projects.childElementCount; i++) {
    projects.children.item(i).onclick = () => {
        loadFile(paths[i]);
    }
}