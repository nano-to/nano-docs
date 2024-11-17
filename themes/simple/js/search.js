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
    var found = data.filter(a => {
        return a.title.toLowerCase().includes(e.value.toLowerCase()) ||
                a.html.toLowerCase().includes(e.value.toLowerCase())
            // (a.title && a.title.toLowerCase().includes(e.value.toLowerCase())) || 
            // (a.endpoints && a.endpoints.find(b => b.title.toLowerCase().includes(e.value.toLowerCase()))) ||
            // (a.endpoints && a.endpoints.find(b => b.params && b.params.find(d => d.key.includes(e.value.toLowerCase())))) ||
            // (a.endpoints && a.endpoints.find(b => b.params && b.params.find(d => d.description.toLowerCase().includes(e.value.toLowerCase())))) || 
            // (a.endpoints && a.endpoints.find(b => b.response && Object.keys(b.response).includes(e.value.toLowerCase())))
    }).reverse()
    var html = ``
    // var categories = []
    // found.map(a => !categories.includes(a.title) ? categories.push(a.title) : '')
    // var related = []
    // found.map(a => {
    //     a.endpoints.filter(i => {
    //         return i.title.toLowerCase().includes(e.value.toLowerCase()) || 
    //         i.params && i.params.find(d => d.key.includes(e.value.toLowerCase())) ||
    //         (i.params && i.params.find(d => d.description && d.description.toLowerCase().includes(e.value.toLowerCase()))) ||
    //         (i.response && i.response && Object.keys(i.response).includes(e.value.toLowerCase()))
    //     })
    //     .map(d => {
    //         d.category = a.title
    //         related.push(d)
    //     })
    // })
    found.map(b => {
        // var related_html = found.filter(a => a.title === b.title).map(a => ``).join('')
        html += `<div class="search-item-wrapper"><a href="/${b.slug}.html" class="search-item"><h2>${b.title}</h2></a></div>`
    })
    document.getElementById('search-results').innerHTML = html
    index = -1
}