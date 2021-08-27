var randomstrinit = require("randomstring");
var randomnum = require('random');
var boolGen = require('random-boolean-generator');

// Require your NPM library
var target = require('./underscore.string');
// var target = require('./qs');

//get arguments names from any function
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    console.log(func);
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

function Expand_replay(target, functionIndex, str) {
    var properties = [];

    for (let i in target) {
        if (typeof target[i] === "function") {
            if (target[i].name != 'deprecated' && target[i].name != '') {
                // console.log('Pushing ' + target[i].name);
                properties.push(i);
            }

            // properties.push(i);
        }
        // if (typeof target[i] === "object") {
        //     console.log('pushing object ' + target[i]);
        //     Expand(target[i]);
        // }
    }

    //print property
    // console.log("properties length is " + properties.length + " functionIndex is " + functionIndex);
    // console.log(properties);


    var targetFunction = properties[functionIndex];
    console.log('Testing ' + targetFunction + ' ' + target[targetFunction] + ' targetFunction is ' + targetFunction);
    
    // Can't do a for loop without erasing the symbolic nature of all but the last variable
    // TODO Make a array with a custom getter that returns a new symbol on unknown lookups and then records it

    // var args = new Array(target[targetFunction].length);
    var arg_names = getParamNames(target[targetFunction]);

    var construct_args = new Array(arg_names.length);
    var sym_index = 0;

    for (var argsNameIndex = 0; argsNameIndex < arg_names.length; argsNameIndex++) {
        if (arg_names[argsNameIndex] == 'str') {

            sym_index = argsNameIndex;


        } else if (arg_names[argsNameIndex] == 'padStr') {

            var pad_max = 11;
            var pad_num = randomnum.int((min = 1), (max = pad_max));

            var pad_string = randomstrinit.generate({
                length: pad_num
            });
            construct_args[argsNameIndex] = pad_string;

        } else if (arg_names[argsNameIndex] == 'characters') {

            var characters = randomstrinit.generate({
                length: 1,
                charset: 'initstirng'
            });
            construct_args[argsNameIndex] = characters;

        } else if (arg_names[argsNameIndex] == 'callback') {

            construct_args[argsNameIndex] = function () { console.log('callback arguments'); };

        } else if (arg_names[argsNameIndex] == 'quoteChar') {
            construct_args[argsNameIndex] = ';';
        } else if (arg_names[argsNameIndex] == 'length') {

            var pad_max = 11;
            var pad_num = randomnum.int((min = 1), (max = pad_max));
            construct_args[argsNameIndex] = pad_num;

        } else if (arg_names[argsNameIndex] == 'options' || arg_names[argsNameIndex] == 'opts') {

            var options = { width: 2, seperator: '.', cut: false, trailingSpaces: true };
            construct_args[argsNameIndex] = options;
            
        } else if (arg_names[argsNameIndex] == 'decapitalize') {

            var swtich = boolGen.gen();
            construct_args[argsNameIndex] = swtich;
        } else if (arg_names[argsNameIndex] == 'trueValues') {

            construct_args[argsNameIndex] = true;
        } else if (arg_names[argsNameIndex] == 'falseValues') {

            construct_args[argsNameIndex] = 0;
            
        } else if (arg_names[argsNameIndex] == 'separator') {

            construct_args[argsNameIndex] = '*';
        } else if (arg_names[argsNameIndex] == 'qty') {
            construct_args[argsNameIndex] = 5;
        }


        else {
            construct_args[argsNameIndex] = 'rwer';
        }

    }

    console.log('=============starting executing functions===================');
    construct_args[sym_index] = str;
    console.log('cccaaa: '+construct_args);
    var result;
    try{
        result = target[properties[functionIndex]](construct_args);

    }catch(error){
        console.log('crete error/exception found\n');
    }
    // var result = target[properties[functionIndex]](construct_args); //(coverage 71.33% for underscore.string)
    // var result = target[targetFunction](...construct_args);
    console.log('result: '+ result);
    console.log(construct_args);
    console.log(target[properties[functionIndex]].toString());
    
    console.log('=============ending executing functions===================');
}

//prepare test case set for symbolic value
const fs = require('fs');
const readline = require('readline');

