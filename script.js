// Sample data
const GUIDES = [
  { id: 'bedroom-pastel', title: 'Pastel Bedroom Nook', cover: 'assets/images/guides/bedroom-pastel.webp', alt: 'Soft pastel bedroom with plush rug and fairy lights', tags: ['bedroom','pastel','cute'], checklist: ['Fairy lights above headboard', 'Round fluffy rug', 'Two plant pots (small + medium)', 'Books stack near bed', 'Wall art with hearts or stars'], links: { youtube: '', tiktok: '' } },
  { id: 'kitchen-cozy', title: 'Cozy Tiny Kitchen', cover: 'assets/images/guides/kitchen-cozy.webp', alt: 'Tiny kitchen with soft colors and cute cookware', tags: ['kitchen','tiny','neutral'], checklist: ['Mini stove + kettle', 'Hanging utensils set', 'Two open shelves with jars', 'Fruit bowl on counter', 'Striped floor mat'], links: { youtube: '', tiktok: '' } },
  { id: 'living-plants', title: 'Green Living Corner', cover: 'assets/images/guides/living-plants.webp', alt: 'Living room corner full of plants and a cozy chair', tags: ['living','plants','calm'], checklist: ['Big leafy plant + small succulent', 'Cozy chair with cushion', 'Side table + mug', 'Framed art (leaf or abstract)', 'Small lamp'], links: { youtube: '', tiktok: '' } },
];
const TAGS = ['bedroom','kitchen','living','pastel','plants','seasonal','tiny','neutral','cute','calm'];

// Render helpers
const grid = document.getElementById('grid');
const tagRow = document.getElementById('tagRow');
const search = document.getElementById('search');
const resetBtn = document.getElementById('resetFilters');

const likedKey = 'ap_guide_likes_v1';
let liked = new Set(JSON.parse(localStorage.getItem(likedKey) || '[]'));
let activeTags = new Set();

function saveLikes(){ localStorage.setItem(likedKey, JSON.stringify([...liked])); }

function cardTemplate(g){
  const isLiked = liked.has(g.id);
  const heart = isLiked ? '♥' : '♡';
  return `
  <article class="cozy-card overflow-hidden flex flex-col">
    <div class="relative">
      <img
        src="${g.cover}"
        alt="${g.alt}"
        class="w-full h-40 object-cover border-b-2 border-cozy-stroke"
        onerror="this.onerror=null; this.src='assets/images/guides/placeholder.jpg'; this.classList.add('is-loaded');"
        onload="this.classList.add('is-loaded')"
      />
      <button
        data-like="${g.id}"
        class="like-btn absolute top-2 right-2 bg-white border-2 border-cozy-stroke rounded-full px-2"
        aria-pressed="${isLiked}"
        aria-label="Like ${g.title}"
      >${heart}</button>
    </div>
    <div class="p-4 flex-1 flex flex-col gap-3">
      <h3 class="text-lg font-bold line-clamp-2">${g.title}</h3>
      <div class="flex flex-wrap gap-1 text-xs">
        ${g.tags.map(t => `<span class='px-2 py-1 border-2 border-cozy-stroke bg-white rounded-full'>${t}</span>`).join('')}
      </div>
      <details class="mt-1">
        <summary class="cursor-pointer font-bold">Checklist</summary>
        <ul class="list-disc ml-5 mt-2 text-sm">
          ${g.checklist.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </details>
      <div class="mt-auto flex gap-2 pt-1">
        <button data-copy='${JSON.stringify(g.checklist).replace(/'/g,"&apos;")}' class="btn border-2 border-cozy-stroke bg-cozy-yellow px-3 py-2 rounded-xl font-bold" aria-live="polite">Copy Checklist</button>
        ${g.links.youtube ? `<a href="${g.links.youtube}" target="_blank" rel="noopener noreferrer" class="btn border-2 border-cozy-stroke bg-white px-3 py-2 rounded-xl font-bold">YouTube</a>` : ''}
        ${g.links.tiktok ? `<a href="${g.links.tiktok}" target="_blank" rel="noopener noreferrer" class="btn border-2 border-cozy-stroke bg-white px-3 py-2 rounded-xl font-bold">TikTok</a>` : ''}
      </div>
    </div>
  </article>`;
}

function render(){
  const term = search.value.trim().toLowerCase();
  const list = GUIDES.filter(g => {
    const matchText = (g.title + ' ' + g.tags.join(' ')).toLowerCase();
    const textOk = !term || matchText.includes(term);
    const tagsOk = activeTags.size === 0 || g.tags.some(t => activeTags.has(t));
    return textOk && tagsOk;
  });
  grid.innerHTML = list.map(cardTemplate).join('');
}

function renderTags(){
  tagRow.innerHTML = TAGS.map(t => `<button data-tag='${t}' class='btn px-3 py-2 rounded-full border-2 border-cozy-stroke bg-white font-bold'>${t}</button>`).join('');
}

// Events
document.addEventListener('click', (e) => {
  const likeBtn = e.target.closest('button[data-like]');
  if (likeBtn) {
    const id = likeBtn.getAttribute('data-like');
    if (liked.has(id)) {
      liked.delete(id);
    } else {
      liked.add(id);
    }
    saveLikes();
    render();
    return;
  }

  const copyBtn = e.target.closest('button[data-copy]');
  if (copyBtn) {
    const items = JSON.parse(copyBtn.getAttribute('data-copy'));
    const text = items.map(i => `• ${i}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy Checklist', 900);
    });
    return;
  }

  const tagBtn = e.target.closest('button[data-tag]');
  if (tagBtn) {
    const t = tagBtn.getAttribute('data-tag');
    if (activeTags.has(t)) {
      activeTags.delete(t);
    } else {
      activeTags.add(t);
    }
    tagBtn.classList.toggle('tag-active');
    render();
  }
});

search.addEventListener('input', render);
resetBtn.addEventListener('click', () => {
  search.value = '';
  activeTags.clear();
  [...tagRow.querySelectorAll('button[data-tag]')].forEach(b => b.classList.remove('tag-active'));
  render();
});

document.getElementById('year').textContent = new Date().getFullYear();

renderTags();
render();