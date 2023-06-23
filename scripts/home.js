data.books = JSON.parse(data.books)
data.chapters = JSON.parse(data.chapters)

let userRecord = {}
const books = document.querySelector("#Books");
const chapters = document.querySelector("#Chapters");
const motivatingWords = ["keep it up!", "you've got this!", "stay determined and focused!", "keep the fire burning!", "keep stretching towards the goal!"]

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

function getReadChapters(bookId){
    let totalRead = 0
    let bookName = data.books[bookId-1].BookName;
    if (userRecord[bookName] != null) {
        for (let i = 0; i < data.books[bookId-1].TotalChapters; i++){
            if (userRecord[bookName].verses[i].isRead){
                totalRead++;
            }
        }
        userRecord[bookName].readChapters = totalRead;
        return totalRead;
    }
    else{
        return 0
    }
}

function getTotalRead(){
    let totalRead = 0
    for (let i = 0; i < data.books.length; i++){
        let bookName = data.books[i].BookName;
        if (userRecord[bookName] != null){
            totalRead += userRecord[bookName].readChapters
        }
    }
    return totalRead
}

function hideAll() {
    $("#Books").addClass("hidden");
    $("#Chapters").addClass("hidden");
}

//This function only runs once
function loadBooks() {
    $("#Books").removeClass("hidden");
    $("#Books").empty()
    const progressBar = document.createElement("div")
    const progressDescription = document.createElement("p")
    let total = getTotalRead()
    if (total < 600) {
        progressDescription.textContent = "You have read " + total.toString() + " chapters out of 1189, " + motivatingWords[Math.floor(Math.random()*motivatingWords.length)]
    }
    else if (total < 900) {
        progressDescription.textContent = "You have read " + total.toString() + " chapters out of 1189, you're almost there!"
    }
    else if (total < 1090) {
        progressDescription.textContent = "You have read " + total.toString() + " chapters out of 1189, "+(1189-total).toString()+" more to go, you can do this!"
    }
    else if (total === 1189){
        progressDescription.textContent = "You have finished the bible, you did it!"
    }
    progressBar.innerHTML = "<progress id='bible-progress' value='"+getTotalRead().toString()+"' max='1189'>"+"</progress>";
    const seperator1 = document.createElement("hr")
    const title1 = document.createElement("h2")
    title1.textContent = "Old Testament"
    books.appendChild(progressBar)
    books.appendChild(progressDescription)
    books.appendChild(seperator1)
    books.appendChild(title1)

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
        book.href = "javascript:void(0)";
        book.dataset.bookId = element.BookID;
        book.classList.add("book-link");
        if(userRecord[data.books[i].BookName] != null){
            if (userRecord[data.books[i].BookName].readChapters == parseInt(data.books[i].TotalChapters)) {
                book.classList.add("ticked");
            }
        }
        
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
    let readChapters = 0;
    if (userRecord[data.books[bookId - 1].BookName] != null) {
        addNewRecord = false;
        readChapters = getReadChapters(bookId);
    }
    else {
        userRecord[data.books[bookId - 1].BookName] = {verses: [], readChapters: 0}
        readChapters = 0;
    }
    $("#Chapters").removeClass("hidden").empty()
    const bookTitle = document.createElement("h2");
    const progressBar = document.createElement("div")
    progressBar.classList.add("progress")
    progressBar.innerHTML = "<label for='chapter-progress'>Chapter progress: </label><progress id='chapter-progress' value='"+readChapters.toString()+"' max='"+data.books[bookId-1].TotalChapters+"'>"+"</progress>";
    bookTitle.innerHTML = "<a href='javascript:void(0)'>" + data.books[bookId - 1].BookName + "</a>";
    chapters.appendChild(bookTitle)
    chapters.appendChild(progressBar)

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
            userRecord[data.books[bookId - 1].BookName].verses.push({
                chapter: i,
                isRead: false
            })
        }
        else {
            if (userRecord[data.books[bookId - 1].BookName].verses[i - 1].isRead) {
                chapter.classList.add("ticked")
            }
        }

    }

    $(".chapter-link").each(function () {
        $(this).on("click", function (event) {
            const chapterId = $(this).data("chapter-id");
            userRecord[data.books[bookId - 1].BookName].verses[chapterId - 1].isRead = !userRecord[data.books[bookId - 1].BookName].verses[chapterId - 1].isRead;
            $(this).toggleClass("ticked");
            $("#chapter-progress").attr("value", getReadChapters(bookId));
            console.log(JSON.stringify(userRecord))
            document.cookie = "newRecord=" + JSON.stringify(userRecord)
            
            console.log(document.cookie)
        });
    });

    $("#Chapters h2").on("click", function (event) {
        hideAll()
        loadBooks();
    })
}

try{
    userRecord = JSON.parse(getCookie("newRecord"));
}
catch{

}
loadBooks();

