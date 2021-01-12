const container = document.getElementById('purplerain')
var uniqueDroplet = 0
var mouseX
var mouseY
let rainInterval

//function to create droplet element, set mouse placement placement for the element, and set animation to let the droplet fall
const triggerRain = () => {
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

//function to clear droplets, called when mouse is up or out of project container
const clearDroplets = () => {
    const droplets = document.querySelectorAll('.droplet')
    setTimeout(() => {
        droplets.forEach(el => {
            el.remove()
        });
    }, 1200);
}

//mouse down calling trigger rain function and creating droplets every .1 second
document.querySelector('.purpleRainCont').addEventListener('mousedown', (e) => {
    rainInterval = setInterval(() => {
        triggerRain()
    }, 100);
})

//sets x and y coordinate variables when mouse moves to changes placement of newly created droplets
document.querySelector('.purpleRainCont').addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

//stops droplet creation and removes them from DOM upon mouse up
document.querySelector('.purpleRainCont').addEventListener('mouseup', (e) => {
    clearInterval(rainInterval)
    clearDroplets()
})
//stops droplet creation and removes them from DOM upon mouse leaving project container
document.querySelector('.purpleRainCont').addEventListener('mouseleave', (e) => {
    clearInterval(rainInterval)
    clearDroplets()
})