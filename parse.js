var fs = require('fs');
var parseit = function(nm,defData) {
    var D2R = 0.01745329251994329577;
    var primeMeridian = {
  "greenwich": 0.0, //"0dE",
  "lisbon": -9.131906111111, //"9d07'54.862\"W",
  "paris": 2.337229166667, //"2d20'14.025\"E",
  "bogota": -74.080916666667, //"74d04'51.3\"W",
  "madrid": -3.687938888889, //"3d41'16.58\"W",
  "rome": 12.452333333333, //"12d27'8.4\"E",
  "bern": 7.439583333333, //"7d26'22.5\"E",
  "jakarta": 106.807719444444, //"106d48'27.79\"E",
  "ferro": -17.666666666667, //"17d40'W",
  "brussels": 4.367975, //"4d22'4.71\"E",
  "stockholm": 18.058277777778, //"18d3'29.8\"E",
  "athens": 23.7163375, //"23d42'58.815\"E",
  "oslo": 10.722916666667 //"10d43'22.5\"E"
};
    var self = {};
    nm = nm.split(":");
    self[nm[0]] = nm[1];
    var paramObj = {};
    defData.split("+").map(function(v){
      return v.trim();
    }).filter(function(a){
      return a;
    }).forEach(function(a){
      var split= a.split("=");
      if(split[1]==="@null"){
        return;
      }
      split.push(true);
      paramObj[split[0].toLowerCase()]=split[1];
    });
    var paramName, paramVal,paramOutname;
    var params = {
      proj:'projName',
      datum:'datumCode',
      rf:function(v){
        self.rf = parseFloat(v,10);
      },
      lat_0:function(v){
        self.lat0 = v * D2R;
      },
      lat_1:function(v){
        self.lat1 = v * D2R;
      },
      lat_2:function(v){
        self.lat2 = v * D2R;
      },
      lat_ts:function(v){
        self.lat_ts = v * D2R;
      },
      lon_0:function(v){
        self.long0 = v * D2R;
      },
      lon_1:function(v){
        self.long1 = v * D2R;
      },
      lon_2:function(v){
        self.long2 = v * D2R;
      },
      alpha:function(v){
        self.alpha = parseFloat(v) * D2R;
      },
      lonc:function(v){
        self.longc = v * D2R;
      },
      x_0:function(v){
        self.x0 =  parseFloat(v,10);
      },
      y_0:function(v){
        self.y0 =  parseFloat(v,10);
      },
      k_0:function(v){
        self.k0 =  parseFloat(v,10);
      },
      k:function(v){
        self.k0 =  parseFloat(v,10);
      },
      r_a:function(){
        self.R_A = true;
      },
      zone:function(v){
        self.zone =  parseInt(v,10);
      },
      south:function(){
        self.utmSouth = true;
      },
      towgs84:function(v){
        self.datum_params = v.split(",").map(function(a){return parseFloat(a,10);});
      },
      to_meter:function(v){
        self.to_meter = parseFloat(v,10);
      },
      from_greenwich:function(v){
        self.from_greenwich = v * D2R;
      },
      pm:function(v){
        self.from_greenwich = (primeMeridian[v] ? primeMeridian[v] : parseFloat(v,10))*D2R;
      },
      axis:function(v){
        var legalAxis = "ewnsud";
        if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
          self.axis = v;
        }
      }
    };
    for(paramName in paramObj){
      paramVal = paramObj[paramName];
      if(paramName in params){
        paramOutname = params[paramName];
        if(typeof paramOutname === 'function'){
          paramOutname(paramVal);
        }else{
          self[paramOutname]=paramVal;
        }
      }else{
        self[paramName]=paramVal;
      }
    }

    return self;
  }
module.exports = function(){
    var p = {defs:{}};
    require('./epsg')(p);
    var outArray = [];
    var outObj = {};
    var parsed;
    for(var name in p.defs){
        parsed = parseit(name,p.defs[name]);
        outObj[name]=parsed;
        outArray.push(parsed);
    }
    fs.writeFile('./epsgAsObj.json',JSON.stringify(outObj),'utf8',function(){console.log('done with obj')});
    fs.writeFile('./epsgAsArray.json',JSON.stringify(outArray),'utf8',function(){console.log('done wiht array')}) 
}