var randomstrinit = require("randomstring");
var randomnum = require('random');
var boolGen = require('random-boolean-generator');


const fs = require('fs');

// Require your NPM library
// var target = require('./underscore.string');
// var target = require('./qs');
// var target = require('validator');
// var target = require('string-kit');
// var target = require('string');
// var target = require('param-case');
// var target = require('47956');

var target = require('filesize');



//get arguments names from any function
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

/**
 * Expands an object/function to explore all properties
 
 * @param {any} target The object to be expanded. 
 */
function Expand(target) {
    var properties = [];

    for (let i in target) {
        console.log(target[i]);
        if (typeof target[i] === "function") {
            console.log('Pushing ' + target[i].name);
            // properties.push(i);
            //skip function with no function name 
            if (target[i].name != 'deprecated') {
                properties.push(i);
            }
        }

        //not pusing object
        // if (typeof target[i] === "object") {
        //     console.log('pushing object ' + target[i]);
        //     Expand(target[i]);
        // }
    }

    //debug print property
    console.log(properties);

    //contenct array
    // var content_array = [];
    //Hashmap key: function name, value: js content;
    var content_map = new Map();
    var null_fn_count = 0;

    for (var functionIndex = 0; functionIndex < properties.length; functionIndex++) {
        var targetFunction = properties[functionIndex];
        console.log('Testing ' + targetFunction + ' ' + target[targetFunction]);
        console.log('targetFunction ' + targetFunction);
        console.log('targetFunction name ' + target[targetFunction].name);
        console.log('target[targetFunction] ' + target[targetFunction].length);

        //constructing args for functions under test
        // var args = new Array(target[targetFunction].length);
        var arg_names = getParamNames(target[targetFunction]);
        console.log(arg_names);

        var construct_args = [];
        var sym_index = 0;
        var length = randomnum.int((min = 1), (max = 10));
        var init_string;
        for (var argsNameIndex = 0; argsNameIndex < arg_names.length; argsNameIndex++) {
            if (arg_names[argsNameIndex] == 'str') {

                sym_index = argsNameIndex;
                init_string = randomstrinit.generate({
                    length: length
                });

                construct_args[argsNameIndex] = init_string;

            } else if (arg_names[argsNameIndex] == 'padStr') {

                var pad_max = init_string.length;
                var pad_num = randomnum.int((min = 1), (max = pad_max));

                var pad_string = randomstrinit.generate({
                    length: pad_num,
                    charset: init_string
                });
                construct_args[argsNameIndex] = pad_string;

            } else if (arg_names[argsNameIndex] == 'characters') {

                var characters = randomstrinit.generate({
                    length: 1,
                    charset: '&^%*(#@#$'
                });
                construct_args[argsNameIndex] = characters;

            } else if (arg_names[argsNameIndex] == 'callback') {
                var arg_fun = function () { console.log("callback arguments"); };

                construct_args[argsNameIndex] = arg_fun;

            } else if (arg_names[argsNameIndex] == 'quoteChar') {
                construct_args[argsNameIndex] = ';';
            } else if (arg_names[argsNameIndex] == 'length') {

                var pad_max = init_string.length;
                var pad_num = randomnum.int((min = 1), (max = pad_max));
                construct_args[argsNameIndex] = pad_num;

            } else if (arg_names[argsNameIndex] == 'options') {

                // var options = { width: 2, seperator: '.', cut: false, trailingSpaces: true };
                var options = {parseFragmentIdentifier: true};

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
            } else if (arg_names[argsNameIndex] == 'pattern') {
                construct_args[argsNameIndex] =  new Object();
            }else if (arg_names[argsNameIndex] == 'modifiers') {
                construct_args[argsNameIndex] = 'g';
            }else if (arg_names[argsNameIndex] == 'locale') {
                construct_args[argsNameIndex] = 'NO';
            }


            else {
                construct_args[argsNameIndex] = 'https://foo.bar?top=foo#bar';
            }

        }
        console.log(construct_args);
        console.log(construct_args[sym_index]);
        console.log(sym_index);

        console.log('============running the function start===================');
        // construct_args[sym_index] = 'jlsdkf';
        // %SymbolicExecution(symbolic_str);
        console.log(properties[functionIndex]);
        var result;
        try{
            result = target[properties[functionIndex]](...construct_args);
        }catch(err){
            console.log('crete error/exception found:'+ err);
        }

        // result = target[properties[functionIndex]](...construct_args);
        console.log(result);
        console.log('============running the function end=====================');


        /**
         * following code will generate seperate content for a testing js file.
         */
        
        //if function name is null, we give it a name;
        var given_function_name = '';
        if(target[targetFunction].name == ''){

            if (targetFunction != ''){
                given_function_name = targetFunction;
            }else{
                given_function_name = 'test_fn_' + null_fn_count;
            }
        }

        console.log('given_function_name is '+ given_function_name);
        var function_content;
        if( given_function_name ===''){
            function_content = target[properties[functionIndex]].toString() + '\n';
        }else{
            function_content = 'var ' + given_function_name + '=';
            function_content += target[properties[functionIndex]].toString() + '\n';
        }
        

        var args_content = '[';
        for (var y = 0; y < construct_args.length; y++) {
            if (y != construct_args.length - 1) {
                if (typeof construct_args[y] === 'function') {
                    args_content += construct_args[y].toString() + ',';

                } else if (typeof construct_args[y] === "object"){
                    args_content += JSON.stringify(construct_args[y]) + ',';
                }
                
                else {
                    args_content += "'" + construct_args[y].toString() + "'" + ',';
                }

            } else {
                if (typeof construct_args[y] === 'function') {
                    args_content += construct_args[y].toString();
                } else if (typeof construct_args[y] === "object"){
                    args_content += JSON.stringify(construct_args[y]);
                } 
                
                else {
                    args_content += "'" + construct_args[y].toString() + "'";
                }
            }
        }
        args_content += ']';

        var symbolic_arg_arr = 'var args =' + args_content + ';\n';
        var symbolic_array_caller = '%SymbolicExecution(args' + '[' + sym_index + ']' + ');' + '\n';

        var caller_content;
        if( given_function_name === ''){
            caller_content = target[targetFunction].name + '(...args);' + '\n';
        }else{
            caller_content = ''+given_function_name +'';
            caller_content += target[targetFunction].name + '(...args);' + '\n';

        }
        

        var file_content = function_content + symbolic_arg_arr + symbolic_array_caller + caller_content;

        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        console.log(file_content);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

        // content_array.push(file_content);
        if( given_function_name ===''){
            content_map.set(target[targetFunction].name, file_content);
        }else{
            content_map.set(given_function_name, file_content);
        }
        
    }

    var base_path = '/home/zheli/node-lib-tests/function-file-ut-gen/';
 

    var async = require('async');
    var content_map_values = Array.from(content_map.values());
    console.log('content_map_values:'+content_map_values);
    var content_map_keys = Array.from(content_map.keys());
    console.log('content_map_keys:'+content_map_values);
    var count = 0;

    async.each(content_map_values, function (file, callback) {

        fs.writeFile(base_path + content_map_keys[count++] + '.js', file, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(file + '.js was updated.');
            }

            callback();
        });

    }, function (err) {

        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
        }
        else {
            console.log('All files have been processed successfully');
        }
    });
}



// Creates the symbolic variable to explore all possible functions and constructing an object
// var switcher = symbolic Switcher initial -1;

Expand(target);
