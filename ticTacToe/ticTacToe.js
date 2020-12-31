
const preModal = document.querySelector('.gameType');
const turnCounter = document.querySelector('.turnCounter')
let socket;
let setTurn
let grid = [null, null, null, null, null, null, null, null, null]
let turn = null

const initializeGame = (online, onlineTurn) => {
    const baseInit = () => {
        grid = [null, null, null, null, null, null, null, null, null]
        if ((typeof onlineTurn === 'undefined' ? Math.floor(Math.random() * 2) : onlineTurn) === 0) {
            turn = 'O'
        } else {
            turn = 'X'
        }
        document.querySelectorAll('.box span').forEach(span => {
            span.style.display = 'none'
            span.style.color = '#dcdcdc'
            span.innerHTML = turn
        })
    }
    if (online) {
        try {
            socket.on('playerdisconnected', () => {
                modalChange('error', 'The other player has disconnected')

            })
            socket.on('waitingturn', res => {
                nextTurn(document.querySelector(`.${res}`), false)
                if (setTurn === turn) {
                    modalChange('waitingturn', `Waiting for ${turn === 'X' ? 'O' : 'X'} to go...`)
                } else {
                    console.log('modal change should happen')
                    modalChange('removemodal')
                }
            })
        } catch (err) {
            console.log(err)
            return modalChange('error', 'Something went wrong with the server.')
        }
        baseInit()
        setTurn = turn
        if (turn === 'O') {
            modalChange('waitingturn', 'Waiting for X to go...')
            turnCounter.innerHTML = `Turn : O`
        } else {
            modalChange('removemodal')
            turnCounter.innerHTML = `Turn : ${turn}`
        }
    } else {
        baseInit()
        modalChange('removemodal')
        turnCounter.innerHTML = `Turn : ${turn}`
    }

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

const nextTurn = async (ele, sendTurn) => {
    //when being called on the client listener, ele is a number, needs to be element for grid displays
    if (!turn) {
        return
    }
    // typeof ele === 'number'
    if (socket?.connected) {
        try {
            if (setTurn !== turn) {
                return
            }
            if (sendTurn) {
                await socket.emit('turntaken', ele.classList[1])
            }

        } catch (err) {
            return modalChange('error', 'Something went wrong with the server.')
        }
    }
    let gridPlace = ele.classList[1].split('box')[1] - 1
    if (grid[gridPlace] !== null) {
        return
    }
    grid[gridPlace] = turn
    ele.children[0].style.display = 'block'
    ele.children[0].style.color = 'black'

    if (checkWin()) {

        return initializeGame()
    }

    document.querySelectorAll('.box span').forEach(span => {
        if (span.style.display !== 'block') {
            console.log(turn, setTurn)
            span.innerHTML = turn !== setTurn ? turn : 'X' ? 'O' : 'X'
        }
    })
    if (turn === 'X') {
        turn = 'O'
    } else {
        turn = 'X'
    }
    turnCounter.innerHTML = `Turn : ${turn}`

    socket?.connected ? modalChange('waitingturn', `Waiting for ${turn} to go...`) : null

}

const createRoom = async () => {
    try {
        socket = await io('http://localhost:5555')
    } catch (err) {
        console.log(err)
        return modalChange('error', 'Something went wrong with the server.')
    }

    socket.on('someonejoined', turn => {
        initializeGame(true, turn)
    })

    socket.emit('createroom', res => {
        if (res.full) {
            return modalChange('error', 'The server is full.')
        }
        if (res.tooManyRooms) {
            return modalChange('error', 'You can only be in one room at a time.')
        }
        modalChange('waiting', res.newRoom)
    })

}

const joinRoom = async () => {
    try {
        socket = await io('http://localhost:5555')
    } catch (err) {
        console.log(err)
        return modalChange('error', 'Could not connect to online match.')
    }
    const typedNumber = document.querySelector(".gameType input[type='text'").value

    modalChange('joining')

    try {
        socket.emit('joinroom', typedNumber, res => {
            if (!res.join) {
                return modalChange('error', 'Room doesnt exist or is full.')
            }
            initializeGame(true, res.turn)
        })
    } catch (err) {

        return modalChange('error', 'Something went wrong with the online connection')
    }

}

const modalChange = (changeTo, data) => {
    preModal.style.display = 'flex'
    switch (changeTo) {
        case 'cancel':
            grid = [null, null, null, null, null, null, null, null, null]
            turn = null
            document.querySelectorAll('.box span').forEach(span => {
                span.style.display = 'none'
                span.style.color = '#dcdcdc'
                span.innerHTML = ''
            })
            turnCounter.innerHTML = ''
            preModal.innerHTML = `<p>Select your game type</p><div><button onclick="initializeGame()">Local</button><button onclick="modalChange('online')">Online</button></div>`
            break;
        case 'online':
            preModal.innerHTML = `<p>Create or join a room?</p><div><button onclick="modalChange('create')">Create Room</button><button onclick="modalChange('join')">Join Room</button><button onclick="modalChange('cancel')">Cancel</button></div>`
            break;
        case 'join':
            preModal.innerHTML = `<p>Please enter the room number you wish to join</p><div><input maxLength='3' type='text' name='join' id='join'><button onclick="joinRoom()">Join</button><button onclick="modalChange('cancel')">Cancel</button></div>`
            break;
        case 'create':
            preModal.innerHTML = '<p>Creating Room...</p>';
            createRoom()
            break;
        case 'waiting':
            preModal.innerHTML = `<p>The room number is : ${data}</p><br/><br/><p>Waiting for player 2 to join...</p>`
            break;
        case 'Joining':
            preModal.innerHTML = `<p>Joining room...</p>`
            break;
        case 'waitingturn':
            preModal.innerHTML = `<p>${data}</p>`
            break;
        case 'error':
            preModal.innerHTML = `<p>${data}</p> <br/> <button onclick="modalChange('cancel')">Back</button>`
            socket.disconnect()
            break;
        case 'removemodal':
            preModal.innerHTML = ''
            preModal.style.display = 'none';
            break;
        default:
    }
}