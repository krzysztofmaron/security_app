document.addEventListener('DOMContentLoaded', function(){

    // Render default district=1 data
    fetchIncidentsData('../api/incidents')

    // Fetch api for incidents data and filter by district
    async function fetchIncidentsData(url){
    
        const districtValue = document.getElementById('selectElement').value
    
        await fetch(url)
          .then((response) => {
              if (!response.ok) {
              throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then((data) => {
      
            dataDistrictFiltered = data.filter(item => {
                const itemDistrict = item.facility.district.name
    
                return itemDistrict === districtValue
            })
            renderWeeklyChart(dataDistrictFiltered)
            renderDailyBars(dataDistrictFiltered)
            renderDailyWeeklyCharts(dataDistrictFiltered)
            render24Hours(dataDistrictFiltered)
    
          })
          .catch((error) => {
              console.error('Fetch error:', error);
          })
    }
    
    // Render "Weekly incidents statistics" chart
    function renderWeeklyChart(data){
        const currentDate = new Date()
        const currentDay = currentDate.getDay()
        const mondayOffset = currentDay === 0 ? 6 : currentDay - 1
        const sundayOffset = 7 - currentDay
        const lastMonday = new Date(currentDay)
        lastMonday.setDate(currentDate.getDate() - mondayOffset)
        const nearestSunday = new Date(currentDate)
        nearestSunday.setDate(currentDate.getDate() + sundayOffset)
    
        let weeklyData = []
        weeklyData = data.filter(item => {
            const mYear = lastMonday.getFullYear()
            const mMonth = (lastMonday.getMonth() + 1).toString().padStart(2, '0')
            const mDay = lastMonday.getDate().toString().padStart(2, '0')
            const mondayFormatted = `${mYear}-${mMonth}-${mDay}`
            const sYear = nearestSunday.getFullYear()
            const sMonth = (nearestSunday.getMonth() + 1).toString().padStart(2, '0')
            const sDay = nearestSunday.getDate().toString().padStart(2, '0')
            const sundayFormatted = `${sYear}-${sMonth}-${sDay}`
    
            const staticMonday = new Date(2024, 0, 22)
            const smYear = staticMonday.getFullYear()
            const smMonth = (staticMonday.getMonth() + 1).toString().padStart(2, '0')
            const smDay = staticMonday.getDate().toString().padStart(2, '0')
            const staticMondayFormatted = `${smYear}-${smMonth}-${smDay}`
            const staticSunday = new Date(2024, 0, 28)
            const ssYear = staticSunday.getFullYear()
            const ssMonth = (staticSunday.getMonth() + 1).toString().padStart(2, '0')
            const ssDay = staticSunday.getDate().toString().padStart(2, '0')
            const staticSundayFormatted = `${ssYear}-${ssMonth}-${ssDay}`
    
            const isInDateRange = item.date >= staticMondayFormatted && item.date <= staticSundayFormatted      //remove 'static' from variable names in production
            
            return isInDateRange
        })
        function countOccurencesPerDay(items){
            const typeCountsPerDay = {}
            const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    
            days.forEach(day => {
                typeCountsPerDay[day] = {}
                items.forEach(item => {
                    const itemDate = new Date(item.date)
                    const itemDay = itemDate.getDay()
                    if ((itemDay === 0 && day === 'Sunday') || (itemDay !== 0 && itemDay === days.indexOf(day) + 1)) {
                        typeCountsPerDay[day][item.type] = (typeCountsPerDay[day][item.type] || 0) + 1
                    }
                })
            })
            return typeCountsPerDay
        }
        const typeCountsPerDay = countOccurencesPerDay(weeklyData)
        //DESTROYING EXISTING CHART
        const existingChart = Chart.getChart("myChart")
        if (existingChart) {
            existingChart.destroy()
        }

        //CREATING A NEW CHART
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(typeCountsPerDay),
                datasets: [
                    { 
                        label: 'CAPTURE', 
                        data: Object.values(typeCountsPerDay).map(obj => obj['capture'] || 0), 
                        borderColor: '#dc5b5b', 
                        borderWidth: "3", 
                        lineTension: .15,
                        fill: true,
                        backgroundColor: '#dc5b5b25',
                        pointBackgroundColor: "#dc5b5b",
                    },{ 
                        label: 'REVEAL', 
                        data: Object.values(typeCountsPerDay).map(obj => obj['reveal'] || 0), 
                        borderColor: '#3bceb3', 
                        borderWidth: "3", 
                        lineTension: .15,
                        fill: true,
                        backgroundColor: '#3bceb325',
                        pointBackgroundColor: "#3bceb3",
                    },{ 
                        label: 'PASS', 
                        data: Object.values(typeCountsPerDay).map(obj => obj['pass'] || 0), 
                        borderColor: '#d5f946', 
                        borderWidth: "3", 
                        lineTension: .15,
                        fill: true,
                        backgroundColor: '#d5f94625',
                        pointBackgroundColor: "#d5f946",
                    },{ 
                        label: 'PREVENTION', 
                        data: Object.values(typeCountsPerDay).map(obj => obj['prevention'] || 0), 
                        borderColor: '#8b64ff', 
                        borderWidth: "3", 
                        lineTension: .15,
                        fill: true,
                        backgroundColor: '#8b64ff25',
                        pointBackgroundColor: "#8b64ff",
                    },
                ]
            },
            options: {
                aspectRatio: 2.5,
                layout: {
                    padding: {
                        left: 15,
                        top: 25,
                    }
                },
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            padding: 12,
                            color: '#FFFFFF',
                            font: {
                                family: "Helvetica",
                                size: 13,
                                weight: 'lighter',
                            }
                        }
                    },
                    x: {
                        ticks: {
                            padding: 12,
                            // stepSize: 2,
                            color: '#FFFFFF',
                            font: {
                                family: "Helvetica",
                                size: 13,
                                weight: 'lighter',
                            },
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'left',
                        align: 'start',
                        labels: {
                            boxWidth: 14,
                            boxHeight: 14,
                            color: '#FFFFFF',
                            font: {
                                family: "Helvetica",
                                size: 14,
                                weight: 'lighter',
                                lineHeight: 14,
                            },
                        }
                    }
                }
            }
        })
    }
    
    // Render "Current day" statistics bars
    function renderDailyBars(data){
        const today = new Date(2024, 0, 25)     //Leave the parenthesis empty for today's data
        const tYear = today.getFullYear()
        const tMonth = (today.getMonth() + 1).toString().padStart(2, '0')
        const tDay = today.getDate().toString().padStart(2, '0')
        const formattedToday = `${tYear}-${tMonth}-${tDay}`
    
        const dailyData = data.filter(item => {
            const isDesiredDate = item.date === formattedToday
        
            return isDesiredDate
        })
        function countOccurencesPerType(data){
            const occurencyCount = {}
            data.forEach(e => {
                if (occurencyCount[e.type]) {
                    occurencyCount[e.type]++
                }else{
                    occurencyCount[e.type] = 1
                }
            })
            return occurencyCount
        }
        const dataset = countOccurencesPerType(dailyData)
    
        const captures = dataset[type="capture"] || 0
        const reveals = dataset[type="reveal"] || 0
        const passes = dataset[type="pass"] || 0
        const preventions = dataset[type="prevention"] || 0
        const numbers = [captures, reveals, passes, preventions]
        const maxValue = Math.max(...numbers)
        const maxWidth = 220
    
        const capturesBar = document.querySelector('.stat-bar.capture')
        const revealsBar = document.querySelector('.stat-bar.reveal')
        const passesBar = document.querySelector('.stat-bar.pass')
        const preventionsBar = document.querySelector('.stat-bar.prevention')
        capturesBar.style.width = parseInt((captures/maxValue)*maxWidth) !== 0 ? parseInt((captures/maxValue)*maxWidth) + 'px': '5px'
        revealsBar.style.width = parseInt((reveals/maxValue)*maxWidth) !== 0 ? parseInt((reveals/maxValue)*maxWidth) + 'px': '5px'
        passesBar.style.width = parseInt((passes/maxValue)*maxWidth) !== 0 ? parseInt((passes/maxValue)*maxWidth) + 'px': '5px'
        preventionsBar.style.width = parseInt((preventions/maxValue)*maxWidth) !== 0 ? parseInt((preventions/maxValue)*maxWidth) + 'px': '5px'
        const capturesCount = document.querySelector('.stat-bar-count.capture')
        const revealsCount = document.querySelector('.stat-bar-count.reveal')
        const passesCount = document.querySelector('.stat-bar-count.pass')
        const preventionsCount = document.querySelector('.stat-bar-count.prevention')
        capturesCount.innerHTML = captures
        revealsCount.innerHTML = reveals
        passesCount.innerHTML = passes
        preventionsCount.innerHTML = preventions
    }

    // Render "Incidents distribution" charts
    function renderDailyWeeklyCharts(data){

        const currentDate = new Date()
        const currentDay = currentDate.getDay()
        const mondayOffset = currentDay === 0 ? 6 : currentDay - 1
        const sundayOffset = 7 - currentDay
        const lastMonday = new Date(currentDay)
        lastMonday.setDate(currentDate.getDate() - mondayOffset)
        const nearestSunday = new Date(currentDate)
        nearestSunday.setDate(currentDate.getDate() + sundayOffset)
    
        let weeklyData = []
        weeklyData = data.filter(item => {
            const mYear = lastMonday.getFullYear()
            const mMonth = (lastMonday.getMonth() + 1).toString().padStart(2, '0')
            const mDay = lastMonday.getDate().toString().padStart(2, '0')
            const sYear = nearestSunday.getFullYear()
            const sMonth = (nearestSunday.getMonth() + 1).toString().padStart(2, '0')
            const sDay = nearestSunday.getDate().toString().padStart(2, '0')
            const mondayFormatted = `${mYear}-${mMonth}-${mDay}`
            const sundayFormatted = `${sYear}-${sMonth}-${sDay}`
    
            const staticMonday = new Date(2024, 0, 22)
            const smYear = staticMonday.getFullYear()
            const smMonth = (staticMonday.getMonth() + 1).toString().padStart(2, '0')
            const smDay = staticMonday.getDate().toString().padStart(2, '0')
            const staticSunday = new Date(2024, 0, 28)
            const ssYear = staticSunday.getFullYear()
            const ssMonth = (staticSunday.getMonth() + 1).toString().padStart(2, '0')
            const ssDay = staticSunday.getDate().toString().padStart(2, '0')
            const staticMondayFormatted = `${smYear}-${smMonth}-${smDay}`
            const staticSundayFormatted = `${ssYear}-${ssMonth}-${ssDay}`
    
            const isInDateRange = item.date >= staticMondayFormatted && item.date <= staticSundayFormatted
            
            return isInDateRange
        })
        
        const weeklyCounts = {}
        weeklyData.forEach(e => {
            const type = e.type
            weeklyCounts[type] = (weeklyCounts[type] || 0) + 1
        })

        const existingChart = Chart.getChart("myChart2")
        if (existingChart) {
            existingChart.destroy()
        }

        const colorsByTypes = {
            capture: '#dc5b5b',
            reveal: '#3bdeb3',
            pass: '#d5f946',
            prevention: '#8b64ff'
        }

        const ctx = document.getElementById('myChart2').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(weeklyCounts),
                datasets: [{
                    data: Object.values(weeklyCounts),
                    backgroundColor: Object.keys(weeklyCounts).map(type => colorsByTypes[type]),
                    borderWidth: [0, 0, 0, 0]
                }]
            },
            options: {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        })
        const totalCount = (weeklyCounts[type='capture'] || 0) + (weeklyCounts[type='reveal'] || 0) + (weeklyCounts[type='pass'] || 0) + (weeklyCounts[type='prevention'] || 0)
        const weeklyCapturePercentage = document.querySelector('.chart2-legend .percentage.capture')
        const weeklyRevealPercentage = document.querySelector('.chart2-legend .percentage.reveal')
        const weeklyPassPercentage = document.querySelector('.chart2-legend .percentage.pass')
        const weeklyPreventionPercentage = document.querySelector('.chart2-legend .percentage.prevention')
        const capturePercent = weeklyCounts[type='capture'] !== undefined ? parseInt(weeklyCounts[type='capture'] / totalCount * 100) : 0
        const revealPercent = weeklyCounts[type='reveal'] !== undefined ? parseInt(weeklyCounts[type='reveal'] / totalCount * 100) : 0
        const passPercent = weeklyCounts[type='pass'] !== undefined ? parseInt(weeklyCounts[type='pass'] / totalCount * 100) : 0
        const preventionPercent = 100 - capturePercent - revealPercent - passPercent
        weeklyCapturePercentage.innerHTML = capturePercent + '%'
        weeklyRevealPercentage.innerHTML = revealPercent + '%'
        weeklyPassPercentage.innerHTML = passPercent + '%'
        weeklyPreventionPercentage.innerHTML = preventionPercent + '%'
        const weeklyCaptureCount = document.querySelector('.chart2-legend .count.capture')
        const weeklyRevealCount = document.querySelector('.chart2-legend .count.reveal')
        const weeklyPassCount = document.querySelector('.chart2-legend .count.pass')
        const weeklyPreventionCount = document.querySelector('.chart2-legend .count.prevention')
        weeklyCaptureCount.innerHTML = weeklyCounts[type='capture'] || 0
        weeklyRevealCount.innerHTML = weeklyCounts[type='reveal'] || 0
        weeklyPassCount.innerHTML = weeklyCounts[type='pass'] || 0
        weeklyPreventionCount.innerHTML = weeklyCounts[type='prevention'] || 0

        const today = new Date(2024, 0, 25)     //Leave the parenthesis empty for today's data
        const tYear = today.getFullYear()
        const tMonth = (today.getMonth() + 1).toString().padStart(2, '0')
        const tDay = today.getDate().toString().padStart(2, '0')
        const formattedToday = `${tYear}-${tMonth}-${tDay}`
    
        const dailyData = data.filter(item => {
            const isDesiredDate = item.date === formattedToday
            return isDesiredDate
        })
        function countOccurencesPerType(data){
            const occurencyCount = {}
            data.forEach(e => {
                if (occurencyCount[e.type]) {
                    occurencyCount[e.type]++
                }else{
                    occurencyCount[e.type] = 1
                }
            })
            return occurencyCount
        }
        const dataset = countOccurencesPerType(dailyData)

        const existingChart2 = Chart.getChart("myChart3")
        if (existingChart2) {
            existingChart2.destroy()
        }

        const ctx2 = document.getElementById('myChart3').getContext('2d');
        const myChart2 = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dataset),
                datasets: [{
                    data: Object.values(dataset),
                    backgroundColor: Object.keys(dataset).map(type => colorsByTypes[type]),
                    borderWidth: [0, 0, 0, 0]
                }]
            },
            options: {
                aspectRatio: 1,
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        })

        const totalCount2 = (dataset[type='capture'] || 0) + (dataset[type='reveal'] || 0) + (dataset[type='pass'] || 0) + (dataset[type='prevention'] || 0)
        const dailyCapturePercentage = document.querySelector('.chart3-legend .percentage.capture')
        const dailyRevealPercentage = document.querySelector('.chart3-legend .percentage.reveal')
        const dailyPassPercentage = document.querySelector('.chart3-legend .percentage.pass')
        const dailyPreventionPercentage = document.querySelector('.chart3-legend .percentage.prevention')
        const capturePercent2 = dataset[type='capture'] !== undefined ? parseInt(dataset[type='capture'] / totalCount2 * 100) : 0
        const revealPercent2 =  dataset[type='reveal'] !== undefined ? parseInt(dataset[type='reveal'] / totalCount2 * 100) : 0
        const passPercent2 =  dataset[type='pass'] !== undefined ? parseInt(dataset[type='pass'] / totalCount2 * 100) : 0
        const preventionPercent2 = 100 - capturePercent2 - revealPercent2 - passPercent2
        dailyCapturePercentage.innerHTML = capturePercent2 + '%'
        dailyRevealPercentage.innerHTML = revealPercent2 + '%'
        dailyPassPercentage.innerHTML = passPercent2 + '%'
        dailyPreventionPercentage.innerHTML = preventionPercent2 + '%'
        const dailyCaptureCount = document.querySelector('.chart3-legend .count.capture')
        const dailyRevealCount = document.querySelector('.chart3-legend .count.reveal')
        const dailyPassCount = document.querySelector('.chart3-legend .count.pass')
        const dailyPreventionCount = document.querySelector('.chart3-legend .count.prevention')
        dailyCaptureCount.innerHTML = dataset[type='capture'] || 0
        dailyRevealCount.innerHTML = dataset[type='reveal'] || 0
        dailyPassCount.innerHTML = dataset[type='pass'] || 0
        dailyPreventionCount.innerHTML = dataset[type='prevention'] || 0


    }
    
    // Render "current day incidents details" in a form of messages or posts
    function render24Hours(data){
        const today = new Date(2024, 0, 25) // leave empty parenthesis for today's data
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        let dailyData = data.filter(item => {
            const itemDate = new Date(item.created_at)

            return itemDate >= today && itemDate < tomorrow
        })
        let dailyDataSorted = dailyData.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at)
        })
        const scrollContainer = document.querySelector('.scroll-container')
        scrollContainer.innerHTML = ''
        dailyDataSorted.forEach(incident => {
            const date = new Date(incident.created_at)
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const postTime = `${hours}:${minutes}`
            const typeLabels = {
                capture: 'CAPTURE',
                reveal: 'REVEAL',
                pass: 'PASS',
                prevention: 'PREVENTION'
            }
            const startHour = incident.start_hour
            const endHour = incident.end_hour
            const reducedStartHour = startHour.split(':').slice(0, 2).join(':')
            const reducedEndHour = endHour.split(':').slice(0, 2).join(':')

            function formatConsecutiveRanges(str) {
                const numbers = str.split(',').map(Number);
                let result = '';
                let start = numbers[0];
                let end = numbers[0];
            
                for (let i = 1; i < numbers.length; i++) {
                    if (numbers[i] === end + 1) {
                        end = numbers[i];
                    } else {
                        if (end - start > 0) {
                            result += (start === end ? start : start + '-' + end) + ', ';
                        } else {
                            result += start + ', ';
                        }
                        start = end = numbers[i];
                    }
                }
            
                if (end - start > 0) {
                    result += (start === end ? start : start + '-' + end);
                } else {
                    result += start;
                }
            
                return result;
            }


            let html = `
                <div class="post-container">
                    <p class="post-hour">${postTime}</p>
                    <div class="post-bar-vertical ${incident.type}"></div>
                    <div class="post-details">
                        <div class="post-creator">
                            <p class="creator-name">${incident.created_by.first_name} ${incident.created_by.last_name} |&nbsp;</p>
                            <p class="facility">J${incident.facility.numerical_name}</p>
                        </div>
                        <div class="post-grid">
                            <div class="post-type-container type">
                                <div class="post-type-label">
                                    <div class="post-img type"></div>
                                    <p>TYPE</p>
                                </div>
                                <div class="post-type-data">
                                    <p>${typeLabels[incident.type]}</p>
                                </div>
                            </div>
                            <div class="post-type-container time">
                                <div class="post-type-label">
                                    <div class="post-img time"></div>
                                    <p>TIME</p>
                                </div>
                                <div class="post-type-data">
                                    <p>${reducedStartHour} - ${reducedEndHour}</p>
                                </div>
                            </div>
                            <div class="post-type-container cameras">
                                <div class="post-type-label">
                                    <div class="post-img cameras"></div>
                                    <p>CAMERAS</p>
                                </div>
                                <div class="post-type-data">
                                    <p>${formatConsecutiveRanges(incident.cameras)}</p>
                                </div>
                            </div>
                            <div class="post-type-container description">
                                <div class="post-type-label">
                                    <div class="post-img description"></div>
                                    <p>DESCRIPTION</p>
                                </div>
                                <div class="post-type-desc">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi feugiat urna non sapien dictum, vel scelerisque dui aliquet. Aenean suscipit ultrices nisi et gravida. Cras ullamcorper dictum enim, in euismod enim congue...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            scrollContainer.innerHTML += html
        })
    }

    // THE DATABASE IS STATIC HENCE ALL OF THE FUNCTIONS ABOVE HAVE STATIC DATES SET IN ORDER TO DISPLAY ANY INFORMATION IN THE FUTURE

    // District select element, reload every chart and dynamically generated data
    const selectButton = document.getElementById('selectElement')
    selectButton.addEventListener('change', function(){
        fetchIncidentsData('../api/incidents')
    })

    // Report Creation Form logic
    const reportForm = document.querySelector('.report-form')
    const unscrollButton = document.querySelector('.unscroll-form-button')
    unscrollButton.addEventListener('click', function(){
        unscrollButton.classList.toggle('reversed')
        reportForm.classList.toggle('unminimized')
    })

    const reportSubmitBtn = document.querySelector('.submit-button')
    reportSubmitBtn.addEventListener('click', function(){
        if (!reportSubmitBtn.classList.contains('disabled')){
            //normal logic
            const facility = document.querySelector('.reportFacility').value
            const type = document.querySelector('.reportType').value
            const startHour = document.querySelector('.time-input.start-hour').value
            const endHour = document.querySelector('.time-input.end-hour').value
            const date = document.querySelector('.date-input.date').value
            const cameras = document.querySelector('.text-input.cameras').value
            const description = document.querySelector('.text-input.description').value
            // console.log(`${facility} | ${type} | ${startHour} - ${endHour} | ${date} | ${cameras} | ${description}`)

            // if this site wasn't static THIS SECTION SHOULD BE
            // 1. get user id for created_by field
            // 2. get current date and time for created_at field
            // 3. populate other fields with information from above
            // 4. POST api call to create a new Instance object in db populating
        }
    })

    const valueInputs = [
        document.querySelector('.reportFacility'),
        document.querySelector('.reportType'),
        document.querySelector('.time-input.start-hour'),
        document.querySelector('.time-input.end-hour'),
        document.querySelector('.date-input.date'),
        document.querySelector('.text-input.cameras'),
        document.querySelector('.text-input.description')
    ]
    valueInputs.forEach(e => {
        e.addEventListener('change', function(){
            if(runValidation(valueInputs)){
                reportSubmitBtn.classList.remove('disabled')
            }else{
                if(!reportSubmitBtn.classList.contains('disabled')){
                    reportSubmitBtn.classList.add('disabled')
                }
            }
        })
    })
    function runValidation(elements){
        for(let i = 0; i < elements.length; i++){
            if(!elements[i].value){
                return false
            }
            if(!validateCameras(elements[5].value)){
                return false
            }
        }
        return true
    }
    function validateCameras(value){
        const camerasRaw = value.split(',')
        const cameras = camerasRaw.map(substring => substring.trim())
        console.log(cameras)
        for(let i = 0; i < cameras.length; i++){
            if(cameras[i].length > 2){
                return false
            }
        }
        return true
    }
})