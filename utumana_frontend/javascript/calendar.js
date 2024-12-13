function getCalendar(elem, year, month) {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const dayInMonth = getDaysInMonth(year, month);
    
    const checkIn = (year === currentYear && month === currentMonth) 
        ? toUTCDate(currentYear, currentMonth, currentDay + 1)
        : toUTCDate(year, month, 1);
    
    const checkOut = toUTCDate(year, month, dayInMonth + 1);

    doFetch(prefixUrl + 'api/availabilities/' + id +'?check_in=' + formatDateUTC(checkIn) +'&check_out=' + formatDateUTC(checkOut),'GET',headers, null)
    .then(availableDays => {
        let load = document.getElementsByClassName('loader')[0];
        if (load) load.remove();

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            year = currentYear;
            month = currentMonth;
        }
        
        let d = toUTCDate(year, month, 1);
        const monthNames = [
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December'
        ];

        let top = document.createElement('div');
        top.classList.add('top');

        let monthYearSelect = document.createElement('select');
        monthYearSelect.classList.add('month-year-select');

        for (let y = currentYear; y <= currentYear + 2; y++) {
            for (let m = (y === currentYear ? currentMonth : 0); m < 12; m++) {
                let option = document.createElement('option');
                option.value = `${y}-${m}`;
                option.text = `${monthNames[m]} ${y}`;
                if (y === year && m === month) {
                    option.selected = true;
                }
                monthYearSelect.appendChild(option);
            }
        }
        
        monthYearSelect.onchange = (e) => {
            const selectedYear = parseInt(e.target.value.split('-')[0]);
            const selectedMonth = parseInt(e.target.value.split('-')[1]);
            elem.innerHTML = '';
            createLoader(elem);
            getCalendar(elem, selectedYear, selectedMonth);
        };
        top.appendChild(monthYearSelect);
        elem.appendChild(top);

        let scroll = document.createElement('div');
        scroll.classList.add('scroll');

        let goBack = document.createElement('button');
        goBack.innerText = '<';
        goBack.onclick = () => {
            elem.innerHTML = '';
            createLoader(elem);
            let y = year;
            let m = month - 1;
            if (m === -1) {
                m = 11;
                y = y - 1;
            }
            getCalendar(elem, y, m);
        };
        scroll.appendChild(goBack);

        let mon = document.createElement('div');
        mon.innerText = `${monthNames[month]} ${year}`;
        scroll.appendChild(mon);

        let goOn = document.createElement('button');
        goOn.innerText = '>';
        goOn.onclick = () => {
            elem.innerHTML = '';
            createLoader(elem);
            let y = year;
            let m = month + 1;
            if (m === 12) {
                m = 0;
                y = y + 1;
            }
            getCalendar(elem, y, m);
        };
        scroll.appendChild(goOn);

        elem.appendChild(scroll);

        if (year === currentYear && month === currentMonth) {
            goBack.disabled = true;
        }

        // Calendar table
        let table = document.createElement('table');

        let headerRow = document.createElement('tr');
        ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].forEach(day => {
            let th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        let currentRow = document.createElement('tr');

        // Empty start days
        for (let i = 0; i < getDay(d); i++) {
            currentRow.appendChild(document.createElement('td'));
        }

		let currentDateUTC = toUTCDate(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
        // Before today
        while (d < currentDateUTC) {
            let td = document.createElement('td');
            td.textContent = d.getUTCDate();
            td.classList.add('passed');
            currentRow.appendChild(td);
            if (getDay(d) % 7 === 6) {
                table.appendChild(currentRow);
                currentRow = document.createElement('tr');
            }
            d = toUTCDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
        }

        // Available/unavailable days
        while (d.getUTCMonth() === month) {
            let td = document.createElement('td');
            td.textContent = d.getUTCDate();
            let price = getPricePerNight(d, availableDays);
            if (price != null) {
                td.className = 'available';
                let p = document.createElement('p');
                p.id = 'price';
                p.textContent = `${price}€`;
                td.appendChild(p);
            } else {
                td.className = 'unavailable';
            }
            currentRow.appendChild(td);

            if (getDay(d) % 7 === 6) {
                table.appendChild(currentRow);
                currentRow = document.createElement('tr');
            }

            d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
        }

        // Empty cells for remaining days
        if (getDay(d) !== 0) {
            for (let i = getDay(d); i < 7; i++) {
                currentRow.appendChild(document.createElement('td'));
            }
        }

        if (currentRow.children.length > 0) {
            table.appendChild(currentRow);
        }

        elem.appendChild(table);
    })
    .catch(error => {
        console.error('Error fetching availabilities:', error);
        console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    });
}

function getDay(date) {
    let day = date.getUTCDay();
    return day === 0 ? 6 : day - 1;
}

function getPricePerNight(d, availabilities) {
    const dates = Object.entries(availabilities)
        .map(([date, price]) => ({ date: formatDateUTC(new Date(date)), price }))
        .sort((a, b) => a.date - b.date);
    let date = formatDateUTC(d);
    for (let i = 0; i < dates.length; i++) {
        if (date === dates[i].date) {
            return dates[i].price;
        }
    }
    return null;
}

function createLoader(elem) {
    let load = document.createElement('div');
    load.classList.add('loader');
    load.style.left = '50%';
    load.style.top = '50%';
    load.style.transform = 'translate(-50%, -50%)';
    elem.appendChild(load);
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function toUTCDate(year, month, day) {
    return new Date(Date.UTC(year, month, day));
}

function formatDateUTC(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
