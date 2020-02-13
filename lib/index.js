const fs = require("fs")
const { execSync: executeCommand } = require("child_process")

const helper = require("./helper")

const crudGenerator = require("./crud")
const baseGenerator = require("./base")

const project = async () => {
    const args = process.argv.slice(2)
    if (args.length < 1) {
        console.log("error: invalid args")
        process.exit()
    }

    const option = args[0].toLocaleLowerCase()

    if (option === "crud" && args.length < 2) {
        console.log("error: specify the crud name")
        process.exit()
    }
    await runOption(option)
}

const runOption = async option => {
    try {
        const folderPath = process.cwd() + "/"
        switch (option) {
            case "crud":
                crudGeneration(folderPath)
                break
            case "base":
                await baseGeneration(folderPath)
                break
            default:
                console.log("error: invalid option")
                break
        }
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

const crudGeneration = folderPath => {
    name = process.argv.slice(2)[1].toLocaleLowerCase()
    const filesInFolder = fs.readdirSync(folderPath)
    if (!isAValidFolderToGenerateCrud(filesInFolder)) {
        console.log("error: invalid folder, maybe you need to project the base of your api before create your cruds")
        process.exit()
    }

    fs.appendFile(`${folderPath}/routes.js`, crudGenerator.alreadyExistentRoutesBody(name, true), error => {
        if (error) console.log(error)
    })
    fs.writeFile(`${folderPath}/controllers/${name}.js`, crudGenerator.controllerBody(name), error => {
        if (error) console.log(error)
    })
    fs.writeFile(`${folderPath}/models/${name}.js`, crudGenerator.modelBody(name), error => {
        if (error) console.log(error)
    })
}

const isAValidFolderToGenerateCrud = filesInFolder =>
    filesInFolder.length > 0 &&
    (filesInFolder.indexOf("routes.js") > -1 ||
        filesInFolder.indexOf("package.json") > -1 ||
        filesInFolder.indexOf("index.js") > -1 ||
        filesInFolder.indexOf("controllers") > -1 ||
        filesInFolder.indexOf("models") > -1)

const baseGeneration = async folderPath => {
    const filesInFolder = fs.readdirSync(folderPath)

    if (filesInFolder.length > 1 || filesInFolder.length < 1 || filesInFolder[0] != "package.json") {
        console.log("error: the folder should contain only a package.json file with a base settings of your api")
        process.exit()
    }

    const yarn = (await helper.askQuestion(`you use yarn [y/n]?: `)).toLocaleLowerCase() === "y"
    const jwt = (await helper.askQuestion(`your application will use jwt [y/n]?: `)).toLocaleLowerCase() === "y"
    const files = (await helper.askQuestion(`your application will work with files [y/n]?: `)).toLocaleLowerCase() == "y"

    fs.writeFileSync(`${folderPath}/index.js`, baseGenerator.indexBody(), error => {
        if (error) {
            console.log(error)
            process.exit()
        }
    })
    fs.writeFileSync(`${folderPath}/config.js`, baseGenerator.configBody(), error => {
        if (error) {
            console.log(error)
            process.exit()
        }
    })
    fs.writeFileSync(`${folderPath}/routes.js`, baseGenerator.routesBody(jwt, files), error => {
        if (error) {
            console.log(error)
            process.exit()
        }
    })
    fs.mkdirSync(`${folderPath}/controllers`, error => {
        if (error) {
            console.log(error)
            process.exit()
        }
    })
    fs.mkdirSync(`${folderPath}/models`, error => {
        if (error) {
            console.log(error)
            process.exit()
        }
    })
    fs.mkdirSync(`${folderPath}/services`, error => {
        if (error) {
            console.log(error)
            process.exit()
        }
    })

    const yarnCommand = `${yarn ? "yarn add" : "npm install --save"} koa koa-logger koa-clean koa-mongo koa-router @koa/cors koa-bodyparser mongodb${
        jwt ? " koa-jwt jsonwebtoken" : ""
    }${files ? " koa-body" : ""}`

    console.log("\x1b[32m%s\x1b[0m", "\ninstalling dependencies...")
    try {
        executeCommand(yarnCommand, { cwd: folderPath })
    } catch (error) {
        console.log(`error: failed to install dependencies${yarn ? " make sure you have yarn installed or try with npm" : ""}`)
        process.exit()
    }
    console.log("\x1b[32m%s\x1b[0m", "\nsuccessful projection")
    process.exit()
}

module.exports = { project }
