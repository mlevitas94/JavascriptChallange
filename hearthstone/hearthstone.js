
let cards = {}
let displayCards = []
let rarity = null
let currentCards = 0
document.querySelectorAll(".inputSection input, .inputSection select").forEach(input => {
    if (input.type === 'radio') {
        input.addEventListener('click', (e) => {
            if (e.target.value === rarity) {
                input.checked = false
                rarity = null
            } else {
                rarity = e.target.value
            }
        })
    }

})
const renderCards = (loadMore) => {
    const cardScroll = document.querySelector('.cardScroll')


    const filterCards = () => {
        if (!loadMore) { 
            currentCards = 0 
            document.querySelectorAll('.cardScroll img').forEach(img => {
                img.remove()
            })
        }
        let tempCurrentCards = currentCards
        let searchQueries = {
            search: !document.querySelector('#search').value ? null : document.querySelector('#search').value,
            cost: document.querySelector('select[name="cost"]').value,
            attack: document.querySelector('select[name="attack"]').value,
            health: document.querySelector('select[name="health"]').value,
            rarity: rarity
        }
        for (const query in searchQueries) {
            if (searchQueries[query] === null || searchQueries[query] === 'null') {
                delete searchQueries[query]
            } else if (query === 'cost' || query === 'attack' || query === 'health') {
                searchQueries[query] = parseInt(searchQueries[query], 10)
            }
        }
        let filteredCards = []
        let limit = 0

        for (const set in cards) {
            if (limit === 4) {
                break
            }
            if (set === 'Hero Skins' || cards[set].length === 0) {
                continue
            }
            filteredCards = [...filteredCards, ...cards[set].filter(card => {
                if (limit !== 4 && card.type !== 'Hero') {
                    queryPass = 0
                    for (query in searchQueries) {
                        if (searchQueries[query] === card[query]) {
                            queryPass++
                        }
                    }
                    if (queryPass === Object.keys(searchQueries).length) {
                        if (tempCurrentCards > 0) {
                            tempCurrentCards--
                            return false
                        } else {
                            limit++
                            return true
                        }
                    }

                }
            })]
        }
        return filteredCards
    }
    console.log(currentCards)
    currentCards += 4
    console.log(currentCards)

    filterCards().forEach(card => {
        let img = document.createElement('img')
        img.setAttribute('src', card.img)
        cardScroll.append(img)
    })
    displayCards.splice()
}

fetch('http://localhost:5555/carddata').then(response => {
    response.json().then(body => {
        cards = body
        console.log(cards)
        // document.querySelector('.loadingModal').style.display = 'none'
        renderCards(false)
    })
}).catch(err => {
    console.error(err);
});

