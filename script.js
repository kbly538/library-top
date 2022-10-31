function Book(title, author, numberOfPages, isRead = false) {
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.isRead = isRead;
    this.bookId = 0;
    this.listed = false;
    this.info = () => {
        return `${this.title} by ${this.author} has ${this.numberOfPages} pages and you ` + (this.isRead === true ? 'have read it.' : "haven't read it yet.");
    };

}
function Library() {
    this.books = [];
    this.lastIndex = 0;
    this.totalNumOfBooks = () => { return this.books.length };
    this.longestBook = () => { return this.books.sort((a, b) => b.numberOfPages - a.numberOfPages)[0].title };
    this.numOfBooksRead = () => { return this.books.reduce((total, book) => book.isRead ? total + 1 : total, 0) };
    this.stats = () => {
        return `Number of books: ${this.totalNumOfBooks()}\n` +
            `Longest Book: ${this.longestBook()}\n` +
            `Number of books read: ${this.numOfBooksRead()}`


    };
}

let bookGrid;
let container;
let bookForm;
let formWrapper;
let libraryImpl;
let errMessage;
const brand = document.querySelector(".brand")
const stats = document.querySelector(".stats")
const newBookButton = document.querySelector(".add-new-book-button")




// ADD BOOK

function addBook(library, title, author, pages, isRead = false) {

    let isDuplicate = library.books.filter((book) => book.title === title).length >= 1 ? true : false;

    if (isDuplicate) {
        alert(`${book.title} is already in the list.`)
        return;
    }


    let book = new Book(title, author, pages, isRead);
    book.bookId = library.lastIndex++;
    library.books.push(book);
}

// UPDATE UI

function updateUI() {

    clearBookGrid();
    for (let book of libraryImpl.books){
        createBookCard(book)
    }

}

function clearBookGrid(){
    bookGrid.innerHTML = ""
}

// CREATE BOOK CARD

function createBookCard(book) {
    const bookCard = document.createElement("div");
    const title = document.createElement("p");
    const author = document.createElement("p");
    const numberOfPages = document.createElement("p");

    const readingStatus = document.createElement("button");
    readingStatus.type = "button"
    readingStatus.classList.add(book.isRead? "read" : "not-read");
    readingStatus.addEventListener("click", function(){
        if (readingStatus.classList.contains("not-read")){
            readingStatus.classList.remove("not-read");
            readingStatus.classList.add("read");
            readingStatus.textContent = "Read";
        } else {
            readingStatus.classList.remove("read");
            readingStatus.classList.add("not-read");
            readingStatus.textContent = "Not read";

        }
    })

    const removeButton = document.createElement("button");
    readingStatus.type = "button"
    removeButton.textContent = "Remove"
    removeButton.dataset.bookId = book.bookId;
    removeButton.addEventListener("click", (e)=> {
        const selectedBook = libraryImpl.books.filter(b => {
            if (b.bookId == e.target.dataset.bookId) return b;
        })[0];
        libraryImpl.books.splice(libraryImpl.books.indexOf(selectedBook),1);
        updateUI()
    })
    
    
    bookCard.classList.add("book-card");
    title.textContent = book.title;
    author.textContent = book.author;
    numberOfPages.textContent = `${book.numberOfPages} pg.`
    readingStatus.textContent = book.isRead === true? "Read" : "Not Read";


    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(numberOfPages);
    bookCard.appendChild(readingStatus);
    bookCard.appendChild(removeButton)

    bookCard.dataset.bookIndex = libraryImpl.books.indexOf(book);
    bookGrid.appendChild(bookCard);
}

// UPDATE LIBRARY

function updateLibrary(book) {
    book.listed = true;
}

// GET USER INPUT

function getUserInput(e) {


    const titleInput = document.querySelector("#title-input");
    const authorInput = document.querySelector("#author-input");
    const pagesInput = document.querySelector("#pages-input");
    const readingStatusInput = document.querySelector("#reading-status-input");


   
    errMessage = document.querySelector(".error-message")
    

    if (!titleInput.value || !authorInput.value || !pagesInput.value){
        errMessage.classList.remove("inactive")
        errMessage.classList.add("active");
        return;
    }

    const title = titleInput.value;
    const author = authorInput.value;
    const pages = pagesInput.value;
    const read = readingStatusInput.classList.contains("read");

    errMessage.classList.remove("active");
    errMessage.classList.add("inactive");

    

    addBook(libraryImpl, title, author, pages, read)
    updateUI();
    e.preventDefault();

}

