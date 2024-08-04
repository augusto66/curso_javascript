function showBookingForm() {
    document.getElementById('booking-form').style.display = 'block';
}

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Reserva realizada con éxito!');
    document.getElementById('form').reset();
    document.getElementById('booking-form').style.display = 'none';
});