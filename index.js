let input = document.getElementById("search");
let results = document.getElementById("results");
let repList = document.getElementById("rep-list");
console.log(input, results);
let dataResults = [];
let repArr = new Map();
let fetchRepo = async (name) => {
  let response = await fetch(
    `https://api.github.com/search/repositories?q=${name}`
  );
  let json = await response.json();
  return json;
};
results.addEventListener("click", (e) => {
  let node = e.target;
  if (node.classList.contains("results__item")) {
    let id = node.dataset.id;
    if (id) repArr.set(dataResults[id].id, dataResults[id]);
    dataResults = [];
    renderResults();
    input.value = "";
    renderRep();
  }
});
function renderRep() {
  repList.innerHTML = [...repArr.values()]
    .map(
      (
        el,
        i
      ) => `<div class="rep-list__item rep-item"> <div class="rep-item__box-data" data-id=${el.d}>
    <div class="rep-item__data" >Name:${el.name}</div>
    <div class="rep-item__data">Owner:${el.owner.login}</div>
    <div class="rep-item__data">Star: ${el.stargazers_count}</div>
</div> <button class="rep-item__button" data-id=${el.id} style="font-size: 30px;">❌</button></div>`
    )
    .join("");
}
repList.addEventListener("click", (e) => {
  let item = e.target;
  if (item.classList.contains("rep-item__button")) {
    let id = item.dataset.id;
    repArr.delete(Number(id));
    renderRep();
  }
});
input.addEventListener(
  "input",
  debounce(async (e) => {
    console.log("inpu");
    let text = e.target.value;
    if (text) {
      let data = await fetchRepo(text);
      dataResults = data.items.slice(0, 5);
      console.log(dataResults);
    } else {
      dataResults = [];
    }
    renderResults();
  }, 100)
);
function renderResults() {
  let html = "";
  dataResults.forEach((item, i) => {
    html += `<div class="results__item" data-id=${i}>${item.full_name}</div>`;
  });
  results.innerHTML = html;
}
function debounce(fn, ms) {
  let timeOut;
  return function (...args) {
    clearTimeout(timeOut);
    return new Promise((res) => {
      timeOut = setTimeout(() => {
        res(fn.call(this, ...args));
      }, ms);
    });
  };
}
