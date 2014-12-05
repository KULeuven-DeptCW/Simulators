function unroll (ht) {
	var result = new Array();
	while(typeof(ht) !== 'undefined') {
		if(typeof(ht.head) !== 'undefined') {
			result.push(ht.head);
		}
		ht = ht.tail;
	}
	return result;
}
