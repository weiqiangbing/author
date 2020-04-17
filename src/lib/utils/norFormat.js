import normalData from '../../assets/json/normal.json'

// 返回作品状态，返回对象
export var bookStatus = function(key, val){
    let bookCheck = normalData.book_checked
    for (let i = 0; i < bookCheck.length; i++) {
        if(bookCheck[i][key] == val){
            return bookCheck[i]
        }
    }
    return ''
}