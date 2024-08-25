document.addEventListener('DOMContentLoaded', function () {
    // Configura intervalo de horas
    configurarIntervaloHoras();

    // Configura fecha mínima
    configurarFechaMinima();

    // Maneja envío del formulario de reserva
    document.getElementById('reservaForm').addEventListener('submit', manejarReserva);

    // Muestra las reservas al cargar la página
    mostrarReservas();
});

function configurarFechaMinima() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('dia').setAttribute('min', hoy);
}

function configurarIntervaloHoras() {
    const horas = [];
    const minutos = ['00', '30'];

    for (let h = 10; h < 24; h++) {
        for (let m = 0; m < minutos.length; m++) {
            horas.push((h < 10 ? '0' : '') + h + ':' + minutos[m]);
        }
    }

    const timeInput = document.getElementById('hora');
    timeInput.setAttribute('list', 'time-options');

    const datalist = document.createElement('datalist');
    datalist.id = 'time-options';

    horas.forEach(function (time) {
        const option = document.createElement('option');
        option.value = time;
        datalist.appendChild(option);
    });

    document.body.appendChild(datalist);
}

function manejarReserva(event) {
    event.preventDefault();

    let nombre = document.getElementById('nombre').value;
    let dia = document.getElementById('dia').value;
    let hora = document.getElementById('hora').value;

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    let reservaExistente = reservas.some(reserva => reserva.dia === dia && reserva.hora === hora);

    let messageElement = document.getElementById('message');

    if (reservaExistente) {
        mostrarMensaje(messageElement, `El turno para el ${dia} a las ${hora} ya está ocupado.`, 'error');
    } else {
        let nuevaReserva = { nombre, dia, hora };
        reservas.push(nuevaReserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        mostrarMensaje(messageElement, `Reserva confirmada para ${nombre} el ${dia} a las ${hora}.`, 'success');

        // Resetea el formulario después de guardar la reserva
        document.getElementById('reservaForm').reset();

        // Actualiza la tabla de reservas
        mostrarReservas();
    }
}

function mostrarMensaje(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';

    setTimeout(() => {
        element.style.display = 'none';
    }, 2000); // Oculta el mensaje después de 2 segundos
}

function mostrarReservas() {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    let reservasList = document.getElementById('reservasList');

    // Limpia la tabla de reservas actual
    reservasList.innerHTML = '';

    if (reservas.length === 0) {
        reservasList.innerHTML = '<tr><td colspan="4">No hay reservas.</td></tr>';
    } else {
        // Muestra todas las reservas en la tabla
        reservas.forEach((reserva, index) => {
            // Formatea la fecha de yyyy-mm-dd a dd-mm-yyyy
            let [year, month, day] = reserva.dia.split('-');
            let fechaFormateada = `${day}-${month}-${year}`;

            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${reserva.nombre}</td>
                <td>${fechaFormateada}</td>
                <td>${reserva.hora}</td>
                <td><button class="delete-button" data-index="${index}">Borrar</button></td>
            `;
            reservasList.appendChild(row);
        });

        // Evento de clic a todos los botones de borrar
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', borrarReserva);
        });
    }

    reservasList.style.display = 'table-row-group';
}

function borrarReserva(event) {
    const index = event.target.getAttribute('data-index');
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Elimina la reserva del array
    reservas.splice(index, 1);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Actualiza la tabla de reservas
    mostrarReservas();
}
