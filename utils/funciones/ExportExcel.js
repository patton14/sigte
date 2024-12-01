import ExcelJS from 'exceljs';

export const exportToExcel = (data, name) => {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Crear una nueva hoja en el libro de Excel
    const worksheet = workbook.addWorksheet('Sheet1');

    // Configurar los tipos de datos de las celdas
    const headers = Object.keys(data[0]);
    const col = [];

    headers.forEach((h) => {
        col.push({ header: h, key: h, width: 20 });
    });

    worksheet.columns = col;

    // Agregar datos y estilos a la hoja de cálculo
    for (let i = 0; i < data.length; i++) {
        const rowData = data[i];
        const row = worksheet.addRow(rowData);

        // Ajustar el ancho de las columnas según el contenido de las celdas
        row.eachCell({ includeEmpty: true }, (cell) => {
            const column = worksheet.getColumn(cell.col);
            const cellWidth = Math.ceil((cell.text.length + 2) * 1.2);
            if (column.width < cellWidth) {
                column.width = cellWidth;
            }

            // Establecer el estilo para los campos vacíos o con ceros
            if (cell.value === null || cell.value === '') {
                cell.value = '0'; // Mostrar '0' en lugar de campo vacío
                cell.alignment = { horizontal: 'right' }; // Alinear al centro
            }
        });
    }

    // Establecer los estilos de los bordes para las líneas marcadas
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
        const row = worksheet.getRow(rowNumber);
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'medium' },
                bottom: { style: 'medium' },
                right: { style: 'medium' },
            };
        });
    }

    // Establecer el estilo del encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '66B2FF' }, // Color de fondo amarillo para el encabezado
        };
    });

    // Escribir el libro de Excel en un archivo
    const fecha = new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    const fileName = `${name}_export_${fecha}.xlsx`;

    workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
        })
        .catch((error) => console.log(error));

    const a = false;

    return a
};
