document.addEventListener('DOMContentLoaded', function () {
    const ticketInfo = document.getElementById('aside-title-summary');
    const totalPrice = document.getElementById('booking-submit-summary');

    function saveTotalPriceToSessionStorage() {
        sessionStorage.setItem('totalPrice', totalPrice.innerText);
    }

    const listofTickets = document.getElementById('list-of-tickets-in-order');
    const emptyStateImage = document.querySelector('.empty-state-image');

    const goodElements = document.querySelectorAll('.GOOD');
    let selectedSeats = 0;
    const selectedSeatIndexes = [];

    // Добавьте обработчик события beforeunload
    window.addEventListener('beforeunload', function() {
        // Очистите значение totalPrice в localStorage перед закрытием страницы
        localStorage.removeItem('totalPrice');
    });

    goodElements.forEach((goodElement, index) => {
        goodElement.addEventListener('click', function () {
            if (selectedSeats < 33) {
                const rowIndex = goodElement.getAttribute('data-row-index');
                const columnIndex = goodElement.getAttribute('data-column-index');
                const seatIndex = `${rowIndex}-${columnIndex}`;

                if (!selectedSeatIndexes.includes(seatIndex)) {
                    const price = goodElement.getAttribute('data-price');

                    // Создаем билет с использованием шаблона
                    const newTicket = document.createElement('li');
                    newTicket.classList.add('GOOD', 'list-group-item');
                    newTicket.innerHTML = `
                        <div class="book-ticket">
                            <div class="book-ticket-row">${rowIndex} ряд</div>
                            <div class="book-ticket-place">
                                <span>${columnIndex}</span><span > место</span>
                            </div>
                            <div class="book-ticket-price">
                                <strong><small>${price} руб</small></strong>
                            </div>
                            <a class="book-ticket-remove" cart-ticket-remove="">
                                <svg class="icon">
                                    <use xlink:href="#close"></use>
                                </svg>
                            </a>
                        </div>
                    `;

                    listofTickets.appendChild(newTicket);
                    updateTotalPrice();
                    updateTicketInfo();
                    updateEmptyState();

                    const deleteButton = newTicket.querySelector('.book-ticket-remove');
                    deleteButton.addEventListener('click', function () {
                        listofTickets.removeChild(newTicket);
                        updateTotalPrice();
                        updateTicketInfo();
                        selectedSeats--;
                        const seatIndexIndex = selectedSeatIndexes.indexOf(seatIndex);
                        if (seatIndexIndex !== -1) {
                            selectedSeatIndexes.splice(seatIndexIndex, 1);
                        }
                        updateEmptyState();
                    });

                    selectedSeats++;
                    selectedSeatIndexes.push(seatIndex);
                } else {
                    alert('Это место уже выбрано.');
                }
            } else {
                alert('Нельзя выбрать больше 6 мест.');
            }
            
        });
    });

    function updateTotalPrice() {
        const tickets = document.querySelectorAll('.list-group-item.GOOD');
        let total = 0;
        tickets.forEach(ticket => {
            const priceText = ticket.querySelector('.book-ticket-price small').innerText;
            const price = parseInt(priceText.split(' ')[0]);
            total += price;
        });

        totalPrice.innerText = total + ' руб';
        saveTotalPriceToSessionStorage();
    }

    function updateTicketInfo() {
        const tickets = document.querySelectorAll('.list-group-item.GOOD');
        const ticketCount = tickets.length;
        ticketInfo.innerText = `${ticketCount} билет${ticketCount !== 1 ? 'а' : ''}, ${totalPrice.innerText}`;
    }

    function updateEmptyState() {
        const tickets = document.querySelectorAll('.list-group-item.GOOD');
        const emptyStateDisplay = tickets.length === 0 ? 'block' : 'none';
        emptyStateImage.style.display = emptyStateDisplay;
    }

    // Получите значение из localStorage при загрузке страницы
    const savedTotalPrice = sessionStorage.getItem('totalPrice');
    if (savedTotalPrice) {
        totalPrice.innerText = savedTotalPrice;
    }
});
