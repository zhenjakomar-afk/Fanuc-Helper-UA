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
    <h2>Калькуляторы</h2>

    <h3>Расчёт оборотов шпинделя</h3>

    <label>Диаметр детали D (мм)</label>
    <br>
    <input
        type="number"
        id="calcDiameter"
        value="100"
        step="0.001"
        oninput="calculateRPM()"
    >

    <br><br>

    <label>Скорость резания Vc (м/мин)</label>
    <br>
    <input
        type="number"
        id="calcSpeed"
        value="150"
        step="0.1"
        oninput="calculateRPM()"
    >

    <br><br>

    <label>Обороты шпинделя S (об/мин)</label>
    <br>
    <input
        type="number"
        id="calcRPM"
        readonly
    >
    <br><br>
<hr>

<h3>Расчёт скорости резания Vc</h3>

<label>Диаметр детали D (мм)</label>
<br>
<input
    type="number"
    id="speedDiameter"
    value="100"
    step="0.001"
    oninput="calculateCuttingSpeed()"
>

<br><br>

<label>Обороты шпинделя S (об/мин)</label>
<br>
<input
    type="number"
    id="speedRPM"
    value="600"
    step="1"
    oninput="calculateCuttingSpeed()"
>

<br><br>

<label>Скорость резания Vc (м/мин)</label>
<br>
<input
    type="number"
    id="speedResult"
    readonly
>
<br><br>
<hr>

<h3>Расчёт конусности</h3>

<p>Введите три известных параметра из четырёх.</p>

<label>Большой диаметр D (мм)</label>
<br>
<input type="number" id="taperD" step="any">

<br><br>

<label>Малый диаметр d (мм)</label>
<br>
<input type="number" id="taperSmallD" step="any">

<br><br>

<label>Длина конуса L (мм)</label>
<br>
<input type="number" id="taperL" step="any">

<br><br>

<label>Угол относительно оси Z (°)</label>
<br>
<input type="number" id="taperAngle" step="any">

<br><br>

<button onclick="calculateTaper()">
    РАССЧИТАТЬ
</button>
<br><br>
<hr>

<h3>Калькулятор радиусов R (G02/G03)</h3>

<label>Радиус R (мм)</label>
<br>
<input type="number" id="radiusR" step="any" value="5">

<br><br>

<label>Начальная координата X (диаметр, мм)</label>
<br>
<input type="number" id="radiusX" step="any">

<br><br>

<label>Начальная координата Z (мм)</label>
<br>
<input type="number" id="radiusZ" step="any">

<br><br>

<label>Конечная координата X (диаметр, мм)</label>
<br>
<input type="number" id="radiusTargetX" step="any">
<br><br>

<label>Конечная координата Z (мм)</label>
<br>
<input type="number" id="radiusTargetZ" step="any">
<br><br>

<label>Направление дуги</label>
<br>

<select id="radiusDirection">
    <option value="G02">G02 — по часовой стрелке</option>
    <option value="G03">G03 — против часовой стрелки</option>
</select>

<br><br>

<label>Угол дуги (°)</label>
<br>
<input type="number" id="radiusAngle" step="any"
       placeholder="90° или оставить пустым">
<br><br>

<button onclick="calculateRadius()">
    РАССЧИТАТЬ
</button>
<div id="radiusVariants"></div>
<br><br>

<label>Начало дуги X</label>
<br>
<input type="text" id="radiusStartX" readonly>

<br><br>

<label>Начало дуги Z</label>
<br>
<input type="text" id="radiusStartZ" readonly>

<br><br>

<label>Конец дуги X</label>
<br>
<input type="text" id="radiusEndX" readonly>

<br><br>

