const root = document.documentElement;
const input = document.querySelector('input');
const wheel = document.querySelector('img.wheel');
const pointer = document.querySelector('img.pointer');
const file_input = document.querySelector('div.file-input');
const question = document.querySelector('div.question');
const q_title = document.querySelector('h2.q-title');
const q_answers = document.querySelector('div.q-answers');
const button = document.querySelector('button');
const final_text = ['הנדסת', 'תוכנה', 'ההבטחה', 'להצלחה'];
let totalDeg = 0;
let rotating = false;
let loaded = false;
let questions = [], selectIndex = -1, answerIndex;
let answersItems = [], clickable = false, checked = false;
let totalAns = 0, correctAns = 0;

function setAnswersClick() {
    for (let i = 0; i < q_answers.childElementCount; i++)
        answersItems.push(q_answers.children.item(i));
    
    for (let i = 0; i < answersItems.length; i++) {
        answersItems[i].onclick = () => {
            if (clickable) {
                selectIndex = i;
                clearAnswer();
                answersItems[i].style.backgroundColor = "rgb(125 113 255)";
            }
        }
    }
}

function clearAnswer() {
    for (let i = 0; i < answersItems.length; i++) {
        answersItems[i].style.backgroundColor = "#b0cbff";
    }
}

function displayQuestion(qnum) {
    if (qnum == -1) {
        file_input.style.display = "none";
        question.style.display = "block";
        answersItems[2].style.display = "grid";
        answersItems[3].style.display = "grid";
        answersItems[2].style.gridColumn = "";
        q_title.innerHTML = 'נוצר על ידי: זיו רפאלי';
        for (let i = 0; i < answersItems.length; i++) {
            answersItems[i].innerHTML = final_text[i];
        }
        return;
    }
    let current = questions.splice(qnum, 1)[0];
    q_title.innerHTML = current.title;
    answerIndex = current.correct;

    switch (current.answers.length) {
        case 2:
            answersItems[2].style.display = "none";
            answersItems[3].style.display = "none";
            answersItems[2].style.gridColumn = "";
            break;
        case 3:
            answersItems[2].style.display = "grid";
            answersItems[3].style.display = "none";
            answersItems[2].style.gridColumn = "1 / 3";
            break;
        case 4:
            answersItems[2].style.display = "grid";
            answersItems[3].style.display = "grid";
            answersItems[2].style.gridColumn = "";
            break;
    }
    for (let i = 0; i < answersItems.length; i++) {
        answersItems[i].innerHTML = current.answers[i];
    }
    clickable = true;
}

button.onclick = () => {
    if (selectIndex == -1 || checked)
        return; 
    clickable = false;
    clearAnswer();
    answersItems[answerIndex].style.backgroundColor = 'green';
    totalAns++;
    if (selectIndex == answerIndex) {
        alert('תשובה נכונה!');
        correctAns++;
    }
    else {
        alert('תשובה שגויה');
        answersItems[selectIndex].style.backgroundColor = 'red';
    }
    checked = true;
}

input.onchange = () => {
    const file = input.files[0];
    uploadFile(file, data => {
        questions = convertData(data);
        loaded = true;
        setAnswersClick();
        alert('סובבו את הגלגל!');
        displayQuestion(-1);
        checked = true;
    });
};

pointer.onclick = () => {
    if (loaded && checked && !rotating) {
        rotating = true;
        clickable = false;
        checked = false;
        selectIndex = -1;
        clearAnswer();

        let deg = random(120, 480);
        let time = random(2, 4);
        root.style.setProperty("--start-deg", totalDeg + "deg");
        root.style.setProperty("--stop-deg", (totalDeg + deg) + "deg");
        totalDeg = (totalDeg + deg) % 360;

        wheel.style.animation = `spin-wheel ${time}s 1`;
    }
};

wheel.addEventListener("animationend", () => {
    rotating = false;
    wheel.style.animation = '';
    wheel.style.transform = `rotate(${totalDeg}deg)`;
    
    if (questions.length == 0) {
        alert('פתרתם את כל השאלות!');
        alert(`עניתם נכון על ${correctAns}/${totalAns} שאלות!`);
        displayQuestion(-1);
        clickable = false;
        checked = true;
    }
    else {
        let index = random(0, questions.length - 1);
        console.log(index);
        displayQuestion(index);
    }
});