let currentAudio = null;
const votes = {};
let voteAccuracy = { correct: 0, incorrect: 0 };
let votesChart;
let accuracyChart;
let currentCategory = '';
let currentTrackIndex = 0;
let previousTrackIndex = -1;

// Available tracks for each category
const availableTracks = {
    'Chicken': ['Cluck - Track 1_false.wav', 'Cluck - Track 2_false.wav', 'Cluck - Track 3_false.wav', 'Cluck - Track 4_true.mp3', 'Cluck - Track 5_true.mp3', 'Cluck - Track 6_false.wav', 'Cluck - Track 7_true.mp3', 'Cluck - Track 8_true.mp3'],
    'Cow': ['Moo - Track 1_false.wav', 'Moo - Track 2_false.wav', 'Moo - Track 3_false.wav', 'Moo - Track 4_true.mp3', 'Moo - Track 5_true.mp3', 'Moo - Track 6_true.mp3'],
    'Goat': ['Bleat - Track 1_false.wav', 'Bleat - Track 2_false.wav', 'Bleat - Track 3_false.wav', 'Bleat - Track 4_true.mp3', 'Bleat - Track 5_true.mp3', 'Bleat - Track 6_true.mp3'],
    'Pig': ['Oink - Track 1_false.wav', 'Oink - Track 2_false.wav', 'Oink - Track 3_false.wav', 'Oink - Track 4_true.mp3', 'Oink - Track 5_true.mp3', 'Oink - Track 6_true.mp3', 'Oink - Track 7_true.mp3'],
    'Rooster': ['Crowing - Track 1_false.wav', 'Crowing - Track 2_false.wav', 'Crowing - Track 3_false.wav', 'Crowing - Track 4_true.mp3', 'Crowing - Track 5_true.mp3'],
    'Duck': ['Quack -Track 1_false.wav', 'Quack - Track 2_false.wav', 'Quack - Track 3_false.wav', 'Quack - Track 4_true.mp3', 'Quack - Track 5_true.mp3', 'Quack - Track 6_true.mp3'],
    //Instruments
    'Cello': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3'],
    'Trumpet': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3'],
    'Drumkit': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3', 'Track 6_true.mp3'],
    'ElectricGuitar': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3', 'Track 6_true.mp3'],
    //Domestic Sound
    'Microwave': ['Track 1_false.wav', 'Track 2_true.mp3', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3'],
    'ToiletFlush': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3'],
    'VacuumCleaner': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3'],	
    'ComputerKeyboard': ['Track 1_false.wav', 'Track 2_false.wav', 'Track 3_false.wav', 'Track 4_true.mp3', 'Track 5_true.mp3']
    // Add more categories as needed
};

document.addEventListener('DOMContentLoaded', () => {
    initializeVotesFromSessionStorage();
    initializeVoteAccuracy();
    
    initializeCharts();
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        showTab('farm-animals');
    });
    
    showTab('farm-animals');
});

function initializeCharts() {
    const ctx = document.getElementById('votesGraph').getContext('2d');
    votesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Votes for AI Generated',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Voted as AI'
                    }
                },
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Tracks'
                    }
                }
            }
        }
    });

    const ctxAccuracy = document.getElementById('accuracyGraph').getContext('2d');
    accuracyChart = new Chart(ctxAccuracy, {
        type: 'doughnut',
        data: {
            labels: ['Correctly Voted', 'Incorrectly Voted'],
            datasets: [{
                label: 'Vote Accuracy',
                data: [voteAccuracy.correct, voteAccuracy.incorrect],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw;
                        }
                    }
                }
            }
        }
    });

    console.log('Charts initialized:', votesChart, accuracyChart);

    updateGraph();
    updateAccuracyChart();
}

