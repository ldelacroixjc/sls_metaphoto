const convertToMap = (objectArray) => 
        objectArray.reduce( (elementMap, element) => {
            elementMap[element.id] = { ...element };
            return elementMap;
        }, {});

module.exports = {
    convertToMap
}