var dirname = '/home/zheli/crete-run-scripts/dispatch/2021-Mar-24_00.32.03.xml_string.underscore/pure-testcase-data/';
const symbolic_str_value = [];
fs.readdir(dirname, (err, files) => {
    if (err)
        console.log(err);
    else {
        console.log("\nCurrent directory filenames:");
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
                        var temp_one_iteration = [];
                        var data_str = data.toString();
                        var raw_array = data_str.split("\n");
                        //raw array length is the number of symbolic values you inject in one crete run
                        for (var i = 0; i < 67; i++) {

                            var raw_end = raw_array[i].length;
                            var final_str = raw_array[i].slice(raw_end - 11, raw_end);
                            // console.log("final_str length is "+final_str.length);
                            console.log('final_str:' + final_str + " i is " + i);

                            Expand_replay(target,i, final_str);

                            // temp_one_iteration.push(final_str);

                        }

                        console.log(temp_one_iteration);
                        // console.log(temp_one_iteration.length);


                        readFiles(index + 1);
                    }
                });
            }
        };
        readFiles(0);
    }
});
//directory end





/**
 * Expands an object/function to explore all properties

 * @param {any} target The object to be expanded.
 */
function Expand(target) {
    var properties = [];

    for (let i in target) {
        if (typeof target[i] === "function") {
            console.log('Pushing ' + target[i].name);
            if (target[i].name != 'deprecated') {
                properties.push(i);
            }
        }
        if (typeof target[i] === "object") {
            console.log('pushing object ' + target[i]);
            Expand(target[i]);
        }
    }

    //print property
    // console.log(properties);
    var count = 0;

    // for (var functionIndex = 0; functionIndex < properties.length; functionIndex++) {
    for (var functionIndex = 0; functionIndex < 1; functionIndex++) {

        count++;
        console.log("count:" + count);

        var targetFunction = properties[functionIndex];
        console.log('Testing ' + targetFunction + ' ' + target[targetFunction]);
        // Can't do a for loop without erasing the symbolic nature of all but the last variable
        // TODO Make a array with a custom getter that returns a new symbol on unknown lookups and then records it

        // var args = new Array(target[targetFunction].length);
        var arg_names = getParamNames(target[targetFunction]);

        var construct_args = new Array(arg_names.length);
        var sym_index = 0;
        var length = randomnum.int((min = 1), (max = 33));

        for (var argsNameIndex = 0; argsNameIndex < arg_names.length; argsNameIndex++) {
            if (arg_names[argsNameIndex] == 'str') {

                sym_index = argsNameIndex;


            } else if (arg_names[argsNameIndex] == 'padStr') {

                var pad_max = init_string.length;
                var pad_num = randomnum.int((min = 1), (max = pad_max));

                var pad_string = randomstrinit.generate({
                    length: pad_num,
                    charset: init_string
                });
                construct_args.push(pad_string);

            } else if (arg_names[argsNameIndex] == 'characters') {

                var characters = randomstrinit.generate({
                    length: 1,
                    charset: '&^%*(#@#$'
                });
                construct_args.push(characters);

            } else if (arg_names[argsNameIndex] == 'callback') {

                construct_args.push((function () { console.log('callback arguments'); }));

            } else if (arg_names[argsNameIndex] == 'quoteChar') {
                construct_args.push(';');
            } else if (arg_names[argsNameIndex] == 'length') {

                var pad_max = init_string.length;
                var pad_num = randomnum.int((min = 1), (max = pad_max));
                construct_args.push(pad_num);

            } else if (arg_names[argsNameIndex] == 'options') {

                var options = { width: 2, seperator: '.', cut: false, trailingSpaces: true };
                construct_args.push(options);
            } else if (arg_names[argsNameIndex] == 'decapitalize') {

                var swtich = boolGen.gen();
                construct_args.push(swtich);
            } else if (arg_names[argsNameIndex] == 'trueValues') {

                construct_args.push(true);
            } else if (arg_names[argsNameIndex] == 'falseValues') {

                construct_args.push(0);
            } else if (arg_names[argsNameIndex] == 'separator') {

                construct_args[argsNameIndex] = 's';
            } else if (arg_names[argsNameIndex] == 'qty') {
                fo
            }


            else {
                construct_args.push('');
            }

        }

        console.log('================================');
        var init_string = randomstrinit.generate(10);
        var con_index = sym_index;
        construct_args[con_index] = 'init_string';
            // %SymbolicExecution(construct_args[con_index]);
        target[properties[functionIndex]](construct_args);
        return 0;
        console.log('================================');
    }
}



// Creates the symbolic variable to explore all possible functions and constructing an object
// var switcher = symbolic Switcher initial -1;

// Expand(target);c
