const db_name = 'My Questions';
const db_version = 1;
const table_name = 'questions';
const primary_key = 'title';
const currectQuestions = [];

class DBQuestion {
    constructor(url) {
        this.index = currectQuestions.length + 1;
        const list = String(url).substring(1).split('&');
        this.title = this.#getValue(list[0]);
        this.count = parseInt(this.#getValue(list[1]));
        this.answers = [];

        for (let i = 2; i < list.length; i++) {
            if (list[i].includes('ans'))
                this.answers.push(this.#getValue(list[i]));
            else
                this.correct = parseInt(this.#getValue(list[i])) - 1;
        }
    }

    #getValue(string) {
        const list = String(string).split('=');
        if (list.length == 2)
            return list[1];
        return list.slice(1).join('=');
    }

    static getCode(object) {
        return `${object.title}|${object.answers.join(',')}|${object.correct}\n`;
    }
}

function initializeTable() {
    const request = indexedDB.open(db_name, db_version);
    request.onerror = (event) => {
        console.error(`db error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        console.log('table initialized');
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(table_name, {
            keyPath: 'title'
        });
    };
}

function insertQuestion(question) {
    const request = indexedDB.open(db_name, db_version);
    request.onerror = (event) => {
        console.error(`db error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(table_name, 'readwrite');
        const store = transaction.objectStore(table_name);
        const query = store.add(question);

        query.onsuccess = (event) => {
            console.log(event);
            alert('שאלה הוספה');
            window.location.search = '';
        };
        query.onerror = (event) => {
            console.log(`query error: ${event}`);
            alert('שגיאה בהוספת השאלה, בדקו שאין כותרות זהות!');
            window.location.search = '';
        };
        transaction.oncomplete = () => {
            db.close();
        };
    };
}

function getQuestionByTitle(title) {
    const request = indexedDB.open(db_name, db_version);
    request.onerror = (event) => {
        console.error(`db error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(table_name, 'readonly');
        const store = transaction.objectStore(table_name);
        const query = store.get(title);

        query.onsuccess = (event) => {
            const question = event.target.result;
            if (!question) {
                console.log(`The question with title ${title} not found`);
            } else {
                console.log(question);
            }
        };
        query.onerror = (event) => {
            console.log(`query error: ${event}`);
        };
        transaction.oncomplete = () => {
            db.close();
        };
    };
}

function getAllQuestions(search) {
    const request = indexedDB.open(db_name, db_version);
    request.onerror = (event) => {
        console.error(`db error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(table_name, "readonly");
        const store = transaction.objectStore(table_name);
        currectQuestions.length = 0;

        store.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                currectQuestions.push(cursor.value);
                cursor.continue();
            }
        };
        transaction.oncomplete = () => {
            db.close();
            console.table(currectQuestions);
            if (search != '')
                insertQuestion(new DBQuestion(search));
            else
                displayAllQuestions();
        };
    };
}

function deleteQuestionByTitle(title) {
    const request = indexedDB.open(db_name, db_version);
    request.onerror = (event) => {
        console.error(`db error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(table_name, 'readwrite');
        const store = transaction.objectStore(table_name);
        const query = store.delete(title);

        query.onsuccess = (event) => {
            console.log(`question with title ${title} deleted`);
            window.location.reload();
        };
        query.onerror = (event) => {
            console.log(`query error: ${event}`);
        };
        transaction.oncomplete = () => {
            db.close();
        };
    };
}

function clearQuestions() {
    const request = indexedDB.open(db_name, db_version);
    request.onerror = (event) => {
        console.error(`db error: ${event.target.errorCode}`);
    };
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(table_name, 'readwrite');
        const store = transaction.objectStore(table_name);
        const query = store.clear();

        query.onsuccess = (event) => {
            console.log(`questions cleared`);
            window.location.reload();
        };
        query.onerror = (event) => {
            console.log(`query error: ${event}`);
        };
        transaction.oncomplete = () => {
            db.close();
        };
    };
}