const navItems = document.querySelectorAll('.sideNav li')
const projects = document.querySelectorAll('.projectCont')

window.addEventListener('scroll', () => {
    console.log('hi')
})

const projectDirect = (self, container) => {
    document.querySelectorAll('.sideNav li').forEach(navItem => {
        navItem.classList.remove('navActive')
    })
    window.scrollBy({ top: document.querySelector(`.${container}`).getBoundingClientRect().y - 100, behavior: 'smooth' }) 
    self.classList.add('navActive')
}