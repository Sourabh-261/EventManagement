document.getElementById('event-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventTime = document.getElementById('event-time').value;
    const eventParticipants = document.getElementById('event-participants').value;
    const eventPriority = document.getElementById('event-priority').value;

    if (eventName && eventDate && eventTime && eventParticipants && eventPriority) {
        const eventList = document.getElementById('events');

        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${eventName}</strong> | ${new Date(eventDate).toLocaleDateString()} | ${eventTime} | Participants: ${eventParticipants} | Priority: ${eventPriority}`;
        listItem.setAttribute('data-priority', eventPriority);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px';

        deleteButton.addEventListener('click', function() {
            eventList.removeChild(listItem);
        });

        listItem.appendChild(deleteButton);
        eventList.appendChild(listItem);

        // Clear input fields
        document.getElementById('event-name').value = '';
        document.getElementById('event-date').value = '';
        document.getElementById('event-time').value = '';
        document.getElementById('event-participants').value = '';
        document.getElementById('event-priority').value = '';
    }
});

// Add Sort Button functionality
const sortButton = document.createElement('button');
sortButton.textContent = 'Sort by Priority';
sortButton.id = 'sort-button';
document.querySelector('section:nth-of-type(2)').appendChild(sortButton);

sortButton.addEventListener('click', function() {
    const eventList = document.getElementById('events');
    const items = [...eventList.children];
    items.sort((a, b) => parseInt(a.getAttribute('data-priority')) - parseInt(b.getAttribute('data-priority')));
    eventList.innerHTML = '';
    items.forEach(item => eventList.appendChild(item));
});