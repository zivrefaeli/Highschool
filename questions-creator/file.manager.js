const letters = '0123456789אבגדהוזחטיכלמנסעפצקרשתםףךץן'.split('');
[65, 97].forEach(s => {
    for (let i = s; i <= s + 25; i++)
        letters.push(String.fromCharCode(i));
});

class Question {
    constructor(number, title, answers, correct) {
        this.number = number;
        this.title = title;
        this.answers = []
        let ans = String(answers).split(',');
        ans.forEach(value => {
            this.answers.push(value);
        });
        this.correct = parseInt(correct);
    }
}

function convertData(data) {
    const questions = [];
    let dataArr = String(data).split('\n');
    dataArr = dataArr.map(value => {
        if (value.endsWith('\r'))
            return value.substring(0, value.length - 1);
        return value;
    });
    dataArr.pop();
    console.log(dataArr);
    let count = 0;
    dataArr.forEach(q => {
        let parts = q.split('|');
        let qus = new Question(++count, parts[0], parts[1], parts[2])
        questions.push(qus);
    });
    console.table(questions);
    return questions;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateFile(file) {
    const name = String(file.name);
    if (!name.startsWith('QC'))
        return -1;
    const list = name.split('-');
    if (list.length != 2)
        return -1;
    return parseInt(list[1]);
}

function uploadFile(file, handleData) {
    const reader = new FileReader();
    try {
        reader.readAsText(file);
    } catch {
        console.log("error");
        return;
    }

    reader.onload = (event) => {
        console.log(file);
        const key = validateFile(file);
        if (key != -1) {
            const data = decode(event.target.result, key);
            if (data.endsWith('Ziv Refeali')) {
                handleData(data);
            } else {
                alert('הכניסו את הקובץ הנכון!');
            }
        } else {
            alert('הכניסו את הקובץ הנכון!');
        }
    };

    reader.onerror = (event) => {
        console.log("error: " + event);
    };
}

function downloadToFile(content) {
    const key = random(1, letters.length - 1);
    content += 'Created by: Ziv Refeali';
    const encodeContent = encode(content, key);
    const filename = `QC-${key}.txt`;
    
    const a = document.createElement('a');
    a.href = `data:text/plain;charset=utf-8,${encodeContent}`;
    a.download = filename;
    a.click();
}

function encode(content, key) {
    let result = '';
    String(content).split('').forEach(char => {
        if (letters.includes(char)) {
            result += letters[(letters.indexOf(char) + key) % letters.length];
        } else {
            result += char;
        }
    });
    return result;
}

function decode(content, key) {
    let result = '';
    String(content).split('').forEach(char => {
        if (letters.includes(char)) {
            result += letters[(letters.indexOf(char) - key + letters.length) % letters.length];
        } else {
            result += char;
        }
    });
    return result;
}