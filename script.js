let cycles = [];
let operations = [];


/* =========================
   Главное меню
========================= */
function showPage(page) {

    const content = document.getElementById("content");

    if (page === "g71") {
        showG71();
        return;
    }

    if (page === "grooving") {
        showGrooving();
        return;
    }

    content.innerHTML = `
        <h2>${page.toUpperCase()}</h2>
        <p>Этот раздел добавим следующим этапом.</p>

        <button onclick="showPage('g71')">
            G71 / G70
        </button>

        <br><br>

        <button onclick="showPage('grooving')">
            Канавки G74 / G75
        </button>
    `;
}
    function showGrooving() {

    const content = document.getElementById("content");

    content.innerHTML = `
        <h2>КАНАВКИ G74 / G75</h2>
<label>Тип канавки:</label>
<select id="grooveType">
    <option value="G75">G75 — продольная</option>
    <option value="G74">G74 — торцевая</option>
</select>
        <div class="cycle">

            <h3>Общие параметры инструмента</h3>

            <label>Номер инструмента:</label>
            <input type="number" id="grooveTool" value="303">

            <label>Обороты шпинделя S:</label>
            <input type="number" id="grooveS" value="1500">

            <label>Скорость резания G96:</label>
            <input type="number" id="grooveSpeed" value="110">

            <label>Ширина пластины, мм:</label>
            <input type="number" id="grooveWidth" value="4" step="0.1">

            <label>Подача F:</label>
            <input type="number" id="grooveF" value="0.05" step="0.01">

            <hr>

            <h3>G75 — продольная канавка</h3>

            <label>Стартовый X:</label>
            <input type="number" id="g75StartX" value="41" step="0.1">

            <label>Стартовый Z:</label>
            <input type="number" id="g75StartZ" value="-21.1" step="0.1">

            <label>Конечный X:</label>
            <input type="number" id="g75EndX" value="29.9" step="0.1">

            <label>Конечный Z:</label>
            <input type="number" id="g75EndZ" value="-11.6" step="0.1">

            <label>P — глубина врезания за проход, мкм:</label>
            <input type="number" id="g75P" value="5000">

            <label>Q — отступ между врезаниями, мкм:</label>
            <input type="text" id="g75Q" readonly>

            <hr>

            <h3>G74 — торцевая канавка</h3>

            <label>Стартовый X:</label>
            <input type="number" id="g74StartX" value="48" step="0.1">

            <label>Стартовый Z:</label>
            <input type="number" id="g74StartZ" value="2" step="0.1">

            <label>Ширина канавки, мм:</label>
            <input type="number" id="g74GrooveWidth" value="36" step="0.1">

            <label>Конечный X — рассчитывается автоматически:</label>
            <input type="text" id="g74EndX" readonly>

            <label>Глубина по Z, мм:</label>
            <input type="number" id="g74DepthZ" value="5" step="0.1">

            <label>Q — глубина врезания, мкм:</label>
            <input type="number" id="g74Q" value="5000">

            <label>P — отступ между врезаниями, мкм:</label>
            <input type="text" id="g74P" readonly>

            <br><br>

            <button onclick="generateGrooving()">
                СОЗДАТЬ ПРОГРАММУ
            </button>

            <br><br>

            <div id="groovingResult"></div>

            <br>

            <button onclick="showPage('home')">
                НАЗАД
            </button>

        </div>
    `;
    document.getElementById("g74StartX")
    .addEventListener("input", updateGroovingCalculations);

document.getElementById("g74GrooveWidth")
    .addEventListener("input", updateGroovingCalculations);

document.getElementById("grooveWidth")
    .addEventListener("input", updateGroovingCalculations);
    updateGroovingCalculations();
    }
function generateGrooving() {

    const type =
        document.getElementById("grooveType").value;

    const tool =
        document.getElementById("grooveTool").value;

    const s =
        document.getElementById("grooveS").value;

    const speed =
        document.getElementById("grooveSpeed").value;

    const width =
        parseFloat(document.getElementById("grooveWidth").value) || 0;

    const feed =
        document.getElementById("grooveF").value;


    // =====================================
    // G75 — ПРОДОЛЬНАЯ КАНАВКА
    // =====================================

    if (type === "G75") {

        const startX =
            document.getElementById("g75StartX").value;

        const startZ =
            document.getElementById("g75StartZ").value;

        const endX =
            document.getElementById("g75EndX").value;

        const endZ =
            document.getElementById("g75EndZ").value;

        const p =
            document.getElementById("g75P").value;

        const q =
            Math.round((width - 0.5) * 1000);


        const program =
`T${tool};
G90G54;
G50S1500;
G96S${speed}M03;
G00Z${startZ};
G00X${startX}M08;
G75R0.5;
G75X${endX}Z${endZ}P${p}Q${q}F${feed};
G00Z10.;
M09;
M05;
G00G28U0W0;`;

        document.getElementById("groovingResult").innerHTML = `
    <pre id="groovingProgram">${program}</pre>

    <button onclick="copyGroovingProgram()">
        📋 Копировать программу
    </button>
`;

        return;
    }


    // =====================================
    // G74 — ТОРЦЕВАЯ КАНАВКА
    // =====================================

    if (type === "G74") {

        const startX =
            document.getElementById("g74StartX").value;

        const startZ =
            document.getElementById("g74StartZ").value;

        const endX =
            document.getElementById("g74EndX").value;

        const depthZ =
            document.getElementById("g74DepthZ").value;

        const q =
            document.getElementById("g74Q").value;

        const p =
            Math.round((width * 2 - 0.5) * 1000);


        const program =
`T${tool};
G90G54;
G50S1500;
G96S${speed}M03;
G00Z${startZ};
G00X${startX}M08;
G74R0.5;
G74X${endX}Z${depthZ}P${p}Q${q}F${feed};
G00Z10.;
M09;
M05;
G00G28U0W0;`;

        document.getElementById("groovingResult").innerHTML = `
    <pre id="groovingProgram">${program}</pre>

    <button onclick="copyGroovingProgram()">
        📋 Копировать программу
    </button>
`;

        return;
    }
}
    function updateGroovingCalculations() {

    const widthInput =
        document.getElementById("grooveWidth");

    if (!widthInput) {
        return;
    }

    const width =
        parseFloat(widthInput.value) || 0;
const g74StartX =
    parseFloat(
        document.getElementById("g74StartX").value
    ) || 0;

const g74GrooveWidth =
    parseFloat(
        document.getElementById("g74GrooveWidth").value
    ) || 0;

const g74EndX =
    g74StartX +
    2 * (g74GrooveWidth - width);

document.getElementById("g74EndX").value =
    formatCoordinate(g74EndX);
    // =========================
    // G75
    // Q = ширина пластины - 0.5 мм
    // =========================

    const g75Q =
        Math.max(0, width - 0.5);

    document.getElementById("g75Q").value =
        Math.round(g75Q * 1000);


    // =========================
    // G74
    // P = две ширины пластины - 0.5 мм
    // =========================

    const g74P =
        Math.max(0, (width * 2) - 0.5);

    document.getElementById("g74P").value =
        Math.round(g74P * 1000);
    }


