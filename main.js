const baseUrl = "https://api.tvmaze.com/shows";
const cardsContainer = document.querySelector("#cardsContainer");
const moviesCards = [];
const episodesCards = [];
const inputEle = document.querySelector("input[type=search]");
const bigImage = document.querySelector("img[alt=oppenheimer]");
const dropdownMovie = document.querySelector(".dropdownMovie");
const dropdownMovieUl = document.querySelector(".dropdownMovie ul");

async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function makeEpisodesCards(movieId) {
  const episodesUrl = `/${movieId}/episodes`;
  const data = await getData(baseUrl + episodesUrl);
  const liEle = document.createElement("li");
  liEle.innerText = "All Episodes";
  liEle.classList.add("dropdown-item", "text-light", "dropdownLi");
  dropdownMovieUl.append(liEle);
  data.forEach((element) => {
    const movieNameCode = `S${element.season}-E${element.number} ${element.name}`;
    const liEle = document.createElement("li");
    liEle.innerText = movieNameCode;
    liEle.classList.add("dropdown-item", "text-light", "dropdownLi");
    dropdownMovieUl.append(liEle);
    liEle.addEventListener(
      "click",
      () => (dropdownMovie.firstElementChild.innerText = movieNameCode)
    );
    const card = document.createElement("div");
    card.classList.add("hoverShow", "position-relative", "rounded");
    const img = document.createElement("img");
    img.classList.add("w-100", "rounded");
    img.setAttribute("src", element.image.medium);
    const div = document.createElement("div");
    div.classList.add(
      "p-2",
      "w-100",
      "position-absolute",
      "bottom-0",
      "bg-dark",
      "bg-opacity-75"
    );
    const movieName = document.createElement("h6");
    movieName.classList.add("fontsizesmall", "text-start", "m-0");
    movieName.innerText = movieNameCode;
    const summary = document.createElement("div");
    summary.classList.add(
      "summary",
      "w-100",
      "h-100",
      "overflow-auto",
      "bg-dark",
      "position-absolute",
      "bottom-0",
      "left-0",
      "z-0",
      "d-none"
    );
    summary.innerHTML = element.summary;
    div.append(movieName);
    card.append(img, div, summary);
    cardsContainer.append(card);
    episodesCards.push(card);
    summary.addEventListener("click", () => {
      window.location.href = element.url;
    });
  });
}

dropdownMovieUl.addEventListener("click", (e) => {
  episodesCards.forEach((element) => {
    if (
      element.children[1].firstElementChild.innerText.toLowerCase() ==
        e.target.innerText.toLowerCase() ||
      e.target.innerText == "All Episodes"
    ) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
});

async function makeCards() {
  const data = await getData(baseUrl);
  for (let i = 0; i < 20; i++) {
    const card = document.createElement("div");
    card.classList.add("position-relative", "movie", "rounded");
    const img = document.createElement("img");
    img.classList.add("w-100", "rounded");
    img.setAttribute("src", data[i].image.medium);
    const div = document.createElement("div");
    div.classList.add(
      "ps-2",
      "pt-1",
      "w-100",
      "position-absolute",
      "bottom-0",
      "bg-dark",
      "bg-opacity-75"
    );
    const movieName = document.createElement("h6");
    movieName.classList.add("fontsizesmall", "text-start");
    movieName.innerText = data[i].name;
    const movieGenres = document.createElement("h6");
    movieGenres.classList.add("fontsizesmall", "text-start");
    movieGenres.innerText = data[i].genres.join(" | ");
    const movieRate = document.createElement("h6");
    movieRate.classList.add("fontsizesmall", "text-start");
    movieRate.innerText = data[i].rating.average;
    div.append(movieName, movieGenres, movieRate);
    card.append(img, div);
    cardsContainer.append(card);
    moviesCards.push(card);
    card.addEventListener("click", () => {
      const selectedMovieId = data[i].id;
      moviesCards.forEach((element) => {
        element.remove();
      });
      makeEpisodesCards(selectedMovieId);

      inputEle.remove();
      dropdownMovie.style.display = "block";

      bigImage.remove();
      const pEle = document.createElement("p");
      pEle.classList.add("bg-black", "rounded", "mb-4", "p-2", "borderOrange");
      pEle.innerText =
        "TvMaze logo is go back button\nEach episode will open TvMaze website";
      cardsContainer.insertAdjacentElement("beforebegin", pEle);
    });
  }
}
makeCards();

inputEle.addEventListener("input", (e) => {
  moviesCards.forEach((element) => {
    element.lastElementChild.firstElementChild.innerText
      .toLowerCase()
      .includes(e.target.value.toLowerCase())
      ? (element.style.display = "block")
      : (element.style.display = "none");
  });
});
