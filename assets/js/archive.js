(() => {
  const grid = document.querySelector('[data-project-grid]');
  const toolbar = document.querySelector('[data-project-toolbar]');
  if (!grid) return;
  const projects = window.PORTFOLIO_PROJECTS || [];
  const filters = document.querySelector('[data-project-filters]');
  const search = document.querySelector('[data-project-search]');
  const count = document.querySelector('[data-project-count]');
  const empty = document.querySelector('[data-project-empty]');
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const asset = slug => `/assets/images/projects/${slug}`;
  const makeCard = project => `
    <article class="work-card" data-project-card data-category="${escape(project.category)}" data-search="${escape([project.title, project.summary, project.categoryLabel, ...project.stack].join(' ').toLowerCase())}">
      <a class="work-card-link" href="/projects/${escape(project.slug)}.html" aria-label="Read the ${escape(project.title)} case study">
        <div class="work-card-media"><img src="${asset(project.media[0])}" alt="${escape(project.mediaAlt[0])}" loading="lazy" width="960" height="600"><span class="media-label">Project preview</span></div>
        <div class="work-card-content"><div class="work-card-meta"><span>${escape(project.categoryLabel)}</span><span class="status"><i aria-hidden="true"></i>${escape(project.status)}</span></div><h2>${escape(project.title)}</h2><p>${escape(project.summary)}</p><div class="work-card-foot"><span>${project.stack.slice(0,3).map(escape).join(' · ')}</span></div></div>
      </a>
    </article>`;
  grid.innerHTML = projects.map(makeCard).join('');
  if (toolbar) toolbar.hidden = false;
  if (filters) {
    const categories = window.PROJECT_CATEGORIES || [];
    filters.innerHTML = categories.map((cat,index) => `<button class="filter-chip" type="button" data-filter="${escape(cat.id)}" aria-pressed="${index===0?'true':'false'}">${escape(cat.label)}</button>`).join('');
  }
  let activeCategory = 'all';
  function update() {
    const term = (search?.value || '').trim().toLocaleLowerCase();
    let shown = 0;
    grid.querySelectorAll('[data-project-card]').forEach(card => {
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const searchMatch = !term || card.dataset.search.includes(term);
      card.hidden = !(categoryMatch && searchMatch);
      if (!card.hidden) shown++;
    });
    if (count) count.textContent = `${shown} ${shown === 1 ? 'project' : 'projects'} shown`;
    if (empty) empty.hidden = shown !== 0;
  }
  filters?.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeCategory = button.dataset.filter;
    filters.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update();
  });
  search?.addEventListener('input', update);
  update();
})();