/* =========================
   Редактор G71 / G70
========================= */

function showG71() {

    cycles = [];
    operations = [];

    const content = document.getElementById("content");

    content.innerHTML = `

        <h2>Программа G71 / G70</h2>

        <h3>Общие данные программы</h3>

        <label>Номер программы</label>
        <input id="programNumber"
               type="number"
               value="1001">

        <h3>Операции</h3>

        <div id="operations"></div>

        <button onclick="addG71Cycle()">
            + Добавить G71
        </button>

        <button onclick="addG70Operation()">
            + Добавить G70
        </button>
        <button onclick="addG74Operation()">
            + Добавить G74
        </button>
        <button onclick="addG75Operation()">
            + Добавить G75
        </button>
        <br><br>
        <button onclick="addDrillG01Operation()">
            + Сверление G01
        </button>
        <button onclick="addDrillG83Operation()">
            + Глубокое сверление G83
        </button>
        <button onclick="addThreadG76Operation()">
            + Наружная резьба G76
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

    const id = Date.now() + Math.random();

    const cycle = {
        id: id,
        type: "G71",
        points: []
    };

    cycles.push(cycle);
    operations.push(cycle);

    renderOperations();
}


/* =========================
   Добавление G70
========================= */

function addG70Operation() {

    const id = Date.now() + Math.random();

    const operation = {
        id: id,
        type: "G70",
        contour: ""
    };

    operations.push(operation);

    renderOperations();
}
/* =========================
   Добавление G74
========================= */

function addG74Operation() {

    const id = Date.now() + Math.random();

    const operation = {
        id: id,
        type: "G74"
    };

    operations.push(operation);

    renderOperations();
}
/* =========================
   Добавление G75
========================= */

function addG75Operation() {

    const id = Date.now() + Math.random();

    const operation = {
        id: id,
        type: "G75"
    };

    operations.push(operation);

    renderOperations();
}

/* =========================
   Добавление сверления G01
========================= */

function addDrillG01Operation() {

    const id = Date.now() + Math.random();

    const operation = {
        id: id,
        type: "DRILL_G01"
    };

    operations.push(operation);

    renderOperations();
}
/* =========================
   Добавление глубокого сверления G83
========================= */

function addDrillG83Operation() {

    const id = Date.now() + Math.random();

    const operation = {
        id: id,
        type: "DRILL_G83"
    };

    operations.push(operation);

    renderOperations();
}

/* =========================
   Добавление наружной резьбы G76
========================= */

function addThreadG76Operation() {

    const id = Date.now() + Math.random();

    const operation = {
        id: id,
        type: "THREAD_G76"
    };

    operations.push(operation);

    renderOperations();
}

/* =========================
   Отрисовка операций
========================= */

function renderOperations() {

    const container =
        document.getElementById("operations");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    operations.forEach((operation, index) => {

        if (operation.type === "G71") {
            renderG71(operation, index);
        }

        if (operation.type === "G70") {
            renderG70(operation, index);
        }

        if (operation.type === "G74") {
            renderG74(operation, index);
        }
       
        if (operation.type === "G75") {
            renderG75(operation, index);
        }
        if (operation.type === "DRILL_G01") {
            renderDrillG01(operation, index);
        }
        if (operation.type === "DRILL_G83") {
            renderDrillG83(operation, index);
        }
        if (operation.type === "THREAD_G76") {
            renderThreadG76(operation, index);
        }
    });
}


/* =========================
   Отрисовка G71
========================= */

function renderG71(cycle, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>G71 №${index + 1}</h3>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${cycle.id}"
            value="T303"
        >

        <label>Максимальные обороты S</label>
        <input
            type="number"
            id="maxRpm_${cycle.id}"
            value="1500"
        >

        <label>Скорость резания G96 S</label>
        <input
            type="number"
            id="cuttingSpeed_${cycle.id}"
            value="110"
        >

        <h4>Подвод инструмента</h4>

        <label>Подвод по Z</label>
        <input
            type="number"
            step="0.001"
            id="approachZ_${cycle.id}"
            value="2"
        >

        <label>Подвод по X</label>
        <input
            type="number"
            step="0.001"
            id="approachX_${cycle.id}"
            value="102"
        >

        <h4>Коррекция радиуса пластины</h4>

        <label>Коррекция</label>
        <select id="correction_${cycle.id}">
            <option value="">Без коррекции</option>
            <option value="G41">G41</option>
            <option value="G42">G42</option>
        </select>

        <h4>Параметры G71</h4>

<label>Глубина резания U</label>
<br>
<input
    type="number"
    step="0.001"
    id="depth_${cycle.id}"
    value="2"
>
<br><br>

<label>Отвод R</label>
<br>
<input
    type="number"
    step="0.001"
    id="retract_${cycle.id}"
    value="0.5"
>
<br><br>

<label>Припуск по X — U</label>
<br>
<input
    type="number"
    step="0.001"
    id="allowanceX_${cycle.id}"
    value="0"
>
<br><br>

<label>Припуск по Z — W</label>
<br>
<input
    type="number"
    step="0.001"
    id="allowanceZ_${cycle.id}"
    value="0"
>
<br><br>

<label>Подача F</label>
<br>
<input
    type="number"
    step="0.001"
    id="feed_${cycle.id}"
    value="0.22"
>
<br><br>

<h4>Контур</h4>

        <div id="points_${cycle.id}"></div>

        <button onclick="addPoint(${cycle.id})">
            + Добавить точку
        </button>

        <button onclick="removeOperation(${cycle.id})">
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
}


/* =========================
   Отрисовка G70
========================= */

function renderG70(operation, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>G70 №${index + 1}</h3>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${operation.id}"
            value="T101"
        >

        <label>Максимальные обороты S</label>
        <input
            type="number"
            id="maxRpm_${operation.id}"
            value="1500"
        >

        <label>Скорость резания G96 S</label>
        <input
            type="number"
            id="cuttingSpeed_${operation.id}"
            value="180"
        >

        <h4>Подвод инструмента</h4>

        <label>Подвод по Z</label>
        <input
            type="number"
            step="0.001"
            id="approachZ_${operation.id}"
            value="2"
        >

        <label>Подвод по X</label>
        <input
            type="number"
            step="0.001"
            id="approachX_${operation.id}"
            value="102"
        >

        <h4>Коррекция радиуса пластины</h4>

        <label>Коррекция</label>
        <select id="correction_${operation.id}">
            <option value="">Без коррекции</option>
            <option value="G41">G41</option>
            <option value="G42">G42</option>
        </select>

        <h4>Контур для чистовой обработки</h4>

        <label>P/Q</label>
        <select id="contour_${operation.id}">
            ${getContourOptions()}
        </select>

        <label>Подача F</label>
        <input
            type="number"
            step="0.001"
            id="feed_${operation.id}"
            value="0.1"
        >

        <br><br>

        <button onclick="removeOperation(${operation.id})">
            Удалить этот G70
        </button>
    `;

    container.appendChild(block);
}
/* =========================
   Отрисовка G74
========================= */

