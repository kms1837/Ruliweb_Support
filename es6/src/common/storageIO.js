class StorageIO 
{
    static get storageName () {
        return storageName;
    }

    static saveUser (userList, callback = () => {}) {
        let userNameKeys = {};
        let userIDKeys = {};
        
        $(userList).each( (index, data) => {
            if (data.name)
                userNameKeys[data.name] = index;
                
            if (data.ruliwebID)
                userIDKeys[data.ruliwebID] = index;
        });

        let inData = {
            'userList': userList,
            'userNameKeys': userNameKeys,
            'userIDKeys': userIDKeys
        }

        StorageIO.setData(inData, callback);
    }

    static getData(callback = () => { }) {
        chrome.storage.sync.get(null, data => {
            callback(data);
        });
    }

    static setData(inData, callback = () => { }) {
        chrome.storage.sync.set(inData, callback);
    }
}

export default StorageIO
