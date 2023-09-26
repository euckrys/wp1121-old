const diaryItemTemplate = document.querySelector("#diary-item-template");
const diaryItemDetailsTemplate = document.querySelector("#diary-item-details-template");
const editPageTemplate = document.querySelector("#edit-page-template");

const diaryDetailsPopup = document.querySelector("#diary-details-popup");
const editDetailsPopup = document.querySelector("#edit-details-popup");

const diaryList = document.querySelector(".diary-list");
const diaryDetails = document.querySelector(".diary-details");
const editDetails = document.querySelector(".edit-details");

const filter = document.getElementById("filter");

const instance = axios.create({
    baseURL: "http://localhost:8000/api",
});

async function main() {
    setupEventListeners();
    renderUpdate();
}

async function renderUpdate() {
    const filterName = filter.value;
    try {
        const diarys = await getDiarys();
        diaryList.innerHTML = '';
        diarys.forEach((diary) => {
            if(filterName === diary.tag || filterName === diary.mood || filterName === "全部") {
                renderDiary(diary);
            }
        })
    } catch(error) {
        alert("Failed to load Diary or Filtering Failed!");
        console.log( error.message );
    }
}

function setupEventListeners() {
    const newDiaryButton = document.querySelector(".new-popup-button");
    const newDiaryEntryPopup = document.querySelector("#new-diary-entry-popup");
    const newDiaryClose = document.querySelector("#new-diary-close");
    const dateChoose = document.querySelector("#date-entry");
    const tagChoose = document.querySelector("#tag-entry");
    const moodChoose = document.querySelector("#mood-entry");
    const diaryContentEntry = document.querySelector("#content-entry");
    const saveDiaryButton = document.querySelector(".save-diary-button");
    const cancelAddButton = document.querySelector(".cancel-add-button");
    const diaryDetailsClose = document.querySelector("#diary-details-close");
    const editDetailsClose = document.querySelector("#edit-details-close");

    newDiaryButton.addEventListener('click', () => {
        newDiaryEntryPopup.style.display = 'block';
        const dateObject = new Date();
        const year = dateObject.getFullYear().toString();
        const m = dateObject.getMonth()+1;
        var month;
        if (m < 10) {
            month = `0${m}`;
        } else {
            month = m.toString();
        }
        var date;
        const d = dateObject.getDate();
        if (d < 10) {
            date = `0${d}`;
        } else {
            date = d.toString();
        }
        const string = `${year}-${month}-${date}`;
        dateChoose.value = string;
        tagChoose.value = "選擇";
        moodChoose.value = "選擇";
        diaryContentEntry.value = "";
    });

    newDiaryClose.addEventListener('click', () => {
        newDiaryEntryPopup.style.display = 'none';
    });
    diaryDetailsClose.addEventListener('click', () => {
        diaryDetailsPopup.style.display = 'none';
    })
    editDetailsClose.addEventListener('click', () => {
        editDetailsPopup.style.display = 'none';
    })


    window.addEventListener('click', (event) => {
        if (event.target === newDiaryEntryPopup) {
            newDiaryEntryPopup.style.display = 'none';
        }
        if (event.target === diaryDetailsPopup) {
            diaryDetailsPopup.style.display = 'none';
        }
    });

    saveDiaryButton.addEventListener('click', async () => {
        const date = dateChoose.value;
        const tag = tagChoose.value;
        const mood = moodChoose.value;
        const content = diaryContentEntry.value;

        if (!date) {
            alert("Please choose a date!");
            return;
        }
        if (tag === "選擇") {
            alert("Please choose a tag!");
            return;
        }
        if (mood === "選擇") {
            alert("Please choose a mood!");
            return;
        }
        if (!content) {
            alert("Please enter some content!");
            return;
        }
        try {
            const diary = await createDiary({ date, tag, mood, content });
            renderDiaryDetails(diary);
            renderUpdate();
        } catch (error) {
            alert("Failed to create diary!");
            console.log( error.messasge );
        }
        newDiaryEntryPopup.style.display = 'none';
    });

    cancelAddButton.addEventListener('click', () => {
        newDiaryEntryPopup.style.display = 'none';
    });

    filter.addEventListener('change', async () => {
        const filterName = filter.value;
        try {
            const diarys = await getDiarys();
            diaryList.innerHTML = '';
            diarys.forEach((diary) => {
                if(filterName === diary.tag || filterName === diary.mood || filterName === "全部") {
                    renderDiary(diary);
                }
            })
        } catch(error) {
            alert("Filtering failed!");
            console.log( error.message );
        }
    })
}

function renderDiary(diary) {
    const item = createDiaryElement(diary);
    diaryList.appendChild(item);
}

