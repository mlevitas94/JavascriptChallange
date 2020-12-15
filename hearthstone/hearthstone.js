//left side input event listeners for changing html and search filter values
document.querySelectorAll(".inputSection input").forEach(input => {
})

//object for cards from api, array diplaying filtered cards/ numbers for limiting the amount, and filter values

let cards = {}

let displayCards = []

let cardCount = 0

let search = null

let rarity = null

let cost = null

let attack = null

let health = null


//render card function will render upon page refresh and load more, still storing prevously rendered cards based on loadMore param
const renderCards = (loadMore, search, rarity, cost, attack, health) => {
    let limit = 0
    let requestedCards = []
    let tempCardCount = cardCount

    const cardScroll = document.querySelector('.cardScroll')

    if (!loadMore) {
        cardCount = 0
    }

    //compre carcount and temp card count down here for load more potential
    const filterCards = () => {
        for (const set in cards) {
            if (set === 'Hero Skins' || cards[set].length === 0) {
                continue
            }
            for (let i = 0; i < cards[set].length; i++) {
                if (cards[set][i]?.type === "Hero") {
                    continue
                }
                if (tempCardCount !== 0) {
                    tempCardCount--
                    continue
                }

                if (limit === 4) {
                    return
                }

                requestedCards.push(cards[set][i])
                limit++
            }
        }
    }

    filterCards()
    cardCount += 4

    displayCards = [...requestedCards]

    for (let i = 0; i < displayCards.length; i++) {
        let img = document.createElement('img')
        img.setAttribute('src', displayCards[i].img)


        cardScroll.append(img)



    }



}

//fetch data from my api -> hearthstone 3rd party api and put them into cards object and calling render function
// fetch('http://localhost:5555/carddata').then(response => {
//     response.json().then(body => {
//         cards = body
//         document.querySelector('.loadingModal').style.display = 'none'
//         renderCards()
//     })
// }).catch(err => {
//     console.error(err);
// });

