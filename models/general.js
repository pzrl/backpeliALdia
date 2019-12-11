
const changeDateFormatDiaMes = (pFecha) => {
    var meses = new Array("En.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.");
    return (pFecha.getDate() + " de " + meses[pFecha.getMonth()]);
}

const changeDateFormatDateTime = (pFecha) => {
    pFecha.fecha = pFecha.fecha.getHours() + ":" + pFecha.fecha.getMinutes() + "    " + pFecha.fecha.getDate() + "-" + pFecha.fecha.getMonth() + "-" + pFecha.fecha.getFullYear();
    return (pFecha);
}

module.exports = {
    changeDateFormatDiaMes: changeDateFormatDiaMes,
    changeDateFormatDateTime: changeDateFormatDateTime
}