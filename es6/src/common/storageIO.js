
import Utility from './utility';

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
        chrome.storage.local.get(null, data => {
            callback(data);
        });
    }

    static setData(inData, callback = () => { }) {
        try {
            chrome.storage.local.set(inData, callback);
        } catch (err) {
            console.log(err);
            Utility.logPrint('red', '문제가 있어 변경사항을 적용하지 못하였습니다');
        }
    }
}

export default StorageIO
