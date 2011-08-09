/**
 * csvjson.js - A script to convert between CSV and JSON formats
 * Author: aaronsnoswell (@aaronsnoswell)
 * www.elucidatedbianry.com
 * MIT Licensed
 */

// Namespace
var csvjson = {};

// Hide from global scope
(function(){
	function isdef(ob) {
		if(typeof(ob) == "undefined") return false;
		return true;
	}
	
	/**
	 * Converts from CSV formatted data (as a string) to JSON returning
	 * 	an object.
	 * @required csvdata {string} The CSV data, formatted as a string.
	 * @param args.delim {string} The delimiter used to seperate CSV
	 * 	items. Defauts to ','.
	 * @param args.textdelim {string} The delimiter used to wrap text in
	 * 	the CSV data. Defaults to nothing (an empty string).
	 */
	csvjson.csv2json = function(csvdata, args) {
		args = args || {};
		var delim = isdef(args.delim) ? args.delim : ",";
		var textdelim = isdef(args.textdelim) ? args.textdelim : "";
		
		var csvlines = csvdata.split("\n");
		var csvheaders = csvlines[0].split(delim);
		var csvrows = csvlines.slice(1, csvlines.length);
		
		var ret = {};
		ret.headers = csvheaders;
		ret.rows = [];
		
		for(var r in csvrows) {
			var row = csvrows[r];
			var rowitems = row.split(delim);
			
			var rowob = {};
			for(var i in rowitems) {
				var item = rowitems[i];
				
				// Remove any text delimiters present in the items
				if(textdelim.length !== 0) item.replace(textdelim, "");
				
				// ...and try to (intelligently) cast the item to a number
				if((item.indexOf(" ") == -1) && !isNaN(parseFloat(item))) {
					item = parseFloat(item);
				}
				
				rowob[csvheaders[i]] = item;
			}
			
			ret.rows.push(rowob);
		}
		
		return ret;
	}	// end csv2json
	
	/**
	 * Taken an object of the form
	 * {
	 *     headers: ["Heading 1", "Header 2", ...]
	 *     rows: [
	 *	       {"Heading 1": SomeValue, "Heading 2": SomeOtherValue},
	 *	       {"Heading 1": SomeValue, "Heading 2": SomeOtherValue},
	 *         ...
	 *     ]
	 * }
	 * and returns a CSV representation as a string.
	 * @requires jsondata {object} The JSON object to parse.
	 * @param args.delim {string} The delimiter used to seperate CSV
	 * 	items. Defauts to ','.
	 * @param args.textdelim {string} The delimiter used to wrap text in
	 * 	the CSV data. Defaults to nothing (an empty string).
	 */
	csvjson.json2csv = function(jsondata, args) {
		args = args || {};
		var delim = isdef(args.delim) ? args.delim : ",";
		var textdelim = isdef(args.textdelim) ? args.textdelim : "";
		
		if(typeof(jsondata) == "string") {
			// JSON text parsing is not implemented (yet)
			return null;
		}
		
		var ret = "";
		
		// Add the headers
		for(var h in jsondata.headers) {
			var heading = jsondata.headers[h];
			ret += textdelim + heading + textdelim +  delim;
		}
		
		// Remove trailing delimiter
		ret = ret.slice(0, ret.length-1);
		ret += "\n";
		
		// Add the items
		for(var r in jsondata.rows) {
			var row = jsondata.rows[r];
			
			// Only add elements that are mentioned in the headers (in order, obviously)
			for(var h in jsondata.headers) {
				var heading = jsondata.headers[h];
				var data = row[heading];
				
				if(typeof(data) == "string") {
					ret += textdelim + row[heading] + textdelim +  delim;
				} else {
					ret += row[heading] + delim;
				}
			}
		
			// Remove trailing delimiter
			ret = ret.slice(0, ret.length-1);
			ret += "\n";
		}
		
		// Remove trailing newling
		ret = ret.slice(0, ret.length-1);
		
		return ret;
	}
	
})();	// Execute hidden-scope code




