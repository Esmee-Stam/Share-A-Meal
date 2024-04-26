//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const database = {
    // het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl',
            isActive : true,
            password: '1234',
            phoneNumber: '0687654321',
            roles: ['admin', 'user'],
            street: 'Schoolstraat 62',
            city: 'Eindhoven'
 
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAdress: 'm@server.nl',
            isActive : true,
            password: '4321',
            phoneNumber: '0612345678',
            roles: ['user'],
            street: 'Kerkstraat 61',
            city: 'Breda'
        }
    ],

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Roep de callback aan, en retourneer de data
            callback(null, this._data)
        }, this._delayTime)
    },

    getById(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!` }, null)
            } else {
                callback(null, this._data[id])
            }
        }, this._delayTime)
    },

    add(item, callback) {
        setTimeout(() => {
            const existingUserEmail = this._data.find(existingUserEmail => existingUserEmail.emailAdress === item.emailAdress)
           
            if (existingUserEmail) {
                callback({message: 'Email address already exists!'}, null)
            } else {
                item.id = this._index++
                this._data.push(item)
                callback(null, item)
            }
        }, this._delayTime)
    },

    update(id, newUser, callback) {
        setTimeout(() => {
            const getUserId = this._data.findIndex(item => item.id === parseInt(id))
     
            if (!Number.isInteger(getUserId) || getUserId === -1) {
                callback({status: 404, message: `Invalid id: ${id}` })
                return
            } else {
                const updatedUser = this._data[getUserId]
                
                if (newUser.firstName) updatedUser.firstName = newUser.firstName
                if (newUser.lastName) updatedUser.lastName = newUser.lastName
                if (newUser.emailAdress) updatedUser.emailAdress = newUser.emailAdress
                callback(null, updatedUser)
            }
        }, this._delayTime)
    },
    
    delete(id, callback) {
        const deleteUserId = this._data.findIndex(item => item.id === parseInt(id))
        setTimeout(() => {
            if (!Number.isInteger(deleteUserId || !deleteUserId === -1)) {
                callback({status: 404, message: `Invalid id: ${id}` })
                return
            } else {
                const removedItem = this._data.filter((item, index) => {
                    if (index === deleteUserId) {
                        return true
                    }
                    return false
                })[0]

                callback(null, removedItem)
            }
        }, this._delayTime)
    }
 
}

module.exports = database
// module.exports = database.index;
