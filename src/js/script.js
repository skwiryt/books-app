const select = {
  booksTemplate: '#template-book',
  booksList: '.books-list',
  allBooksImgs: '.book__image',
  filters: '.filters form',
};
const classes = {
  favorite: 'favorite',
  hidden: 'hidden',
};
const data = dataSource.books;
const booksTemplate = Handlebars.compile(document.querySelector(select.booksTemplate).innerHTML);

class BooksList {
  constructor(data) {
    const thisList = this;
    thisList.data = data;
    thisList.filters = [];
    thisList.favoriteBooks = [];

    thisList.getElements();
    thisList.initBooks();
    thisList.initActions();
  }
  getElements() {
    const thisList = this;
    thisList.dom = {};
    thisList.dom.bookList = document.querySelector(select.booksList);
    thisList.dom.filtersForm = document.querySelector(select.filters);  
  }
  initBooks() {
    const thisList = this;
    const bookListElem = thisList.dom.bookList;
    const setRatingStyle  = (rating) => {
      let background = '';
      if (rating > 6) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      if (rating > 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }
      if (rating > 9) {    
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }
      if (rating <= 6) {
     
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      }
      return `style="background: ${background}; width: ${rating * 10}%"`;
    };
    data.forEach((book) => {
      //book.styleAttribute = 'style="background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)"';
      book.styleAttribute = setRatingStyle(book.rating);
      const generatedHtml = booksTemplate(book);
      const bookLiElem = utils.createDOMFromHTML(generatedHtml);
      bookListElem.appendChild(bookLiElem);
    });
  }
  initActions() {
    const thisList = this;
    thisList.dom.bookList.addEventListener('dblclick', (event) => {
      event.preventDefault();
      const element = event.target.parentNode.parentNode;
      let id;
      if (element.classList.contains('book__image')) {
        id = element.getAttribute('data-id');
      }
      if (!thisList.favoriteBooks.includes(id) && id) {
        thisList.favoriteBooks.push(id);
      } else if (id) {
        thisList.removeFromArray(thisList.favoriteBooks, id);
      }
      thisList.showFavorites();
    });
    thisList.dom.filtersForm.addEventListener('click', (event) => {    
      const element = event.target;
      if (element.tagName === 'INPUT' && element.type === 'checkbox' && element.name === 'filter') {
        if (element.checked) {
          thisList.filters.push(element.value);
        }
        else {
          thisList.removeFromArray(thisList.filters, element.value);
        }
      }
      thisList.applyFilters();
    });
  }
  showFavorites() {
    const thisList = this;
    const allBooksElems= document.querySelectorAll(select.allBooksImgs);
    allBooksElems.forEach((bookElem) => bookElem.classList.remove(classes.favorite));
    thisList.favoriteBooks.forEach((id) => {    
      const favoriteBookElem = document.querySelector(`[data-id="${id}"]`);
      favoriteBookElem.classList.add(classes.favorite);
    });
  }
  applyFilters() {
    const thisList = this;
    data.forEach((book) => {
      let listed = true;
      if (thisList.filters.length > 0) {
        listed = false;  
        if (Object.keys(book.details).some((key) => 
          book.details[key] === true && thisList.filters.includes(key)))
        {
          listed = true;
        }
      }
      const bookElem = document.querySelector(`[data-id="${book.id}"`);
      if(listed) {
        bookElem.classList.remove(classes.hidden);
      } else {
        bookElem.classList.add(classes.hidden);
      }
    });  
  }

  removeFromArray(array, element) {
    array.splice(array.indexOf(element), 1);
  }
}

(function() { new BooksList(data); }());


