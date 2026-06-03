import './style.css'

const storageKey = 'diario-de-avistamentos'

const sampleSightings = [
  {
    id: crypto.randomUUID(),
    title: 'Luzes sobre a serra',
    place: 'Teresopolis, RJ',
    date: '2026-06-03',
    notes: 'Tres pontos brilhantes se moveram em linha reta por alguns minutos.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Rastro no entardecer',
    place: 'Petropolis, RJ',
    date: '2026-05-28',
    notes: 'Objeto rapido atravessou o ceu antes de desaparecer perto das nuvens.',
  },
]

const loadSightings = () => {
  const saved = localStorage.getItem(storageKey)
  return saved ? JSON.parse(saved) : sampleSightings
}

let sightings = loadSightings()

const saveSightings = () => {
  localStorage.setItem(storageKey, JSON.stringify(sightings))
}

document.querySelector('#app').innerHTML = `
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">Registro pessoal</p>
      <h1>Diario de Avistamentos</h1>
      <p class="lead">Guarde relatos, datas e locais de eventos curiosos observados no ceu.</p>
    </section>

    <section class="workspace" aria-label="Diario de avistamentos">
      <form class="panel" id="sighting-form">
        <h2>Novo avistamento</h2>
        <label>
          Titulo
          <input name="title" type="text" placeholder="Ex.: Luz intensa no horizonte" required />
        </label>
        <label>
          Local
          <input name="place" type="text" placeholder="Cidade, estado" required />
        </label>
        <label>
          Data
          <input name="date" type="date" required />
        </label>
        <label>
          Observacoes
          <textarea name="notes" rows="5" placeholder="Descreva o que voce viu" required></textarea>
        </label>
        <button type="submit">Adicionar registro</button>
      </form>

      <section class="panel list-panel">
        <div class="list-header">
          <div>
            <h2>Registros</h2>
            <p><span id="count">0</span> avistamentos salvos</p>
          </div>
          <button class="ghost" id="clear-all" type="button">Limpar</button>
        </div>
        <div class="sightings" id="sightings"></div>
      </section>
    </section>
  </main>
`

const form = document.querySelector('#sighting-form')
const sightingsList = document.querySelector('#sightings')
const count = document.querySelector('#count')
const clearAll = document.querySelector('#clear-all')

const formatDate = (date) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${date}T12:00:00`))

const renderSightings = () => {
  count.textContent = sightings.length

  if (sightings.length === 0) {
    sightingsList.innerHTML = '<p class="empty">Nenhum avistamento registrado ainda.</p>'
    return
  }

  sightingsList.innerHTML = sightings
    .map(
      (sighting) => `
        <article class="sighting">
          <div>
            <h3>${sighting.title}</h3>
            <p class="meta">${formatDate(sighting.date)} · ${sighting.place}</p>
          </div>
          <p>${sighting.notes}</p>
        </article>
      `,
    )
    .join('')
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)

  sightings = [
    {
      id: crypto.randomUUID(),
      title: data.get('title').trim(),
      place: data.get('place').trim(),
      date: data.get('date'),
      notes: data.get('notes').trim(),
    },
    ...sightings,
  ]

  saveSightings()
  renderSightings()
  form.reset()
})

clearAll.addEventListener('click', () => {
  sightings = []
  saveSightings()
  renderSightings()
})

renderSightings()