function createDiaryElement(diary) {
    const item = diaryItemTemplate.content.cloneNode(true);
    const container = item.querySelector(".diary-item");
    container.id = diary.id;
    console.log(diary);
    const date = item.querySelector("#date-preview");
    const year = diary.date.substr(0,4);
    const month = diary.date.substr(5,2);
    const day = diary.date.substr(8,2);
    const dayOfTheWeek = getDay(year, month, day);
    date.innerText = `${year}.${month}.${day} (${dayOfTheWeek})`;
    const tag = item.querySelector("#tag-preview");
    tag.innerText = diary.tag;
    const mood = item.querySelector("#mood-preview");
    mood.innerText = diary.mood;
    const content = item.querySelector("#content-preview");
    if (diary.content.length > 40) {
        content.innerText = `${diary.content.substr(0,40)}...`;
    } else {
        content.innerText = diary.content;
    }

    const viewDetailsButton = item.querySelector(".view-details-button");
    viewDetailsButton.addEventListener('click', () => {
        renderDiaryDetails(diary);
    });
    return item;
}

function renderDiaryDetails(diary) {
    const details = createDetailsElement(diary);
    diaryDetails.innerHTML = '';
    diaryDetails.appendChild(details);
}

function createDetailsElement(diary) {
    const details = diaryItemDetailsTemplate.content.cloneNode(true);
    const container = details.querySelector(".diary-item-details");
    container.id = diary.id;
    const date = details.querySelector("#date-details");
    const year = diary.date.substr(0,4);
    const month = diary.date.substr(5,2);
    const day = diary.date.substr(8,2);
    const dayOfTheWeek = getDay(year, month, day);
    date.innerText = `${year}.${month}.${day} (${dayOfTheWeek})`;
    const tag = details.querySelector("#tag-details");
    tag.innerText = diary.tag;
    const mood = details.querySelector("#mood-details");
    mood.innerText = diary.mood;
    const content = details.querySelector("#content-details");
    content.innerText = diary.content;

    const editButton = details.querySelector(".edit-button");
    editButton.addEventListener('click', () => {
        renderEditPage(diary);
    });

    diaryDetailsPopup.style.display = 'block';
    return details;
}

function renderEditPage(diary) {
    const details = renderEditPageElement(diary);
    editDetails.innerHTML = '';
    editDetails.appendChild(details);
}

function renderEditPageElement(diary) {
    const details = editPageTemplate.content.cloneNode(true);
    const container = details.querySelector(".edit-page");
    container.id = diary.id;
    const dateEditElement = details.querySelector("#date-edit");
    const year = diary.date.substr(0,4);
    const month = diary.date.substr(5,2);
    const date = diary.date.substr(8,2);
    dateEditElement.defaultValue = `${year}-${month}-${date}`;
    const tagEditElement = details.querySelector("#tag-edit");
    tagEditElement.value = diary.tag;
    const moodEditElement = details.querySelector("#mood-edit");
    moodEditElement.value = diary.mood;
    const contentEditElement = details.querySelector("#content-edit");
    contentEditElement.value = diary.content;

    const saveEditButton = details.querySelector(".save-edit-button");
    const cancelEditButton = details.querySelector(".cancel-edit-button");

    saveEditButton.addEventListener('click', async () => {
        const date = dateEditElement.value;
        const tag = tagEditElement.value;
        const mood = moodEditElement.value;
        const content = contentEditElement.value;
        if (!date) {
            alert("Please choose a date!");
            return;
        }
        if (!content) {
            alert("Please enter some content!");
            return;
        }
        try {
            const diary = await updateDiaryStatus(container.id, { date, tag, mood, content });
            renderUpdate();
        } catch (error) {
            alert("Failed to update diary!");
            console.log( error.message );
        }
        editDetailsPopup.style.display = 'none';
    });

    cancelEditButton.addEventListener('click', () => {
        editDetailsPopup.style.display = 'none';
    });

    editDetailsPopup.style.display = 'block';
    return details;
}

function getDay(year, month, date) {
    var y = year;
    var m = month;
    var d = date;

    if (month.substr(0,1) === "0") {
        m = month.substr(1,1)-1;
    }
    if (date.substr(0,1) === "0") {
        d = date.substr(1,1);
    }

    var someDay = new Date(y, m, d);
    var dayOfTheWeek = someDay.getDay();
    var dayOfTheWeekChinese;
    switch(dayOfTheWeek) {
        case 0:
            dayOfTheWeekChinese = "日";
            break;
        case 1:
            dayOfTheWeekChinese = "一";
            break;
        case 2:
            dayOfTheWeekChinese = "二";
            break;
        case 3:
            dayOfTheWeekChinese = "三";
            break;
        case 4:
            dayOfTheWeekChinese = "四";
            break;
        case 5:
            dayOfTheWeekChinese = "五";
            break;
        case 6:
            dayOfTheWeekChinese = "六";
            break;
    }
    return dayOfTheWeekChinese;
}

async function getDiarys() {
    const response = await instance.get("/diarys");
    return response.data;
}

async function createDiary(diary) {
    const response = await instance.post("/diarys", diary);
    return response.data;
}

async function updateDiaryStatus(id, diary) {
    const response = await instance.put(`/diarys/${id}`, diary);
    renderDiaryDetails(diary);
    return response.data;
}

main();