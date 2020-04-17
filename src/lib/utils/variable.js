import comm from './comm'

// url中的参数,返回对象
export var params = (()=> {
    var url = window.location.href
    // let url = 'https://hw-novelcath5.damowang.com/v1//h5/activity/?user_id=41&lang=en-us#/rechargeActivities?event_id=32&aa=7'
    var hash;
    var newUrl = url.slice(url.indexOf('?') + 1)
    // console.log('1',newUrl);
    var myJson = {};
    if(newUrl.indexOf(window.location.hash) != -1){
        if(window.location.hash.indexOf('?') != -1 || window.location.hash.indexOf('&') != -1){
            if(window.location.hash.indexOf('?') != -1){
                newUrl = newUrl.replace(window.location.hash.split('?')[0], '')
            }
            if(window.location.hash.indexOf('&') != -1){
                newUrl = newUrl.replace(window.location.hash.split('&')[0], '')
            }
        }else{
            newUrl = newUrl.replace(window.location.hash, '')
        }
    }
    newUrl = comm.mapReplace(newUrl,'?','&')
    var hashes = newUrl.split('&')
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
})()
