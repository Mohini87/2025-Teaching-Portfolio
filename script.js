// Toggle visibility of alignment-container and reflection-bubble on year-marker click
document.addEventListener('DOMContentLoaded', function() {
    const yearEntries = document.querySelectorAll('.year-entry');
        yearEntries.forEach((entry, idx) => {
            // Alternate .even class for zigzag
            if (idx % 2 === 1) entry.classList.add('even');
            else entry.classList.remove('even');

            // Add close buttons if not present
            const align = entry.querySelector('.alignment-container');
            if (align && !align.querySelector('.close-btn')) {
                const btn = document.createElement('button');
                btn.className = 'close-btn';
                btn.innerHTML = '&times;';
                btn.title = 'Close';
                btn.onclick = e => {
                    e.stopPropagation();
                    entry.classList.remove('active-year');
                };
                align.insertBefore(btn, align.firstChild);
            }
            const reflect = entry.querySelector('.reflection-bubble');
            if (reflect && !reflect.querySelector('.close-btn')) {
                const btn = document.createElement('button');
                btn.className = 'close-btn';
                btn.innerHTML = '&times;';
                btn.title = 'Close';
                btn.onclick = e => {
                    e.stopPropagation();
                    entry.classList.remove('active-year');
                };
                reflect.insertBefore(btn, reflect.firstChild);
            }

            const marker = entry.querySelector('.year-marker');
            if (marker) {
                marker.style.cursor = 'pointer';
                marker.addEventListener('click', function() {
                    if (entry.classList.contains('active-year')) {
                        entry.classList.remove('active-year');
                    } else {
                        yearEntries.forEach(e => e.classList.remove('active-year'));
                        entry.classList.add('active-year');
                    }
                });
            }
            // Also allow clicking the toggle-indicator to open/close
            const indicator = entry.querySelector('.toggle-indicator');
            if (indicator) {
                indicator.style.cursor = 'pointer';
                indicator.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (entry.classList.contains('active-year')) {
                        entry.classList.remove('active-year');
                    } else {
                        yearEntries.forEach(e => e.classList.remove('active-year'));
                        entry.classList.add('active-year');
                    }
                });
            }
        });
});
document.addEventListener('DOMContentLoaded', function () {
    // Success Rate and Students Chart
    const successCanvas = document.getElementById('successChart');
    if (successCanvas) {
        const ctxSuccess = successCanvas.getContext('2d');
        const successChart = new Chart(ctxSuccess, {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    type: 'line',
                    label: 'Average Success Rate (%)',
                    data: [97.22, 96.43, 96.7, 88.51, 80.63],
                    borderColor: '#4777C3',
                    backgroundColor: 'rgba(71, 119, 195, 0.2)',
                    borderWidth: 2,
                    yAxisID: 'y'
                }, {
                    type: 'bar',
                    label: 'Total Students',
                    data: [72, 56, 91, 148, 315],
                    backgroundColor: '#90EE90',
                    yAxisID: 'y1'
                }]
            },
            options: {
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Success Rate (%)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Students'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Research Performance Chart
    const researchCanvas = document.getElementById('researchChart');
    if (researchCanvas) {
        const ctxResearch = researchCanvas.getContext('2d');
        const researchChart = new Chart(ctxResearch, {
            type: 'bar',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Research Points',
                    data: [0, 0, 2, 2, 6],
                    backgroundColor: '#90EE90'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});