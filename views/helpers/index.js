module.exports = {
    /**
	* Usage:
	* {{ toJSON ['name1', 'name2', 'name3'] }}
	* {{ toJSON {a: 56, b: 45: c:true} }}
	*/
    toJSON: function (obj) {
        return JSON.stringify(obj);
    },
};