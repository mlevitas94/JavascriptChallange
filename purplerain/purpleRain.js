const container = document.getElementById('purpleRainCont')
var uniqueDroplet = 0
var mouseX
var mouseY
let rainInterval
const triggerRain = (event) => {
    const rect = container.getBoundingClientRect()
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;
    const droplet = document.createElement('div')
    droplet.className = `droplet droplet${uniqueDroplet}`
    droplet.style.left = `${x}px`
    droplet.style.top = `${y}px`
    container.appendChild(droplet)
    setTimeout(() => {
        document.querySelector(`.droplet${uniqueDroplet}`).style.transform = 'translate(0px, 700px)'
        uniqueDroplet ++
    }, 50);
}
const clearDroplets = () => {
    const droplets = document.querySelectorAll('.droplet')
    setTimeout(() => {
        droplets.forEach(el => {
            el.remove()
        });
    }, 1200);
}
document.querySelector('.purpleRainCont').addEventListener('mousedown', (e) => {
    rainInterval = setInterval(() => {
        triggerRain(e)
    }, 100);
})
document.querySelector('.purpleRainCont').addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})
document.querySelector('.purpleRainCont').addEventListener('mouseup', (e) => {
    clearInterval(rainInterval)
    clearDroplets()
})