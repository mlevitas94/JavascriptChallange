let groups = {
    groupOne: [],
    groupTwo: []
}

const selectedElement = null

const groupOneInner = document.querySelector('.groupOne .inner')


//removes grabbed item wherever it may be
document.querySelector('.projectCont').addEventListener('mouseup', () => {
    document.querySelectorAll('.outer .item').forEach(item => {
        item.remove()
    })
})



//mouse position function for placing dragged item where mouse is
const getMousePosition = (group, e) => {
    let rect = group.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return [x,y]
}

//this takes the input value and places it in group 1. validates, and clears upon pressing the add button. makes the new item dragable

//also adds the click drag event to the new item
document.querySelector('.newInput button').addEventListener('click', () => {

    const input = document.querySelector('.newInput input')

    if (!input.value) {
        return
    }

    let newItem = document.createElement('div')

    newItem.className = 'item'

    newItem.innerHTML = `<p>${input.value}</p>`

    newItem.addEventListener('mousedown', (e) => {
        const itemOnMouse = document.createElement('div')

        itemOnMouse.className = 'item itemOnMouse'

        itemOnMouse.innerHTML = `${newItem.innerHTML}`

        
        document.querySelector('.groupOne .outer').appendChild(itemOnMouse)

        document.querySelector('.itemOnMouse').style.left = `${getMousePosition(document.querySelector('.groupOne'), e)[0]}px`
        document.querySelector('.itemOnMouse').style.top = `${getMousePosition(document.querySelector('.groupOne'), e)[1]}px`
        
    })

    groups.groupOne.push(newItem)
    groupOneInner.appendChild(newItem)

    input.value = ''
})



