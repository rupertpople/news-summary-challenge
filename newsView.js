const newsModel = require("./newsModel");
const newsApi = require("./newsApi");

class newsView {
  constructor(model = new newsModel(), api = new newsApi()) {
    this.model = model;
    this.api = api;

    this.mainContainerEl = document.querySelector("#main-container");
    this.searchFieldEl = document.querySelector("#search-field");
    this.searchButtonEl = document.querySelector("#search-button");

    this.searchButtonEl.addEventListener("click", () => {
      let query = this.searchFieldEl.value;
      this.displayNewsFromApi(query);
      this.searchFieldEl.value = "";
    });
  }

  displayNews() {
    this.#clearAll();
    const news = this.model.getNews();

    if (news.length == 0) {
      const newsEl = document.createElement("div");
      newsEl.className = "empty";
      newsEl.innerText = "There were no results matching your search";
      this.mainContainerEl.append(newsEl);
    }

    news.forEach((article) => {
      const newsEl = document.createElement("div");
      newsEl.className = "news";

      const imgEl = document.createElement("img");
      imgEl.className = "image";
      imgEl.src = article.fields.thumbnail;

      const hrefEl = document.createElement("a");
      hrefEl.className = "hyperlink";
      hrefEl.innerText = article.webTitle;
      hrefEl.href = article.webUrl;

      newsEl.append(hrefEl);
      newsEl.append(document.createElement("br"));
      newsEl.append(imgEl);

      this.mainContainerEl.append(newsEl);
    });
  }

  displayNewsFromApi(query) {
    this.api.fetchNews(
      query,
      (data) => {
        this.model.setNews(data);
        this.displayNews();
      },
      () => {
        this.displayError();
      }
    );
  }

  displayError() {
    this.#clearAll();
    let errorElement = document.createElement("div");
    errorElement.className = "error";
    errorElement.innerText = "Oops, something went wrong";
    this.mainContainerEl.append(errorElement);
  }

  #clearAll() {
    const oldNews = document.querySelectorAll("div.news");
    oldNews.forEach((article) => {
      article.remove();
    });
    const oldErrors = document.querySelectorAll("div.error");
    oldErrors.forEach((error) => {
      error.remove();
    });
    const oldEmpty = document.querySelectorAll("div.empty");
    oldEmpty.forEach((empty) => {
      empty.remove();
    });
  }
}

module.exports = newsView;