function showTab(tabId, event) {
    const tabs = document.querySelectorAll('.content');
    tabs.forEach(tab => {
        tab.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');

    const navLinks = document.querySelectorAll('.nav-bar a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    if (event) {
        event.target.classList.add('active');
    }

    if (tabId === 'info-motivation' || tabId === 'farm-animals' || tabId === 'domestic-sound' || tabId === 'instruments') {
        closeModal();
        if (tabId === 'info-motivation') {
            updateGraph();
            updateAccuracyChart();
        }
    }
}

function openModal(title) {
    currentCategory = title.split(' - ')[0];
    showRandomTrack();
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = `${title} Tracks`;
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
}

function showRandomTrack() {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = '';

    const availableTrackList = availableTracks[currentCategory];
    if (!availableTrackList) {
        console.error(`No track list found for category: ${currentCategory}`);
        return;
    }

    let randomIndex = Math.floor(Math.random() * availableTrackList.length);

    // Ensure the new randomIndex is different from the previousTrackIndex
    while (randomIndex === previousTrackIndex) {
        randomIndex = Math.floor(Math.random() * availableTrackList.length);
    }

    previousTrackIndex = randomIndex; // Update the previousTrackIndex to the current randomIndex

    const selectedTrack = availableTrackList[randomIndex];
    currentTrackIndex = randomIndex;
    const cleanTrackName = selectedTrack.replace(/(_true|_false)?\.(wav|mp3)$/, '');

    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.innerHTML = `
        <span>
            <img src="C:\\Users\\Christoph\\Fake\\Icon\\Playbutton.png" alt="Play Icon" onclick="playTrack('${currentCategory}', '${selectedTrack}')">
            ${cleanTrackName}
        </span>
        <button class="track-button" onclick="voteTrack('${selectedTrack}')">Vote for: AI generated</button>
    `;
    trackList.appendChild(trackItem);

    const nextTrackButton = document.createElement('button');
    nextTrackButton.textContent = 'Next Track';
    nextTrackButton.className = 'next-track';
    nextTrackButton.onclick = showRandomTrack;
    trackList.appendChild(nextTrackButton);
}

function playTrack(category, track) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    //Adjust this base path to match the folder structure on your system 
    const basePath = "C:\\Users\\Christoph\\Fake\\Vocal Imitation Auswahl\\";
    const filePath = `${basePath}${category}\\${category} - ${track}`;

    // Ensure the file path is correct for your system
    currentAudio = new Audio(`file:///${filePath}`);
    currentAudio.play();

}

function updateGraph() {
    if (!votesChart) return;

    const labels = [];
    const data = [];


    for (const category in availableTracks) {
        
        const availableTrackList = availableTracks[category];
        for (const track of availableTrackList) {
            const cleanTrackName = track.replace(/(_true|_false)?\.(wav|mp3)$/, '');
            
            if (votes[`${category} - ${cleanTrackName}`] !== undefined) {
                labels.push(`${category} - ${cleanTrackName}`);
                data.push(votes[`${category} - ${cleanTrackName}`]);
                
            }
        }
    }

    votesChart.data.labels = labels;
    votesChart.data.datasets[0].data = data;
    votesChart.update();
}

function voteTrack(trackName) {
    // Determine if the track is correctly identified as AI generated or not
    const isCorrect = trackName.includes('_true');
    const isIncorrect = trackName.includes('_false');

    // Clean the track name for display (removing suffix and extension)
    const cleanTrackName = `${currentCategory} - ${trackName.replace(/(_true|_false)?\.(wav|mp3)$/, '')}`;

    // Initialize vote count if not present
    if (!votes[cleanTrackName]) {
        votes[cleanTrackName] = 0;
    }
    votes[cleanTrackName]++;

    // Update the vote accuracy based on the track's suffix
    if (isCorrect) {
        voteAccuracy.correct++;
    } else if (isIncorrect) {
        voteAccuracy.incorrect++;
    }

    console.log(`Voted for ${cleanTrackName} as AI generated. Total votes: ${votes[cleanTrackName]}`);
    console.log(`Correct votes: ${voteAccuracy.correct}, Incorrect votes: ${voteAccuracy.incorrect}`);

    sessionStorage.setItem(cleanTrackName, votes[cleanTrackName]);
    sessionStorage.setItem('voteAccuracy', JSON.stringify(voteAccuracy));

    // Update the charts
    updateGraph();
    updateAccuracyChart();
}

function updateAccuracyChart() {
    if (!accuracyChart) return;

    const totalVotes = voteAccuracy.correct + voteAccuracy.incorrect;
    const correctPercentage = totalVotes === 0 ? 0 : ((voteAccuracy.correct / totalVotes) * 100).toFixed(2);
    const incorrectPercentage = totalVotes === 0 ? 0 : ((voteAccuracy.incorrect / totalVotes) * 100).toFixed(2);

    // Update the doughnut chart data
    accuracyChart.data.datasets[0].data = [voteAccuracy.correct, voteAccuracy.incorrect];
    accuracyChart.update();

    // Update the percentage display
    const accuracyPercentageDiv = document.getElementById('accuracyPercentage');
    accuracyPercentageDiv.innerHTML = `
        <p>Correct Votes: ${correctPercentage}% (${voteAccuracy.correct})</p>
        <p>Incorrect Votes: ${incorrectPercentage}% (${voteAccuracy.incorrect})</p>
    `;
}


function initializeVotesFromSessionStorage() {
    for (const key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key) && key !== 'voteAccuracy') {
            const value = parseInt(sessionStorage.getItem(key));
            if (!isNaN(value)) {
                votes[key] = value;
                console.log(`Voted for ${key} as AI generated. Total votes: ${votes[key]}`);
            }
        }
    }
}

function initializeVoteAccuracy() {
    const storedData = sessionStorage.getItem('voteAccuracy');
    if (storedData) {
        voteAccuracy = JSON.parse(storedData);
        console.log('Vote accuracy data loaded from session storage:', voteAccuracy);
    } else {
        console.log('No vote accuracy data found in session storage. Initializing.');
        // Initialize voteAccuracy if not found in session storage
        voteAccuracy = {
            correct: 0,
            incorrect: 0
        };
    }
}





