
const preModal = document.querySelector('.gameType');
const turnCounter = document.querySelector('.turnCounter')
let socket;

let grid = [null, null, null, null, null, null, null, null, null]
let turn = null

const initializeGame = (online) => {
    if (online) {
        preModal.innerHTML = "<p>Create or join a room?</p><div><button onclick='createRoom()'>Create Room</button><button onclick='joinRoom()'>Join Room</button></div>"

        // socket = io('http://localhost:5555')


    }else{
        grid = [null, null, null, null, null, null, null, null, null]
        preModal.style.display = 'none'
        if(Math.floor(Math.random() * 2) === 0){
            turn = 'O'
        }else{
            turn = 'X'
        }
        turnCounter.innerHTML = `Turn : ${turn}`
        document.querySelectorAll('.box span').forEach(span => {
            span.style.display = 'none'
            span.style.color = '#dcdcdc'
            span.innerHTML = turn
        })
    }
}

const checkWin = () => {
    const horizontal = [0,3,6].map(n => {
        return [n, n+1, n+2]
    })
    const vertical = [0,1,2].map(n => {
        return [n, n+3, n+6]
    })
    const diagonal = [[0,4,8], [2,4,6]]

    const allWinSlots = [].concat(horizontal).concat(vertical).concat(diagonal)

    let result = allWinSlots.some(winSlot => {
        return grid[winSlot[0]] === turn && grid[winSlot[1]] === turn && grid[winSlot[2]] === turn
    })

    return result
}

const nextTurn = (ele) => {
    if(!turn){
        return
    }
    const gridPlace = ele.classList[1].split('box')[1]-1
    if(grid[gridPlace] !== null){
        return
    }
    grid[gridPlace] = turn
    ele.children[0].style.display = 'block'
    ele.children[0].style.color = 'black'

    if(checkWin()){
        
        return initializeGame('local')
    }
    
    if(turn ==='X'){
        turn = 'O'
    }else{
        turn = 'X'
    }
    turnCounter.innerHTML = `Turn : ${turn}`
    document.querySelectorAll('.box span').forEach(span => {
        if(span.style.display !== 'block'){
            span.innerHTML = turn
        }
    })
}