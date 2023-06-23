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

function replaceString(s, index, replaceChar){
    return s.slice(0,index) + replaceChar + s.slice(index + 1)
}

function getReadChapters(bookId){
    let totalRead = 0
    let bookName = data.books[bookId-1].BookName;
    if (userRecord[bookId] != null) {
        for (let i = 0; i < data.books[bookId-1].TotalChapters; i++){
            if (userRecord[bookId].verses[i].isRead){
                totalRead++;
            }
        }
        userRecord[bookId].readChapters = totalRead;
        return totalRead;
    }
    else{
        return 0
    }
}

function getTotalRead(){
    let totalRead = 0
    for (let i = 0; i < data.books.length; i++){
        if (userRecord[i+1] != null){
            totalRead += parseInt(userRecord[i+1].r)
        }
    }
    return totalRead
}

function listPress(currRead, maxRead) {
    if (currRead == maxRead){
        return 0
    }
    return maxRead
}

function updateAll(){
    // Progress Bar, paragraph, buttons
    $(".main-progress progress").attr("value", getTotalRead().toString())
    let textContent = ""
    let total = getTotalRead()
    if (total < 600) {
        textContent = "You have read " + total.toString() + " chapters out of 1189, " + motivatingWords[Math.floor(Math.random()*motivatingWords.length)]
    }
    else if (total < 900) {
        textContent = "You have read " + total.toString() + " chapters out of 1189, you're almost there!"
    }
    else if (total < 1090) {
        textContent = "You have read " + total.toString() + " chapters out of 1189, "+(1189-total).toString()+" more to go, you can do this!"
    }
    else if (total === 1189){
        textContent = "You have finished the bible, you did it!"
    }
    $("#Books p").innerHTML = textContent;

    for (let i = 1; i <= 66; i++){
        if (userRecord[i] != null){
            if (userRecord[i].r == parseInt(data.books[i-1].TotalChapters)){
                $("a."+i.toString()).addClass("ticked");
            }
            else{
                $("a."+i.toString()).removeClass("ticked");
            }   
        }
    }

    document.cookie = "newRecord=" + JSON.stringify(userRecord)
}

function initRecord(){
    let n = data.books.length
    for (let i = 0; i < n; i++){
        if(userRecord[i+1] == null){
            userRecord[i+1] = {
                v: [],
                r: 0
            }
            let chapterLen = data.books[i].TotalChapters
            for (let j = 0; j < chapterLen; j++){
                userRecord[i+1].v.push({
                    r: 0
                })
            }
        }
    }
}

function hideAll() {
    $("#Books").addClass("hidden");
    $("#Chapters").addClass("hidden");
}

