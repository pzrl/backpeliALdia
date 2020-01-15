
const changeDateFormatDiaMes = (pFecha) => {
    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    return (pFecha.getDate() + " de " + meses[pFecha.getMonth()]);
}

const changeDateFormatDateTime = (pFecha) => {

    let hora = pFecha.fecha.getHours();
    let minutosMenor = ''
    let minutos = pFecha.fecha.getMinutes();
    if (minutos < 10) minutosMenor = '0';
    let dia = pFecha.fecha.getDate();
    let mesMenor = ''
    let mes = (pFecha.fecha.getMonth() + 1);
    if (mes < 10) mesMenor = '0';
    let año = pFecha.fecha.getFullYear();

    pFecha.fecha = hora + ":" + minutosMenor + minutos + " " + dia + "-" + mesMenor + mes + "-" + año;
    return (pFecha);
}

module.exports = {
    changeDateFormatDiaMes: changeDateFormatDiaMes,
    changeDateFormatDateTime: changeDateFormatDateTime
}