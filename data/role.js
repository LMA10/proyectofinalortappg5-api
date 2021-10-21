const connection = require('./connection')
const roleModel = require('./schemas/role')

async function getAllRoles(){
    await connection.getConnection()
    const roles =  await roleModel.RoleModel.find({})
    return roles
}

async function addRole(role){
    await connection.getConnection()
    const newRole = await new roleModel.RoleModel(role)
    await newRole.save()
    return newRole
}

async function getRole(roleId){
    await connection.getConnection()
    const roleById = await roleModel.RoleModel.findById(roleId)
    return roleById
}

async function updateRole(){
    await connection.getConnection()
}

async function deleteRole(roleId){
    await connection.getConnection()
    await roleModel.RoleModel.findByIdAndDelete(roleId)
}

module.exports = {getAllRoles, addRole, getRole, updateRole, deleteRole}