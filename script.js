let cycles = [];


/* =========================
   Главное меню
========================= */

function showPage(page) {

    const content = document.getElementById("content");

    if (page === "g71") {
        showG71();
        return;
    }

    content.innerHTML = `
        <h2>${page.toUpperCase()}</h2>
        <p>Этот раздел добавим следующим этапом.</p>

        <button onclick="showPage('g71')">
            G71 / G70
        </button>
    `;
}


/* =========================
   Создание редактора G71
========================= */

function showG71() {

    cycles = [];

    const content = document.getElementById("content");

    content.innerHTML = `

        <h2>Программа G71 / G70</h2>

        <h3>Общие данные программы</h3>

        <label>Номер программы</label>
        <input id="programNumber"
               type="number"
               value="1001">

        <label>Инструмент</label>
        <input id="tool"
               type="text"
               value="T303">

        <label>Максимальные обороты S</label>
        <input id="maxRpm"
               type="number"
               value="1500">

        <label>Скорость резания G96 S</label>
        <input id="cuttingSpeed"
               type="number"
               value="110">

        <h3>Циклы программы</h3>

        <div id="cycles"></div>

        <button onclick="addG71Cycle()">
            + Добавить G71
        </button>

        <button onclick="generateProgram()">
            СОЗДАТЬ ПРОГРАММУ
        </button>

        <div id="result"></div>
    `;

    addG71Cycle();
}


/* =========================
   Добавление G71
========================= */

function addG71Cycle() {

    const cycleNumber = cycles.length + 1;

    const cycle = {
        id: cycleNumber,
        points: []
    };

    cycles.push(cycle);

    renderCycles();
}


/* =========================
   Отрисовка всех циклов
========================= */

function renderCycles() {

    const container =
        document.getElementById("cycles");

    container.innerHTML = "";

    cycles.forEach((cycle, cycleIndex) => {

        const block =
            document.createElement("div");

        block.className = "cycle";

        block.innerHTML = `

            <h3>
                G71 №${cycleIndex + 1}
            </h3>

            <label>Глубина резания U</label>
            <input
                type="number"
                step="0.1"
                value="2"
                id="depth_${cycle.id}"
            >

            <label>Отвод R</label>
            <input
                type="number"
                step="0.1"
                value="0.5"
                id="retract_${cycle.id}"
            >

            <label>Припуск по X — U</label>
            <input
                type="number"
                step="0.1"
                value="1"
                id="allowanceX_${cycle.id}"
            >

            <label>Припуск по Z — W</label>
            <input
                type="number"
                step="0.1"
                value="0.1"
                id="allowanceZ_${cycle.id}"
            >

            <label>Подача F</label>
            <input
                type="number"
                step="0.01"
                value="0.22"
                id="feed_${cycle.id}"
            >

            <h4>Контур</h4>

            <div id="points_${cycle.id}"></div>

            <button onclick="addPoint(${cycle.id})">
                + Добавить точку
            </button>

            <button onclick="removeCycle(${cycle.id})">
                Удалить этот G71
            </button>
        `;

        container.appendChild(block);

        if (cycle.points.length === 0) {
            addPoint(cycle.id);
            addPoint(cycle.id);
        }
        else {
            renderPoints(cycle.id);
        }
    });
}


/* =========================
   Добавление точки
========================= */

function addPoint(cycleId) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    cycle.points.push({
        motion: "G01",
        x: "",
        z: ""
    });

    renderPoints(cycleId);
}


/* =========================
   Отрисовка точек
========================= */

function renderPoints(cycleId) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    const container =
        document.getElementById(`points_${cycleId}`);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    cycle.points.forEach((point, index) => {

        const row =
            document.createElement("div");

        row.className = "point-row";

        row.innerHTML = `

            <span>N${index + 1}</span>

            <select
                onchange="changeMotion(
                    ${cycleId},
                    ${index},
                    this.value
                )"
            >
                <option value="G01"
                    ${point.motion === "G01" ? "selected" : ""}>
                    G01
                </option>

                <option value="G00"
                    ${point.motion === "G00" ? "selected" : ""}>
                    G00
                </option>
            </select>

            <input
                type="number"
                step="0.001"
                placeholder="X"
                value="${point.x}"
                onchange="changeX(
                    ${cycleId},
                    ${index},
                    this.value
                )"
            >

            <input
                type="number"
                step="0.001"
                placeholder="Z"
                value="${point.z}"
                onchange="changeZ(
                    ${cycleId},
                    ${index},
                    this.value
                )"
            >

            <button
                onclick="removePoint(
                    ${cycleId},
                    ${index}
                )"
            >
                ×
            </button>
        `;

        container.appendChild(row);
    });
}


/* =========================
   Изменение точки
========================= */

function changeMotion(cycleId, index, value) {

    cycles
        .find(c => c.id === cycleId)
        .points[index]
        .motion = value;
}


