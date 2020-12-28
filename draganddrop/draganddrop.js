let groups = {
    groupOne: [],
    groupTwo: []
}
const groupOneInner = document.querySelector('.groupOne .inner')
const groupTwoInner = document.querySelector('.groupTwo .inner')
let uniqueItem = 0
//function to render group lists based on "groups" object
const renderGroups = () => {
    document.querySelectorAll('.item').forEach(item => {
        item.remove()
    })
    groups.groupOne.forEach(item => {
        groupOneInner.appendChild(item)
    })

    groups.groupTwo.forEach(item => {
        groupTwoInner.appendChild(item)
    })
}


//removes grabbed item and makes original placement appear if not re-allocated 
const removeGrabbed = () => {
    const items = document.querySelectorAll('.itemGroup .inner .item')
    document.querySelector('.itemOnMouse').remove()

    items.forEach(item => {
        item.childNodes[0].style.opacity = '1'
    })
}

//add listener for created or transfered item to allow grabbing

const newGrabListener = (toBeGrabbed, uniqueItemPlace) => {
    toBeGrabbed.addEventListener('mousedown', (e) => {
        const itemOnMouse = document.createElement('div')

        itemOnMouse.className = `item itemOnMouse ${toBeGrabbed.classList[1]} from${e.path[3].classList[1]}`

        itemOnMouse.innerHTML = `${toBeGrabbed.innerHTML}`


        document.querySelector('.groupOne .outer').appendChild(itemOnMouse)

        document.querySelector('.itemOnMouse').style.left = `calc(${getMousePosition(document.querySelector('.groupOne'), e)[0] - 11}px - ${e.target.clientWidth / 2}px)`
        document.querySelector('.itemOnMouse').style.top = `calc(${getMousePosition(document.querySelector('.groupOne'), e)[1] - 22}px - ${e.target.clientHeight / 2}px)`

        e.target.style.opacity = '0'


    })
    //unique item being raised for old items being dragged
}




//removes grabbed item wherever it may be and allocates to group if mouse up on it 
document.querySelector('.projectCont').addEventListener('mouseup', (e) => {
    //check here for douplicate problems
    let grabbed = document.querySelector('.itemOnMouse')

    if(!grabbed){return}

    let groupFrom = grabbed.classList[3]
    removeGrabbed()
    let selectedGroup = document.elementFromPoint(e.clientX, e.clientY).closest('.itemGroup').classList

    if (selectedGroup[0] === 'itemGroup') {
        if(groupFrom !== `from${selectedGroup[1]}`){
            grabbed.classList.remove('itemOnMouse')
            newGrabListener(grabbed, uniqueItem)
            groups[selectedGroup[1]].push(grabbed)

            groups[selectedGroup[1] === 'groupOne' ? 'groupTwo' : 'groupOne'].forEach((item, i, array) => {
                if(item.classList.contains(grabbed.classList[1])){
                    array.splice(i, 1)
                }
            })
            renderGroups()
        }

    }
})
//mouse position function for placing dragged item where mouse is
const getMousePosition = (group, e) => {
    let rect = group.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return [x, y]
}
//calculation if grabbed item is up to make it move with the mouse
document.querySelector('.dragAndDrop').addEventListener('mousemove', (e) => {
    const draggedItem = document.querySelector('.itemOnMouse')
    if (draggedItem) {
        draggedItem.style.left = `calc(${getMousePosition(document.querySelector('.groupOne'), e)[0] - 11}px - ${draggedItem.clientWidth / 2}px)`
        draggedItem.style.top = `calc(${getMousePosition(document.querySelector('.groupOne'), e)[1] - 22}px - ${draggedItem.clientHeight / 2}px)`

    }
})
//this takes the input value and places it in group 1. validates, and clears upon pressing the add button. makes the new item dragable
//also adds the click drag event to the new item
document.querySelector('.newInput button').addEventListener('click', () => {
    const input = document.querySelector('.newInput input')

    if (!input.value) {
        return
    }

    let newItem = document.createElement('div')

    newItem.className = `item item${uniqueItem}`

    newItem.innerHTML = `<p>${input.value}</p>`

    newGrabListener(newItem, uniqueItem)

    uniqueItem++
    
    groups.groupOne.push(newItem)

    renderGroups()

    input.value = ''
})



