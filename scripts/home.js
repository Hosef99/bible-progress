data.books = JSON.parse(data.books);
data.chapters = JSON.parse(data.chapters);

let userRecord = [];
const books = document.querySelector("#Books");
const chapters = document.querySelector("#Chapters");
const motivatingWords = [
	"keep it up!",
	"you've got this!",
	"stay determined and focused!",
	"keep the fire burning!",
	"keep stretching towards the goal!",
];

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function repS(s, index, replaceChar) {
	return s.slice(0, index) + replaceChar + s.slice(index + 1);
}

function getReadChapters(bookId) {
	let totalRead = 0;

	totalRead = (userRecord[bookId].match(/1/g) || []).length;
	return totalRead;
}

function getTotalRead() {
	let totalRead = 0;
	for (let i = 0; i < data.books.length; i++) {
		totalRead += getReadChapters(i);
	}
	return totalRead;
}

function listPress(currRead, maxRead) {
	if (currRead == maxRead) {
		return 0;
	}
	return maxRead;
}

function saveCookie() {
	document.cookie = "progress=" + JSON.stringify(userRecord);
}

function updateAll() {
	// Progress Bar, paragraph, buttons
	$(".main-progress progress").attr("value", getTotalRead().toString());
	let textContent = "";
	let total = getTotalRead();
	if (total < 600) {
		textContent =
			"You have read " +
			total.toString() +
			" chapters out of 1189, " +
			motivatingWords[Math.floor(Math.random() * motivatingWords.length)];
	} else if (total < 900) {
		textContent =
			"You have read " +
			total.toString() +
			" chapters out of 1189, you're almost there!";
	} else if (total < 1190) {
		textContent =
			"You have read " +
			total.toString() +
			" chapters out of 1189, " +
			(1189 - total).toString() +
			" more to go, you can do this!";
	} else if (total === 1189) {
		textContent = "You have finished the bible, you did it!";
	}

	$(".motivation").text(textContent);

	for (let i = 1; i <= 66; i++) {
		if (
			getReadChapters(i - 1) == parseInt(data.books[i - 1].TotalChapters)
		) {
			$("a." + i.toString()).addClass("ticked");
		} else {
			$("a." + i.toString()).removeClass("ticked");
		}
	}

	saveCookie();
}

