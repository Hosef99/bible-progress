data.books = JSON.parse(data.books)
data.chapters = JSON.parse(data.chapters)

let userRecord = {}
const books = document.querySelector("#Books");
const chapters = document.querySelector("#Chapters");

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hideAll() {
    $("#Books").addClass("hidden");
    $("#Chapters").addClass("hidden");
}

//This function only runs once
function loadBooks() {
    for (let i = 0; i < data.books.length; i++) {
        if (i == 39) {
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
    let addNewRecord = true;
    if (userRecord[data.books[bookId - 1].BookName] != null) {
        addNewRecord = false;
    }
    else {
        userRecord[data.books[bookId - 1].BookName] = []
    }
    $("#Chapters").removeClass("hidden").empty()
    const bookTitle = document.createElement("h2");
    bookTitle.innerHTML = "<a href='#'>" + data.books[bookId - 1].BookName + "</a>";
    chapters.appendChild(bookTitle)

    for (let i = 1; i <= data.books[bookId - 1].TotalChapters; i++) {
        const chapter = document.createElement("a");
        chapter.textContent = i.toString();
        chapter.href = "#"
        chapter.classList.add("chapter")
        chapter.dataset.chapterId = i;
        chapter.dataset.bookId = bookId;
        chapter.classList.add("chapter-link");
        chapters.appendChild(chapter)
        if (addNewRecord) {
            userRecord[data.books[bookId - 1].BookName].push({
                chapter: i,
                isRead: false
            })
        }
        else {
            if (userRecord[data.books[bookId - 1].BookName][i - 1].isRead) {
                chapter.classList.add("ticked")
            }
        }

    }

    $(".chapter-link").each(function () {
        $(this).on("click", function (event) {
            const chapterId = $(this).data("chapter-id");
            userRecord[data.books[bookId - 1].BookName][chapterId - 1].isRead = !userRecord[data.books[bookId - 1].BookName][chapterId - 1].isRead;
            $(this).toggleClass("ticked");
            document.cookie = "record=" + JSON.stringify(userRecord)
            console.log(document.cookie)
        });
    });

    $("#Chapters h2").on("click", function (event) {
        hideAll()
        $("#Books").removeClass("hidden");
    })
}


if (document.cookie != "") userRecord = JSON.parse(getCookie(document.cookie));
loadBooks();