function renderG74(operation, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>G74 №${index + 1}</h3>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${operation.id}"
            value="T404"
        >

        <label>Максимальные обороты S</label>
        <input
            type="number"
            id="maxRpm_${operation.id}"
            value="1500"
        >

        <label>Скорость резания G96 S</label>
        <input
            type="number"
            id="cuttingSpeed_${operation.id}"
            value="100"
        >

        <h4>Параметры пластины</h4>

        <label>Ширина пластины, мм</label>
        <input
            type="number"
            step="0.1"
            id="insertWidth_${operation.id}"
            value="4"
        >

        <h4>Исходная точка</h4>

        <label>Стартовый X</label>
        <input
            type="number"
            step="0.001"
            id="startX_${operation.id}"
            value="40"
        >

        <label>Стартовый Z</label>
        <input
            type="number"
            step="0.001"
            id="startZ_${operation.id}"
            value="2"
        >

        <h4>Параметры канавки</h4>

        <label>Ширина канавки, мм</label>
        <input
            type="number"
            step="0.001"
            id="grooveWidth_${operation.id}"
            value="36"
        >

        <label>Конечный X — рассчитывается автоматически</label>
        <input
            type="text"
            id="endX_${operation.id}"
            readonly
        >

        <label>Глубина по Z, мм</label>
        <input
            type="number"
            step="0.001"
            id="depthZ_${operation.id}"
            value="-5"
        >

        <label>Q — глубина врезания, мкм</label>
        <input
            type="number"
            id="q_${operation.id}"
            value="5000"
        >

        <label>P — отступ между врезаниями, мкм</label>
        <input
            type="text"
            id="p_${operation.id}"
            readonly
        >

        <label>Подача F</label>
        <input
            type="number"
            step="0.001"
            id="feed_${operation.id}"
            value="0.05"
        >

        <br><br>

        <button onclick="removeOperation(${operation.id})">
            Удалить этот G74
        </button>
    `;

    container.appendChild(block);

    updateG74Fields(operation.id);

    document.getElementById(`insertWidth_${operation.id}`)
        .addEventListener("input", () => updateG74Fields(operation.id));

    document.getElementById(`startX_${operation.id}`)
        .addEventListener("input", () => updateG74Fields(operation.id));

    document.getElementById(`grooveWidth_${operation.id}`)
        .addEventListener("input", () => updateG74Fields(operation.id));
}
function updateG74Fields(id) {

    const insertWidth =
        Number(getValue(`insertWidth_${id}`));

    const startX =
        Number(getValue(`startX_${id}`));

    const grooveWidth =
        Number(getValue(`grooveWidth_${id}`));

    const endX =
        startX + 2 * (grooveWidth - insertWidth);

    const p =
        Math.round((insertWidth * 2 - 0.5) * 1000);

    const endXField =
        document.getElementById(`endX_${id}`);

    const pField =
        document.getElementById(`p_${id}`);

    if (endXField) {
        endXField.value = formatCoordinate(endX);
    }

    if (pField) {
        pField.value = p;
    }
}

/* =========================
   Отрисовка G75
========================= */

function renderG75(operation, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>G75 №${index + 1}</h3>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${operation.id}"
            value="T202"
        >

        <label>Максимальные обороты S</label>
        <input
            type="number"
            id="maxRpm_${operation.id}"
            value="1500"
        >

        <label>Скорость резания G96 S</label>
        <input
            type="number"
            id="cuttingSpeed_${operation.id}"
            value="100"
        >

        <h4>Параметры пластины</h4>

        <label>Ширина пластины, мм</label>
        <input
            type="number"
            step="0.1"
            id="insertWidth_${operation.id}"
            value="4"
        >
        <label>Тип канавки</label>
<select id="grooveSide_${operation.id}">
    <option value="outer">Наружная</option>
    <option value="inner">Внутренняя</option>
</select>

<br><br>
<div id="innerApproach_${operation.id}" style="display:none;">

    <label>Первый безопасный Z</label>
    <input
        type="number"
        step="0.001"
        id="safeZ_${operation.id}"
        value="5"
    >

</div>
        <h4>Исходная точка</h4>

        <label>Исходный X</label>
        <input
            type="number"
            step="0.001"
            id="startX_${operation.id}"
            value="41"
        >

        <label>Исходный Z</label>
        <input
            type="number"
            step="0.001"
            id="startZ_${operation.id}"
            value="-21.1"
        >

        <h4>Конечная точка</h4>

        <label>Конечный X</label>
        <input
            type="number"
            step="0.001"
            id="endX_${operation.id}"
            value="29.9"
        >

        <label>Конечный Z</label>
        <input
            type="number"
            step="0.001"
            id="endZ_${operation.id}"
            value="-11.6"
        >

        <h4>Параметры G75</h4>

        <label>Глубина врезания P, мм</label>
        <input
            type="number"
            step="0.001"
            id="depthP_${operation.id}"
            value="5"
        >

        <label>Q — отступ между врезаниями</label>
        <input
            type="text"
            id="stepQ_${operation.id}"
            value="3500"
            readonly
        >

        <label>Подача F</label>
        <input
            type="number"
            step="0.001"
            id="feed_${operation.id}"
            value="0.05"
        >

        <br><br>

        <button onclick="removeOperation(${operation.id})">
            Удалить этот G75
        </button>
    `;

    container.appendChild(block);
const grooveSide =
    document.getElementById(`grooveSide_${operation.id}`);

const innerApproach =
    document.getElementById(`innerApproach_${operation.id}`);

if (grooveSide && innerApproach) {

    grooveSide.addEventListener("change", function () {

        if (this.value === "inner") {
            innerApproach.style.display = "block";
        }
        else {
            innerApproach.style.display = "none";
        }
    });
}
    updateG75Q(operation.id);

    const widthInput =
        document.getElementById(
            `insertWidth_${operation.id}`
        );

    if (widthInput) {

        widthInput.addEventListener(
            "input",
            function () {
                updateG75Q(operation.id);
            }
        );
    }
}
function updateG75Q(id) {

    const insertWidth =
        Number(getValue(`insertWidth_${id}`));

    const q =
        Math.round((insertWidth - 0.5) * 1000);

    const qField =
        document.getElementById(`stepQ_${id}`);

    if (qField) {
        qField.value = q;
    }
}

