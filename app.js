let log = console.log;
let ping = require('ping');
let hosts = require('./Modules/OLT');
let err_map_cache = new Map();
let err_map_cache_runner;
let hosts_runner;
let dingTalk = require('./Modules/dingtalk');
let Sequ_Module = require('./mysql/Modules/Sequ_Module');
let getTime = require('./Modules/getTime');

async function run() {
    hosts_runner = hosts;
    err_map_cache_runner = err_map_cache;
    hosts_runner.forEach(async function (host, oltName) {
        let res = await ping.promise.probe(host, { timeout: 4, extra: ["-i 2"] })
        if (!res.alive) {
            err_map_cache.set(oltName, host);
            hosts.delete(oltName);
            console.log({ title: 'OLT脱管通报', text: `### OLT脱管通报\n ${oltName}(${host})` });
            await Sequ_Module.MOD.create({
                id: new Date().getTime(),
                name: oltName,
                start_time: getTime(),
                end_time: null
            });
            await dingTalk({ title: 'OLT脱管通报', text: `### OLT脱管通报\n ${oltName}(${host})` });
        }
    })
    err_map_cache_runner.forEach(async function (host, oltName) {
        let res_err = await ping.promise.probe(host, { timeout: 4, extra: ["-i 2"] });
        if (res_err.alive) {
            hosts.set(oltName, host);
            err_map_cache.delete(oltName);
            console.log({
                title: "已恢复OLT:",
                text: `> ${oltName}(${host}) 已恢复`
            });
            Sequ_Module.MOD.update({ end_time: getTime() }, { where: { name: oltName, end_time: null } });
            await dingTalk({
                title: "已恢复OLT:",
                text: `> ${oltName}(${host}) 已恢复`
            });
        }
    })
    //每次刷新通报
    // err_map_cache_runner.forEach(async function (host,oltName) {
    //     if(err_num<20){
    //         let res_err = await ping.promise.probe(host, { timeout: 4, extra: ["-i 2"] })
    //         if (res_err.alive) {
    //             hosts.set(oltName, host);
    //             err_map_cache.delete(oltName);
    //             console.log({ title: '已恢复OLT:', text: `> ${oltName}(${host}) 已恢复` });
    //             Sequ_Module.MOD.update(
    //                 { end_time: getTime() },
    //                 {
    //             err_map_cache_runner.forEach(async function (host,oltName) {
    //     if(err_num<20){
    //         let res_err = await ping.promise.probe(host, { timeout: 4, extra: ["-i 2"] })
    //         if (res_err.alive) {
    //             hosts.set(oltName, host);
    //             err_map_cache.delete(oltName);
    //             console.log({ title: '已恢复OLT:', text: `> ${oltName}(${host}) 已恢复` });
    //             Sequ_Module.MOD.update(
    //                 { end_time: getTime() },
    //                 {
    //                     'where': {
    //                         name: oltName,
    //                         end_time: null
    //                     }
    //                 }
    //             );
    //             await dingTalk({ title: '已恢复OLT:', text: `> ${oltName}(${host}) 已恢复` });
    //         }

    //     }
    // })        'where': {
    //                         name: oltName,
    //                         end_time: null
    //                     }
    //                 }
    //             );
    //             await dingTalk({ title: '已恢复OLT:', text: `> ${oltName}(${host}) 已恢复` });
    //         }

    //     }
    // })
    //整点刷新通报
    let hour = new Date().getHours();
    let min = new Date().getMinutes();
    let sec = new Date().getSeconds();
    if (min < 5) {
        console.log(`${hour}:${min}:${min}`);
        let arr_err_olts = await Sequ_Module.MOD.findAll(//query failure olts.
            {
                where: { end_time: null }
            }
        );
        console.log(arr_err_olts.length)
        if (arr_err_olts.length) {
            let err_olts = '';
            arr_err_olts.forEach(async function (x) {
                err_olts += x.dataValues.name + '(故障开始时间' + x.dataValues.start_time + ')\n\r' + '> ';

            })
            err_olts = '> ' + err_olts;
            err_olts = err_olts.substring(0, err_olts.length - 2);
            await dingTalk({ title: '当前仍脱管OLT:', text: `### 当前仍脱管OLT:\n ${err_olts}` });
        }
    }
}

function wait(time) {
    // oneLoop = true;
    run();
    setTimeout(() => {
        wait(time)
    }, time);
}
wait(5 * 60 * 1000);
