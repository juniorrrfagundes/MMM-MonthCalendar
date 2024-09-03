Module.register("MMM-MonthCalendar", {
    defaults: {
        updateInterval: 3 * 60 * 60 * 1000, // Intervalo de atualização (24 horas)
        fadeSpeed: 2000,
        daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },

    getStyles: function() {
        return ["MMM-MonthCalendar.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.updateCalendarData();
        this.scheduleUpdate();
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "month-calendar";
        
        const header = document.createElement("div");
        header.className = "calendar-header";
        header.innerText = this.month;
        wrapper.appendChild(header);

        const line = document.createElement("hr");
        line.className = "calendar-line";
        wrapper.appendChild(line);

        const table = document.createElement("table");
        table.className = "calendar-table";

        const daysOfWeek = this.config.daysOfWeek;
        const headerRow = document.createElement("tr");
        daysOfWeek.forEach(day => {
            const th = document.createElement("th");
            th.innerText = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        this.calendarData.forEach(week => {
            const row = document.createElement("tr");
            week.forEach(day => {
                const cell = document.createElement("td");
                if (day) {
                    cell.innerText = day.day;
                    if (day.isCurrentDay) {
                        cell.className = "current-day";
                    }
                }
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        wrapper.appendChild(table);
        return wrapper;
    },

    getCalendarData: function() {
        date = new Date(); 
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const currentDate = date.getDate();

        const weeks = [];
        let week = new Array(7).fill(null);
        let currentDay = 1;

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
        date = new Date(); 
        const monthLowerCase = date.toLocaleString('default', { month: 'long' });
        return monthLowerCase.charAt(0).toUpperCase() + monthLowerCase.slice(1);
    },

    scheduleUpdate: function() {
        const now = new Date();
        const nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0, 0);
        
        if (now > nextUpdate) {
            nextUpdate.setDate(nextUpdate.getDate() + 1);
        }
    
        const timeUntilUpdate = nextUpdate.getTime() - now.getTime();
    
        setTimeout(() => {
            this.updateCalendarData(); // Atualiza os dados do calendário
            this.updateDom(this.config.fadeSpeed);
            setInterval(() => {
                this.updateCalendarData(); // Atualiza os dados do calendário
                this.updateDom(this.config.fadeSpeed);
            }, this.config.updateInterval);
        }, timeUntilUpdate);
    },

    updateCalendarData: function() {
        this.calendarData = this.getCalendarData();
        this.month = this.getMonth();
    },

});
