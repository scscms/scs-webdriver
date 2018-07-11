const webDriver = require('selenium-webdriver')
const fs = require('fs')
let word = 'alog'
!async function() {
    let driver = await new webDriver.Builder().forBrowser('firefox').build()
    await driver.get('http://www.baidu.com/').then(async ()=>{
        await driver.findElement(webDriver.By.css('#kw')).sendKeys(word)
        await driver.findElement(webDriver.By.css('#su')).click()
        await driver.wait(webDriver.until.titleIs(word+'_百度搜索'), 2000)
        let img = await driver.takeScreenshot()
        fs.writeFileSync('img.png', img,'base64');
        console.log('ok')
    }).catch(err=>{
        console.log(err);
    })
    await driver.quit();
}()