<label>Конец дуги Z</label>
<br>
<input type="text" id="radiusEndZ" readonly>
`;
}
function calculateRPM() {
    const diameter = Number(
        document.getElementById("calcDiameter").value
    );

    const speed = Number(
        document.getElementById("calcSpeed").value
    );

    const result = document.getElementById("calcRPM");

    if (diameter > 0 && speed > 0) {
        const rpm = (1000 * speed) / (Math.PI * diameter);
        result.value = Math.round(rpm);
    } else {
        result.value = "";
    }
}
function calculateCuttingSpeed() {
    const diameter = Number(
        document.getElementById("speedDiameter").value
    );

    const rpm = Number(
        document.getElementById("speedRPM").value
    );

    const result =
        document.getElementById("speedResult");

    if (diameter > 0 && rpm > 0) {
        const speed = (Math.PI * diameter * rpm) / 1000;
        result.value = speed.toFixed(2);
    } else {
        result.value = "";
    }
}
function calculateTaper() {
    const ids = ["taperD", "taperSmallD", "taperL", "taperAngle"];
    const fields = ids.map(id => document.getElementById(id));

    const values = fields.map(field =>
        field.value.trim() === "" ? null : Number(field.value)
    );

    const missing = values
        .map((value, index) => value === null ? index : -1)
        .filter(index => index !== -1);

    if (missing.length !== 1) {
        alert("Заполните ровно три поля, оставив одно пустым.");
        return;
    }

    let [D, d, L, angle] = values;
    const index = missing[0];

    if (values.some(value => value !== null && !Number.isFinite(value))) {
        alert("Введите корректные числа.");
        return;
    }

    if ((D !== null && D <= 0) ||
        (d !== null && d < 0) ||
        (L !== null && L <= 0) ||
        (angle !== null && (angle <= 0 || angle >= 90))) {
        alert("Проверьте введённые размеры и угол.");
        return;
    }

    const radians = angle === null ? null : angle * Math.PI / 180;

    if (index === 0) {
        D = d + 2 * L * Math.tan(radians);
    }

    if (index === 1) {
        d = D - 2 * L * Math.tan(radians);
    }

    if (index === 2) {
        L = (D - d) / (2 * Math.tan(radians));
    }

    if (index === 3) {
        angle = Math.atan((D - d) / (2 * L)) * 180 / Math.PI;
    }

    const results = [D, d, L, angle];

    if (results.some(value => !Number.isFinite(value)) ||
        D <= 0 || d < 0 || D <= d || L <= 0 ||
        angle <= 0 || angle >= 90) {
        alert("Из этих данных невозможно построить правильный конус.");
        return;
    }

    fields[index].value = results[index].toFixed(4);
}
function calculateRadius() {
    const R = Number(document.getElementById("radiusR").value);
    const X = Number(document.getElementById("radiusX").value);
    const Z = Number(document.getElementById("radiusZ").value);

    const rField = document.getElementById("radiusR");
    const xField = document.getElementById("radiusX");
    const zField = document.getElementById("radiusZ");

    const targetXField = document.getElementById("radiusTargetX");
    const targetZField = document.getElementById("radiusTargetZ");

    const targetXText = targetXField.value.trim();
    const targetZText = targetZField.value.trim();

    const targetX = targetXText === "" ? null : Number(targetXText);
    const targetZ = targetZText === "" ? null : Number(targetZText);
   
    const angleField = document.getElementById("radiusAngle");

    const angle = angleField.value.trim() === ""
    ? 90
    : Number(angleField.value);
   
    if (
        rField.value.trim() === "" ||
        xField.value.trim() === "" ||
        zField.value.trim() === "" ||
        !Number.isFinite(R) ||
        !Number.isFinite(X) ||
        !Number.isFinite(Z) ||
        R <= 0 ||
        !Number.isFinite(angle) ||
        angle <= 0 ||
        angle >= 360 ||
        (targetX === null && targetZ === null) ||
        (targetX !== null && !Number.isFinite(targetX)) ||
        (targetZ !== null && !Number.isFinite(targetZ))
    ) {
        alert("Введите корректные значения R, X и Z.");
        return;
    }

   const startX = X;
const startZ = Z;

let endX = targetX;
let endZ = targetZ;
   const arcDirection = document.getElementById("radiusDirection").value;
   const radians = angle * Math.PI / 180;
const chord = 2 * R * Math.sin(radians / 2);
 
   if (endZ === null && endX !== null) {
    const dx = (endX - startX) / 2;
    const square = chord * chord - dx * dx;

    if (square < -1e-9) {
        alert("При таком радиусе и угле дуга невозможна");
        return;
    }

    const dz = Math.sqrt(Math.max(0, square));
    endZ = startZ - dz;
alert(
    "Возможные конечные координаты Z:\n" +
    "Z" + (startZ - dz).toFixed(3) + "\n" +
    "Z" + (startZ + dz).toFixed(3)
);
  } 
   if (endX === null && endZ !== null) {
    const dz = endZ - startZ;
    const square = chord * chord - dz * dz;

    if (square < -1e-9) {
        alert("При таком радиусе и угле дуга невозможна");
        return;
    }

    const dx = 2 * Math.sqrt(Math.max(0, square));
    endX = startX + dx;

    alert(
        "Возможные конечные координаты X:\n" +
        "X" + (startX + dx).toFixed(3) + "\n" +
        "X" + (startX - dx).toFixed(3)
    );
   }
   document.getElementById("radiusStartX").value =
        startX.toFixed(3);

    document.getElementById("radiusStartZ").value =
        startZ.toFixed(3);

    document.getElementById("radiusEndX").value =
        endX.toFixed(3);

    document.getElementById("radiusEndZ").value =
        endZ.toFixed(3);
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
            + Резьба G76
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

        <h3 id="threadTitle_${operation.id}">Наружная резьба G76 №${index + 1}</h3>

<label>Тип резьбы</label>
<select id="threadType_${operation.id}">
    <option value="external">Наружная</option>
    <option value="internal">Внутренняя</option>
</select>

<br><br>

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

<div id="threadSafeZBlock_${operation.id}" style="display:none;">

    <label>Первый безопасный Z</label>
    <input
        type="number"
        step="0.001"
        id="threadSafeZ_${operation.id}"
        value="5"
    >

    <br><br>
</div>
        

        <label>Подвод X</label>
        <input
            type="number"
            step="0.001"
            id="approachX_${operation.id}"
            value="25"
        >
        <label>Подвод Z</label>
        <input
            type="number"
            step="0.001"
            id="approachZ_${operation.id}"
            value="5"
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

<label>Система різьби</label>
<select id="threadSystem_${operation.id}">
    <option value="metric">Метрична</option>
    <option value="inch">Дюймова</option>
</select>
<div id="inchSizeBlock_${operation.id}" style="display:none;">
    <br>
    <label>Розмір різьби, дюйм</label>
    <select id="inchSize_${operation.id}">
        <option value="1/8">1/8"</option>
        <option value="1/4">1/4"</option>
        <option value="3/8">3/8"</option>
        <option value="1/2">1/2"</option>
        <option value="3/4">3/4"</option>
        <option value="1">1"</option>
        <option value="1 1/4">1 1/4"</option>
        <option value="1 1/2">1 1/2"</option>
        <option value="2">2"</option>
        <option value="2 1/2">2 1/2"</option>
        <option value="3">3"</option>
        <option value="4">4"</option>
    </select>
</div>
<br><br>
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

        <label>Крок різьби F</label>
<input
    type="text"
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
   const threadType =
    document.getElementById(`threadType_${operation.id}`);

const threadTitle =
    document.getElementById(`threadTitle_${operation.id}`);

if (threadType && threadTitle) {

    function updateThreadType() {
        if (threadType.value === "internal") {
            threadTitle.textContent =
                `Внутренняя резьба G76 №${index + 1}`;
        } else {
            threadTitle.textContent =
                `Наружная резьба G76 №${index + 1}`;
        }
       const threadDirection =
    document.getElementById(`threadDirection_${operation.id}`);

const threadSafeZBlock =
    document.getElementById(`threadSafeZBlock_${operation.id}`);

if (threadDirection && threadSafeZBlock) {
    threadSafeZBlock.style.display =
        threadType.value === "internal" &&
        threadDirection.value === "left"
            ? "block"
            : "none";
}
    }

   const directionSelect =
    document.getElementById(`threadDirection_${operation.id}`);

if (directionSelect) {
    directionSelect.addEventListener(
        "change",
        updateThreadType
    );
}
    threadType.addEventListener(
        "change",
        updateThreadType
    );

    updateThreadType();
}
   const threadSystem =
    document.getElementById(`threadSystem_${operation.id}`);

const inchSizeBlock =
    document.getElementById(`inchSizeBlock_${operation.id}`);

if (threadSystem) {

    function updateThreadSystem() {

        if (inchSizeBlock) {
            inchSizeBlock.style.display =
                threadSystem.value === "inch" ? "block" : "none";
        }

        updateThreadG76P(operation.id);
    }

    threadSystem.addEventListener(
        "change",
        updateThreadSystem
    );

    updateThreadSystem();
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
    const threadSystem =
        getValue(`threadSystem_${id}`);

    const threadFField =
        document.getElementById(`threadF_${id}`);

    const threadPField =
        document.getElementById(`threadP_${id}`);

    if (!threadFField || !threadPField) {
        return;
    }

    if (threadSystem === "metric") {
        const threadF =
            Number(threadFField.value);

        const threadP =
            Math.round(threadF * 0.542 * 1000);

        threadPField.value = threadP;
        threadPField.readOnly = true;
    }

    if (threadSystem === "inch") {
        const value =
            threadFField.value.trim();

        if (value.includes("/")) {
            const parts = value.split("/");

            if (parts.length === 2) {
                const numerator = Number(parts[0]);
                const denominator = Number(parts[1]);

                if (denominator !== 0) {
                    const inchPitch =
                        numerator / denominator;

                    const metricPitch =
                        inchPitch * 25.4;

                    threadFField.dataset.metricPitch =
                        metricPitch;
                }
            }
        } else {
            const inchPitch = Number(value);

            if (!isNaN(inchPitch)) {
                threadFField.dataset.metricPitch =
                    inchPitch * 25.4;
            }
        }

        threadPField.readOnly = false;
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

      const threadSafeZ =
    formatCoordinate(
        getValue(`threadSafeZ_${operation.id}`)
    );
      
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

    let threadF;

const threadSystem =
    getValue(`threadSystem_${operation.id}`);

if (threadSystem === "inch") {
    const threadFField =
        document.getElementById(`threadF_${operation.id}`);

    const metricPitch =
        Number(threadFField.dataset.metricPitch);

    threadF =
        formatCoordinate(metricPitch);
} else {
    threadF =
        formatCoordinate(
            getValue(`threadF_${operation.id}`)
        );
}

    program += `${tool};\n`;
    program += `G90G54;\n`;
    program += `G97S${rpm}M03;\n`;
    const threadType = getValue(`threadType_${operation.id}`);
const threadDirection = getValue(`threadDirection_${operation.id}`);

if (threadType === "internal" && threadDirection === "left") {
    program += `G00Z${threadSafeZ};\n`;
    program += `G00X${approachX}M08;\n`;
    program += `G00Z${approachZ};\n`;
} else {
    program += `G00Z${approachZ};\n`;
    program += `G00X${approachX}M08;\n`;
}

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
        <br><br>

        <button onclick="saveNC()">
            💾 СОХРАНИТЬ NC
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
function saveNC() {
    const output = document.getElementById("programOutput");

    if (!output || !output.value.trim()) {
        alert("Сначала создайте программу.");
        return;
    }

    const program = output.value;

    const match = program.match(/\bO(\d+)\b/);
    const fileName = match ? `O${match[1]}.NC` : "PROGRAM.NC";

    const blob = new Blob([program], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
