function primobj (obj,type,degree) {
	obj.type = type;
	obj.degree = degree;
	obj.describe = describePrimobj;
}

function prNul () {
	primobj(this,"nul",1);
	this.tostring = function () {return "nul";};
	this.calc = function (x) {return [0];};
}

function prSucc () {
	primobj(this,"succ",1);
	this.tostring = function () {return "succ";};
	this.calc = function (x) {return [x[0]+0x01];};
}

function prProjection (n,i) {
    primobj(this,"p",n);
	this.pick = i;
	this.tostring = function () {return "p["+this.degree+","+this.pick+"]";};
	this.calc = function (x) {return x[this.pick];};
}

function prComposite (f,gs) {
    primobj(this,"cn",gs.head.degree);
    this.f = f;
    this.gs = gs;
    this.tostring = function () {var gi = this.gs;var result = "cn["+this.f.tostring()+","+gi.head.tostring(); while(typeof(gi.tail) !== 'undefined') {gi = gi.tail; result += ","+gi.head.tostring();}return result+"]";};
    this.calc = function (x) {var gi = this.gs; var rs = new Array();rs.push(gi.head.calc(x)); while(typeof(gi.tail) !== 'undefined') {gi = gi.tail; rs.push(gi.head.calc(x));}return f.calc(rs);};
}

function prRecursion (f,g) {
    primobj(this,"pr",f.degree+1);
    this.f = f;
    this.g = g;
    this.tostring = function () {return "pr["+this.f.tostring()+","+this.g.tostring()+"]";};
}

function describePrimobj () {
	var res = "";
	if(this.degree > 1) {
		res = "<sup>"+this.degree+"</sup>";
	}
	return "&#x2115;"+res+"&#8594;&#x2115;";
}

function prFeedback (iid,fid,tid) {
	prparse(iid);
	if(prResult === null) {
		$("#"+fid).attr('class','has-error');
		$("#"+tid).html('Invalid expression');
	} else {
		$("#"+fid).attr('class','');
		$("#"+tid).html(":t ("+prResult.tostring()+") = "+prResult.describe());
		document.writeln(prResult.calc([0]));
	}
}
