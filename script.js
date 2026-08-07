function showPage(page){

    const content=document.getElementById("content");

    switch(page){

        case "g71":
            content.innerHTML=`
            <h2>G71 / G70</h2>

            <p><b>Генератор находится в разработке.</b></p>

            <p>Будут доступны:</p>

            <ul>
                <li>наружное точение</li>
                <li>внутреннее точение</li>
                <li>автоматический расчёт припуска</li>
                <li>готовая программа Fanuc</li>
            </ul>
            `;
        break;

        case "g76":
            content.innerHTML=`
            <h2>G76</h2>

            <p>Генератор резьбы скоро появится.</p>
            `;
        break;

        case "turning":
            content.innerHTML="<h2>Наружное точение</h2><p>Раздел в разработке.</p>";
        break;

        case "grooving":
            content.innerHTML="<h2>Канавки G74/G75</h2><p>Раздел в разработке.</p>";
        break;

        case "calculator":
            content.innerHTML="<h2>Калькуляторы</h2><p>Скоро будут калькуляторы режимов резания и конусов.</p>";
        break;

        case "library":
            content.innerHTML="<h2>Библиотека</h2><p>Здесь будут готовые программы и примеры.</p>";
        break;

    }

}
