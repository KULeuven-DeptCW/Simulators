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
	this.calc = function (x) {return [parseInt(x[0])+0x01];};
}

function prProjection (n,i) {
    primobj(this,"p",n);
	this.pick = i;
	this.tostring = function () {return "p["+this.degree+","+this.pick+"]";};
	this.calc = function (x) {return x[this.pick-1];};
}

function prComposite (f,gs) {
    primobj(this,"cn",gs.head.degree);
    var deg = this.degree;
    var gi = gs;
    var od = 1;
    while(typeof(gi.tail) !== 'undefined') {
    	gi = gi.tail;
    	if(gi.degree != deg) {
    		throw "The degrees of all functions of the composite function must have the same degree.";
    	}
    	od++;
    }
    if(f.degree != od) {
    	throw "The degree of the first function of the composite must be equal to the number of functions of the composition minus one.";
    }
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

function prFeedback (eid,fid,tid,iid,oid,outid,errid) {
	var str = document.getElementById(eid).value;
	prparse(str);
	if(prResult === null) {
		$("#"+fid).attr('class','has-error');
		$("#"+tid).html('Invalid expression');
		$("#"+oid).html('Invalid expression');
		var errors = "";
		for(var i = 0; i < prError_cnt; i++ ) {
			errors += "Parse error near <code>" + str.substr( prError_off[i], 30 ) + "</code>, expecting " + prError_la[i].map(function (x) {return "<code>"+x+"</code>";}).join(", ");
		}
		$("#"+errid).show();
		$("#"+errid).html(errors);
		$("#"+outid).hide();
	} else {
		$("#"+fid).attr('class','');
		$("#"+tid).html(":t ("+prResult.tostring()+") = "+prResult.describe());
		$("#"+oid).html(prResult.calc(document.getElementById(iid).value.split(" ")).join(" "));
		$("#"+errid).hide();
		$("#"+outid).show();
		$("#"+outid).html("<strong>output:</strong> ");
	}
}
