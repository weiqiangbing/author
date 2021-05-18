/**	
 * 通道,用来与html进行可靠的通信	
 *	
 * 1. 有序	
 * 2. 回传与ack机制,保证到达	
 * 3. id验证机制,去重	
 *	
 * @param thisObj {Object} this对象	
 * @param webId {String} web的id	
 * @param timeout {Number} 超时时间,超时后会重试,单位ms,默认1000	
 */	
var Channel = function (thisObj, webId, timeout) {	
    timeout = timeout || 1000	
	
    var that = this	
	
    var debug = (...msgs) => console.debug.apply(null, ['[通道]', ...msgs])	
    var log = (...msgs) => console.log.apply(null, ['[通道]', ...msgs])	
    var error = (...msgs) => console.error.apply(null, ['[通道]', ...msgs])	
	
    //消息id生成器	
    that.idGenerator = 0	
    //消息发送队列	
    that.sendQueue = [	
        // {	
        //     data: {},	
        //     resolve: Object,	
        // },	
    ]	
    //***列表	
    that.listeners = {	
        // type: [listener1, listener2],	
    }	
    //当前接收的消息id	
    that.receivedId = 0	
    /**	
     * @param type {String} 消息类型	
     * @param data {Object} 消息内容	
     * @return {Promise}	
     */	
    that.sendMsg = function (type, data) {	
        var resolve;	
        var promise = new Promise(resolve_ => resolve = resolve_)	
        that.sendQueue.push({	
            data: {	
                pType: 'msg',	
                id: ++that.idGenerator,	
                type: type,	
                data: data,	
            },	
            resolve	
        })	
        return promise	
    }	
    /**	
     * 监听	
     * @param type 消息类型	
     * @param callback 回调	
     */	
    that.on = function (type, callback) {	
        var typeListeners = that.listeners[type] || []	
        that.listeners[type] = typeListeners	
        typeListeners.push(callback)	
    }	
    /**	
     * 收到消息时调用(设置web组件的message事件的处理函数)	
     */	
    that.onMsg = function ({message, url}) {	
        debug('[收到消息]', message, '('+url+')')	
        var {pType, id, type, data} = JSON.parse(message)	
	
        if (pType === 'ack') {//ack包	
            if (id === that.idGenerator) {//是当前的ack,有效,删除元素	
                var nowPackets = that.sendQueue.splice(0, 1);	
                that.valid_(nowPackets.length === 1)	
                nowPackets[0].resolve()	
            }	
        }else if (pType === 'msg') {//正常消息	
            if (id === that.receivedId+1) {//是下个准备接收的包,有效	
                //更新缓存值	
                that.receivedId++	
                //处理	
                var typeListeners = that.listeners[type] || []	
                log('[处理消息]', '类型: '+type, '处理器数量: '+typeListeners.length)	
                for (var i=0;i<typeListeners.length;i++) {	
                    try {	
                        typeListeners[i](data)	
                    } catch (e) {	
                        error('[处理器错误]', e)	
                    }	
                }	
                //响应ack	
                that.send_({	
                    pType: 'ack',	
                    id,	
                })	
            }	
        }else {//没有pType,当作ping包处理,忽略	
            return	
        }	
    }	
    /**	
     * 发包	
     */	
    that.send_ = function (packet) {	
        var str = JSON.stringify(packet)	
        thisObj.$element(webId).postMessage({	
            message: str	
        })	
        debug('[发送消息]', str)	
    }	
    /**	
     * 下个包	
     */	
    that.next_ = function() {	
        if (that.sendQueue.length > 0) {	
            that.send_(that.sendQueue[0].data)	
        }	
    }	
    /**	
     * 验证	
     */	
    that.valid_ = function(bool, errMsg) {	
        if (!bool) {	
            throw new Error(errMsg || 'Valid Fail!')	
        }	
    }	
    //计时器: 不断重试发送包	
    var timerId = setInterval(function () {	
        if (thisObj.$valid) {//仍然有效	
            that.next_()	
        }else {//取消计时器	
            log('已经失效,取消计时器')	
            clearInterval(timerId)
        }	
    }, timeout)
}
	
module.exports = Channel