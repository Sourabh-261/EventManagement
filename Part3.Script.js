        // Sample users database
        const users = {
            'admin': { password: 'admin123', role: 'Administrator' },
            'user': { password: 'user123', role: 'User' }
        };

        // Events storage
        let events = [
            {
                id: 1,
                title: 'Project Presentation',
                description: 'Final project presentations for Computer Science students',
                date: '2025-06-15',
                time: '14:00',
                priority: 1,
                course: 'CS 101',
                semester: 'Spring 2025',
                participants: 25,
                createdBy: 'admin'
            },
            {
                id: 2,
                title: 'Study Group Session',
                description: 'Mathematics study group for upcoming exams',
                date: '2025-06-10',
                time: '16:30',
                priority: 2,
                course: 'MATH 201',
                semester: 'Spring 2025',
                participants: 15,
                createdBy: 'user'
            }
        ];

        let currentUser = null;
        let nextEventId = 3;

        function login() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (users[username] && users[username].password === password) {
                currentUser = { username, role: users[username].role };
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('eventSection').style.display = 'block';
                document.getElementById('userRole').textContent = currentUser.role;
                
                // Show add form button only for administrators
                if (currentUser.role === 'Administrator') {
                    document.getElementById('showAddBtn').style.display = 'inline-block';
                } else {
                    document.getElementById('showAddBtn').style.display = 'none';
                }
                
                displayEvents();
            } else {
                alert('Invalid username or password!');
            }
        }

        function logout() {
            currentUser = null;
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('eventSection').style.display = 'none';
            document.getElementById('addEventForm').style.display = 'none';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            clearForm();
        }

        function showAddForm() {
            document.getElementById('addEventForm').style.display = 'block';
            document.getElementById('showAddBtn').style.display = 'none';
        }

        function cancelAdd() {
            document.getElementById('addEventForm').style.display = 'none';
            document.getElementById('showAddBtn').style.display = 'inline-block';
            clearForm();
        }

        function clearForm() {
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            document.getElementById('date').value = '';
            document.getElementById('time').value = '';
            document.getElementById('priority').value = '';
            document.getElementById('course').value = '';
            document.getElementById('semester').value = '';
            document.getElementById('participants').value = '';
        }

        function addEvent() {
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const priority = parseInt(document.getElementById('priority').value);
            const course = document.getElementById('course').value.trim();
            const semester = document.getElementById('semester').value.trim();
            const participants = parseInt(document.getElementById('participants').value);

            if (!title || !date || !time || !priority) {
                alert('Please fill in all required fields (Title, Date, Time, Priority)');
                return;
            }

            const newEvent = {
                id: nextEventId++,
                title,
                description,
                date,
                time,
                priority,
                course,
                semester,
                participants: participants || 0,
                createdBy: currentUser.username
            };

            events.push(newEvent);
            displayEvents();
            cancelAdd();
            alert('Event added successfully!');
        }

        function deleteEvent(eventId) {
            if (confirm('Are you sure you want to delete this event?')) {
                events = events.filter(event => event.id !== eventId);
                displayEvents();
            }
        }

        function getPriorityText(priority) {
            switch (priority) {
                case 1: return 'High';
                case 2: return 'Medium';
                case 3: return 'Low';
                default: return 'Unknown';
            }
        }

        function getPriorityClass(priority) {
            switch (priority) {
                case 1: return 'priority-high';
                case 2: return 'priority-medium';
                case 3: return 'priority-low';
                default: return '';
            }
        }

        function formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        function formatTime(timeStr) {
            const [hours, minutes] = timeStr.split(':');
            const date = new Date();
            date.setHours(hours, minutes);
            return date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        }

        function displayEvents() {
            const eventsList = document.getElementById('eventsList');
            
            if (events.length === 0) {
                eventsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">No events scheduled yet.</div>';
                return;
            }

            // Sort events by date and priority
            const sortedEvents = events.sort((a, b) => {
                const dateA = new Date(a.date + ' ' + a.time);
                const dateB = new Date(b.date + ' ' + b.time);
                if (dateA.getTime() === dateB.getTime()) {
                    return a.priority - b.priority;
                }
                return dateA - dateB;
            });

            eventsList.innerHTML = sortedEvents.map(event => `
                <div class="event-card ${getPriorityClass(event.priority)}">
                    <div class="event-title">${event.title}</div>
                    ${event.description ? `<div style="color: #666; margin-bottom: 10px;">${event.description}</div>` : ''}
                    <div class="event-details">
                        <div class="event-detail">
                            <strong>Date:</strong> ${formatDate(event.date)}
                        </div>
                        <div class="event-detail">
                            <strong>Time:</strong> ${formatTime(event.time)}
                        </div>
                        <div class="event-detail">-
                            <strong>Priority:</strong> ${getPriorityText(event.priority)}
                        </div>
                        ${event.course ? `<div class="event-detail"><strong>Course:</strong> ${event.course}</div>` : ''}
                        ${event.semester ? `<div class="event-detail"><strong>Semester:</strong> ${event.semester}</div>` : ''}
                        ${event.participants ? `<div class="event-detail"><strong>Participants:</strong> ${event.participants}</div>` : ''}
                        <div class="event-detail">
                            <strong>Created by:</strong> ${event.createdBy}
                        </div>
                    </div>
                    ${currentUser.role === 'Administrator' || currentUser.username === event.createdBy ? 
                        `<div class="event-actions">
                            <button onclick="deleteEvent(${event.id})" class="btn-danger">Delete</button>
                        </div>` : ''
                    }
                </div>
            `).join('');
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Set today's date as minimum for date input
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').min = today;
            
            // Allow Enter key to login
            document.getElementById('password').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    login();
                }
            });
        });
