"use strict"

const comments = [
    '//organize the line codes and include in module.exports'
]

const alreadyExistentRoutesBody = (crudName, includeComment) => {
    const controllerName = crudName.charAt(0).toUpperCase() + crudName.slice(1) + 'Controller'
    return `
    
${includeComment ? comments[0] + '\n' : ''} const ${controllerName} = use('controllers/${crudName}')

const ${crudName} = new Router({ prefix: '/${crudName}' })
    .get("/", Bind(${controllerName}.get))
    .get("/:id", Bind(${controllerName}.getById))
    .put("/:id", Bind(${controllerName}.update))
    .post("/", Bind(${controllerName}.insert))
    .delete("/:id", Bind(${controllerName}.remove))`
}

const controllerBody = (crudName) => {
    const repositoryName = crudName.charAt(0).toUpperCase() + crudName.slice(1) + 'Repository'
    return `"use strict"

const ${repositoryName} = use('models/${crudName}')

const get = async ({ db }) =>
    await ${repositoryName}.get(db)

const getById = async ({ db }, { id }) =>
    id
        ? await ${repositoryName}.getById(db, id)
        : [400, "Id not informed"]

const insert = async ({ db }, { ...object }) =>
    (await ${repositoryName}.insert(db, object)).result.n === 1
        ? true
        : [500, "Something went wrong"]

const update = async ({ db }, { id, _id, ...object }) => {
    if (!id)
        return [400, "Id not informed"]

    return (await ${repositoryName}.update(db, id, object)).result.n === 1
        ? true
        : [500, "Something went wrong"]
}

const remove = async ({ db }, { id }) => {
    if (!id)
        return [400, "Id not informed"]

    return (await ${repositoryName}.remove(db, id)).result.n === 1
        ? true
        : [500, "Something went wrong"]
}


module.exports = {
    get,
    getById,
    insert,
    update,
    remove
}`
}

const modelBody = (crudName) =>
    ` "use strict"

const Mongo = require('mongodb')
const __MODULE__ = '${crudName}'

const get = (db) =>
    db.collection(__MODULE__).find().toArray()

const getById = (db, id) =>
    db.collection(__MODULE__).findOne({ _id: Mongo.ObjectId(id) })

const insert = (db, object) =>
    db.collection(__MODULE__).insertOne(object)

const update = (db, id, object) =>
    db.collection(__MODULE__).updateOne({ _id: Mongo.ObjectId(id) }, { $set: object })

const remove = (db, id) =>
    db.collection(__MODULE__).deleteOne({ _id: Mongo.ObjectId(id) })


module.exports = {
    get,
    getById,
    insert,
    update,
    remove
}`

module.exports = { alreadyExistentRoutesBody, controllerBody, modelBody }