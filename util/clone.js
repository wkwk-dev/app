function clone(obj) {
	const cloned = Array.isArray(obj) ? [] : {};
	if (Array.isArray(obj)) {
		for (const prop of obj) {
			if (typeof prop !== 'object' || !prop) {
				cloned.push(prop)
			} else {
				cloned.push(clone(prop))
			}
		}
	} else {
		for (const prop in obj) {
			if (typeof obj[prop] !== 'object' || !obj[prop]) {
				cloned[prop] = obj[prop]
			} else {
				cloned[prop] = clone(obj[prop])
			}
		}
	}
	return cloned;
}

module.exports = clone