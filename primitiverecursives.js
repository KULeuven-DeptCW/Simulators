function primobj (obj,degree) {
	obj.degree = degree;
	obj.describe = describePrimobj;
}

function prNul () {
	primobj(this,1);
	this.tostring = function () {return "nul";};
}

function prSucc () {
	primobj(this,1);
	this.tostring = function () {return "succ";};
}

function prProjection (n,i) {
    primobj(this,n);
	this.pick = i;
	this.tostring = function () {return "p["+this.degree+","+this.pick+"]";};
}

function prComposite (f,gs) {
    primobj(this,gs[0].degree);
}

function prRecursion (f,g) {
    primobj(this,f.degree+1);
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
	//var parseStack
}

function describePrimobj () {
	var res = "";
	if(this.degree > 1) {
		res = "<sup>"+this.degree+"</sup>";
	}
	return "&#x2115;"+res+"&#8594;&#x2115;";
}

document.writeln(new prProjection(5,2).describe());