// RESET AND CLOSE FORM

function cancelForm(e){
    bookForm.reset();
    formWrapper.style.display = ""
    if(errMessage !== undefined){
        errMessage.classList.remove("active");
        errMessage.classList.add("inactive");
    }
}

// CREATE FORM
function createAuthorInput() {

    const authorLabel = document.createElement("label");
    authorLabel.htmlFor = "author-input";
    const authorInput = document.createElement("input");
    authorInput.type = "text"
    authorInput.id = "author-input"
    authorInput.placeholder = "Enter the author"
    authorInput.required = true;

    authorLabel.appendChild(authorInput);

    return authorLabel;

}

function createTitleInput() {
    const titleLabel = document.createElement("label");
    titleLabel.htmlFor = "title-input";
    const titleInput = document.createElement("input");
    titleInput.type = "text"
    titleInput.id = "title-input"
    titleInput.placeholder = "Enter the title"
    titleInput.required = true;

    titleLabel.appendChild(titleInput);

    return titleLabel;
}

function createPagesInput() {

    const pagesLabel = document.createElement("label");
    pagesLabel.htmlFor = "pages-input";

    const pagesInput = document.createElement("input");
    pagesInput.type = "number"
    pagesInput.id = "pages-input"
    pagesInput.placeholder = "Total Pages"
    pagesInput.required = true;

    pagesLabel.appendChild(pagesInput);

    return pagesLabel;

}

function createReadingStatusInput() {
    const readingStatusLabel = document.createElement("label");
    readingStatusLabel.htmlFor = "reading-status-input";
    const readingStatusButton = document.createElement("button");
    readingStatusButton.id = "reading-status-input"
    readingStatusButton.type = "button"
    readingStatusButton.textContent = "Read it?"
    readingStatusButton.addEventListener("click", function(){

        if (readingStatusButton.classList.contains("not-read")){
            readingStatusButton.classList.remove("not-read");
            readingStatusButton.classList.add("read");
            readingStatusButton.textContent = "Read";
        } else {
            readingStatusButton.classList.remove("read");
            readingStatusButton.classList.add("not-read");
            readingStatusButton.textContent = "Not read";

        }
    })


    readingStatusLabel.appendChild(readingStatusButton);

    return readingStatusLabel;
}

function createFormButtons() {

    //Add Button
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.innerText = "Add Book";
    addButton.addEventListener("click", getUserInput)
    
    // Cancel Form Button
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.innerText = "Cancel"
    cancelButton.addEventListener("click", cancelForm)

    return { addButton, cancelButton }
}

function createBookForm(action) {
    const formWrapper = document.createElement("div");
    formWrapper.classList.add("form-wrapper")
    const form = document.createElement("form");
    form.action = action;

    form.appendChild(createTitleInput());
    form.appendChild(createAuthorInput());
    form.appendChild(createPagesInput());
    form.appendChild(createReadingStatusInput());
    const { addButton, cancelButton } = createFormButtons();
    form.appendChild(addButton);
    form.appendChild(cancelButton);

    const errMessage = document.createElement("p");
    errMessage.textContent = "All fields are required."
    errMessage.classList.add("error-message", "inactive")
    form.appendChild(errMessage);
    

    formWrapper.appendChild(form);

    container.appendChild(formWrapper);
}

function initializeLibrary() {

    // Create Library
    libraryImpl = new Library();

    // SEED LIBRARY
    // ............

    // Get container div
    container = document.querySelector(".container");

    // Create form
    createBookForm("/")

    // Get form wrapper
    formWrapper = document.querySelector(".form-wrapper");

    // Get form
    bookForm = document.querySelector("form");

    // Get book grid
    bookGrid = document.querySelector(".book-grid");

    // Setup new book button
    newBookButton.addEventListener("click", ()=>{
        formWrapper.style.display = "flex";
    })

    updateUI();

}

initializeLibrary();

