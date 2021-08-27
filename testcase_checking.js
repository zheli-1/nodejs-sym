const fs = require('fs');

var dirname = '/home/zheli/crete-run-scripts/dispatch/2021-Mar-30_13.59.38.xml/pure-testcase-data/';

fs.readdir(dirname, (err, files) => {
    if (err)
        console.log(err);
    else {
        console.log("\n Current directory filenames:");
        var readFiles = function (index) {
            if (index == files.length) {
                console.log("Done reading all the files.");
            }
            else {

                // For each file we use readFile() to get 
                // the contents of the file 
                var full_path_file = dirname + files[index];
                console.log("path_file:" + files[index] + " " + "index is " + index);
                fs.readFile(full_path_file, function (err, data) {
                    if (err) {
                        console.log("Error reading the file", err);
                    }
                    else {
                        var data_str = data.toString();
                        var raw_array = data_str.split("\n");
                        for (var i = 0; i < raw_array.length; i++) {

                            // var raw_end = raw_array[i].length;
                            // var final_str = raw_array[i].slice(raw_end - 11, raw_end);
                            var final_str = raw_array[i];
                            // console.log("final_str length is "+final_str.length);
                            console.log('final_str:' + final_str);

                        }

                        readFiles(index + 1);
                    }
                });
            }
        };
        readFiles(0);
    }
});