/* =========================
   Отрисовка сверления G01
========================= */

function renderDrillG01(operation, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>Сверление через G01 №${index + 1}</h3>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${operation.id}"
            value="T1010"
        >

        <label>Обороты шпинделя G97 S</label>
        <input
            type="number"
            id="rpm_${operation.id}"
            value="800"
        >

        <h4>Подвод инструмента</h4>

        <label>Подвод по Z</label>
        <input
            type="number"
            step="0.001"
            id="approachZ_${operation.id}"
            value="5"
        >

        <label>Подвод по X</label>
        <input
            type="number"
            step="0.001"
            id="approachX_${operation.id}"
            value="0"
        >

        <h4>Параметры сверления</h4>

        <label>Глубина сверления Z</label>
        <input
            type="number"
            step="0.001"
            id="drillZ_${operation.id}"
            value="-100"
        >

        <label>Подача F</label>
        <input
            type="number"
            step="0.001"
            id="feed_${operation.id}"
            value="0.09"
        >

        <br><br>

        <button onclick="removeOperation(${operation.id})">
            Удалить это сверление G01
        </button>
    `;

    container.appendChild(block);
}

/* =========================
   Отрисовка глубокого сверления G83
========================= */

function renderDrillG83(operation, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>Глубокое сверление G83 №${index + 1}</h3>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${operation.id}"
            value="T1010"
        >

        <label>Обороты шпинделя G97 S</label>
        <input
            type="number"
            id="rpm_${operation.id}"
            value="400"
        >

        <h4>Подвод инструмента</h4>

        <label>Подвод по Z</label>
        <input
            type="number"
            step="0.001"
            id="approachZ_${operation.id}"
            value="3"
        >

        <label>Подвод по X</label>
        <input
            type="number"
            step="0.001"
            id="approachX_${operation.id}"
            value="0"
        >

        <h4>Параметры G83</h4>

        <label>Глубина сверления Z</label>
        <input
            type="number"
            step="0.001"
            id="drillZ_${operation.id}"
            value="-100"
        >

        <label>Q — глубина врезания, мкм</label>
        <input
            type="number"
            id="q_${operation.id}"
            value="5000"
        >

        <label>Подача F</label>
        <input
            type="number"
            step="0.001"
            id="feed_${operation.id}"
            value="0.04"
        >

        <br><br>

        <button onclick="removeOperation(${operation.id})">
            Удалить это сверление G83
        </button>
    `;

    container.appendChild(block);
}

