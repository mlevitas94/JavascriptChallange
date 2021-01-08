const navItems = document.querySelectorAll('.sideNav li')
const projects = document.querySelectorAll('.projectSection')

const isScrolledIntoViewPartial = (el) => {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    var isVisible = (elemTop >= -el.clientHeight + 150) && (elemBottom <= window.innerHeight + el.clientHeight - 150);
    return isVisible;
  }

window.addEventListener('scroll', () => {
    projects.forEach(project => {
        if(isScrolledIntoViewPartial(project)){
            navItems.forEach(item => {
                item.classList.remove('navActive')
                if(project.id === item.classList[0]){
                    item.classList.add('navActive')
                }
            })
        }
    })
})



const projectDirect = (container) => {
    window.scrollBy({ top: document.querySelector(`.${container}`).getBoundingClientRect().y - 100, behavior: 'smooth' })
}