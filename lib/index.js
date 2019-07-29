const fs = require('fs')

const helper = require('./helper')

const crudGenerator = require('./crud')
const baseGenerator = require('./base')

const project = async () => {
    const args = process.argv.slice(2)

    if (args.length < 1) {
        console.log('error: inválid args')
        return
    }

    const path = await process.cwd() + "\\"
    const option = args[0].toLocaleLowerCase()
    let name

    if (option == 'crud') {
        if (args.length < 2) {
            console.log('specify the crud name')
            return
        }
        name = args[1]
    }
    let jwt = false
    let files = false
    try {
        switch (option) {
            case "crud":
                {
                    const filesInFolder = fs.readdirSync(path)
                    if (!filesInFolder.length || filesInFolder.indexOf('routes.js') == -1 || filesInFolder.indexOf('package.json') == -1 || filesInFolder.indexOf('index.js') == -1 || filesInFolder.indexOf('controllers') == -1 || filesInFolder.indexOf('models') == -1) {
                        console.log("error: inválid folder, maybe you need to project the base of your api before create your cruds")
                        return
                    }
                }
                fs.appendFile(`${path}\\routes.js`, crudGenerator.alreadyExistentRoutesBody(name, true), error => { if (error) console.log(error) })
                fs.writeFile(`${path}\controllers\\${name}.js`, crudGenerator.controllerBody(name), error => { if (error) console.log(error) })
                fs.writeFile(`${path}\models\\${name}.js`, crudGenerator.modelBody(name), error => { if (error) console.log(error) })
                break
            case "base":
                {
                    const filesInFolder = fs.readdirSync(path)
                    if (filesInFolder.length > 1 || filesInFolder.length < 1 || filesInFolder[0] != 'package.json') {
                        console.log("error: the folder should contain only a package.json file with a base settings of your api")
                        return
                    }
                }

                {
                    const response = await helper.askQuestion(`your application will use jwt [y/n]?`)
                    if (response == 'y')
                        jwt = true
                    else
                        jwt = false
                }
                {
                    const response = await helper.askQuestion(`your application will work with files [y/n]?`)
                    if (response == 'y')
                        files = true
                    else
                        files = false
                }


                fs.writeFile(`${path}\\index.js`, baseGenerator.indexBody(), error => { if (error) console.log(error) })
                fs.writeFile(`${path}\\config.js`, baseGenerator.configBody(), error => { if (error) console.log(error) })
                fs.writeFile(`${path}\\routes.js`, baseGenerator.routesBody(jwt, files), error => { if (error) console.log(error) })
                fs.mkdir(`${path}\controllers`, error => { if (error) console.log(error) })
                fs.mkdir(`${path}\models`, error => { if (error) console.log(error) })
                fs.mkdir(`${path}\services`, error => { if (error) console.log(error) })

                let yarnCommand = `yarn add koa koa-logger koa-clean koa-mongo koa-router @koa/cors koa-bodyparser mongodb${jwt ? " koa-jwt jsonwebtoken" : ""}${files ? " koa-body" : ""}`
                console.log("\x1b[32m%s\x1b[0m", "\nsuccessful projection, use this command to include the required dependencies:")
                console.log("\x1b[33m%s\x1b[0m", yarnCommand)

                break;
        }
    }
    catch (error) {
        console.log(error)
        return
    }
}

module.exports = { project }
