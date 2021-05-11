// 服务器地址
var server_url = 'http://47.102.210.188:8080';

var vid_id = "myVideo";
var vid_ele = document.getElementById(vid_id);

var speed_range_id = "range";
var speed_range_ele = document.getElementById(speed_range_id);

var speed_txt_id = "speed";
var speed_txt_ele = document.getElementById(speed_txt_id);

var upload_id = "upload";
var upload_ele = document.getElementById(upload_id);

var playing_txt_id = "playing";
var playing_txt_ele = document.getElementById(playing_txt_id);

// 当前正在播放
var is_playing = false;

// 当前播放速度
var speed = 1

// 	事件在视频/音频（audio/video）暂停时触发
vid_ele.onpause = function () {
    is_playing = false;
    sync_request();
}

// 事件在视频/音频（audio/video）开始播放时触发
vid_ele.onplay = function () {
    is_playing = true;
    sync_request();
}

// 速度条滑动
speed_range_ele.onchange = function() {
    speed = speed_range_ele.value;
    vid_ele.playbackRate = speed; // 改变视频播放速度
    speed_txt_ele.innerHTML = speed
    sync_request();
}

// 选择播放的视频文件
upload_ele.onchange = function() {
    new_path = upload_ele.files[0].name;
    vid_ele.src = new_path;
    playing_txt_ele.innerHTML = new_path;
}

// 同步请求
function sync_request() {
    let state = {
        current_time: vid_ele.currentTime,
        is_playing: is_playing,
        speed: speed,
        client_timestamp: new Date().getTime()
    }
    post(
        server_url + '/sync',
        JSON.stringify(state),
        function (responseText) {
            if (responseText === '{}') {
                return;
            }

            expectation = JSON.parse(responseText);
            console.log(expectation);
            sync(expectation);
        }
    )
}

// 同步
function sync(expectation) {
    switch (expectation.is_playing) {
        case true:
            vid_ele.play();
            break;
        case false:
            vid_ele.pause();
    }

    vid_ele.currentTime = expectation.current_time;

    let expected_speed = expectation.speed;
    vid_ele.playbackRate = expected_speed;
    speed = expected_speed;
    speed_range_ele.value = speed;
    speed_txt_ele.innerHTML = speed;
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
setInterval(sync_request, 400);
setInterval(calcDelay, 5000);
