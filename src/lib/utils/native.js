export var goTo = function(url){
    // console.log(location.href);
    let oldUrl = location.href
    if(oldUrl && oldUrl.indexOf('/') != -1){
        let newUrl = oldUrl.substring(oldUrl, oldUrl.lastIndexOf('/'))
        newUrl = newUrl+'/'+url
        console.log(newUrl);
        window.location = newUrl
    }
    
}