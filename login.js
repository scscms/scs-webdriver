//http://www.geetest.com/type/
const webDriver = require('selenium-webdriver')
const fs = require('fs')
const utils = require('./utils')
const imgFile = 'img.png'
let driver

async function autoVerify(){
    let re = true;
    await utils.sleep(4000)
    await driver.executeScript(`document.querySelector('.geetest_canvas_fullbg').style.display = 'none'`)
    await driver.executeScript(`document.querySelector('.geetest_canvas_slice').style.display = 'none'`)
    await utils.sleep(2000)
    const bgCanvas = await driver.findElement(webDriver.By.css('.geetest_slicebg'))
    const bgPng = await bgCanvas.takeScreenshot()
    fs.writeFileSync(imgFile, bgPng,'base64');
    await driver.executeScript(`document.querySelector('.geetest_canvas_slice').style.display = 'block'`)
    const button = await driver.findElement(webDriver.By.css('.geetest_slider_button'))
    const buttonRect = await button.getRect()
    let x = ~~buttonRect.x + 5;
    let y = ~~buttonRect.y + 5;
    await utils.sleep(1000)
    let len = await utils.getLen(imgFile)
    if(!Number.isInteger(len)){
        return re;//取不到值
    }
    let actions = driver.actions({async: true})
    actions = await actions.move({
        x: x,
        y: y,
        duration: 1000
    }).press()
    let _x = x + len - 5//备份
    const arr = [];
    do{
        let t = ~~(Math.random()*20)+1
        if (t > 0) {
            len -= t
            arr.push(t)
            if(len<15){
                len = 0
            }
        }
    }while (len>0)
    for(let i = arr.length;i--;){
        x += arr[i];
        await actions.move({
            x,
            y: y + Math.ceil(Math.random()*20+1)*(Math.random()>0.5?-1:1),
            duration: ~~(Math.random()*500+100)
        })
    }
    await actions.move({
        x:_x,
        y :y + Math.ceil(Math.random()*20+1)*(Math.random()>0.5?-1:1),
        duration: ~~(Math.random()*1000)
    }).release().perform()
    await utils.sleep(3000)
    let but = await driver.findElement(webDriver.By.css('.login-btn'))
    re = await but.getAttribute("disabled")
    !re && await but.click()
    return re;
}

!async function() {
    driver = await new webDriver.Builder().forBrowser('firefox').build()
    await driver.get('https://account.geetest.com/login')
    await utils.sleep(3000)
    await driver.findElement(webDriver.By.id('email')).sendKeys("10000@qq.com");
    await driver.findElement(webDriver.By.id('password')).sendKeys("123456abc");
    await driver.findElement(webDriver.By.css('.geetest_radar_tip')).click()
    let b
    do{
        b = await autoVerify()
    }while(b)
}()