/* =========================
   Отрисовка наружной резьбы G76
========================= */

function renderThreadG76(operation, index) {

    const container =
        document.getElementById("operations");

    const block =
        document.createElement("div");

    block.className = "cycle";

    block.innerHTML = `

        <hr>

        <h3>Наружная резьба G76 №${index + 1}</h3>

<label>Направление резьбы</label>
<select id="threadDirection_${operation.id}">
    <option value="right">Правая</option>
    <option value="left">Левая</option>
</select>

<br><br>

<h4>Инструмент и режимы</h4>

        <label>Инструмент</label>
        <input
            type="text"
            id="tool_${operation.id}"
            value="T505"
        >

        <label>Обороты шпинделя G97 S</label>
        <input
            type="number"
            id="rpm_${operation.id}"
            value="600"
        >

<h4>Подвод инструмента</h4>

        <label>Подвод Z</label>
        <input
            type="number"
            step="0.001"
            id="approachZ_${operation.id}"
            value="5"
        >

        <label>Подвод X</label>
        <input
            type="number"
            step="0.001"
            id="approachX_${operation.id}"
            value="25"
        >

<h4>Первая строка G76</h4>

        <label>Чистовые проходы</label>
        <input
            type="number"
            id="finishPasses_${operation.id}"
            value="1"
        >

        <label>Выход / фаска</label>
        <input
            type="number"
            id="chamfer_${operation.id}"
            value="0"
        >

        <label>Угол профиля</label>
        <input
            type="number"
            id="threadAngle_${operation.id}"
            value="60"
        >

        <label>Минимальная глубина прохода Q (первая строка)</label>
        <input
            type="number"
            id="firstQ_${operation.id}"
            value="50"
        >

        <label>Чистовой припуск R</label>
        <input
            type="number"
            step="0.001"
            id="finishR_${operation.id}"
            value="0.05"
        >

<h4>Вторая строка G76</h4>

        <label>Конечный диаметр X</label>
        <input
            type="number"
            step="0.001"
            id="threadX_${operation.id}"
            value="20"
        >

        <label>Конечная координата Z</label>
        <input
            type="number"
            step="0.001"
            id="threadZ_${operation.id}"
            value="-28"
        >

        <label>Высота резьбы P — рассчитывается автоматически</label>
<input
    type="text"
    id="threadP_${operation.id}"
    value="1626"
    readonly
>

        <label>Глубина первого прохода Q (вторая строка)</label>
        <input
            type="number"
            id="secondQ_${operation.id}"
            value="50"
        >

        <label>Шаг резьбы F</label>
        <input
            type="number"
            step="0.001"
            id="threadF_${operation.id}"
            value="3"
        >

        <br><br>

        <button onclick="removeOperation(${operation.id})">
            Удалить эту резьбу G76
        </button>
    `;

    container.appendChild(block);
   updateThreadG76P(operation.id);

const threadFInput =
    document.getElementById(`threadF_${operation.id}`);

if (threadFInput) {
    threadFInput.addEventListener(
        "input",
        function () {
            updateThreadG76P(operation.id);
        }
    );
}
   const threadDirection =
    document.getElementById(
        `threadDirection_${operation.id}`
    );

if (threadDirection) {

    threadDirection.addEventListener(
        "change",
        function () {

            const approachZField =
                document.getElementById(
                    `approachZ_${operation.id}`
                );

            const threadZField =
                document.getElementById(
                    `threadZ_${operation.id}`
                );

            if (
                approachZField &&
                threadZField
            ) {

                const oldApproachZ =
                    approachZField.value;

                approachZField.value =
                    threadZField.value;

                threadZField.value =
                    oldApproachZ;
            }
        }
    );
}
}
function updateThreadG76P(id) {

    const threadF =
        Number(
            getValue(`threadF_${id}`)
        );

    const threadP =
        Math.round(
            threadF * 0.542 * 1000
        );

    const threadPField =
        document.getElementById(`threadP_${id}`);

    if (threadPField) {
        threadPField.value = threadP;
    }
}

/* =========================
   Список контуров
========================= */

function getContourOptions() {

    const g71s =
        cycles.filter(c => c.type === "G71");

    if (g71s.length === 0) {
        return `<option value="">Нет контуров</option>`;
    }

    return g71s.map((cycle, index) => {

        return `
            <option value="${cycle.id}">
                Контур G71 №${index + 1}
            </option>
        `;

    }).join("");
}


/* =========================
   Добавление точки
========================= */

