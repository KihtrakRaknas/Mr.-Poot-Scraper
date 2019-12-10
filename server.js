const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://sites.google.com/view/misterpoot/ap-chemistry?authuser=0');

    var units = await page.evaluate(()=>{
        var units = []
        for(el of document.getElementsByTagName("section")[1].getElementsByTagName("a")){
            if(!el.href.includes("#")&&el.href.includes("misterpoot")){
                units.push(el.href)
            }
        }
        return units;
    })
    var unitNames = await page.evaluate(()=>{
        var units = []
        for(el of document.getElementsByTagName("section")[1].getElementsByTagName("a")){
            if(!el.href.includes("#")&&el.href.includes("misterpoot")){
                units.push(el.innerText)
            }
        }
        return units;
    })

    var information = {};
    for(unitURLindex in units){
        unitURL = units[unitURLindex]
        information[unitNames[unitURLindex]] = {}
        await page.goto(unitURL)


        await page.waitForNavigation()

        var unitSubsections = await page.evaluate(()=>{
            function getUnits (sec){
                console.log(sec)
                for(el of sec.getElementsByTagName("a")){
                    if(!el.href.includes("#")&&el.href.includes("misterpoot")){
                        units.push(el.href)
                    }
                }
            }
            var units = []
    
            for(var i = 1; i!=document.getElementsByTagName("section").length; i++){
                if(i+1<document.getElementsByTagName("section").length){
                    if(document.getElementsByTagName("section")[i+1].innerText.trim() == ""&&document.getElementsByTagName("section")[i+1].getElementsByTagName("iframe").length==0){
                        getUnits(document.getElementsByTagName("section")[i])
                        break;
                    }
                }else{
                    getUnits(document.getElementsByTagName("section")[i])
                    break;
                }
            }        
            return units;
        })

        var unitSubsectionNames = await page.evaluate(()=>{
            function getUnits (sec){
                console.log(sec)
                for(el of sec.getElementsByTagName("a")){
                    if(!el.href.includes("#")&&el.href.includes("misterpoot")){
                        units.push(el.innerText)
                    }
                }
            }
            var units = []
    
            for(var i = 1; i!=document.getElementsByTagName("section").length; i++){
                if(i+1<document.getElementsByTagName("section").length){
                    if(document.getElementsByTagName("section")[i+1].innerText.trim() == ""&&document.getElementsByTagName("section")[i+1].getElementsByTagName("iframe").length==0){
                        getUnits(document.getElementsByTagName("section")[i])
                        break;
                    }
                }else{
                    getUnits(document.getElementsByTagName("section")[i])
                    break;
                }
            }        
            return units;
        })

        for(subURLindex in unitSubsections){
            subURL = unitSubsections[subURLindex]
            information[unitNames[unitURLindex]][unitSubsectionNames[subURLindex]] = [];
            //console.log(subURL)
            await page.goto(subURL)


            //await page.waitForNavigation()

            information[unitNames[unitURLindex]][unitSubsectionNames[subURLindex]] = await page.evaluate(()=>{
                var obj = [];
                for(var i = 1; i!=document.getElementsByTagName("section").length; i++){
                    if(document.getElementsByTagName("section")[i].innerText.trim()!="")
                        obj.push(document.getElementsByTagName("section")[i].innerHTML)
                    console.log(document.getElementsByTagName("section")[i])
					if(i+2<document.getElementsByTagName("section").length){
                        console.log(document.getElementsByTagName("section")[i+2].innerText.trim() == "")
                        console.log(document.getElementsByTagName("section")[i+2].getElementsByTagName("iframe").length==0)
                        if(document.getElementsByTagName("section")[i+2].innerText.trim() == ""&&document.getElementsByTagName("section")[i+2].getElementsByTagName("iframe").length==0){
                            break;
                        }
                    }else{
                            break;
                    }
                }
                return obj;
            })

            await page.waitFor(500)

        }
    }
    
        console.log(information)
        try {
        fs.writeFileSync('pootData.json', JSON.stringify(information))
      } catch (err) {
        console.error(err)
      }
    
    await browser.close();
})();
