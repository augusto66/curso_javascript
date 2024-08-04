document.addEventListener('DOMContentLoaded', function () {
    // Obtener el campo de entrada
    let timeInput = document.getElementById('hora');

    // Función para configurar el intervalo de tiempo
    function intervaloHoras() {
        const horas = [];
        const minutos = ['00', '30'];

        // Llenar las horas de 10 a 24 horas en intervalos de 30 minutos
        for (let h = 10; h < 24; h++) {
            for (let m = 0; m < minutos.length; m++) {
                horas.push((h < 10 ? '0' : '') + h + ':' + minutos[m]);
            }
        }

        // Establecer el valor de la lista desplegable
        const timeInput = document.getElementById('hora');
        timeInput.setAttribute('list', 'time-options');

        // Crear un elemento datalist para opciones
        const datalist = document.createElement('datalist');
        datalist.id = 'time-options';

        // Crear opciones para el datalist
        horas.forEach(function (time) {
            const option = document.createElement('option');
            option.value = time;
            datalist.appendChild(option);
        });

        // Agregar el datalist al documento
        document.body.appendChild(datalist);
    }


    // Ejecutar la función para establecer intervalos de tiempo
    intervaloHoras();
});

// Manejar el envío del formulario de reserva
document.getElementById('reservaForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Obtener los valores del formulario
    let nombre = document.getElementById('nombre').value;
    let dia = document.getElementById('dia').value;
    let hora = document.getElementById('hora').value;

    // Cargar reservas desde localStorage, o inicializar como un array vacío si no hay reservas
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Verificar si ya existe una reserva para el mismo día y hora
    let reservaExistente = reservas.some(reserva => reserva.dia === dia && reserva.hora === hora);

    // Obtener el elemento para mostrar mensajes
    let messageElement = document.getElementById('message');

    if (reservaExistente) {
        // Mostrar mensaje de error si ya hay una reserva
        messageElement.textContent = `El turno para el ${dia} a las ${hora} ya está ocupado.`;
        messageElement.className = 'message error'; // Asignar una clase CSS para estilo de error
    } else {
        // Crear y agregar nueva reserva
        let nuevaReserva = {
            nombre: nombre,
            dia: dia,
            hora: hora
        };

        reservas.push(nuevaReserva);
        localStorage.setItem('reservas', JSON.stringify(reservas)); // Guardar reservas en localStorage

        // Mostrar mensaje de confirmación
        messageElement.textContent = `Reserva confirmada para ${nombre} el ${dia} a las ${hora}.`;
        messageElement.className = 'message success'; // Asignar una clase CSS para estilo de éxito
    }

    messageElement.style.display = 'block'; // Asegurarse de que el mensaje se muestra

    // Manejar la lista de reservas
    document.getElementById('listarReservas').addEventListener('click', function () {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        let reservasList = document.getElementById('reservasList');

        if (reservas.length === 0) {
            reservasList.textContent = 'No hay reservas.';
        } else {
            reservasList.innerHTML = '<h2>Reservas</h2><ul>' + reservas.map(reserva =>
                `<li>${reserva.nombre} ha reservado el ${reserva.dia} a las ${reserva.hora}</li>`).join('') + '</ul>';
        }

        reservasList.style.display = 'block';
    });
});