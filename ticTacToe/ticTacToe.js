
const preModal = document.querySelector('.gameType');
const turnCounter = document.querySelector('.turnCounter')
let socket;

let grid = [null, null, null, null, null, null, null, null, null]
let turn = null



const initializeGame = (online) => {

    grid = [null, null, null, null, null, null, null, null, null]
    preModal.style.display = 'none'
    if (Math.floor(Math.random() * 2) === 0) {
        turn = 'O'
    } else {
        turn = 'X'
    }
    turnCounter.innerHTML = `Turn : ${turn}`
    document.querySelectorAll('.box span').forEach(span => {
        span.style.display = 'none'
        span.style.color = '#dcdcdc'
        span.innerHTML = turn
    })

}

const checkWin = () => {
    const horizontal = [0, 3, 6].map(n => {
        return [n, n + 1, n + 2]
    })
    const vertical = [0, 1, 2].map(n => {
        return [n, n + 3, n + 6]
    })
    const diagonal = [[0, 4, 8], [2, 4, 6]]

    const allWinSlots = [].concat(horizontal).concat(vertical).concat(diagonal)

    let result = allWinSlots.some(winSlot => {
        return grid[winSlot[0]] === turn && grid[winSlot[1]] === turn && grid[winSlot[2]] === turn
    })

    return result
}

const nextTurn = (ele) => {
    if (!turn) {
        return
    }
    const gridPlace = ele.classList[1].split('box')[1] - 1
    if (grid[gridPlace] !== null) {
        return
    }
    grid[gridPlace] = turn
    ele.children[0].style.display = 'block'
    ele.children[0].style.color = 'black'

    if (checkWin()) {

        return initializeGame('local')
    }

    if (turn === 'X') {
        turn = 'O'
    } else {
        turn = 'X'
    }
    turnCounter.innerHTML = `Turn : ${turn}`
    document.querySelectorAll('.box span').forEach(span => {
        if (span.style.display !== 'block') {
            span.innerHTML = turn
        }
    })
}

const createRoom = async () => {
    try {
        socket = await io('http://localhost:5555')
    } catch (err) {
        console.log(err)
        return modalChange('error')
    }

    socket.emit('createroom', res => {
        modalChange('waiting', res.newRoom)
    })

}

const joinRoom = async () => {
    try {
        socket = await io('http://localhost:5555')
    } catch (err) {
        console.log(err)
        return modalChange('error')
    }
    const typedNumber = document.querySelector(".gameType input[type='text'").value
    

    socket.emit('joinroom', typedNumber, res => {

    })

}

const modalChange = (changeTo, data) => {
    switch (changeTo) {
        case 'cancel':
            preModal.innerHTML = `<p>Select your game type</p><div><button onclick="initializeGame()">Local</button><button onclick="modalChange('online')">Online</button></div>`
            break;
        case 'online':
            preModal.innerHTML = `<p>Create or join a room?</p><div><button onclick="modalChange('create')">Create Room</button><button onclick="modalChange('join')">Join Room</button><button onclick="modalChange('cancel')">Cancel</button></div>`
            break;
        case 'join':
            preModal.innerHTML = `<p>Please enter the room number you wish to join</p><div><input type='text' name='join' id='join'><button onclick="joinRoom()">Join</button><button onclick="modalChange('cancel')">Cancel</button></div>`
            break;
        case 'create':
            preModal.innerHTML = '<p>Creating Room...</p>';
            createRoom()
            break;
        case 'waiting':
            preModal.innerHTML = `<p>The room number is : ${data}</p><br/><br/><p>Waiting for player 2 to join...</p>`
            break;
        case 'error':
            preModal.innerHTML = `<p>error</p>`
            break;
        default:
        // code block
    }
}