function changeX(cycleId, index, value) {

    cycles
        .find(c => c.id === cycleId)
        .points[index]
        .x = value;
}


function changeZ(cycleId, index, value) {

    cycles
        .find(c => c.id === cycleId)
        .points[index]
        .z = value;
}


/* =========================
   Удаление точки
========================= */

function removePoint(cycleId, index) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    if (cycle.points.length <= 2) {
        alert("В контуре должно быть минимум две точки.");
        return;
    }

    cycle.points.splice(index, 1);

    renderPoints(cycleId);
}


/* =========================
   Удаление цикла
========================= */

function removeCycle(cycleId) {

    if (cycles.length <= 1) {
        alert("В программе должен остаться хотя бы один цикл.");
        return;
    }

    cycles =
        cycles.filter(c => c.id !== cycleId);

    cycles.forEach((cycle, index) => {
        cycle.id = index + 1;
    });

    renderCycles();
}


/* =========================
   Формат координат
========================= */

function formatCoordinate(value) {

    if (value === "" || value === null) {
        return "";
    }

    let number = Number(value);

    if (Number.isNaN(number)) {
        return "";
    }

    /*
       X и Z всегда получают
       десятичную точку.
    */

    if (Number.isInteger(number)) {
        return number.toFixed(1);
    }

    return number.toString();
}


/* =========================
   Формат U/W/R
========================= */

function formatDistance(value) {

    if (value === "" || value === null) {
        return "";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "";
    }

    if (Number.isInteger(number)) {
        return number.toFixed(1);
    }

    return number.toString();
}


/* =========================
   Генерация программы
========================= */

function generateProgram() {

    const programNumber =
        document.getElementById("programNumber").value;

    const tool =
        document.getElementById("tool").value;

    const maxRpm =
        document.getElementById("maxRpm").value;

    const cuttingSpeed =
        document.getElementById("cuttingSpeed").value;


    let program = "";

    program += `O${programNumber};\n`;
    program += `${tool};\n`;
    program += `G90G54;\n`;
    program += `G50S${maxRpm};\n`;
    program += `G96S${cuttingSpeed}M03;\n`;


    /*
       Общий счётчик P/Q/N.

       Каждый новый контур получает
       новую пару номеров.
    */

    let nextNumber = 1;


    cycles.forEach((cycle) => {

        if (cycle.points.length < 2) {
            return;
        }


        const pNumber = nextNumber;
        const qNumber = nextNumber + 1;

        nextNumber += 2;


        const depth =
            formatDistance(
                document.getElementById(
                    `depth_${cycle.id}`
                ).value
            );

        const retract =
            formatDistance(
                document.getElementById(
                    `retract_${cycle.id}`
                ).value
            );

        const allowanceX =
            formatDistance(
                document.getElementById(
                    `allowanceX_${cycle.id}`
                ).value
            );

        const allowanceZ =
            formatDistance(
                document.getElementById(
                    `allowanceZ_${cycle.id}`
                ).value
            );

        const feed =
            document.getElementById(
                `feed_${cycle.id}`
            ).value;


        /*
           Первый блок G71
        */

        program +=
            `G71U${depth}R${retract};\n`;


        /*
           Второй блок G71
        */

        program +=
            `G71P${pNumber}Q${qNumber}` +
            `U${allowanceX}` +
            `W${allowanceZ}` +
            `F${feed};\n`;


        /*
           Начало контура.

           P указывает на N первого блока.
        */

        const firstPoint =
            cycle.points[0];

        let firstLine =
            `G00N${pNumber}`;

        if (firstPoint.x !== "") {
            firstLine +=
                `X${formatCoordinate(firstPoint.x)}`;
        }

        if (firstPoint.z !== "") {
            firstLine +=
                `Z${formatCoordinate(firstPoint.z)}`;
        }

        program += firstLine + ";\n";


        /*
           Остальные точки.
        */

        for (
            let i = 1;
            i < cycle.points.length;
            i++
        ) {

            const point =
                cycle.points[i];

            /*
               Последняя точка получает N=Q.
            */

            let line = point.motion;

            if (i === cycle.points.length - 1) {
                line += `N${qNumber}`;
            }


            if (point.x !== "") {
                line +=
                    `X${formatCoordinate(point.x)}`;
            }

            if (point.z !== "") {
                line +=
                    `Z${formatCoordinate(point.z)}`;
            }

            program += line + ";\n";
        }


        /*
           Чистовая обработка G70
        */

        program +=
            `G70P${pNumber}Q${qNumber};\n`;
    });


    /*
       Завершение программы.
    */

    program += "G00Z10.;\n";
    program += "M09;\n";
    program += "M05;\n";
    program += "G00G28U0W0;\n";
    program += "M01;";


    showResult(program);
}


/* =========================
   Вывод результата
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
            alert(
                "Не удалось автоматически скопировать. " +
                "Выделите программу вручную."
            );
        });
                        }