function addPoint(cycleId) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    if (!cycle) {
        return;
    }

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

    const cycle =
        cycles.find(c => c.id === cycleId);

    cycle.points[index].motion = value;
}


function changeX(cycleId, index, value) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    cycle.points[index].x = value;
}


function changeZ(cycleId, index, value) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    cycle.points[index].z = value;
}


/* =========================
   Удаление точки
========================= */

function removePoint(cycleId, index) {

    const cycle =
        cycles.find(c => c.id === cycleId);

    if (cycle.points.length <= 2) {

        alert(
            "В контуре должно быть минимум две точки."
        );

        return;
    }

    cycle.points.splice(index, 1);

    renderPoints(cycleId);
}


/* =========================
   Удаление операции
========================= */

function removeOperation(id) {

    if (operations.length <= 1) {

        alert(
            "В программе должна остаться хотя бы одна операция."
        );

        return;
    }

    operations =
        operations.filter(operation =>
            operation.id !== id
        );

    cycles =
        cycles.filter(cycle =>
            cycle.id !== id
        );

    renderOperations();
}


/* =========================
   Формат чисел
========================= */

/*
   X, Z, U, W, R:

   2      -> 2.
   2.0    -> 2.
   0.5    -> 0.5
   -20    -> -20.
   -20.5  -> -20.5

   S:

   1500 -> 1500
   110  -> 110
*/


function formatCoordinate(value) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "";
    }

    if (Number.isInteger(number)) {
        return number.toFixed(0) + ".";
    }

    return String(number);
}


function formatDistance(value) {

    return formatCoordinate(value);
}


/* =========================
   Получение значения поля
========================= */

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value;
}


/* =========================
   Генерация программы
========================= */

