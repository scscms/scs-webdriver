const webDriver = require('selenium-webdriver')
const fs = require('fs')
const utils = require('./utils')
const imgFile = 'img.png'

!async function() {
    let driver = await new webDriver.Builder().forBrowser('firefox').build()
    await driver.get('https://account.geetest.com/login')
    await utils.sleep(3000)
    await driver.findElement(webDriver.By.id('email')).sendKeys("10000@qq.com");
    await driver.findElement(webDriver.By.id('password')).sendKeys("123456abc");
    await driver.findElement(webDriver.By.css('.geetest_radar_tip')).click()
    await utils.sleep(3000)
    await driver.executeScript(`document.querySelector('.geetest_canvas_fullbg').style.display = 'none'`)
    await driver.executeScript(`document.querySelector('.geetest_canvas_slice').style.display = 'none'`)
    await utils.sleep(2000)
    const bgCanvas = await driver.findElement(webDriver.By.css('.geetest_slicebg'))
    const bgPng = await bgCanvas.takeScreenshot()
    fs.writeFileSync(imgFile, bgPng,'base64');
    await driver.executeScript(`document.querySelector('.geetest_canvas_slice').style.display = 'block'`)
    const button = await driver.findElement(webDriver.By.css('.geetest_slider_button'))
    const buttonRect = await button.getRect()
    let x = ~~buttonRect.x;
    let y = ~~buttonRect.y;
    await utils.sleep(1000)
    let len = await utils.getLen(imgFile)
    let actions = driver.actions({async: true})

    actions = await actions.move({
        x: x + 5,
        y: y + 5,
        duration: 1000
    }).press()

    await actions.move({
        x: x + len,
        y: y,
        duration: 3000
    }).release().perform()
}()
