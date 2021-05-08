// 服务器地址
var server_url = 'http://47.102.210.188:8080'

var vid_id = "myVideo"
var vid_ele = document.getElementById(vid_id);

// 	事件在视频/音频（audio/video）暂停时触发
vid_ele.onpause = function () {
    is_playing = false;
    sync_request()
}

// 事件在视频/音频（audio/video）开始播放时触发
vid_ele.onplay = function () {
    is_playing = true;
    sync_request()
}

// // 事件在用户重新定位视频/音频（audio/video）的播放位置后触发
// vid_ele.onseeked = function () {
//     console.log('onseeked')
//     sync()
// }

// 当前正在播放
var is_playing = false;

// 同步请求
function sync_request() {
    let state = {
        current_time: vid_ele.currentTime,
        is_playing: is_playing,
        client_timestamp: new Date().getTime()
    }
    post(
        server_url + '/sync',
        JSON.stringify(state),
        function (responseText) {
            if (responseText === '{}') {
                return;
            }

            expectation = JSON.parse(responseText)
            console.log(expectation)
            sync(expectation)
        }
    )
}

// 同步
function sync(expectation) {
    switch (expectation.is_playing) {
        case true:
            vid_ele.play()
            break;
        case false:
            vid_ele.pause()
    }

    vid_ele.currentTime = expectation.current_time
}

// 计算网络延迟
function calcDelay() {
    let timestamp = new Date().getTime();
    post(
        server_url + '/delay',
        null,
        function (responseText) {
            let delay_ele = document.getElementById('delay');
            delay_ele.innerHTML = '' + (new Date().getTime() - timestamp);
        }
    )
}

sync_request();
calcDelay();

// 定时同步
setInterval(sync_request, 400)
setInterval(calcDelay, 5000)