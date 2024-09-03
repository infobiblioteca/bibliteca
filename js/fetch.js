document.addEventListener('DOMContentLoaded', function () {
    let tesisData = []; // Para almacenar los datos de tesis

    fetch('tesis.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            tesisData = data; // Guardamos los datos
            renderTable(tesisData); // Renderizamos la tabla inicialmente
        })
        .catch(error => console.error('Hubo un error:', error));

    // Función para renderizar la tabla
    function renderTable(data) {
        const listaTesisContainer = document.querySelector('#lista-tesis tbody');
        listaTesisContainer.innerHTML = ''; // Limpiar la tabla existente
        data.forEach(tesis => {
            const row = document.createElement('tr');
    
            // Generar el contenido de la columna "Observaciones"
            const observaciones = tesis["OBSERVACIONES"] || '';

            // Verificar si hay URLs en las observaciones para la columna de recursos
            let recursos = '';
            if (tesis["RECURSOS"]) {
                const docs = tesis["RECURSOS"].split(';'); // Suponiendo que las URLs están separadas por punto y coma
                docs.forEach(doc => {
                    if (doc.trim().startsWith('http')) {
                        recursos +=  `
                        <a href="${doc.trim()}" target="_blank" style="display: inline-block; margin-right: 5px;">
                        <i class="bi bi-file-earmark-text" style="font-size: 1.5rem; color: #236259;"></i>
                    </a>`;
                    }
                });
            }

            // Mostrar un mensaje si no hay recursos
            if (!recursos) {
                recursos = '<span>Solo en formato físico</span>';
            }

            row.innerHTML = `
                <td>${tesis["Nª DE INV."]}</td>
                <td>${tesis["NOMBRES Y APELLIDOS"]}</td>
                <td>${tesis["TITULO"]}</td>
                <td>${tesis["AÑO"]}</td>
                <td>${observaciones}</td> <!-- Ahora correctamente definida -->
                <td>${recursos}</td>
            `;
            listaTesisContainer.appendChild(row);
        });
    }

    // Función para buscar y filtrar los datos
    function filterTable(query, criteria) {
        const filteredData = tesisData.filter(tesis => {
            const lowerQuery = query.toLowerCase();
            if (criteria === 'nombres') {
                return tesis["NOMBRES Y APELLIDOS"].toLowerCase().includes(lowerQuery);
            } else if (criteria === 'titulo') {
                return tesis["TITULO"].toLowerCase().includes(lowerQuery);
            } else if (criteria === 'ano') {
                return tesis["AÑO"].toString().includes(lowerQuery);
            }
            return false;
        });
        renderTable(filteredData);
    }

    // Evento de entrada para el campo de búsqueda
    const searchInput = document.getElementById('search');
    const searchForm = document.getElementById('search-form');

    searchInput.addEventListener('input', function () {
        const selectedCriteria = searchForm.querySelector('input[name="searchCriteria"]:checked').value;
        filterTable(this.value, selectedCriteria);
    });

    // Evento de cambio para los botones de radio
    searchForm.addEventListener('change', function () {
        // Limpiar el campo de búsqueda y disparar la búsqueda con el criterio actualizado
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    });
});

