Module.register("MMM-MonthCalendar", {
    defaults: {
        updateInterval: 24 * 60 * 60 * 1000, // Atualiza uma vez por dia
        fadeSpeed: 2000
    },

    getStyles: function() {
        return ["MMM-MonthCalendar.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.calendarData = this.getCalendarData();
        this.month = this.getMonth();
        this.scheduleUpdate();
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "month-calendar";
        
        // Adiciona o cabeçalho
        var header = document.createElement("div");
        header.className = "calendar-header";
        header.innerText = this.month;
        wrapper.appendChild(header);

        // Adiciona uma linha horizontal
        var line = document.createElement("hr");
        line.className = "calendar-line";
        wrapper.appendChild(line);

        var table = document.createElement("table");
        table.className = "calendar-table";

        // Adiciona cabeçalhos dos dias da semana
        var daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        var headerRow = document.createElement("tr");
        daysOfWeek.forEach(day => {
            var th = document.createElement("th");
            th.innerText = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Adiciona dias do mês
        this.calendarData.forEach(week => {
            var row = document.createElement("tr");
            week.forEach(day => {
                var cell = document.createElement("td");
                if (day) {
                    cell.innerText = day.day;
                    if (day.isCurrentDay) {
                        cell.className = "current-day";
                    }
                } else {
                    cell.innerText = "";
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        wrapper.appendChild(table);
        return wrapper;
    },

    getCalendarData: function() {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        var currentDate = date.getDate();

        var weeks = [];
        var week = new Array(7).fill(null);
        var currentDay = 1;

        for (let i = firstDay; i < 7; i++) {
            week[i] = { day: currentDay, isCurrentDay: currentDay === currentDate };
            currentDay++;
        }
        weeks.push(week);

        while (currentDay <= lastDate) {
            week = new Array(7).fill(null);
            for (let i = 0; i < 7 && currentDay <= lastDate; i++) {
                week[i] = { day: currentDay, isCurrentDay: currentDay === currentDate };
                currentDay++;
            }
            weeks.push(week);
        }

        return weeks;
    },

    getMonth: function () {
        var date = new Date();
        month_lowerCase = date.toLocaleString('default', { month: 'long' });
        month_UpperCase = month_lowerCase.charAt(0).toUpperCase() + month_lowerCase.slice(1);
        
        return month_UpperCase;
    },

    scheduleUpdate: function() {
        // Atualiza o calendário à meia-noite e então a cada 24 horas
        var now = new Date();
        var nextUpdate = new Date();
        nextUpdate.setHours(24, 0, 0, 0); // Define para a próxima meia-noite
        
        if (now.getTime() > nextUpdate.getTime()) {
            // Se já passou da meia-noite, define o próximo horário de atualização para o dia seguinte
            nextUpdate.setDate(nextUpdate.getDate() + 1);
        }

        var timeUntilUpdate = nextUpdate.getTime() - now.getTime();

        // Atualiza o calendário e agenda a próxima atualização para 24 horas depois
        setTimeout(() => {
            this.updateDom(this.config.fadeSpeed);
            setInterval(() => {
                this.updateDom(this.config.fadeSpeed);
            }, this.config.updateInterval);
        }, timeUntilUpdate);
    }
});