function loadBooks() {
    let listToggle = false;
    $("#Books").removeClass("hidden");
    $("#Books").empty()
    const progressBar = document.createElement("div")
    progressBar.classList.add("main-progress")
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
    const seperator2 = document.createElement("hr")
    const OTTitle = document.createElement("h2")
    const viewToggle = document.createElement("a");
    const linkContainer = document.createElement("div");
    viewToggle.setAttribute("id", "view-toggle")
    viewToggle.textContent = "Toggle List"
    viewToggle.href = "javascript:void(0)"
    OTTitle.textContent = "Old Testament"
    books.appendChild(progressBar)
    books.appendChild(progressDescription)
    books.appendChild(seperator1)
    books.appendChild(viewToggle)
    books.appendChild(seperator2)
    books.appendChild(linkContainer)
    linkContainer.appendChild(OTTitle)
    
    for (let i = 0; i < data.books.length; i++) {
        if (i == 39) {
            const seperator = document.createElement("hr")
            const NTTitle = document.createElement("h2")
            NTTitle.textContent = "New Testament"
            linkContainer.appendChild(seperator)
            linkContainer.appendChild(NTTitle)
        }

        // Expand View
        let currReadChapter = 0
        try {
            currReadChapter = userRecord[i+1].r;
        } catch (error) {
            
        }
        const element = data.books[i];
        const book = document.createElement("a");
        book.textContent = element.BookName;
        book.href = "javascript:void(0)";
        book.dataset.bookId = element.BookID;
        book.classList.add("book-link");
        book.classList.add((i+1).toString())

        if (currReadChapter == parseInt(data.books[i].TotalChapters)) {
            book.classList.add("ticked");
        }
        else{
            book.classList.remove("ticked");
        }
        linkContainer.appendChild(book);

        // List View
        const listItem = document.createElement("a");
        listItem.innerHTML = "<label for='chapter-progress'>"+element.BookName+": </label><progress id='chapter-progress' value='"+currReadChapter+"' max='"+data.books[i].TotalChapters+"'>"+"</progress>";
        listItem.classList.add("list");
        listItem.classList.add("hidden");
        listItem.dataset.bookId = element.BookID;
        listItem.href = "javascript:void(0)"
        linkContainer.appendChild(listItem);
    }

    $("#view-toggle").on('click', function (event) {
        listToggle = !listToggle;
        if(listToggle){
            $(".list").removeClass("hidden");
            $(".book-link").addClass("hidden");
            linkContainer.classList.add("link-container")
        }
        else{
            loadBooks();
        }
    })


    // List item that triggers on click
    $(".list").on("click", function () {
        let readValue = $(this).children("progress").attr("value")
        let maxValue = $(this).children("progress").attr("max")
        readValue = listPress(readValue, maxValue)
        $(this).children("progress").attr("value", readValue)
        const bookId = $(this).data("book-id")
        if (readValue === 0) {  
            for (let i = 0; i < userRecord[bookId].verses.length; i++){
                userRecord[bookId].verses[i].isRead = false;
            }
        }
        else{
            for (let i = 0; i < userRecord[bookId].v.length; i++){
                userRecord[bookId].v[i].r = true;
            }
        }
        userRecord[bookId].r = readValue;
        updateAll()
    })

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
    if (userRecord[bookId] != null) {
        addNewRecord = false;
        readChapters = getReadChapters(bookId);
    }
    else {
        userRecord[bookId] = {v: [], r: 0}
        readChapters = 0;
    }
    $("#Chapters").removeClass("hidden").empty()
    const bookTitle = document.createElement("h2");
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress");
    progressBar.innerHTML = "<label for='chapter-progress'>Chapter progress: </label><progress id='chapter-progress' value='"+readChapters.toString()+"' max='"+data.books[bookId-1].TotalChapters+"'>"+"</progress>";
    bookTitle.innerHTML = "<a href='javascript:void(0)'>" + data.books[bookId - 1].BookName + "</a>";
    chapters.appendChild(bookTitle)
    chapters.appendChild(progressBar)

    for (let i = 1; i <= data.books[bookId - 1].TotalChapters; i++) {
        const chapter = document.createElement("a");
        chapter.textContent = i.toString();
        chapter.href = "#"
        chapter.dataset.chapterId = i;
        chapter.dataset.bookId = bookId;
        chapter.classList.add("chapter-link");
        chapters.appendChild(chapter)
        if (addNewRecord) {
            userRecord[bookId].v.push({
                r: 0
            })
        }
        else {
            if (userRecord[bookId].v[i - 1].r) {
                chapter.classList.add("ticked")
            }
        }
    }

    $(".chapter-link").each(function () {
        $(this).on("click", function (event) {
            const chapterId = $(this).data("chapter-id");
            if (userRecord[bookId].v[chapterId - 1].r == 0){
                userRecord[bookId].v[chapterId - 1].r = 1;
            } else{
                userRecord[bookId].v[chapterId - 1].r = 0;
            }
            
            
            $(this).toggleClass("ticked");
            $("#chapter-progress").attr("value", getReadChapters(bookId));
            updateAll();
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
initRecord();
loadBooks();

