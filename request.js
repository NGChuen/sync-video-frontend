// HTTP GET 请求
function get(url, func) {
    var xmlhttp = null
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            func(xmlhttp.responseText)
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send()
}

// HTTP POST 请求
function post(url, content, func) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            func(xmlhttp.responseText);
        }
    }
    xmlhttp.open("POST", url, true);
    if(content) {
        // xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Content-type","application/json");
        xmlhttp.send(content);
    } else {
        xmlhttp.send();
    }
}
