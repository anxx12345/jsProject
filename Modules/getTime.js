function getTime(){
    let d = new Date();
    let day = d.getDate();
    let hr = d.getHours();
    let min = d.getMinutes();
    let sec = d.getSeconds();
    let month = d.getMonth()+1;
    if(sec < 10){
        sec = '0' +sec;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if(hr<10){
        hr = '0' + hr;
    }
    if(day<10){
        day = '0' + day;
    }
    if(month<10){
        month = '0' + month
    }
    let year = d.getFullYear();
// console.log(`${year}-${month}-${day} ${hr}:${min}:${sec}`)
    return `${year}-${month}-${day} ${hr}:${min}:${sec}`
}

module.exports = getTime;
