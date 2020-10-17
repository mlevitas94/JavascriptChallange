let groups = {
    groupOne: [],
    groupTwo: []
}

const groupOneInner = document.querySelector('.groupOne .inner')
const groupTwoInner = document.querySelector('.groupTwo .inner')

let uniqueItem = 0


//function to render group lists based on above object

const renderGroups = () => {
    document.querySelectorAll('.item').forEach(item => {
        item.remove()
    })
    groups.groupOne.forEach(item => {
        groupOneInner.appendChild(item)
    })

    groups.groupTwo.forEach(item => {
        console.log(item)
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

//add listener for created or transfered item for grab

const newGrabListener = (toBeGrabbed) => {
    toBeGrabbed.addEventListener('mousedown', (e) => {
        const itemOnMouse = document.createElement('div')

        itemOnMouse.className = 'item itemOnMouse'

        itemOnMouse.innerHTML = `${toBeGrabbed.innerHTML}`


        document.querySelector('.groupOne .outer').appendChild(itemOnMouse)

        document.querySelector('.itemOnMouse').style.left = `calc(${getMousePosition(document.querySelector('.groupOne'), e)[0] - 11}px - ${e.target.clientWidth / 2}px)`
        document.querySelector('.itemOnMouse').style.top = `calc(${getMousePosition(document.querySelector('.groupOne'), e)[1] - 22}px - ${e.target.clientHeight / 2}px)`

        e.target.style.opacity = '0'


    })
}




//removes grabbed item wherever it may be and allocates to group if mouse up on it 
document.querySelector('.projectCont').addEventListener('mouseup', (e) => {

    let grabbed = document.querySelector('.itemOnMouse')

    removeGrabbed()
    let selectedGroup = document.elementFromPoint(event.clientX, event.clientY).closest('.itemGroup').classList

    if (selectedGroup[0] === 'itemGroup') {
        for (let group in groups) {
            if (group === selectedGroup[1]) {
                return
            } else {

                grabbed.classList.remove('itemOnMouse')
                newGrabListener(grabbed)
                groups[selectedGroup[1]].push(grabbed)


                renderGroups()
            }
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
    uniqueItem++

    newItem.innerHTML = `<p>${input.value}</p>`

    newGrabListener(newItem)



    groups.groupOne.push(newItem)

    renderGroups()

    input.value = ''
})



