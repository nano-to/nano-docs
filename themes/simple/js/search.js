var index = -1
var data = []

async function fetchData() {
  const response = await fetch("/api.json")
  data = (await response.json())
}

fetchData()

function toggle_submenu(e) {
  if (Array.from(e.classList).includes('active')) return e.classList.remove('active')
    let submenus = document.querySelectorAll('.menu-item');
  submenus.forEach((item, i) => item.classList.remove('active'))
  e.classList.add('active')
}

function toggle_menu(e) {
    var menu = document.getElementById('mobile-menu')
    menu.style.display = menu.style.display !== 'flex' ? 'flex' : 'none'
}

function hide_search(e) {
    document.getElementById('search-backdrop').style.display = 'none'
    document.getElementById('search').style.display = 'none'
    document.onkeydown = null
    index = -1
}

function show_search(e) {
    let submenus = document.querySelectorAll('.menu-item');
  submenus.forEach((item, i) => item.classList.remove('active'))
    document.getElementById('search-backdrop').style.display = 'block'
    document.getElementById('search').style.display = 'block'
    document.getElementById("search-input").focus()
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            hide_search()
        }
        // moveIndex()
        let searchItems = document.querySelectorAll('.search-item');
        function setActive(index) {
            searchItems.forEach((item, i) => {
              if (i === index) {
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            });
          }
        if (evt.key === 'ArrowUp') {
            index = index - 1 <= 0 ? 0 : index - 1
            setActive(index)
            return evt.preventDefault()
        }
        if (evt.key === 'ArrowDown') {
            index = index + 1 >= searchItems.length ? 0 : index + 1
            setActive(index)
            console.log( index, searchItems.length )
            return evt.preventDefault()
        }
        if (evt.key === 'Enter') {
            var enter_index = index === -1 ? 0 : index
            window.location.href = searchItems[enter_index].getAttribute('href');
        }
    }
}

window.reset_search = function(e) {
    document.getElementById('search-input').value = ''
    document.getElementById('clear-search').style.display = 'none'
    document.getElementById('search-results').innerHTML = ''
}

function slugify(string) {
    return string.toLowerCase().split(' ').join('-').split('.').join('-')
}

function search(e) {
    if (!e.value) return reset_search()
    document.getElementById('clear-search').style.display = 'block'
    
    const query = e.value.toLowerCase()
    const queryWords = query.split(/\s+/).filter(word => word.length > 0)
    
    // Score and filter results
    var scoredResults = data.map(item => {
        const title = item.title.toLowerCase()
        const content = item.html.toLowerCase()
        
        let score = 0
        let matchType = 'content'
        let snippet = ''
        
        // Title exact match gets highest score
        if (title.includes(query)) {
            score += 100
            matchType = 'title'
        }
        
        // Title word matches
        queryWords.forEach(word => {
            if (title.includes(word)) {
                score += 50
                matchType = 'title'
            }
        })
        
        // Content matches
        if (content.includes(query)) {
            score += 20
            snippet = extractSnippet(item.html, query)
        }
        
        // Content word matches
        queryWords.forEach(word => {
            if (content.includes(word)) {
                score += 10
                if (!snippet) {
                    snippet = extractSnippet(item.html, word)
                }
            }
        })
        
        return {
            ...item,
            score,
            matchType,
            snippet: snippet || extractSnippet(item.html, queryWords[0] || query)
        }
    }).filter(item => item.score > 0)
    
    // Sort by relevance (score) descending
    scoredResults.sort((a, b) => b.score - a.score)
    
    var html = ``
    scoredResults.forEach(item => {
        const highlightedTitle = highlightText(item.title, query)
        const highlightedSnippet = highlightText(item.snippet, query)
        
        html += `<div class="search-item-wrapper">
            <a href="/${item.slug}.html" class="search-item">
                <h2>${highlightedTitle}</h2>
                <p class="search-snippet">${highlightedSnippet}</p>
            </a>
        </div>`
    })
    
    document.getElementById('search-results').innerHTML = html
    index = -1
}

function extractSnippet(html, query) {
    // Remove HTML tags for snippet extraction
    const textContent = html.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    
    const queryLower = query.toLowerCase()
    const textLower = textContent.toLowerCase()
    
    const index = textLower.indexOf(queryLower)
    if (index === -1) {
        // If exact query not found, try individual words
        const words = query.split(/\s+/)
        for (let word of words) {
            const wordIndex = textLower.indexOf(word.toLowerCase())
            if (wordIndex !== -1) {
                return extractSnippetAroundIndex(textContent, wordIndex, word.length)
            }
        }
        // Fallback to first 150 characters
        return textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '')
    }
    
    return extractSnippetAroundIndex(textContent, index, query.length)
}

function extractSnippetAroundIndex(text, index, queryLength) {
    const snippetLength = 150
    const start = Math.max(0, index - snippetLength / 2)
    const end = Math.min(text.length, start + snippetLength)
    
    let snippet = text.substring(start, end)
    
    // Add ellipsis if we're not at the beginning/end
    if (start > 0) snippet = '...' + snippet
    if (end < text.length) snippet = snippet + '...'
    
    return snippet.trim()
}

function highlightText(text, query) {
    if (!query) return text
    
    const queryWords = query.split(/\s+/).filter(word => word.length > 0)
    let highlightedText = text
    
    queryWords.forEach(word => {
        const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi')
        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
    })
    
    return highlightedText
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}