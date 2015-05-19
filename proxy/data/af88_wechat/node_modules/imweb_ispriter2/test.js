var ispriter=require("./src/ispriter");

//console.log(ispriter);

var conf={
        "input":  "./test/css/main.css", // input cssSource
        "output": "./test/sprite_output/css/" // output cssDist
    };
var conf={
		"replace00":false,
		//"md5len":32,
        "input": {

            /**
             * 原 cssRoot
             */
            "cssSource": ["./test/css/style2.css"]
        },
        "output": {

            /**
             * 原 cssRoot
             */
            "cssDist": ["./test/css2/"],

            /**
             * 原 imageRoot
             */
            "imageDist": "./sprite/",

            /**
             * 原 maxSize
             */
            "maxSingleSize": 160,
			"prefix":"",
            
            "margin": 3
        }
    }
//console.log(ispriter);
ispriter(conf);

//78e731027d8fd50ed642340b7c9a63b3
//f7b44cfafd5c52223d5498196c8a2e7b
//78e731027d8fd50ed642340b7c9a63b3
//f7b44cfafd5c52223d5498196c8a2e7b
//f7b44cfafd5c52223d5498196c8a2e7b
//3449c9e5e332f1dbb81505cd739fbf3f
//ca9c491ac66b2c62500882e93f3719a8
//ca9c491ac66b2c62500882e93f3719a8
//e29e130d8c436de3d2a4ce31df4358c4
//01ab253e6b8089278192b616796c5c3c