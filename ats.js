let csvData = null;

// Fetch the hardcoded CSV file (octatten.csv)
fetch('octatten.csv')
    .then(response => response.text())
    .then(csvText => {
        // Parse CSV data using PapaParse
        Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                csvData = results.data;  // Store the parsed data
                console.log(csvData);  // For debugging: Log the parsed data to console
            }
        });
    });

// Check attendance when the button is clicked
function checkAttendance() {
    const rollNumber = document.getElementById('rollNumberInput').value.trim();

    if (!csvData) {
        alert("CSV data is not loaded yet. Please wait.");
        return;
    }

    // Find the student data based on roll number
    const studentData = csvData.find(row => row['Roll number'].trim() === rollNumber);
    
    if (studentData) {
        // Fetch the last month's attendance directly from the CSV file
        const lastMonthAttendance = studentData['Last month'] || 0;  // Default to 0 if undefined
        const totalPresent = studentData['Total'];
        
        // Calculate current attendance percentage based on the total attendance
        const referenceStudent = csvData.find(row => row['Roll number'] === '238x1a4400');
        
        // Ensure reference student data is available
        if (!referenceStudent) {
            document.getElementById('result').innerHTML = "Reference student data not found.";
            return;
        }

        const totalClasses = referenceStudent['Total'];
        const currentAttendancePercentage = (totalPresent / totalClasses) * 100;

        // Calculate the average attendance percentage
        const averageAttendancePercentage = (currentAttendancePercentage + lastMonthAttendance) / 2;

        // Display the result
        document.getElementById('result').innerHTML = `
            Roll Number: ${rollNumber} <br>
            Last Month Attendance: ${lastMonthAttendance}% <br>
            Current Month Attendance: ${currentAttendancePercentage.toFixed(2)}% <br>
            Total Attendance: <span class="${getPercentageClass(averageAttendancePercentage)}">${averageAttendancePercentage.toFixed(2)}%</span></br>
            <br><strong style="color: red;">Note:</strong> Current attendance is an estimate, while last month's attendance is official.<br>`
        ;
    } else {
        document.getElementById('result').innerHTML = "Roll number not found.";
    }
}

// Function to determine the class based on attendance percentage
function getPercentageClass(percentage) {
    if (percentage > 75) {
        return 'result-green';
    } else if (percentage >= 50) {
        return 'result-orange';
    } else {
        return 'result-red';
    }
}