function initRecord() {
	let n = data.books.length;
	for (let i = 0; i < n; i++) {
		if (userRecord[i] == null) {
			userRecord[i] = "0".repeat(data.books[i].TotalChapters);
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
	$("#Books").empty();
	const progressBar = document.createElement("div");
	progressBar.classList.add("main-progress");
	const progressDescription = document.createElement("p");
	let total = getTotalRead();
	if (total < 600) {
		progressDescription.textContent =
			"You have read " +
			total.toString() +
			" chapters out of 1189, " +
			motivatingWords[Math.floor(Math.random() * motivatingWords.length)];
	} else if (total < 900) {
		progressDescription.textContent =
			"You have read " +
			total.toString() +
			" chapters out of 1189, you're almost there!";
	} else if (total < 1090) {
		progressDescription.textContent =
			"You have read " +
			total.toString() +
			" chapters out of 1189, " +
			(1189 - total).toString() +
			" more to go, you can do this!";
	} else if (total === 1189) {
		progressDescription.textContent =
			"You have finished the bible, you did it!";
	}
	progressDescription.classList.add("motivation");
	progressBar.innerHTML =
		"<progress id='bible-progress' value='" +
		getTotalRead().toString() +
		"' max='1189'>" +
		"</progress>";
	const seperator1 = document.createElement("hr");
	const seperator2 = document.createElement("hr");
	const OTTitle = document.createElement("h2");
	const viewToggle = document.createElement("a");
	const OTContainer = document.createElement("div");
	const NTContainer = document.createElement("div");
	const seperator = document.createElement("hr");
	const NTTitle = document.createElement("h2");
	NTTitle.textContent = "New Testament";
	viewToggle.setAttribute("id", "view-toggle");
	viewToggle.textContent = "Toggle List";
	viewToggle.href = "javascript:void(0)";
	OTTitle.textContent = "Old Testament";

	books.appendChild(progressBar);
	books.appendChild(progressDescription);
	books.appendChild(seperator1);
	books.appendChild(viewToggle);
	books.appendChild(seperator2);
	books.appendChild(OTContainer);
	books.appendChild(seperator);
	books.appendChild(NTContainer);
	OTContainer.appendChild(OTTitle);
	NTContainer.appendChild(NTTitle);
	const clusterOTContainer = document.createElement("div");
	const listOTContainer = document.createElement("div")
    const clusterNTContainer = document.createElement("div");
	const listNTContainer = document.createElement("div")
    listOTContainer.classList.add("list-container")
    listOTContainer.classList.add("hidden")
    listNTContainer.classList.add("list-container")
    listNTContainer.classList.add("hidden")
    clusterOTContainer.classList.add("cluster");
    OTContainer.appendChild(clusterOTContainer)
    OTContainer.appendChild(listOTContainer)
NTContainer.appendChild(clusterNTContainer)
NTContainer.appendChild(listNTContainer)

	for (let i = 0; i < data.books.length; i++) {
		if (i == 39) {
		}

		// Expand View
		if (i < 39) {
			let currReadChapter = 0;
			try {
				currReadChapter = getReadChapters(i);
			} catch (error) {}
			const element = data.books[i];
			const book = document.createElement("a");
			book.textContent = element.BookName;
			book.href = "javascript:void(0)";
			book.dataset.bookId = i;
			book.classList.add("book-link");
			book.classList.add((i + 1).toString());

			if (currReadChapter == parseInt(data.books[i].TotalChapters)) {
				book.classList.add("ticked");
			} else {
				book.classList.remove("ticked");
			}
			clusterOTContainer.appendChild(book);

			// List View
			const listItem = document.createElement("a");
			listItem.innerHTML =
				"<label for='chapter-list-progress'>" +
				element.BookName +
				": </label><progress id='chapter-list-progress' value='" +
				currReadChapter +
				"' max='" +
				data.books[i].TotalChapters +
				"'>" +
				"</progress>";
			listItem.classList.add("list");
			listItem.classList.add("hidden");
			listItem.dataset.bookId = i;
			listItem.href = "javascript:void(0)";
			listOTContainer.appendChild(listItem);
		} else {
			let currReadChapter = 0;
			try {
				currReadChapter = getReadChapters(i);
			} catch (error) {}
			const element = data.books[i];
			const book = document.createElement("a");
			book.textContent = element.BookName;
			book.href = "javascript:void(0)";
			book.dataset.bookId = i;
			book.classList.add("book-link");
			book.classList.add((i + 1).toString());

			if (currReadChapter == parseInt(data.books[i].TotalChapters)) {
				book.classList.add("ticked");
			} else {
				book.classList.remove("ticked");
			}
			clusterNTContainer.appendChild(book);

			// List View
			const listItem = document.createElement("a");
			listItem.innerHTML =
				"<label for='chapter-list-progress'>" +
				element.BookName +
				": </label><progress id='chapter-list-progress' value='" +
				currReadChapter +
				"' max='" +
				data.books[i].TotalChapters +
				"'>" +
				"</progress>";
			listItem.classList.add("list");
			listItem.classList.add("hidden");
			listItem.dataset.bookId = i;
			listItem.href = "javascript:void(0)";
			listNTContainer.appendChild(listItem);
		}
	}

	$("#view-toggle").on("click", function (event) {
		listToggle = !listToggle;
		if (listToggle) {
			$(".list").removeClass("hidden");
			clusterOTContainer.classList.add("hidden")
            clusterNTContainer.classList.add("hidden")
			listOTContainer.classList.remove("hidden");
			listNTContainer.classList.remove("hidden");
		} else {
            clusterOTContainer.classList.remove("hidden")
            clusterNTContainer.classList.remove("hidden")
			listOTContainer.classList.add("hidden");
			listNTContainer.classList.add("hidden");
		}
	});

	// List item that triggers on click
	$(".list").on("click", function () {
		const bookId = $(this).data("book-id");
		let maxValue = data.books[bookId].TotalChapters;
		readValue = listPress(getReadChapters(bookId), maxValue);
		$(this).children("progress").attr("value", readValue);
		$(this).children("progress").attr("max", maxValue);
		let bookLength = data.books[bookId].TotalChapters;
		if (readValue === 0) {
			userRecord[bookId] = "0".repeat(bookLength);
		} else {
			userRecord[bookId] = "1".repeat(bookLength);
		}
		updateAll();
	});

	$(".book-link").each(function () {
		$(this).on("click", function (event) {
			event.preventDefault();

			const bookId = $(this).data("book-id");
			hideAll();
			loadChapters(bookId);
		});
	});
	updateAll();
}

function loadChapters(bookId) {
	$("#Chapters").removeClass("hidden").empty();
	const bookTitle = document.createElement("h2");
	const progressBar = document.createElement("div");
	progressBar.classList.add("progress");
	console.log(bookId);
	progressBar.innerHTML =
		"<label for='chapter-progress'>Chapter progress: </label><progress id='chapter-progress' value='" +
		getReadChapters(bookId).toString() +
		"' max='" +
		data.books[bookId].TotalChapters +
		"'>" +
		"</progress>";
	bookTitle.innerHTML =
		"<a href='javascript:void(0)'>" + data.books[bookId].BookName + "</a>";
	chapters.appendChild(bookTitle);
	chapters.appendChild(progressBar);

	for (let i = 0; i < data.books[bookId].TotalChapters; i++) {
		const chapter = document.createElement("a");
		chapter.textContent = (i + 1).toString();
		chapter.href = "#";
		chapter.dataset.chapterId = i;
		chapter.dataset.bookId = bookId;
		chapter.classList.add("chapter-link");
		chapters.appendChild(chapter);

		if (userRecord[bookId][i] == "1") {
			chapter.classList.add("ticked");
		}
	}

	$(".chapter-link").each(function () {
		$(this).on("click", function (event) {
			const chapterId = $(this).data("chapter-id");
			if (userRecord[bookId][chapterId] == "0") {
				userRecord[bookId] = repS(userRecord[bookId], chapterId, "1");
			} else {
				userRecord[bookId] = repS(userRecord[bookId], chapterId, "0");
			}

			$(this).toggleClass("ticked");
			$("#chapter-progress").attr("value", getReadChapters(bookId));
			console.log($("#chapter-progress").attr("value"));
			saveCookie();
		});
	});

	$("#Chapters h2").on("click", function (event) {
		hideAll();
		loadBooks();
	});
}

try {
	userRecord = JSON.parse(getCookie("progress"));
} catch {}
initRecord();
loadBooks();
