const fs = require('fs');
const path = require('path');

var packagepath = "/home/zheli/node-v8-workers/validator-benchmark/node_modules/";

const dirs_files = fs.readdirSync(packagepath);

for (var i = 0; i < dirs_files.length; i++) {
    if (dirs_files[i].includes('@') || dirs_files[i].includes('.')) {
    }
    else {
        var dir_path = path.join(packagepath, dirs_files[i]);
        var json_path = dir_path + '/package.json';
        // console.log(json_path);

        var rawdata = fs.readFileSync(json_path);
        var jsonobj = JSON.parse(rawdata);
        var devDeps = jsonobj.hasOwnProperty("devDependencies");
        if (devDeps) {

            var devDep = jsonobj.devDependencies.hasOwnProperty("tape");
            if (devDep) {

                var test_folder_path1 = dir_path + '/tests';
                //console.log("test_folder_path1:"+test_xml_path1);
                //var test_xml_path1 = '/home/zheli/validator-benchmark/node_modules/tests';
                var test_folder_path2 = dir_path + '/test';
                //var test_xml_path2 = '/home/zheli/validator-benchmark/node_modules/test';

                try {
                    if (fs.existsSync(test_folder_path1)) {

                        fs.readdirSync(test_folder_path1).forEach(file => {

                            if (file.includes('.js')) {
                                var file_path = path.join(test_folder_path1, file);
                                var filename = file.split('.js')[0];
                                var xml_file_name = '/home/zheli/guest_xml_config_output/' + filename + '.xml';

                                var length = file_path.length;
                                var config_content = "<crete>\n" + "<exec>/home/zheli/node/node</exec>\n" + "<args>\n"
                                    + "<arg " + "index=\"1\" " + "size=\"" + length + "\" " + "value=\"" +file_path + "\" " + "concolic=\"false\"" + "/>\n"
                                    + "</args>\n"
                                    + "</crete>\n";

                                fs.writeFile(xml_file_name, config_content, (err) => {
                                    // throws an error, you could also catch it here
                                    if (err) throw err;

                                    // success case, the file was saved
                                    console.log('config 1 file gened.');
                                });

                                var dispatch_content = "<item>" + "/home/zheli/validator-benchmark/" + filename + ".xml" + "</item>\n";
                                fs.appendFile('/home/zheli/dispatch_items/tape_items.txt', dispatch_content, (err) => {
                                    if (err) throw err;
                                    console.log('disptach items generated.');
                                });
                            }
                        });

                        console.log("Directory exists.")
                    }

                    if (fs.existsSync(test_folder_path2)) {

                        fs.readdirSync(test_folder_path2).forEach(file => {

                            if (file.includes('.js')) {
                                var file_path = path.join(test_folder_path2, file);
                                var filename = file.split('.js')[0];
                                var xml_file_name = '/home/zheli/guest_xml_config_output/' + filename + '.xml';

                                var length = file_path.length;
                                var config_content = "<crete>\n" + "<exec>/home/zheli/node/node</exec>\n" + "<args>\n"
                                    + "<arg " + "index=\"1\" " + "size=\"" + length + "\" " + "value=\"" + file_path + "\" " + "concolic=\"false\"" + "/>\n"
                                    + "</args>\n"
                                    + "</crete>\n";

                                fs.writeFile(xml_file_name, config_content, (err) => {
                                    // throws an error, you could also catch it here
                                    if (err) throw err;

                                    // success case, the file was saved
                                    console.log('config 2 file gened!');
                                });

                                var dispatch_content = "<item>" + "/home/zheli/validator-benchmark/" + filename + ".xml" + "</item>\n";
                                fs.appendFile('/home/zheli/dispatch_items/tape_items.txt', dispatch_content, (err) => {
                                    if (err) throw err;
                                    console.log('disptach items generated.');
                                });
                            }
                        });


                    }
                } catch (e) {
                    
                    console.log("An error occurred "+e);
                }

                //console.log(dirs_files[i]);
            }
        }

    }
}