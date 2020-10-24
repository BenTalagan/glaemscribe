function arrayEquals(array1, array2) {
	if (!array2) {
		return false;
	}

	if (array1.length != array2.length) {
		return false;
	}

	for (var i = 0, l=array1.length; i < l; i++) {
		if (Array.isArray(array1[i]) && Array.isArray(array2[i])) {
			if (!arrayEquals(array1[i], array2[i])) {
				return false;
			}
		} else if (array1[i] != array2[i]) {
			return false;
		}
	}

	return true;
}
