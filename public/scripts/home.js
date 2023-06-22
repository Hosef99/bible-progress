data.books = JSON.parse(data.books)
data.chapters = JSON.parse(data.chapters)

let state = "Books";
const books = document.querySelector("#Books");
const chapters = document.querySelector("#Chapters");
const verses = document.querySelector("#Verses");

function findVerse(bookId, chapterId){
    for (let i = 0; i < data.chapters.length; i++){
        const element = data.chapters[i]
        if (element.BookID == bookId) {
            if(element.Chapter == chapterId){
                return i
            }
            
        }
    }
}

function hideAll(){
    $("#Books").addClass("hidden");
    $("#Chapters").addClass("hidden");
    $("#Verses").addClass("hidden");
}

//This function only runs once
function loadBooks() {
	for (let i = 0; i < data.books.length; i++) {
        if (i == 39){
            const seperator = document.createElement("hr")
            const title = document.createElement("h2")
            title.textContent = "New Testament"
            books.appendChild(seperator)
            books.appendChild(title)
        }
		const element = data.books[i];
		const book = document.createElement("a");
		book.textContent = element.BookName;
		book.href = "";
		book.dataset.bookId = element.BookID;
		book.classList.add("book-link");
		books.appendChild(book);
	}
    
    $(".book-link").each(function () {
        $(this).on("click", function (event) {
            event.preventDefault();
    
            const bookId = $(this).data("book-id");
            hideAll()
            loadChapters(bookId)
        });
    });
}

function loadChapters(bookId) {
    $("#Chapters").removeClass("hidden").empty()
    const bookTitle = document.createElement("h2");
    bookTitle.textContent = data.books[bookId-1].BookName;
    chapters.appendChild(bookTitle)

    for (let i = 1; i <= data.books[bookId-1].TotalChapters; i++){
        const chapter = document.createElement("a");
        chapter.textContent = i.toString();
        chapter.href = ""
        chapter.dataset.chapterId = i;
        chapter.dataset.bookId = bookId;
        chapter.classList.add("chapter-link");
        chapters.appendChild(chapter)
    }

    $(".chapter-link").each(function () {
        $(this).on("click", function (event) {
            event.preventDefault();
    
            const chapterId = $(this).data("chapter-id");
            hideAll()
            loadVerses(bookId, chapterId)
        });
    });

}

function loadVerses(bookId, chapterId){
    $("#Verses").removeClass("hidden").empty()
    const bookChapterTitle = document.createElement("h2")
    bookChapterTitle.textContent = data.books[bookId-1].BookName + ", Chapter " + chapterId.toString()
    verses.appendChild(bookChapterTitle)

    const index = findVerse(bookId, chapterId);
    const verseNo = data.chapters[index].TotalVerses;
    for (let i = 1; i <= verseNo; i++){
        const verse = document.createElement("a")
        verse.textContent = i.toString();
        verse.href = ""
        verse.dataset.verseId = i;
        verse.dataset.chapterId = chapterId;
        verse.dataset.bookId = bookId;
        verse.classList.add("verse-link")
        verse.appendChild(verse);
    }

    $(".verse-link").each(function () {
        $(this).on("click", function (event) {
            event.preventDefault();
            
            const chapterId = $(this).data("verse-id");
        });
    });
}



loadBooks();

