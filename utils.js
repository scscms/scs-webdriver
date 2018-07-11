class utils {
    /**
     * 延时执行
     * @param {Number} time 延时的毫秒数
     */
    static sleep(time = 0) {
        return new Promise(resolve => {
            setTimeout(async() => {
                resolve()
            }, time)
        })
    }
    /**
     * 获取移动长度
     * @param {String} img 图片地址
     */
    static getLen(img) {
        return new Promise((resolve, reject) => {
            require("get-pixels")(img, function(err, pixels) {
                if(err) {
                    resolve("Bad image path")
                }
                for (let x = 10; x < 210; x++) {
                    for (let y = 10; y < 120; y++) {
                        let c = pixels.get(x, y,0)+pixels.get(x, y,1)+pixels.get(x, y,2)
                        if (c < 110) {
                            resolve(x)
                            return;
                        }
                    }
                }
                resolve()
            })
        })
    }
}
module.exports = utils;
