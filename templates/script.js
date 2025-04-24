    // Document ready function
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize map
        initMap();
        
        // Initialize charts
        initCharts();
        
        // Initialize comparison sliders
        initComparisonSliders();
        
        // Initialize the quiz
        initQuiz();
        
        // Dark mode toggle
        const darkToggle = document.getElementById('dark-toggle');
        const darkIcon = darkToggle.querySelector('i');
        
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                darkIcon.classList.remove('fa-moon');
                darkIcon.classList.add('fa-sun');
            } else {
                darkIcon.classList.remove('fa-sun');
                darkIcon.classList.add('fa-moon');
            }
        });
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            });
        });
        
        // Map filters
        document.querySelectorAll('.map-control-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.map-control-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterMapMarkers(this.getAttribute('data-filter'));
            });
        });
        
        // EcoTracker form submission
        document.getElementById('eco-report-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate form submission with a delay
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            setTimeout(() => {
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Report';
                document.getElementById('report-modal').style.display = 'flex';
            }, 1500);
        });
        
        // Modal close functionality
        document.querySelector('.modal-close').addEventListener('click', function() {
            document.getElementById('report-modal').style.display = 'none';
        });
        
        document.getElementById('modal-ok').addEventListener('click', function() {
            document.getElementById('report-modal').style.display = 'none';
        });
        
        // Close modal if clicked outside
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('report-modal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Map Initialization and Data
    function initMap() {
        // Create map centered on Ayusai Gorge
        const map = L.map('map').setView([43.25, 77.02], 13);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Sample data for map markers
        const locations = [
            {
                id: 1,
                lat: 43.248,
                lng: 77.013,
                title: 'Deforestation Area',
                description: 'Significant tree loss due to illegal logging activity detected in spring 2023.',
                image: '/api/placeholder/300/200?text=Deforestation',
                date: '2023-04-15',
                type: 'anthropogenic',
                period: '2020'
            },
            {
                id: 2,
                lat: 43.252,
                lng: 77.025,
                title: 'Rockslide',
                description: 'Natural rockslide occurred after heavy rainfall, changing the topography of the eastern slope.',
                image: '/api/placeholder/300/200?text=Rockslide',
                date: '2024-08-10',
                type: 'natural',
                period: '2020'
            },
            {
                id: 3,
                lat: 43.245,
                lng: 77.019,
                title: 'New Hiking Trail',
                description: 'Unofficial trail created by tourists, causing vegetation damage and soil compaction.',
                image: '/api/placeholder/300/200?text=Hiking+Trail',
                date: '2022-07-22',
                type: 'anthropogenic',
                period: '2020'
            },
            {
                id: 4,
                lat: 43.258,
                lng: 77.018,
                title: 'River Bank Erosion',
                description: 'Significant natural erosion of the river bank due to high water levels during spring melt.',
                image: '/api/placeholder/300/200?text=River+Erosion',
                date: '2023-04-30',
                type: 'natural',
                period: '2020'
            },
            {
                id: 5,
                lat: 43.251,
                lng: 77.009,
                title: 'Trash Dump Site',
                description: 'Illegal dumping of household waste discovered by researchers.',
                image: '/api/placeholder/300/200?text=Trash+Dump',
                date: '2024-03-15',
                type: 'anthropogenic',
                period: '2020'
            },
            {
                id: 6,
                lat: 43.242,
                lng: 77.023,
                title: 'Landslide Area',
                description: 'Natural landslide occurred in 2018 after a period of heavy rainfall.',
                image: '/api/placeholder/300/200?text=Landslide',
                date: '2018-05-20',
                type: 'natural',
                period: '2015'
            },
            {
                id: 7,
                lat: 43.257,
                lng: 77.011,
                title: 'Abandoned Construction',
                description: 'Partially built tourist facility abandoned in 2017, materials still present.',
                image: '/api/placeholder/300/200?text=Construction',
                date: '2017-09-10',
                type: 'anthropogenic',
                period: '2015'
            },
            {
                id: 8,
                lat: 43.249,
                lng: 77.028,
                title: 'Vegetation Recovery',
                description: 'Natural regrowth of native vegetation in previously disturbed area.',
                image: '/api/placeholder/300/200?text=Vegetation',
                date: '2019-06-30',
                type: 'natural',
                period: '2015'
            },
            {
                id: 9,
                lat: 43.246,
                lng: 77.007,
                title: 'Cliff Collapse',
                description: 'Major cliff face collapse from natural weathering processes documented in 2013.',
                image: '/api/placeholder/300/200?text=Cliff+Collapse',
                date: '2013-10-17',
                type: 'natural',
                period: '2010'
            },
            {
                id: 10,
                lat: 43.259,
                lng: 77.022,
                title: 'Old Mining Site',
                description: 'Small-scale mining operation active from 2011-2014, now abandoned but signs remain.',
                image: '/api/placeholder/300/200?text=Mining+Site',
                date: '2014-12-05',
                type: 'anthropogenic',
                period: '2010'
            }
        ];
        
        // Create marker groups
        const markerGroups = {
            all: L.layerGroup(),
            natural: L.layerGroup(),
            anthropogenic: L.layerGroup(),
            '2020': L.layerGroup(),
            '2015': L.layerGroup(),
            '2010': L.layerGroup()
        };
        
        // Add markers to the map
        locations.forEach(location => {
            const markerIcon = L.divIcon({
                className: `marker-${location.type}`,
                html: '<i class="fas fa-map-pin"></i>',
                iconSize: [20, 20]
            });
            
            const popupContent = `
                <div class="custom-popup">
                    <span class="popup-tag ${location.type}">${location.type}</span>
                    <img src="${location.image}" alt="${location.title}">
                    <h3>${location.title}</h3>
                    <p>${location.description}</p>
                    <div class="popup-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(location.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</span>
                    </div>
                </div>
            `;
            
            const marker = L.marker([location.lat, location.lng], { icon: markerIcon })
                .bindPopup(popupContent);
            
            // Add marker to appropriate groups
            markerGroups.all.addLayer(marker);
            markerGroups[location.type].addLayer(marker);
            markerGroups[location.period].addLayer(marker);
        });
        
        // Add the 'all' group to the map by default
        markerGroups.all.addTo(map);
        
        // Store marker groups in global scope for filtering
        window.markerGroups = markerGroups;
        window.map = map;
    }
    
    // Filter map markers based on selection
    function filterMapMarkers(filter) {
        const markerGroups = window.markerGroups;
        const map = window.map;
        
        // Remove all marker groups from map
        Object.values(markerGroups).forEach(group => {
            map.removeLayer(group);
        });
        
        // Add selected group to map
        markerGroups[filter].addTo(map);
    }

    // Initialize charts for statistics section
    function initCharts() {
        // Impact types distribution chart (pie chart)
        const impactCtx = document.getElementById('impactChart').getContext('2d');
        const impactChart = new Chart(impactCtx, {
            type: 'pie',
            data: {
                labels: ['Natural Changes', 'Human Impact'],
                datasets: [{
                    data: [45, 55],
                    backgroundColor: [
                        '#76c893', // Natural
                        '#ee9b00'  // Anthropogenic
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                }
            }
        });
        
        // Changes over time chart (line chart)
        const timelineCtx = document.getElementById('timelineChart').getContext('2d');
        const timelineChart = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
                datasets: [
                    {
                        label: 'Natural Changes',
                        data: [8, 12, 15, 18, 20, 24, 28, 32],
                        borderColor: '#76c893',
                        backgroundColor: 'rgba(118, 200, 147, 0.2)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Human Impact',
                        data: [5, 10, 18, 25, 30, 38, 45, 52],
                        borderColor: '#ee9b00',
                        backgroundColor: 'rgba(238, 155, 0, 0.2)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Documented Changes'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Most affected areas chart (bar chart)
        const areasCtx = document.getElementById('areasChart').getContext('2d');
        const areasChart = new Chart(areasCtx, {
            type: 'bar',
            data: {
                labels: ['North Ridge', 'River Valley', 'Central Basin', 'East Slope', 'South Entrance'],
                datasets: [
                    {
                        label: 'Natural Changes',
                        data: [12, 28, 15, 22, 8],
                        backgroundColor: 'rgba(118, 200, 147, 0.7)'
                    },
                    {
                        label: 'Human Impact',
                        data: [18, 32, 25, 10, 23],
                        backgroundColor: 'rgba(238, 155, 0, 0.7)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Documented Changes'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Area'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Initialize comparison sliders for before & after section
    function initComparisonSliders() {
        const sliders = [
            {
                slider: document.getElementById('comparison-slider-1'),
                handle: document.getElementById('slider-handle-1'),
                before: document.querySelector('#comparison-slider-1 .comparison-item.before')
            },
            {
                slider: document.getElementById('comparison-slider-2'),
                handle: document.getElementById('slider-handle-2'),
                before: document.querySelector('#comparison-slider-2 .comparison-item.before')
            },
            {
                slider: document.getElementById('comparison-slider-3'),
                handle: document.getElementById('slider-handle-3'),
                before: document.querySelector('#comparison-slider-3 .comparison-item.before')
            }
        ];
        
        sliders.forEach(item => {
            const slider = item.slider;
            const handle = item.handle;
            const before = item.before;
            
            let isDragging = false;
            
            // Mouse events
            handle.addEventListener('mousedown', () => {
                isDragging = true;
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const sliderRect = slider.getBoundingClientRect();
                let position = (e.clientX - sliderRect.left) / sliderRect.width;
                
                // Constrain position between 0 and 1
                position = Math.max(0, Math.min(1, position));
                
                // Update slider position
                handle.style.left = `${position * 100}%`;
                before.style.clipPath = `polygon(0 0, ${position * 100}% 0, ${position * 100}% 100%, 0 100%)`;
            });
            
            // Touch events for mobile
            handle.addEventListener('touchstart', () => {
                isDragging = true;
            });
            
            document.addEventListener('touchend', () => {
                isDragging = false;
            });
            
            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                const touch = e.touches[0];
                const sliderRect = slider.getBoundingClientRect();
                let position = (touch.clientX - sliderRect.left) / sliderRect.width;
                
                // Constrain position between 0 and 1
                position = Math.max(0, Math.min(1, position));
                
                // Update slider position
                handle.style.left = `${position * 100}%`;
                before.style.clipPath = `polygon(0 0, ${position * 100}% 0, ${position * 100}% 100%, 0 100%)`;
            });
        });
    }

    // Initialize quiz functionality
    function initQuiz() {
      const quizData = [
    {
        question: "Which of the following is NOT a natural cause of erosion in the Ayusai Gorge?",
        options: [
            "Rainfall and water runoff",
            "Wind erosion",
            "Tourist hiking trails",
            "Freeze-thaw cycles"
        ],
        correctAnswer: 2
    },
    {
        question: "What percentage of documented changes in the Ayusai Gorge are human-induced?",
        options: [
            "25%",
            "40%",
            "55%",
            "70%"
        ],
        correctAnswer: 2
    },
    {
        question: "Which area of the Ayusai Gorge shows the highest level of natural changes?",
        options: [
            "North Ridge",
            "River Valley",
            "Central Basin",
            "East Slope"
        ],
        correctAnswer: 1
    },
    {
        question: "Which of these conservation efforts would be most effective in preserving the Ayusai Gorge ecosystem?",
        options: [
            "Building more tourist facilities",
            "Establishing designated hiking trails",
            "Increasing mining operations",
            "Removing all visitor access"
        ],
        correctAnswer: 1
    },
    {
        question: "What year did the Ayusai Gorge Research Project begin documenting changes?",
        options: [
            "2005",
            "2010",
            "2015",
            "2020"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the primary purpose of the Ayusai Gorge Research Project?",
        options: [
            "Develop tourism",
            "Monitor ecological changes",
            "Expand agricultural land",
            "Construct new roads"
        ],
        correctAnswer: 1
    },
    {
        question: "Which species is most threatened by human activity in Ayusai Gorge?",
        options: [
            "Golden eagle",
            "Mountain goat",
            "Snow leopard",
            "Alpine marmot"
        ],
        correctAnswer: 2
    },
    {
        question: "How do freeze-thaw cycles contribute to erosion?",
        options: [
            "Melting snow covers plants",
            "Ice expands and breaks rocks",
            "Water evaporates quickly",
            "Sunlight intensifies soil movement"
        ],
        correctAnswer: 1
    },
    {
        question: "Which human activity is most responsible for vegetation loss in the gorge?",
        options: [
            "Picnicking",
            "Littering",
            "Unregulated hiking",
            "Bird watching"
        ],
        correctAnswer: 2
    },
    {
        question: "How often is data collected in the Ayusai Gorge Research Project?",
        options: [
            "Annually",
            "Biannually",
            "Monthly",
            "Every five years"
        ],
        correctAnswer: 0
    },
    {
        question: "Which organization funds the Ayusai Gorge Research Project?",
        options: [
            "World Bank",
            "UNESCO",
            "Kazakhstan Ministry of Ecology",
            "WWF"
        ],
        correctAnswer: 2
    },
    {
        question: "What natural feature is most studied in the Ayusai Gorge?",
        options: [
            "Waterfalls",
            "Rock formations",
            "Soil layers",
            "River dynamics"
        ],
        correctAnswer: 3
    },
    {
        question: "What is a common indicator of human impact in the area?",
        options: [
            "Increased vegetation",
            "Trail widening",
            "Animal migration",
            "Snow accumulation"
        ],
        correctAnswer: 1
    },
    {
        question: "Which method is used to track erosion in the gorge?",
        options: [
            "Drone mapping",
            "Satellite imagery",
            "On-ground sensors",
            "All of the above"
        ],
        correctAnswer: 3
    },
    {
        question: "Why are designated trails important for conservation?",
        options: [
            "They provide better photos",
            "They limit damage to sensitive areas",
            "They allow vehicle access",
            "They mark property boundaries"
        ],
        correctAnswer: 1
    },
    {
        question: "What is a freeze-thaw cycle in simple terms?",
        options: [
            "Snow melting into rivers",
            "Water freezing and then melting repeatedly",
            "Water boiling from sunlight",
            "Dry soil absorbing rain"
        ],
        correctAnswer: 1
    },
    {
        question: "Which season typically accelerates erosion in Ayusai Gorge?",
        options: [
            "Summer",
            "Winter",
            "Spring",
            "Autumn"
        ],
        correctAnswer: 2
    },
    {
        question: "Which of the following is an indirect effect of tourism?",
        options: [
            "Soil erosion",
            "Littering",
            "Noise pollution",
            "All of the above"
        ],
        correctAnswer: 3
    },
    {
        question: "What tool helps researchers track environmental change over time?",
        options: [
            "Binoculars",
            "Time-lapse cameras",
            "Maps",
            "Measuring tape"
        ],
        correctAnswer: 1
    },
    {
        question: "Which is a major concern for biodiversity in Ayusai Gorge?",
        options: [
            "Forest fires",
            "Tourist waste",
            "Urbanization",
            "Logging"
        ],
        correctAnswer: 1
    }
];

        
        let currentQuestion = 0;
        let selectedOption = null;
        let answered = false;
        
        const questionElement = document.getElementById('quiz-question');
        const optionsElement = document.getElementById('quiz-options');
        const resultElement = document.getElementById('quiz-result');
        const prevButton = document.getElementById('quiz-prev');
        const nextButton = document.getElementById('quiz-next');
        const checkButton = document.getElementById('quiz-check');
        
        // Load the initial question
        loadQuestion(currentQuestion);
        
        // Event listeners for quiz navigation
        prevButton.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion(currentQuestion);
                updateNavButtons();
            }
        });
        
        nextButton.addEventListener('click', () => {
            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                loadQuestion(currentQuestion);
                updateNavButtons();
            }
        });
        
        checkButton.addEventListener('click', () => {
            if (selectedOption === null) {
                alert('Please select an answer before checking.');
                return;
            }
            
            if (!answered) {
                checkAnswer();
                answered = true;
                checkButton.textContent = 'Next Question';
            } else {
                // Move to next question if there is one, otherwise reset
                if (currentQuestion < quizData.length - 1) {
                    currentQuestion++;
                    loadQuestion(currentQuestion);
                    updateNavButtons();
                } else {
                    alert('Quiz completed! You can restart to try again.');
                    currentQuestion = 0;
                    loadQuestion(currentQuestion);
                    updateNavButtons();
                }
                answered = false;
                checkButton.textContent = 'Check Answer';
            }
        });
        
        // Load question and options
        function loadQuestion(index) {
            const question = quizData[index];
            questionElement.textContent = question.question;
            
            // Clear previous options and selection
            optionsElement.innerHTML = '';
            selectedOption = null;
            resultElement.style.display = 'none';
            
            // Add new options
            question.options.forEach((option, i) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.dataset.value = i;
                
                optionDiv.addEventListener('click', () => {
                    // Remove selection from all options
                    document.querySelectorAll('.quiz-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Select this option
                    optionDiv.classList.add('selected');
                    selectedOption = i;
                });
                
                optionsElement.appendChild(optionDiv);
            });
        }
        
        // Check the selected answer
        function checkAnswer() {
            const correctAnswer = quizData[currentQuestion].correctAnswer;
            
            // Highlight correct and incorrect answers
            document.querySelectorAll('.quiz-option').forEach(option => {
                const optionValue = parseInt(option.dataset.value);
                
                if (optionValue === correctAnswer) {
                    option.classList.add('correct');
                } else if (optionValue === selectedOption) {
                    option.classList.add('incorrect');
                }
            });
            
            // Show result message
            resultElement.style.display = 'block';
            if (selectedOption === correctAnswer) {
                resultElement.textContent = 'Correct! Great job!';
                resultElement.className = 'quiz-result correct';
            } else {
                resultElement.textContent = 'Incorrect. The correct answer is highlighted.';
                resultElement.className = 'quiz-result incorrect';
            }
        }
        
        // Update navigation buttons state
        function updateNavButtons() {
            prevButton.disabled = currentQuestion === 0;
            nextButton.disabled = currentQuestion === quizData.length - 1;
        }
    }
    async function translatePage(targetLang) {
  const elements = Array.from(document.body.querySelectorAll("*"));
  
  for (let el of elements) {
    for (let node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim() !== "") {
        const originalText = node.textContent.trim();
        
        // Optional: Skip if already translated or cached
        if (!originalText.match(/[a-zA-Zа-яА-ЯіІңҢөӨүҮқҚһҺғҒ]/)) continue;

        try {
          const translatedText = await translateText(originalText, "en", targetLang);
          node.textContent = translatedText;
        } catch (err) {
          console.error("Translation error:", err);
        }
      }
    }
  }
}