// Toggle only the alignment and reflection containers for the given year
function toggleAlignmentReflection(year) {
    // Hide all alignment-reflection-row containers and remove active-year from all year-entries
    document.querySelectorAll('.alignment-reflection-row').forEach(row => row.style.display = 'none');
    document.querySelectorAll('.year-entry').forEach(ye => ye.classList.remove('active-year'));
    // Hide all alignment-container and reflection-bubble (for legacy years)
    document.querySelectorAll('.alignment-container').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.reflection-bubble').forEach(el => el.style.display = 'none');

    // Hide all 'Show Alignment & Reflection' buttons except the active year (using unique IDs)
    document.querySelectorAll('.toggle-indicator[id^="toggle-"]').forEach(btn => {
        if (btn.id === `toggle-${year}`) {
            btn.style.display = 'inline-block';
        } else {
            btn.style.display = 'none';
        }
    });

    // Find the year-entry that contains the button with id toggle-<year>
    let entry = null;
    const btn = document.getElementById('toggle-' + year);
    if (btn) {
        entry = btn.closest('.year-entry');
    }
    // Special case: if 2020 is toggled, move 2021 marker down
    var year2021Entry = null;
    document.querySelectorAll('.year-entry').forEach(entryEl => {
        const marker = entryEl.querySelector('.year-marker');
        if (marker && marker.textContent.trim().includes('2021')) {
            year2021Entry = entryEl;
        }
    });

    // Determine if already visible
    let isVisible = false;
    // Try to find .alignment-reflection-row for this year
    let row = null;
    // Try by ID first (for 2025), else by parent search
    row = document.querySelector(`#alignment-container-${year}`)?.closest('.alignment-reflection-row');
    if (!row) {
        // For legacy years, create a temporary row wrapper if not present
        const align = document.getElementById('alignment-container-' + year);
        const reflect = document.getElementById('reflection-bubble-' + year);
        if (align && reflect) {
            // If not already wrapped, wrap them
            if (!align.parentElement.classList.contains('alignment-reflection-row')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'alignment-reflection-row';
                align.parentElement.insertBefore(wrapper, align);
                wrapper.appendChild(align);
                wrapper.appendChild(reflect);
            }
            row = align.parentElement;
        }
    }
    if (row && row.style.display === 'flex') {
        isVisible = true;
    }

    if (!isVisible) {
        // Show the row side by side
        if (row) row.style.display = 'flex';
        if (entry) entry.classList.add('active-year');
        if (btn) btn.textContent = 'Hide Alignment & Reflection';
        // Move 2021 marker down if 2020 is toggled
        if (year === '2020' && year2021Entry) {
            year2021Entry.classList.add('move-marker-down');
        }
    } else {
        // Hide the row
        if (row) row.style.display = 'none';
        if (entry) entry.classList.remove('active-year');
        if (btn) btn.textContent = 'Show Alignment & Reflection';
        // Restore all buttons when hiding
        document.querySelectorAll('.toggle-indicator[id^="toggle-"]').forEach(b => b.style.display = 'inline-block');
        // Always ensure the 2020 year marker is visible
        var marker2020 = document.querySelector('.year-marker');
        if (marker2020 && marker2020.textContent.trim().includes('2020')) {
            marker2020.style.display = 'block';
        }
        // Remove 2021 marker move if toggling off 2020
        if (year === '2020' && year2021Entry) {
            year2021Entry.classList.remove('move-marker-down');
        }
    }
}
// Generic toggle function for extra containers and alignment table
function toggleExtra(year) {
    // Hide all campus-innovations and lessons-learnt containers for all years
    document.querySelectorAll('[id^="campus-innovations-"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id^="lessons-learnt-"]').forEach(el => el.style.display = 'none');
    // Only toggle for this year
    const campus = document.getElementById('campus-innovations-' + year);
    const lessons = document.getElementById('lessons-learnt-' + year);
    // Find the button within the same year-entry
    let btn = null;
    let yearEntry = null;
    btn = document.querySelector('.year-entry .toggle-extra-btn[onclick*="' + year + '"]') ||
        Array.from(document.querySelectorAll('.year-entry')).find(entry => {
            return entry.querySelector('.toggle-extra-btn') && entry.querySelector('.toggle-extra-btn').getAttribute('onclick')?.includes(year);
        })?.querySelector('.toggle-extra-btn');
    if (!btn) {
        // fallback: try by order (should not be needed)
        btn = document.querySelector('.toggle-extra-btn');
    }
    if (btn) {
        yearEntry = btn.closest('.year-entry');
    }
    // Determine visibility
    const isVisible = campus && campus.style.display === 'block';
    if (campus) campus.style.display = isVisible ? 'none' : 'block';
    if (lessons) lessons.style.display = isVisible ? 'none' : 'block';
    if (btn) btn.textContent = isVisible ? 'Show Campus Innovations & Lessons Learnt' : 'Hide Campus Innovations & Lessons Learnt';
    // Move next year marker down if any extra is visible
    if (yearEntry) {
        if (!isVisible && (campus || lessons)) {
            yearEntry.classList.add('expanded-extra');
        } else {
            yearEntry.classList.remove('expanded-extra');
        }
    }
}
// Backward compatibility for existing HTML onclicks
function toggleExtra2020() { toggleExtra('2020'); }
function toggleExtra2021() { toggleExtra('2021'); }
function toggleExtra2022() { toggleExtra('2022'); }
function toggleExtra2023() { toggleExtra('2023'); }
function toggleExtra2024() { toggleExtra('2024'); }
function toggleExtra2025() { toggleExtra('2025'); }

