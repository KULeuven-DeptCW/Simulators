function primobj (obj,type,degree) {
	obj.type = type;
	obj.degree = degree;
	obj.describe = describePrimobj;
}

function prNul () {
	primobj(this,"nul",1);
	this.tostring = function () {return "nul";};
}

function prSucc () {
	primobj(this,"succ",1);
	this.tostring = function () {return "succ";};
}

function prProjection (n,i) {
    primobj(this,"p",n);
	this.pick = i;
	this.tostring = function () {return "p["+this.degree+","+this.pick+"]";};
}

function prComposite (f,gs) {
    primobj(this,"cn",gs.head.degree);
    this.f = f;
    this.gs = gs;
    this.tostring = function () {var gi = this.gs;var result = "cn["+this.f.tostring()+","+gi.head.tostring(); while(typeof(gi.tail) !== 'undefined') {gi = gi.tail; result += ","+gi.head.tostring();}return result+"]";};
}

function prRecursion (f,g) {
    primobj(this,"pr",f.degree+1);
    this.f = f;
    this.g = g;
    this.tostring = function () {return "pr["+this.f.tostring()+","+this.g.tostring()+"]";};
}

function prParseIdentifier (text,args) {
    switch(text) {
        case "nul" :
            return new prNul();
        case "succ" :
            return new prSucc();
        case "p" :
            return new prProjection(args[0],args[1]);
        case "cn" :
        	return new prComposite(null,null);
        case "pr" :
        	return new prRecursion(null,null);
        default :
            return null;
    }
}

function prParse (text) {
	var parseStack = new Array();
	var current = "";
	for(var i = 0x00; i < text.length; i++) {
		
	}
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
	}
}
