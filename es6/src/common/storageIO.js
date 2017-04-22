
import Utility from './utility';

class StorageIO 
{
    static get storageName () {
        return storageName;
    }

    static saveUser (userList) {
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

        return StorageIO.setData(inData);
    }

    static getData(callback = () => { }) {
        return new Promise( (resolve, rejected) => {
            chrome.storage.local.get(null, data => {
                resolve(data);
            });
        });
    }

    static setData(inData) {
        try {
            return new Promise( (resolve, rejected) => {
                chrome.storage.local.set(inData, resolve);
            });
        } catch (err) {
            console.error(err);
            Utility.logPrint('red', '문제가 있어 변경사항을 적용하지 못하였습니다');
            
            return new Promise( (resolve, rejected) => {
                chrome.storage.local.set(inData, rejected);
            });
        }
    }
}

export default StorageIO