// Utility: get year from a year-entry
function getYearFromEntry(entry) {
    const marker = entry.querySelector('.year-marker');
    if (!marker) return null;
    return marker.textContent.trim().replace(/[^\d]/g, '');
}

document.addEventListener('DOMContentLoaded', function() {
    const yearEntries = document.querySelectorAll('.year-entry');
    yearEntries.forEach((entry, idx) => {
        // Alternate .even class for zigzag
        if (idx % 2 === 1) entry.classList.add('even');
        else entry.classList.remove('even');

        // Add close buttons if not present, and improve logic to reset toggle button and restore all buttons
        const align = entry.querySelector('.alignment-container');
        if (align && !align.querySelector('.close-btn')) {
            const btn = document.createElement('button');
            btn.className = 'close-btn';
            btn.innerHTML = '&times;';
            btn.title = 'Close';
            btn.onclick = e => {
                e.stopPropagation();
                // Hide both alignment and reflection
                align.style.display = 'none';
                const reflect = entry.querySelector('.reflection-bubble');
                if (reflect) reflect.style.display = 'none';
                // Reset toggle button text and restore all toggle buttons
                const entryYear = getYearFromEntry(entry);
                const toggleBtn = document.getElementById('toggle-' + entryYear);
                if (toggleBtn) toggleBtn.textContent = 'Show Alignment & Reflection';
                document.querySelectorAll('.toggle-indicator[id^="toggle-"]').forEach(b => b.style.display = 'inline-block');
                entry.classList.remove('active-year');
                // Restore original content for this year
                const yearContent = entry.querySelector('.year-content');
                const studentQuotes = entry.querySelector('.student-quotes');
                if (yearContent) yearContent.style.display = 'block';
                if (studentQuotes) studentQuotes.style.display = 'block';
                // Always ensure the 2020 year marker is visible
                var marker2020 = document.querySelector('.year-marker');
                if (marker2020 && marker2020.textContent.trim().includes('2020')) {
                    marker2020.style.display = 'block';
                }
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
                // Hide both reflection and alignment
                reflect.style.display = 'none';
                const align = entry.querySelector('.alignment-container');
                if (align) align.style.display = 'none';
                // Reset toggle button text and restore all toggle buttons
                const entryYear = getYearFromEntry(entry);
                const toggleBtn = document.getElementById('toggle-' + entryYear);
                if (toggleBtn) toggleBtn.textContent = 'Show Alignment & Reflection';
                document.querySelectorAll('.toggle-indicator[id^="toggle-"]').forEach(b => b.style.display = 'inline-block');
                entry.classList.remove('active-year');
                // Restore original content for this year
                const yearContent = entry.querySelector('.year-content');
                const studentQuotes = entry.querySelector('.student-quotes');
                if (yearContent) yearContent.style.display = 'block';
                if (studentQuotes) studentQuotes.style.display = 'block';
                // Always ensure the 2020 year marker is visible
                var marker2020 = document.querySelector('.year-marker');
                if (marker2020 && marker2020.textContent.trim().includes('2020')) {
                    marker2020.style.display = 'block';
                }
            };
            reflect.insertBefore(btn, reflect.firstChild);
        }

        // Year marker: restore original visible content for the respective year
        const marker = entry.querySelector('.year-marker');
        if (marker) {
            marker.style.cursor = 'pointer';
            marker.addEventListener('click', function() {
                const year = getYearFromEntry(entry);
                if (!year) return;
                // Show main content
                const yearContent = entry.querySelector('.year-content');
                const studentQuotes = entry.querySelector('.student-quotes');
                if (yearContent) yearContent.style.display = 'block';
                if (studentQuotes) studentQuotes.style.display = 'block';
                // Hide all toggled containers for this year
                const align = entry.querySelector('.alignment-container');
                const reflect = entry.querySelector('.reflection-bubble');
                const campus = document.getElementById('campus-innovations-' + year);
                const lessons = document.getElementById('lessons-learnt-' + year);
                const alignment = document.getElementById('alignment-container-' + year); // Only for 2020
                if (align) align.style.display = 'none';
                if (reflect) reflect.style.display = 'none';
                if (campus) campus.style.display = 'none';
                if (lessons) lessons.style.display = 'none';
                if (alignment) alignment.style.display = 'none';
                // Remove highlight/active classes
                entry.classList.remove('active-year', 'expanded-extra');
                // Restore all toggle buttons for this year
                const toggleBtn = document.getElementById('toggle-' + year);
                if (toggleBtn) toggleBtn.textContent = 'Show Alignment & Reflection';
                document.querySelectorAll('.toggle-indicator[id^="toggle-"]').forEach(b => b.style.display = 'inline-block');
            });
        }
    });

    // Restore thumbnail expand logic for each year
    window.expandImage = function(img) {
        // Find the parent evidence container to determine the year
        let parent = img.closest('[class^="evidence-thumbnails"]');
        if (!parent) return;
        let year = null;
        // Class is like evidence-thumbnails2020, evidence-thumbnails2021, etc.
        parent.classList.forEach(cls => {
            if (cls.startsWith('evidence-thumbnails')) {
                year = cls.replace('evidence-thumbnails', '');
            }
        });
        if (!year) {
            // fallback: try to extract from className string
            const match = parent.className.match(/evidence-thumbnails(\d{4})/);
            if (match) year = match[1];
        }
        if (!year) return;
        const expanded = document.getElementById('expandedThumbnail' + year);
        const expandedImg = document.getElementById('expandedImg' + year);
        if (expanded && expandedImg) {
            expandedImg.src = img.src;
            expanded.style.display = 'flex';
        }
    };
    window.closeExpandedThumbnail = function(year) {
        const expanded = document.getElementById('expandedThumbnail' + year);
        if (expanded) {
            expanded.style.display = 'none';
        }
    };
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
                    data: [97.22, 96.43, 96.7, 88.51, 87.62],
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
                        beginAtZero: true,
                        min: 0,
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
                    data: [0.5, 0.5, 2, 2, 4],
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