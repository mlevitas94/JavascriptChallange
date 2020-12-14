document.querySelectorAll(".inputSection input").forEach(input => {
    if (input.type === 'range') {
        input.addEventListener('change', (e) => {
            document.querySelector(`.${e.target.id}`).innerHTML = e.target.value === '10' ? '10+' : e.target.value
        })
    }
})

let cards = {}

let displayCards = []

let limit = 0

let search = null

let rarity = null

let cost = null

let attack = null

let health = null

const renderCards = (search, rarity, cost, attack, health) => {
    startingLimit = limit
    requestedCards = []

    const cardScroll = document.querySelector('.cardScroll')

    const filterCards = () => {
        for (const set in cards) {
            console.log(set)
            if (set === 'Hero Skins') {
                continue
            }
            for(let i = 0; i <= cards[set].length ; i++){
                if(startingLimit === limit + 4){
                    return
                }
                if(cards[set][i].type === "Hero"){
                    continue
                }
                requestedCards.push(cards[set][i])
                startingLimit++
            }
        }
    }

    filterCards()

    limit += 4
    
    displayCards = [...displayCards, ...requestedCards]

    for(let i = 0; i < displayCards.length; i++){
        let img = document.createElement('img')
        img.setAttribute('src', displayCards[i].img)


        cardScroll.append(img)



    }

    

}


fetch('http://localhost:5555/carddata').then(response => {
    response.json().then(body => {
         cards = body
         console.log(cards)
         renderCards()
    })
}).catch(err => {
    console.error(err);
});

