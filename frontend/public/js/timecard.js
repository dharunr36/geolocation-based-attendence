document.addEventListener('DOMContentLoaded', () => {
    const totalHoursElement = document.getElementById('totalHours');
    const overtimeElement = document.getElementById('overtime');
    const activityListElement = document.getElementById('activityList');
    const hoursChartCanvas = document.getElementById('hoursChart').getContext('2d');

    // Fetch data from the database
    
    // Fetch data from the database
async function fetchWorkingHours() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('User not logged in. Please log in first.');
        return;
    }

    try {
        const response = await fetch(`https://geolocation-based-attendence-1.onrender.com/api/auth/getdata?userId=${userId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });


        const data = await response.json();

        if (response.status === 200) {
            const { activities = [], weeklyData = [] } = data;

            // Get today's date in the format used in the activities array
            const today = new Date();
            const formattedToday = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`; // Format: dd/m/yyyy


            // Find today's activity
            const todayActivity = activities.find(activity => activity.date === formattedToday);
            console.log(formattedToday,todayActivity)
            // Update total hours and overtime
            const totalHours = todayActivity ? todayActivity.totalHours : 0;
            const overtime = todayActivity ? todayActivity.dailyOvertime : 0;
            

            totalHoursElement.textContent = `${totalHours.toFixed(2)} hours`;
            overtimeElement.textContent = `${overtime.toFixed(2)} hours`;

            // Update recent activity
            if (activities.length > 0) {
                activityListElement.innerHTML = activities.map(activity => {
                    const hoursWorked = activity.totalHours.toFixed(2);
                    const checkIn = activity.checkIn ? activity.checkIn : 'N/A';
                    const checkOut = activity.checkOut ? activity.checkOut : 'N/A';
                    return `
                        <div class="activity-item">
                            <div class="icon-column">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div>
                                <p class="full-width"><strong>Check-in:</strong> ${checkIn}</p>
                                <p class="full-wid"><strong>Check-out:</strong> ${checkOut}</p>
                                <p class="full-width"><strong>Hours Worked:</strong> ${hoursWorked} hours</p>
                            </div>
                        </div>`;
                }).join('');
            } else {
                activityListElement.innerHTML = '<p>No recent activity to display.</p>';
            }

            // Display chart for weekly working hours
            displayWeeklyChart(weeklyData);
        } else {
            alert(data.error || 'Failed to load working hours.');
        }
    } catch (error) {
        console.error('Error fetching working hours:', error);
        alert('An error occurred while fetching working hours.');
    }
}


    

    // Display weekly working hours chart
    function displayWeeklyChart(weeklyData) {
        if (!weeklyData || weeklyData.length === 0) {
            return;
        }

        const labels = weeklyData.map(entry => entry.date);
        const data = weeklyData.map(entry => entry.hoursWorked);

        new Chart(hoursChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Working Hours (Weekly)',
                    data: data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointBackgroundColor: 'rgb(75, 192, 192)',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: context => `${context.raw} hours`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours Worked'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    // Fetch and display data on page load
    fetchWorkingHours();
});



