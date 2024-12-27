document.addEventListener("DOMContentLoaded", function () {
  const BOOKS_KEY = "bookbox";
  const titleInput = document.getElementById("bookFormTitle");
  const authorInput = document.getElementById("bookFormAuthor");
  const yearInput = document.getElementById("bookFormYear");
  const isComplateInput = document.getElementById("bookFormIsComplete");
  const addNewBook = document.getElementById("tambah");
  const findBook = document.getElementById("searchBookTitle");
  const buttonSearch = document.getElementById("searchSubmit");
  const doneBook = document.getElementById("completeBookList");
  const notyetBook = document.getElementById("uncompleteBookList");

  //penyimpanan local
  function saveBooksToLocalStorage(books) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }

  //pengambilan buku di penyimpanan local
  function loadBooksFormLocalStorage() {
    const databooks = localStorage.getItem(BOOKS_KEY);
    return databooks ? JSON.parse(databooks) : [];
  }

  //update rak buku
  function updateBookBox() {
    const books = loadBooksFormLocalStorage();
    doneBook.innerHTML = "";
    notyetBook.innerHTML = "";

    books.forEach((book) => {
      const listbookItem = document.createElement("li");
      listbookItem.innerHTML = ` 
            <div>
                <p>title Buku: ${book.bookFormTitle}</p>
                <p>author Buku: ${book.bookFormAuthor}</p>
                <p>year Buku: ${book.bookFormYear}</p>
            </div>
            <div>
                <button class="move-botton">${
                  book.bookFormIsComplete
                    ? "belum dibaca"
                    : "sudah selesai dibaca"
                }
                </button>
                <button class="delete-botton">Hapus</button>    
            </div>
            `;

      const moveBotton = listbookItem.querySelector(".move-botton");
      moveBotton.addEventListener("click", () => {
        book.bookFormIsComplete = !book.bookFormIsComplete;
        saveBooksToLocalStorage(books);
        updateBookBox();
      });

      const deleteBotton = listbookItem.querySelector(".delete-botton");
      deleteBotton.addEventListener("click", () => {
        const bookIndex = books.findIndex((b) => b.id === book.id);
        if (bookIndex !== -1) {
          books.splice(bookIndex, 1);
          saveBooksToLocalStorage(books);
          updateBookBox();
        }
      });

      if (book.bookFormIsComplete) {
        doneBook.appendChild(listbookItem);
      } else {
        notyetBook.appendChild(listbookItem);
      }
    });
  }

  addNewBook.addEventListener("click", () => {
    const bookFormTitle = titleInput.value;
    const bookFormAuthor = authorInput.value;
    const bookFormYear = parseInt(yearInput.value);
    const bookFormIsComplete = isComplateInput.checked;

    if (bookFormTitle && bookFormAuthor && bookFormYear) {
      const books = loadBooksFormLocalStorage();
      const newBook = {
        id: +new Date(),
        bookFormTitle,
        bookFormAuthor,
        bookFormYear,
        bookFormIsComplete,
      };

      books.push(newBook);
      saveBooksToLocalStorage(books);

      titleInput.value = "";
      authorInput.value = "";
      yearInput.value = "";
      isComplateInput.checked = false;

      updateBookBox();
    }
  });

  buttonSearch.addEventListener("click", () => {
    const searchTerm = findBook.value.toLowerCase();
    const books = loadBooksFormLocalStorage();
    doneBook.innerHTML = "";
    notyetBook.innerHTML = "";

    books.forEach((book) => {
      const { bookFormTitle, bookFormAuthor, bookFormYear } = book;
      const lowercaseTitle = bookFormTitle.toLowerCase();
      const lowercaseAuthor = bookFormAuthor.toLowerCase();
      const yearString = bookFormYear.toString();

      if (
        lowercaseTitle.includes(searchTerm) ||
        lowercaseAuthor.includes(searchTerm) ||
        yearString.includes(searchTerm)
      ) {
        const listbookItem = document.createElement("li");
        listbookItem.innerHTML = `
                <div>
                    <p>Judul Buku: ${book.bookFormTitle}</p>
                    <p>Penulis Buku: ${book.bookFormAuthor}</p>
                    <p>Tahun Terbit: ${book.bookFormYear}</p>
                </div>
                <div>
                <button class="move-botton">${
                  book.bookFormIsComplete
                    ? "belum dibaca"
                    : "sudah selesai dibaca"
                }
                </button>
                <button class="delete-botton">Hapus</button>    
                </div>
                `;

        const moveBotton = listbookItem.querySelector(".move-botton");
        moveBotton.addEventListener("click", () => {
          book.bookFormIsComplete = !book.bookFormIsComplete;
          saveBooksToLocalStorage(books);
          updateBookBox();
        });

        const deleteBotton = listbookItem.querySelector(".delete-botton");
        deleteBotton.addEventListener("click", () => {
          const bookIndex = books.findIndex((b) => b.id === book.id);
          if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            saveBooksToLocalStorage(books);
            updateBookBox();
          }
        });

        if (book.bookFormIsComplete) {
          doneBook.appendChild(listbookItem);
        } else {
          notyetBook.appendChild(listbookItem);
        }
      }
    });
  });

  updateBookBox();
});
