// URLs to the CSV files
const studentDataUrl = 'students.csv'; // Replace with the actual file path
const resultsDataUrl = 'results.csv'; // Replace with the actual file path
const creditsDataUrl = 'credits1.csv'; // Replace with the actual file path

let students = [];
let results = [];
let credits = {};

// Function to fetch and parse CSV data
function fetchCSV(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const rows = text.trim().split('\n').map(row => row.split(','));
            callback(rows);
        })
        .catch(error => console.error('Error fetching CSV:', error));
}
// Function to load results from CSV and match column names in the result data
function loadResults() {
    fetchCSV(resultsDataUrl, (data) => {
        const headers = data[0];
        results = data.slice(1).map(row => {
            const result = {};
            headers.forEach((header, i) => result[header.trim()] = row[i].trim());
            return result;
        });
        console.log("Results data:", results);  // Debug: Check if results are loaded
    });
}

// Handle result form submission
document.getElementById('resultForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const rollNumber = document.getElementById('rollNumber').value;
    const dob = formatDate(document.getElementById('dob').value);

    document.getElementById('resultDetails').style.display = 'none';
    document.getElementById('resultTableBody').innerHTML = '';
    document.getElementById('totalCredits').textContent = '0';
    document.getElementById('status').textContent = 'N/A';
    document.getElementById('studentPic').src = '';

    if (!rollNumber || !dob) {
        alert('Please enter both roll number and date of birth.');
        return;
    }

    console.log("Searching for student with roll number:", rollNumber, " and DOB:", dob);  // Debug: Check if correct data is passed
    const student = students.find(s => s['Roll Number'] === rollNumber && formatDate(s['DOB']) === dob);
    const studentResults = results.find(r => r['Roll number'] === rollNumber);

    if (student && studentResults) {
        document.getElementById('studentPic').src = student['Picture'] || '';
        document.getElementById('studentName').textContent = student['Name'] || 'Unknown';
        document.getElementById('studentRollNumber').textContent = student['Roll Number'] || 'Unknown';
        document.getElementById('studentCourse').textContent = student['Course'] || 'Unknown';
        document.getElementById('studentYear').textContent = student['Year'] || 'Unknown';

        let totalCreditsEarned = 0;
        let totalMaxCredits = 0;
        let allPass = true;

        const subjects = ['M1', 'Introduction to programming', 'Chemistry', 'Communicative English', 'Engineering graphics', 'IP Lab', 'IT workshop', 'CE Lab', 'Chemistry lab', 'HWYS'];
        subjects.forEach(subject => {
            const pointsObtained = parseInt(studentResults[subject], 10) || 0;
            const totalPointsAvailable = parseInt(studentResults['totalpoints'], 10) || 10;  // Assuming max is 10
            const creditValue = credits[subject] || 0;  // Get the credit value from credits.csv
            const creditsEarned = pointsObtained >= 5 ? creditValue : 0;  // Full credits if points >= 5, else zero
            const status = creditsEarned > 0 ? 'Pass' : 'Fail';
            const statusClass = creditsEarned > 0 ? 'pass' : 'fail';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject}</td>
                <td>${totalPointsAvailable}</td>
                <td>${pointsObtained}</td>
                <td>${creditValue}</td>
                <td class="${statusClass}">${status}</td>
            `;
            document.getElementById('resultTableBody').appendChild(row);

            totalCreditsEarned += creditsEarned;
            totalMaxCredits += creditValue;
            if (status === 'Fail') {
                allPass = false;
            }
        });

        // Show total earned credits
        document.getElementById('totalCredits').textContent = totalCreditsEarned;

        // Show pass/fail status
        document.getElementById('status').textContent = allPass ? 'Pass' : 'Fail';

        // Show result details
        document.getElementById('resultDetails').style.display = 'block';
    } else {
        alert('No results found for the provided roll number and date of birth.');
    }
});
