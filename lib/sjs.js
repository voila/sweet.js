var fs = require("fs");

var sweet = require("./sweet.js");

var argv = require("optimist")
            .usage("Usage: sjs [options] path/to/file.js")
            .demand(1)
            .alias('o', 'output')
            .describe('o', 'Output file path')
            .alias('watch', 'w')
            .describe('watch', 'watch a file')
            .boolean('watch')
            .alias('map', 'm')
            .describe('map', 'create a source map')
            .boolean('map')
            .argv;

exports.run = function() {
    var infile = argv._[0];
    var outfile = argv.output;
    var watch = argv.watch;
    var file = fs.readFileSync(infile, "utf8");
    var genOpts = (argv.map ?  {sourceMap: infile} : {});

	if (watch && outfile){
		fs.watch(infile, function(){
			file = fs.readFileSync(infile, "utf8");
			try {
				fs.writeFileSync(outfile, sweet.compile(file, parseOpts, genOpts), "utf8");
			} catch (e) {
				console.log(e);
			}
		});
	} else if(outfile) {
       fs.writeFileSync(outfile, sweet.compile(file, parseOpts, genOpts), "utf8");
    } else {
        console.log(sweet.compile(file, parseOpts, genOpts));
    }
};
