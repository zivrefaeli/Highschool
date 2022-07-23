const btnAdd = document.querySelector('button.add');
const btnClose = document.querySelector('div.cover>button');
const btnCreate = document.querySelector('button.create');
const cover = document.querySelector('div.cover');
const form = document.querySelector('form');
const select = document.querySelector('select');
const answers = document.querySelector('div.answers');
const divQuestions = document.querySelector('div.questions');

window.onload = () => {
    initializeTable();
    console.log(window.location.search);
    const search = decodeURIComponent(window.location.search.replaceAll('+', ' '));
    getAllQuestions(search);
};

btnAdd.onclick = () => {
    cover.style.display = 'grid';
    createAnswers(2);
};

btnClose.onclick = () => {
    cover.style.display = 'none';
};

btnCreate.onclick = () => {
    if (currectQuestions.length < 1) {
        alert('הכניסו לפחות שאלה אחת!');
        return;
    }
    let content = '';
    currectQuestions.forEach(q => {
        content += DBQuestion.getCode(q);
    });
    downloadToFile(content);
    clearQuestions();
};

form.onsubmit = () => {
    if (form['title'].value == '') {
        alert('הכניסו את כותרת השאלה');
        return false;
    }
    for (let i = 1; i <= form['correct'].length; i++) {
        if (form[`ans${i}`].value == '') {
            alert(`הכניסו את תשובה ${i}`);
            return false;
        }
    }
    if (form['correct'].value == '') {
        alert('בחרו את התשובה הנכונה');
        return false;
    }
    return true;
};

select.onchange = () => {
    createAnswers(parseInt(select.value));
};

function createAnswers(count) {
    answers.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        createAnswer(i);
    }
}

function createAnswer(num) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `ans${num}`;
    input.placeholder = `תשובה ${num}`;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.value = `${num}`;
    radio.name = 'correct';

    answers.appendChild(radio);
    answers.appendChild(input);
}

function displayAllQuestions() {
    divQuestions.innerHTML = '';
    currectQuestions.sort((q1, q2) => q1.index - q2.index);
    currectQuestions.forEach(q => {
        const div = document.createElement('div');
        div.className = 'q';

        const button = document.createElement('button');
        button.innerHTML = 'x';
        button.onclick = () => {
            if (prompt('כדי למחוק שאלה זו רשמו: "מחק"') == 'מחק') {
                deleteQuestionByTitle(q.title);
            }
        }

        const qTitle = document.createElement('b');
        qTitle.innerHTML = q.title;

        const divAns = document.createElement('div');
        divAns.style.gridTemplateColumns = `repeat(${q.count}, auto)`;
        for (let i = 0; i < q.count; i++) {
            const span = document.createElement('span');
            span.innerHTML = q.answers[i];
            if (i == q.correct) {
                span.style.backgroundColor = 'rgb(182 255 218)';
            }
            divAns.appendChild(span);
        }

        div.appendChild(button);
        div.appendChild(qTitle);
        div.appendChild(divAns);
        divQuestions.appendChild(div);
    });
}
