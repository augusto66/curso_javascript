document.getElementById('reservaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let nombre = document.getElementById('nombre').value;
    let dia = document.getElementById('dia').value;
    let hora = document.getElementById('hora').value;

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Verificar si ya existe una reserva para el mismo día y hora
    let reservaExistente = reservas.find(reserva => reserva.dia === dia && reserva.hora === hora);

    let messageElement = document.getElementById('message');

    if (reservaExistente) {
        // Si el turno está ocupado, mostrar mensaje de error
        messageElement.textContent = `El turno para el ${dia} a las ${hora} ya está ocupado.`;
        messageElement.className = 'message error';
    } else {
        // Si el turno está disponible, registrar la reserva
        let nuevaReserva = {
            nombre: nombre,
            dia: dia,
            hora: hora
        };

        reservas.push(nuevaReserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        // Mostrar mensaje de confirmación
        messageElement.textContent = `Reserva confirmada para ${nombre} el ${dia} a las ${hora}.`;
        messageElement.className = 'message success';
    }

    messageElement.style.display = 'block';
});