let contour = [];

function showPage(page) {
    const content = document.getElementById("content");

    if (page === "g71") {
        showG71();
        return;
    }

    if (page === "g76") {
        content.innerHTML = `
            <h2>G76 — Резьба</h2>
            <p>Генератор G76 добавим следующим этапом.</p>
        `;
        return;
    }

    if (page === "turning") {
        content.innerHTML = `
            <h2>Наружное точение</h2>
            <p>Раздел подготовлен. Добавим его после G71.</p>
        `;
        return;
    }

    if (page === "grooving") {
        content.innerHTML = `
            <h2>G74 / G75 — Канавки</h2>
            <p>Генератор канавок добавим следующим этапом.</p>
        `;
        return;
    }

    if (page === "calculator") {
        content.innerHTML = `
            <h2>Калькуляторы</h2>
            <p>Калькуляторы добавим следующим этапом.</p>
        `;
        return;
    }

    if (page === "library") {
        content.innerHTML = `
            <h2>Библиотека программ</h2>
            <p>Библиотека будет добавлена позже.</p>
        `;
        return;
    }
}


/* =========================
   G71 / G70
========================= */

function showG71() {
    contour = [];

    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>G71 / G70</h2>

        <div class="form">

            <label>Номер программы</label>
            <input id="programNumber" type="number" value="1001">

            <label>Инструмент</label>
            <input id="tool" type="text" value="T0101">

            <label>Обороты S</label>
            <input id="speed" type="number" value="350">

            <label>Подача F, мм/об</label>
            <input id="feed" type="number" step="0.01" value="0.25">

            <h3>Параметры G71</h3>

            <label>Глубина резания U</label>
            <input id="depth" type="number" step="0.1" value="2">

            <label>Отвод R</label>
            <input id="retract" type="number" step="0.1" value="0.5">

            <label>Припуск по X U</label>
            <input id="allowanceX" type="number" step="0.1" value="0.3">

            <label>Припуск по Z W</label>
            <input id="allowanceZ" type="number" step="0.1" value="0.1">

            <h3>Контур детали</h3>

            <div id="points"></div>

            <button onclick="addPoint()">
                + Добавить точку
            </button>

            <button onclick="generateG71()">
                СОЗДАТЬ ПРОГРАММУ
            </button>

            <button onclick="showPage('g71')">
                Очистить
            </button>

        </div>

        <div id="result"></div>
    `;

    addPoint();
    addPoint();
}


/* =========================
   Добавление точки
========================= */

function addPoint() {
    const points = document.getElementById("points");

    const number = contour.length + 1;

    const row = document.createElement("div");

    row.className = "point-row";

    row.innerHTML = `
        <span>${number}</span>

        <select class="motion">
            <option value="G01">G01</option>
            <option value="G00">G00</option>
        </select>

        <input
            class="x"
            type="number"
            step="0.001"
            placeholder="X"
        >

        <input
            class="z"
            type="number"
            step="0.001"
            placeholder="Z"
        >

        <button onclick="removePoint(this)">
            ×
        </button>
    `;

    points.appendChild(row);

    contour.push(row);
}


/* =========================
   Удаление точки
========================= */

function removePoint(button) {

    const row = button.parentElement;

    row.remove();

    renumberPoints();
}


/* =========================
   Перенумерация
========================= */

function renumberPoints() {

    const rows = document.querySelectorAll(".point-row");

    rows.forEach((row, index) => {
        row.querySelector("span").textContent = index + 1;
    });

    contour = Array.from(rows);
}


/* =========================
   Генерация G71 / G70
========================= */

function generateG71() {

    const programNumber =
        document.getElementById("programNumber").value;

    const tool =
        document.getElementById("tool").value;

    const speed =
        document.getElementById("speed").value;

    const feed =
        document.getElementById("feed").value;

    const depth =
        document.getElementById("depth").value;

    const retract =
        document.getElementById("retract").value;

    const allowanceX =
        document.getElementById("allowanceX").value;

    const allowanceZ =
        document.getElementById("allowanceZ").value;


    const rows = document.querySelectorAll(".point-row");

    if (rows.length < 2) {
        alert("Добавьте минимум две точки контура.");
        return;
    }


    let points = [];

    rows.forEach(row => {

        const motion =
            row.querySelector(".motion").value;

        const x =
            row.querySelector(".x").value;

        const z =
            row.querySelector(".z").value;

        if (x !== "" || z !== "") {

            points.push({
                motion: motion,
                x: x,
                z: z
            });

        }

    });


    if (points.length < 2) {
        alert("Введите координаты минимум двух точек.");
        return;
    }


    /*
       Номера блоков контура.
       Начинаем со 100 и увеличиваем на 10.
    */

    const firstN = 100;

    const lastN =
        firstN + (points.length - 1) * 10;


    let program = "";

    program += `O${programNumber}\n`;
    program += `${tool}\n`;
    program += `G97 S${speed} M03\n`;

    program += `G71 U${depth} R${retract}\n`;

    program +=
        `G71 P${firstN} Q${lastN} U${allowanceX} W${allowanceZ} F${feed}\n`;


    points.forEach((point, index) => {

        const n =
            firstN + index * 10;

        let line = `N${n} ${point.motion}`;

        if (point.x !== "") {
            line += ` X${point.x}`;
        }

        if (point.z !== "") {
            line += ` Z${point.z}`;
        }

        program += line + "\n";
    });


    program += `G70 P${firstN} Q${lastN}\n`;
    program += `M05\n`;
    program += `M30`;


    showResult(program);
}


/* =========================
   Вывод программы
========================= */

function showResult(program) {

    const result =
        document.getElementById("result");

    result.innerHTML = `
        <h3>Готовая программа</h3>

        <textarea
            id="programOutput"
            readonly
        >${program}</textarea>

        <button onclick="copyProgram()">
            📋 Копировать программу
        </button>
    `;
}


/* =========================
   Копирование
========================= */

function copyProgram() {

    const output =
        document.getElementById("programOutput");

    output.select();

    navigator.clipboard.writeText(output.value)
        .then(() => {
            alert("Программа скопирована.");
        })
        .catch(() => {
            alert("Не удалось автоматически скопировать. Выделите программу вручную.");
        });
}
