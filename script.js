class Book {
    constructor(title, author, numberOfPages, isRead = false) {
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.isRead = isRead;
        this.bookId = 0;
        this.listed = false;
    }

    info() {
        return `${this.title} by ${this.author} has ${this.numberOfPages} pages and you ` + (this.isRead === true ? 'have read it.' : "haven't read it yet.");
    };
}
class Library {

    // GODLIKE LIBRARY CLASS. Why?
    // Quick refactorization of traditional function oriented program 
    // into newly acquired class syntax as part of a practice assignment in The Odin Project

    constructor() {
        this.books = [];
        this.lastIndex = 0;
        this.bookForm = document.querySelector("form");
        this.bookGrid = document.querySelector(".book-grid");
        this.container = document.querySelector(".container");
        this.formWrapper = document.querySelector(".form-wrapper");
        this.errMessage = document.querySelector(".error-message");
        this.brand = document.querySelector(".brand")
        this.stats = document.querySelector(".stats")
        this.newBookButton = document.querySelector(".add-new-book-button")
        this.createBookForm("/")
        this.addListener();
    }

    addListener() {
        this.newBookButton.addEventListener("click", () => {
            this.formWrapper.style.display = "flex";
        })
    }

    totalNumOfBooks() { return this.books.length };
    longestBook() { return this.books.sort((a, b) => b.numberOfPages - a.numberOfPages)[0].title };
    numOfBooksRead() { return this.books.reduce((total, book) => book.isRead ? total + 1 : total, 0) };
    stats() {
        return `Number of books: ${this.totalNumOfBooks()}\n` +
            `Longest Book: ${this.longestBook()}\n` +
            `Number of books read: ${this.numOfBooksRead()}`
    };

    addBook(title, author, pages, isRead = false) {
        let isDuplicate = this.books.filter((book) => book.title === title).length >= 1 ? true : false;

        if (isDuplicate) {
            alert(`${book.title} is already in the list.`)
            return;
        }


        let book = new Book(title, author, pages, isRead);
        book.bookId = this.lastIndex++;
        this.books.push(book);
    }

    updateUI() {

        this.clearBookGrid();
        for (let book of this.books) {
            this.createBookCard(book)
        }

    }


    clearBookGrid() {
        this.bookGrid.innerHTML = ""
    }

    createBookCard(book) {
        const bookCard = document.createElement("div");
        const title = document.createElement("p");
        const author = document.createElement("p");
        const numberOfPages = document.createElement("p");

        const readingStatus = document.createElement("button");
        readingStatus.type = "button"
        readingStatus.classList.add(book.isRead ? "read" : "not-read");
        readingStatus.addEventListener("click", function () {
            if (readingStatus.classList.contains("not-read")) {
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
        removeButton.addEventListener("click", (e) => {
            const selectedBook = this.books.filter(b => {
                if (b.bookId == e.target.dataset.bookId) return b;
            })[0];
            this.books.splice(this.books.indexOf(selectedBook), 1);
            updateUI()
        })


        bookCard.classList.add("book-card");
        title.textContent = book.title;
        author.textContent = book.author;
        numberOfPages.textContent = `${book.numberOfPages} pg.`
        readingStatus.textContent = book.isRead === true ? "Read" : "Not Read";


        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(numberOfPages);
        bookCard.appendChild(readingStatus);
        bookCard.appendChild(removeButton)

        bookCard.dataset.bookIndex = this.books.indexOf(book);
        this.bookGrid.appendChild(bookCard);
    }

    updateLibrary(book) {
        book.listed = true;
    }

    getUserInput(e) {

        const errMessage = document.querySelector(".error-message");
        const titleInput = document.querySelector("#title-input");
        const authorInput = document.querySelector("#author-input");
        const pagesInput = document.querySelector("#pages-input");
        const readingStatusInput = document.querySelector("#reading-status-input");

        if (!titleInput.value || !authorInput.value || !pagesInput.value) {
            errMessage.classList.remove("inactive")
            errMessage.classList.add("active");
            return;
        }

        const title = titleInput.value;
        const author = authorInput.value;
        const pages = pagesInput.value;
        const read = readingStatusInput.classList.contains("read");

        this.errMessage = errMessage;
        this.errMessage.classList.remove("active");
        this.errMessage.classList.add("inactive");



        this.addBook(title, author, pages, read);
        this.updateUI();
        

        e.preventDefault();

    }


    createAuthorInput() {

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

    createBookForm(action) {
        const formWrapper = document.createElement("div");
        formWrapper.classList.add("form-wrapper")
        const form = document.createElement("form");
        form.action = action;
        
        form.appendChild(this.createTitleInput());
        form.appendChild(this.createAuthorInput());
        form.appendChild(this.createPagesInput());
        form.appendChild(this.createReadingStatusInput());
        const { addButton, cancelButton } = this.createFormButtons();
        form.appendChild(addButton);
        form.appendChild(cancelButton);
        
        const errMessage = document.createElement("p");
        errMessage.textContent = "All fields are required."
        errMessage.classList.add("error-message", "inactive")
        this.errMessage = errMessage
        form.appendChild(errMessage);


        formWrapper.appendChild(form);
        
        this.bookForm = form;
        this.container.appendChild(formWrapper);
        this.formWrapper = formWrapper;

    }

    createFormButtons() {

        //Add Button
        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.innerText = "Add Book";
        addButton.addEventListener("click", (e)=>this.getUserInput(e))

        // Cancel Form Button
        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.innerText = "Cancel"
        this.cancelButton = cancelButton;
        this.cancelButton.addEventListener("click", (e)=>{
            this.bookForm.reset();
            this.formWrapper.style.display = ""
            if (this.errMessage !== undefined) {
                this.errMessage.classList.remove("active");
                this.errMessage.classList.add("inactive");
            }
        })

        return { addButton, cancelButton }
    }

    createTitleInput() {
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

    createPagesInput() {

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

    createReadingStatusInput() {
        const readingStatusLabel = document.createElement("label");
        readingStatusLabel.htmlFor = "reading-status-input";
        const readingStatusButton = document.createElement("button");
        readingStatusButton.id = "reading-status-input"
        readingStatusButton.type = "button"
        readingStatusButton.textContent = "Read it?"
        readingStatusButton.addEventListener("click", function () {

            if (readingStatusButton.classList.contains("not-read")) {
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

}

let libraryImpl = new Library();

