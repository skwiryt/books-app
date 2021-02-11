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

const dom = {
  bookList: document.querySelector(select.booksList),
  filtersForm: document.querySelector(select.filters),

};
const setRatingStyle  =(rating) => {
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
const initBooks = () => {
  const bookListElem = dom.bookList;
  data.forEach((book) => {
    //book.styleAttribute = 'style="background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)"';
    book.styleAttribute = setRatingStyle(book.rating);
    const generatedHtml = booksTemplate(book);
    const bookLiElem = utils.createDOMFromHTML(generatedHtml);
    bookListElem.appendChild(bookLiElem);
  });
};
initBooks();

const favoriteBooks = [];
const filters = [];

const showFavorites = () => {
  const allBooksElems= document.querySelectorAll(select.allBooksImgs);
  allBooksElems.forEach((bookElem) => bookElem.classList.remove(classes.favorite));
  favoriteBooks.forEach((id) => {    
    const favoriteBookElem = document.querySelector(`[data-id="${id}"]`);
    favoriteBookElem.classList.add(classes.favorite);
  });
};
const applyFilters = () => {
  data.forEach((book) => {
    let listed = true;
    if (filters.length > 0) {
      listed = false;  
      if (Object.keys(book.details).some((key) => 
        book.details[key] === true && filters.includes(key)))
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
};
const remove = (array, element) => {
  array.splice(array.indexOf(element), 1);
};
const initActions = () => {   
  dom.bookList.addEventListener('dblclick', (event) => {
    event.preventDefault();
    const element = event.target.parentNode.parentNode;
    let id;
    if (element.classList.contains('book__image')) {
      id = element.getAttribute('data-id');
    }
    if (!favoriteBooks.includes(id) && id) {
      favoriteBooks.push(id);
    } else if (id) {
      remove(favoriteBooks, id);
    }
    showFavorites();
  });
  dom.filtersForm.addEventListener('click', (event) => {    
    const element = event.target;
    if (element.tagName === 'INPUT' && element.type === 'checkbox' && element.name === 'filter') {
      if (element.checked) {
        filters.push(element.value);
      }
      else {
        remove(filters, element.value);
      }
    }
    applyFilters();
  });
};
initActions();

