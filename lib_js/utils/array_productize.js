function productizeArray(array1, array2) {
	var result = new Array(array1.length * array2.length);

	for (var i = 0; i < array1.length; i++) {
		for (var j = 0; j < array2.length; j++) {
			result[i * array2.length + j] = [array1[i], array2[j]];
		}
	}

	return result;
}
