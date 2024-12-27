document.addEventListener("DOMContentLoaded", function () {
  const BOOKS_KEY = "bookbox";
  const bookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  // Menyimpan buku ke localStorage
  function saveBooksToLocalStorage(books) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }

  // Memuat buku dari localStorage
  function loadBooksFromLocalStorage() {
    try {
      const books = JSON.parse(localStorage.getItem(BOOKS_KEY));
      return Array.isArray(books) ? books : [];
    } catch {
      return [];
    }
  }

  // Memperbarui daftar buku
  function updateBookLists() {
    const books = loadBooksFromLocalStorage();
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  // Membuat elemen buku
  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    // Tombol toggle selesai/belum selesai
    const toggleButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    // Tombol hapus buku
    const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    return bookItem;
  }

  // Menambah buku baru
  function addBook({ title, author, year, isComplete }) {
    const books = loadBooksFromLocalStorage();
    books.push({
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    });
    saveBooksToLocalStorage(books);
    updateBookLists();
  }

  // Mengubah status selesai/belum selesai
  function toggleBookStatus(bookId) {
    const books = loadBooksFromLocalStorage();
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage(books);
      updateBookLists();
    }
  }

  // Menghapus buku
  function deleteBook(bookId) {
    const books = loadBooksFromLocalStorage();
    const updatedBooks = books.filter((b) => b.id !== bookId);
    saveBooksToLocalStorage(updatedBooks);
    updateBookLists();
  }

  // Mencari buku
  function searchBooks(query) {
    const books = loadBooksFromLocalStorage();
    const lowerCaseQuery = query.toLowerCase();

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      if (
        book.title.toLowerCase().includes(lowerCaseQuery) ||
        book.author.toLowerCase().includes(lowerCaseQuery) ||
        book.year.toString().includes(lowerCaseQuery)
      ) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      }
    });
  }

  // Event listener untuk form tambah buku
  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = bookForm.bookFormTitle.value.trim();
    const author = bookForm.bookFormAuthor.value.trim();
    const year = parseInt(bookForm.bookFormYear.value.trim(), 10);
    const isComplete = bookForm.bookFormIsComplete.checked;

    if (!title || !author || isNaN(year)) {
      alert("Semua kolom wajib diisi dengan benar!");
      return;
    }

    addBook({ title, author, year, isComplete });
    bookForm.reset();
  });

  // Event listener untuk form pencarian
  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchQuery = searchBookForm.searchBookTitle.value.trim();
    if (searchQuery) {
      searchBooks(searchQuery);
    } else {
      updateBookLists();
    }
  });

  // Inisialisasi daftar buku saat halaman dimuat
  updateBookLists();
});