function generateProgram() {

    const programNumber =
        getValue("programNumber");

    let program = "";

    program += `O${programNumber};\n`;


    /*
       Каждому G71 назначаем
       уникальную пару P/Q.

       N также считается глобально.
    */

    let nextPQ = 1;
    let nextN = 1;


    /*
       Сначала определяем номера контуров.
    */

    const contourMap = new Map();

    cycles.forEach(cycle => {

        const pNumber = nextPQ;
        const qNumber = nextPQ + 1;

        nextPQ += 2;

        contourMap.set(
            cycle.id,
            {
                p: pNumber,
                q: qNumber
            }
        );
    });


    /*
       Генерируем операции
       в том порядке, в котором
       они находятся на странице.
    */

    operations.forEach((operation, operationIndex) => {

        if (operation.type === "G71") {

            const numbers =
                contourMap.get(operation.id);

            if (!numbers) {
                return;
            }

            generateG71(
                operation,
                numbers.p,
                numbers.q
            );
        }


        if (operation.type === "G70") {

            generateG70(operation);
        }
        if (operation.type === "G74") {
            generateG74(operation);
        }
        if (operation.type === "G75") {
            generateG75(operation);
        }
        if (operation.type === "DRILL_G01") {
            generateDrillG01(operation);
        }
        if (operation.type === "DRILL_G83") {
            generateDrillG83(operation);
        }
        if (operation.type === "THREAD_G76") {
            generateThreadG76(operation);
        }

    });
    program += "M30;\n";

   


    showResult(program);


    /*
       Вложенная функция генерации G71.
    */

    function generateG71(
        cycle,
        pNumber,
        qNumber
    ) {

        if (cycle.points.length < 2) {
            return;
        }


        const tool =
            getValue(`tool_${cycle.id}`);

        const maxRpm =
            getValue(`maxRpm_${cycle.id}`);

        const cuttingSpeed =
            getValue(`cuttingSpeed_${cycle.id}`);

        const approachZ =
            formatCoordinate(
                getValue(`approachZ_${cycle.id}`)
            );

        const approachX =
            formatCoordinate(
                getValue(`approachX_${cycle.id}`)
            );

        const correction =
            getValue(`correction_${cycle.id}`);

        const depth =
            formatDistance(
                getValue(`depth_${cycle.id}`)
            );

        const retract =
            formatDistance(
                getValue(`retract_${cycle.id}`)
            );

        const allowanceX =
            formatDistance(
                getValue(`allowanceX_${cycle.id}`)
            );

        const allowanceZ =
            formatDistance(
                getValue(`allowanceZ_${cycle.id}`)
            );

        const feed =
            getValue(`feed_${cycle.id}`);


        program += `${tool};\n`;
        program += `G90G54;\n`;
        program += `G50S${maxRpm};\n`;
        program += `G96S${cuttingSpeed}M03;\n`;

        program +=
            `G00Z${approachZ};\n`;

        program +=
            `G00X${approachX}`;

        if (correction !== "") {
            program += correction;
        }

        program += "M08;\n";


        program +=
            `G71U${depth}R${retract};\n`;

        program +=
            `G71P${pNumber}Q${qNumber}` +
            `U${allowanceX}` +
            `W${allowanceZ}` +
            `F${feed};\n`;


        /*
           Контур.

           P ставится на первой строке.
           Q ставится на последней.
        */

        const firstPoint =
            cycle.points[0];

        let firstLine =
            `G00N${nextN}`;

        nextN++;


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
           Все промежуточные точки.
        */

        for (
            let i = 1;
            i < cycle.points.length - 1;
            i++
        ) {

            const point =
                cycle.points[i];

            let line =
                point.motion;

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
           Последняя точка.
        */

        const lastPoint =
            cycle.points[
                cycle.points.length - 1
            ];

        let lastLine =
            `G01N${nextN}`;

        nextN++;


        if (lastPoint.x !== "") {

            lastLine +=
                `X${formatCoordinate(lastPoint.x)}`;
        }

        if (lastPoint.z !== "") {

            lastLine +=
                `Z${formatCoordinate(lastPoint.z)}`;
        }

        program += lastLine + ";\n";


        /*
           Если включена коррекция,
           обязательно отменяем G41/G42.
        */

        program += "G00Z10.;\n";

if (correction !== "") {
    program += "G40;\n";
}

program += "M09;\n";
program += "M05;\n";
program += "G00G28U0W0;\n";
       program += ";\n";
    }


    /*
       Генерация G70.
    */

    function generateG70(operation) {

        const contourId =
            getValue(
                `contour_${operation.id}`
            );

        if (!contourId) {
            return;
        }

        const numbers =
            contourMap.get(
                Number(contourId)
            );

        /*
           Date.now() создаёт число.
           Значение select может храниться
           как строка, поэтому проверяем также
           строковый вариант.
        */

        let contourNumbers = numbers;

        if (!contourNumbers) {

            contourNumbers =
                contourMap.get(contourId);
        }

        if (!contourNumbers) {
            return;
        }


        const tool =
            getValue(`tool_${operation.id}`);

        const maxRpm =
            getValue(`maxRpm_${operation.id}`);

        const cuttingSpeed =
            getValue(
                `cuttingSpeed_${operation.id}`
            );

        const approachZ =
            formatCoordinate(
                getValue(
                    `approachZ_${operation.id}`
                )
            );

        const approachX =
            formatCoordinate(
                getValue(
                    `approachX_${operation.id}`
                )
            );

        const correction =
            getValue(
                `correction_${operation.id}`
            );

        const feed =
            getValue(
                `feed_${operation.id}`
            );


        program += `${tool};\n`;
        program += `G90G54;\n`;
        program += `G50S${maxRpm};\n`;
        program += `G96S${cuttingSpeed}M03;\n`;

        program +=
            `G00Z${approachZ};\n`;

        program +=
            `G00X${approachX}`;

        if (correction !== "") {
            program += correction;
        }

        program += "M08;\n";


        program +=
            `G70P${contourNumbers.p}` +
            `Q${contourNumbers.q}` +
            `F${feed};\n`;


        /*
           После G70 отход.

           Если G41/G42 были включены,
           G40 обязателен.
        */

      program += "G00Z10.;\n";

if (correction !== "") {
    program += "G40;\n";
}

program += "M09;\n";
program += "M05;\n";
program += "G00G28U0W0;\n";
   program += ";\n";
    }
   function generateG74(operation) {

    const tool =
        getValue(`tool_${operation.id}`);

    const maxRpm =
        getValue(`maxRpm_${operation.id}`);

    const cuttingSpeed =
        getValue(`cuttingSpeed_${operation.id}`);

    const startX =
        formatCoordinate(
            getValue(`startX_${operation.id}`)
        );

    const startZ =
        formatCoordinate(
            getValue(`startZ_${operation.id}`)
        );

    const endX =
        formatCoordinate(
            getValue(`endX_${operation.id}`)
        );

    const depthZ =
        formatCoordinate(
            getValue(`depthZ_${operation.id}`)
        );

    const p =
        getValue(`p_${operation.id}`);

    const q =
        getValue(`q_${operation.id}`);

    const feed =
        getValue(`feed_${operation.id}`);

    program += `${tool};\n`;
    program += `G90G54;\n`;
    program += `G50S${maxRpm};\n`;
    program += `G96S${cuttingSpeed}M03;\n`;

    program += `G00Z${startZ};\n`;
    program += `G00X${startX}M08;\n`;

    program += `G74R0.5;\n`;

    program +=
        `G74X${endX}` +
        `Z${depthZ}` +
        `P${p}` +
        `Q${q}` +
        `F${feed};\n`;

    program += `G00Z10.;\n`;
    program += `M09;\n`;
    program += `M05;\n`;
    program += `G00G28U0W0;\n`;
   program += ";\n";
   }
   function generateG75(operation) {

    const tool =
        getValue(`tool_${operation.id}`);

    const maxRpm =
        getValue(`maxRpm_${operation.id}`);

    const cuttingSpeed =
        getValue(`cuttingSpeed_${operation.id}`);

      const grooveSide =
    getValue(`grooveSide_${operation.id}`);

const safeZ =
    formatCoordinate(
        getValue(`safeZ_${operation.id}`)
    );
      
    const startX =
        formatCoordinate(
            getValue(`startX_${operation.id}`)
        );

    const startZ =
        formatCoordinate(
            getValue(`startZ_${operation.id}`)
        );

    const endX =
        formatCoordinate(
            getValue(`endX_${operation.id}`)
        );

    const endZ =
        formatCoordinate(
            getValue(`endZ_${operation.id}`)
        );

    const depthP =
        Number(
            getValue(`depthP_${operation.id}`)
        );

    const insertWidth =
        Number(
            getValue(`insertWidth_${operation.id}`)
        );

    const q =
        Math.round((insertWidth - 0.5) * 1000);

    const p =
        Math.round(depthP * 1000);

    const feed =
        getValue(`feed_${operation.id}`);

    program += `${tool};\n`;
    program += `G90G54;\n`;
    program += `G50S${maxRpm};\n`;
    program += `G96S${cuttingSpeed}M03;\n`;

    if (grooveSide === "inner") {

    program += `G00Z${safeZ};\n`;
    program += `G00X${startX};\n`;
    program += `G00Z${startZ}M08;\n`;

}
else {

    program += `G00Z${startZ};\n`;
    program += `G00X${startX}M08;\n`;

}

program += `G75R0.5;\n`;

    program +=
        `G75X${endX}` +
        `Z${endZ}` +
        `P${p}` +
        `Q${q}` +
        `F${feed};\n`;

    program += `G00Z10.;\n`;
    program += `M09;\n`;
    program += `M05;\n`;
    program += `G00G28U0W0;\n`;
   program += ";\n";
   }
   function generateDrillG01(operation) {

    const tool =
        getValue(`tool_${operation.id}`);

    const rpm =
        getValue(`rpm_${operation.id}`);

    const approachZ =
        formatCoordinate(
            getValue(`approachZ_${operation.id}`)
        );

    const approachX =
        formatCoordinate(
            getValue(`approachX_${operation.id}`)
        );

    const drillZ =
        formatCoordinate(
            getValue(`drillZ_${operation.id}`)
        );

    const feed =
        formatCoordinate(
            getValue(`feed_${operation.id}`)
        );

    program += `${tool};\n`;
    program += `G90G54;\n`;
    program += `G97S${rpm}M03;\n`;
    program += `G00Z${approachZ};\n`;
    program += `G00X${approachX}M08;\n`;
    program += `G01Z${drillZ}F${feed};\n`;
    program += `G00Z10.;\n`;
    program += `M09;\n`;
    program += `M05;\n`;
    program += `G00G28U0W0;\n`;
    program += `M01;\n`;
    program += ";\n";
   }
   function generateDrillG83(operation) {

    const tool =
        getValue(`tool_${operation.id}`);

    const rpm =
        getValue(`rpm_${operation.id}`);

    const approachZ =
        formatCoordinate(
            getValue(`approachZ_${operation.id}`)
        );

    const approachX =
        formatCoordinate(
            getValue(`approachX_${operation.id}`)
        );

    const drillZ =
        formatCoordinate(
            getValue(`drillZ_${operation.id}`)
        );

    const q =
        getValue(`q_${operation.id}`);

    const feed =
        formatCoordinate(
            getValue(`feed_${operation.id}`)
        );

    program += `${tool};\n`;
    program += `G99G54;\n`;
    program += `G18;\n`;
    program += `G97S${rpm}M03;\n`;
    program += `G00Z${approachZ};\n`;
    program += `G00X${approachX}M08;\n`;
    program += `G83Z${drillZ}Q${q}F${feed};\n`;
    program += `G80;\n`;
    program += `G00Z10.;\n`;
    program += `M09;\n`;
    program += `M05;\n`;
    program += `G00G28U0W0;\n`;
    program += `M01;\n`;
    program += ";\n";
   }
   function generateThreadG76(operation) {

    const tool =
        getValue(`tool_${operation.id}`);

    const rpm =
        getValue(`rpm_${operation.id}`);

    const approachZ =
        formatCoordinate(
            getValue(`approachZ_${operation.id}`)
        );

    const approachX =
        formatCoordinate(
            getValue(`approachX_${operation.id}`)
        );

    const finishPasses =
        getValue(`finishPasses_${operation.id}`)
            .padStart(2, "0");

    const chamfer =
        getValue(`chamfer_${operation.id}`)
            .padStart(2, "0");

    const threadAngle =
        getValue(`threadAngle_${operation.id}`)
            .padStart(2, "0");

    const firstP =
        finishPasses + chamfer + threadAngle;

    const firstQ =
        getValue(`firstQ_${operation.id}`);

    const finishR =
        formatCoordinate(
            getValue(`finishR_${operation.id}`)
        );

    const threadX =
        formatCoordinate(
            getValue(`threadX_${operation.id}`)
        );

    const threadZ =
        formatCoordinate(
            getValue(`threadZ_${operation.id}`)
        );

    const threadP =
        getValue(`threadP_${operation.id}`);

    const secondQ =
        getValue(`secondQ_${operation.id}`);

    const threadF =
        formatCoordinate(
            getValue(`threadF_${operation.id}`)
        );

    program += `${tool};\n`;
    program += `G90G54;\n`;
    program += `G97S${rpm}M03;\n`;
    program += `G00Z${approachZ};\n`;
    program += `G00X${approachX}M08;\n`;

    program +=
        `G76P${firstP}` +
        `Q${firstQ}` +
        `R${finishR};\n`;

    program +=
        `G76X${threadX}` +
        `Z${threadZ}` +
        `P${threadP}` +
        `Q${secondQ}` +
        `F${threadF};\n`;

    program += `G00Z10.;\n`;
    program += `M09;\n`;
    program += `M05;\n`;
    program += `G00G28U0W0;\n`;
    program += `M01;\n`;
    program += ";\n";
   }
}


/* =========================
   Вывод результата
========================= */

function showResult(program) {

    const result =
        document.getElementById("result");

    if (!result) {
        return;
    }

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
   Копирование программы
========================= */

function copyProgram() {

    const output =
        document.getElementById("programOutput");

    if (!output) {
        return;
    }

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
function copyGroovingProgram() {

    const output =
        document.getElementById("groovingProgram");

    if (!output) {
        alert("Не найден текст программы.");
        return;
    }

    navigator.clipboard.writeText(output.innerText)
        .then(() => {
            alert("Программа скопирована.");
        })
        .catch(() => {
            alert("Не удалось скопировать программу.");
        });
}
