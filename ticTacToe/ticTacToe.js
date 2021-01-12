const preModal = document.querySelector('.gameType');
const turnCounter = document.querySelector('.turnCounter')
let socket;
let currentTurn;
let playAgainConfirmed = false;
let grid = [null, null, null, null, null, null, null, null, null]
let turn = null

//function to start game. online param will set online elements. onlineturn param will be 0 or 1 randomly from back end to set each players turn when joined online
const initializeGame = (online, onlineTurn) => {
    const baseInit = () => {
        playAgainConfirmed = false
        grid = [null, null, null, null, null, null, null, null, null]
        if ((typeof onlineTurn === 'undefined' ? Math.floor(Math.random() * 2) : onlineTurn) === 0) {
            turn = 'O'
            socket?.connected ? currentTurn = false : null
        } else {
            turn = 'X'
            socket?.connected ? currentTurn = true : null
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
            })
        } catch (err) {
            console.log(err)
            return modalChange('error', 'Something went wrong with the server.')
        }
        baseInit()
        if (turn === 'O') {
            modalChange('waitingturn', 'Waiting for X to go...')
            turnCounter.innerHTML = `Turn : X`
        } else {
            modalChange('removemodal')
            turnCounter.innerHTML = `Turn : ${turn}`
        }
        turn = 'X'
        document.querySelectorAll('.box span').forEach(span => {
            span.style.display = 'none'
            span.style.color = '#dcdcdc'
            span.innerHTML = turn
        })
    } else {
        baseInit()
        modalChange('removemodal')
        turnCounter.innerHTML = `Turn : ${turn}`
    }

}

//reintializes game in local or online
const playAgain = () => {
    if (!socket?.connected) {
        initializeGame()
    } else {
        try {
            if (playAgainConfirmed) {
                return socket.emit('initplayagain', (res) => {

                    initializeGame(true, res.turn)
                })
            }
            socket.emit('playagain')
            modalChange('playagainwaiting')
        } catch (err) {
            return modalChange('error', 'Something went wrong with the server')
        }
    }
}

//function to check grid global variable to see if a placement has won the game
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

// sets grid variable current turn's symbol, places symbol on DOM grid. stops if placed location causes a win or tie.
//if no win or tie, sets next turn. If online is connected, placement location is sent to server which sends to other player who calls this function upon recieving socket call
const nextTurn = async (ele, sendTurn) => {
    //rewriting this for synced online communication
    if (!turn) {
        return
    }


    if (socket?.connected) {
        try {
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

    ele.children[0].style.display = 'block'
    ele.children[0].style.color = 'black'


    grid[gridPlace] = turn


    if (checkWin()) {
        return modalChange('gamefinished', `${turn} Won!`)
    }

    if(grid.every(ele => ele !== null)){
        return modalChange('gamefinished', `Tie`)
    }


    turn === 'X' ? turn = 'O' : turn = 'X'

    document.querySelectorAll('.box span').forEach(span => {
        if (span.style.display !== 'block') {
            span.innerHTML = turn

        }
    })

    turnCounter.innerHTML = `Turn : ${turn}`

    sendTurn && socket?.connected ? modalChange('waitingturn', `Waiting for ${turn} to go...`) : modalChange('removemodal')

}

//creates room in server, waits for other player to connect
const createRoom = async () => {

    try {
        socket = await io('http://localhost:5555')

    } catch (err) {
        console.log(err)
        return modalChange('error', 'Could not create room.')
    }



    socket.on('someonejoined', turn => {
        initializeGame(true, turn)
    })

    socket.on('playagainconfirmed', (resetTurn) => {
        if (typeof resetTurn !== 'number') {
            if (!playAgainConfirmed) {
                playAgainConfirmed = true
            }
        } else {

            initializeGame(true, resetTurn)
        }
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

//joins room created in server. If there is no room from user input or room is full, it will reject. Connection is made if a free room is found
const joinRoom = async () => {
    try {
        socket = await io('http://localhost:5555')
        socket.on('playagainconfirmed', (resetTurn) => {
            if (typeof resetTurn !== 'number') {
                if (!playAgainConfirmed) {
                    playAgainConfirmed = true
                }
            } else {

                initializeGame(true, resetTurn)
            }
        })
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


//function to change popup modal based on occurences of actions. Can show information and button options as well as executing modal removal and socket disconnection
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
            socket.disconnect()
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
        case 'playagainwaiting':
            preModal.innerHTML = `<p>Waiting for the other player to accept...</p>`
            break;
        case 'Joining':
            preModal.innerHTML = `<p>Joining room...</p>`
            break;
        case 'waitingturn':
            preModal.innerHTML = `<p>${data}</p>`
            break;
        case 'gamefinished':
            preModal.innerHTML = `<p>${data}</p></br><div><button onclick="playAgain()">Play Again</button> <button onclick="modalChange('cancel')">Exit</button></div>`
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