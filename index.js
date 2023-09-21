const input = document.getElementById("search");
const results = document.getElementById("results");
const repList = document.getElementById("rep-list");
let dataResults = [];
const repArr = new Map();
const fetchRepo = async (name) => {
  const result = {
    data: null,
    error: null,
  };
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${name}`
    );
    const json = await response.json();
    result.data = json.items;
  } catch (e) {
    result.error = e;
  }
  return result;
};
function addRepo(id) {
  if (id) repArr.set(dataResults[id].id, dataResults[id]);
  renderRep();
}
function setResults(data) {
  dataResults = data;
  renderResults({ data: [], error: null });
}
results.addEventListener("click", (e) => {
  const node = e.target;
  if (node.classList.contains("results__item")) {
    const id = node.dataset.id;
    if (id) repArr.set(dataResults[id].id, dataResults[id]);
    input.value = "";
    setResults([]);
    renderRep();
  }
});
function getRepHtml(data) {
  return `<div class="rep-list__item rep-item"> <div class="rep-item__box-data" data-id=${data.id}>
  <div class="rep-item__data" >Name:${data.name}</div>
  <div class="rep-item__data">Owner:${data.owner.login}</div>
  <div class="rep-item__data">Star: ${data.stargazers_count}</div>
</div> <button class="rep-item__button" data-id=${data.id} style="font-size: 30px;">❌</button></div>`;
}
function renderRep() {
  setInner(
    repList,
    [...repArr.values()].map(getRepHtml).join("")
  );
}
repList.addEventListener("click", (e) => {
  const item = e.target;
  if (item.classList.contains("rep-item__button")) {
    const id = item.dataset.id;
    repArr.delete(Number(id));
    renderRep();
  }
});
function validInput(text) {
  return text.trim() != "";
}
input.addEventListener(
  "input",
  debounce(async (e) => {
    const text = e.target.value;
    if (!validInput(text)) {
      dataResults = [];
      return;
    }
    const response = await fetchRepo(text);
    dataResults = response.data;
    renderResults(response);
  }, 100)
);
function setInner(node, html) {
  node.innerHTML = "";
  node.insertAdjacentHTML("afterbegin", html);
}
function renderResults({ data, error }) {
  let html = "";
  if (!error) {
    data.slice(0, 5).forEach((item, i) => {
      html += `<div class="results__item" data-id=${i}>${item.full_name}</div>`;
    });
  } else {
    html = "Oй, что-то пошло не так. Перезагрузите страницу";
  }
  setInner(results, html);
}
function debounce(fn, ms) {
  let timeOut;
  return function(...args) {
    clearTimeout(timeOut)
    timeOut = setTimeout(fn.bind(this,...args),ms)
    
}
}
