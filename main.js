//Samurai71's mod

//define the mod name,versions, the var for it, 
if(SpellCaster === undefined) 
    var SpellCaster = {};
SpellCaster.name = 'SpellCaster Madeleine Merlin';
SpellCaster.version = '1.5';
SpellCaster.GameVersion = '2.042';

SpellCaster.launch = function()
{
    SpellCaster.init = function()
    {
        //set loaded to true, create a backup and config.
        SpellCaster.isloaded = 1;
        SpellCaster.config = {};

        SpellCaster.config = SpellCaster.defaultConfig();
        if(CCSE.config.OtherMods.SpellCaster && !Game.modSaveData[SpellCaster.name])
            Game.modSaveData[SpellCaster.modSaveData] = JSON.stringify(CSSE.config.OtherMods);


        Game.customOptionsMenu.push(function()
        {
            CCSE.AppendCollapsibleOptionsMenu(SpellCaster.name, SpellCaster.getMenuString());
        });

        Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(SpellCaster.name, SpellCaster.version);
		});

        //brings up game notification that the mod has been loaded.
        if (Game.prefs.popups) 
            Game.Popup('SpellCaster Madeleine has awakened!');
		else 
        {
            //Game.Notify('SpellCaster summoned!', '<div style="text-align: center; front-weight: bold; color:#ffffff;">0%</div>', '', 1, 1);
            Game.Notify('SpellCaster summoned!', '', '', 6, 1);
        }

        if(SpellCaster.postLoadHooks)
        {
            for(var index = 0; index < SpellCaster.postLoadHooks.length; index++)
            {
                SpellCaster.postLoadHooks[index]();
            }
        }
    }

    SpellCaster.defaultConfig = function()
    {
        return{
            autoBakedGoods : false,
            autoHandOfFate : false,
            autoStretchTime : false,
            autoSpontaneousEdifice : false,
            autoHagglerCharm : false,
            autoCraftyPixies :false,
            autoGamblerFeverDream : false,
            autoReserrectAbomination : false,
            autoDiminishIneptitude : false
        }
    }

    SpellCaster.toggle = function(prefName, button, on, off, invert)
    {
        if(SpellCaster.config[prefName])
        {
            l(button).innerHTML = off;
            SpellCaster.config[prefName] = false;
        }
        else
        {
            l(button).innerHTML = on;
            SpellCaster.config[prefName] = true;
        }
        l(button).className = 'option' + ((SpellCaster.config[prefName]^invert) ? '' : ' off');

        setInterval(SpellCaster.autoCastBakedGoods, 360000);
        setInterval(SpellCaster.autoCastHandOfFate, 540000);
        setInterval(SpellCaster.autoCastStretchTime, 540001);
        setInterval(SpellCaster.autoSpontaneousEdifice, 600000);
        setInterval(SpellCaster.autoCastHagglerCharm, 540001);
        setInterval(SpellCaster.autoCastSummonCraftyPixies, 540001);
        setInterval(SpellCaster.autoCastGamblerFeverDream, 60000);
        setInterval(SpellCaster.autoCastResurrectAbomination, 240000);
        setInterval(SpellCaster.autoCastDiminishIneptitude, 240000);
    }

    SpellCaster.save = function()
    {
        return JSON.stringify(SpellCaster.config);
    }

    SpellCaster.load = function(str)
    {
        var config = JSON.parse(str);
        
        for(var pref in config)
        {
            SpellCaster.config[pref] = config[pref];
        }

        // SpellCaster.config.autoBakedGoods = config.autoBakedGoods;
        // SpellCaster.config.autoHandOfFate = config.autoHandOfFate;
        // SpellCaster.config.autoStretchTime = config.autoStretchTime;
        // SpellCaster.config.autoSpontaneousEdifice = config.autoSpontaneousEdifice;
        // SpellCaster.config.autoHagglerCharm = config.autoHagglerCharm;
        // SpellCaster.config.autoCraftyPixies = config.autoCraftyPixies;
        // SpellCaster.config.autoGamblerFeverDream = config.autoGamblerFeverDream;
        // SpellCaster.config.autoReserrectAbomination = config.autoReserrectAbomination;
        // SpellCaster.config.autoDiminishIneptitude = config.autoDiminishIneptitude; 
    }

    //general idea for getting cost need to generalize it.
    // SpellCaster.bakedGoodsCost = function()
    // {
    //     var spellBook = Game.Objects["Wizard tower"].minigame;
    //     var spellCost = spellBook.getSpellCost(spellBook.spells["conjure baked goods"]);

    //     return spellCost;
    // }

    //helper function to call the wizard tower minigame easier instead of writing  Game.Objects["Wizard tower"].minigame;
    SpellCaster.getMiniGame = function()
    {
        return Game.Objects["Wizard tower"].minigame;
    }

    SpellCaster.allSpellCosts = function()
    {
        //have the wizard minigame in the function
        var spellBook = SpellCaster.getMiniGame();
        
        //array to store the spell costs, another array to store spell names
        var allSpells = []; 
        var spellNames = ["conjure baked goods","hand of fate","stretch time","spontaneous edifice",'haggler\'s charm',"summon crafty pixies",'gambler\'s fever dream','resurrect abomination','diminish ineptitude'];

        for(var index = 0; index < spellNames.length; index++)
        {
            allSpells.push(spellBook.getSpellCost(spellBook.spells[spellNames[index]]));
        }

        return allSpells;
    }

    SpellCaster.showMagic = function()
    {
        var spellBook = SpellCaster.getMiniGame();
        // how to acces total magic and current magic
        // var totalMagic = spellBook.magicM; magicM is total
        // var currentMagic = spellBook.magic; 

        var str = "The current amount of magic I can use is: " + Math.floor(spellBook.magic) + "\r The total amount of magic is " + spellBook.magicM;
        
        return str;
    }

    //Just click and a helper function. Definetly a prototype for understanding. Can be made more general;
    // SpellCaster.castBakedGoods = function()
    // {
    //     var spellBook = SpellCaster.getMiniGame();

    //     var bakedGoodsCost = SpellCaster.allSpellCosts();

    //     if(spellBook.magic > bakedGoodsCost[0])
    //     {
    //         spellBook.castSpell(spellBook.spells["conjure baked goods"]);
    //     }
    // }

    //generalized function to cast each spell. 
    SpellCaster.castSpecificSpell = function(spellIndex)
    {
        //get the minigame and all the spell costs
        var spellBook = SpellCaster.getMiniGame();
        var spellCost = SpellCaster.allSpellCosts();

        var spellNames = ["conjure baked goods","hand of fate","stretch time",
        "spontaneous edifice",'haggler\'s charm',"summon crafty pixies",
        'gambler\'s fever dream','resurrect abomination','diminish ineptitude'];

        var gotName = spellNames[spellIndex];
        console.log(gotName);
        
        //check if we have sufficent magic
        if(spellBook.magic > spellCost[spellIndex])
        {
            //we are casting one spell at a time. If/else can work but i dont see more spells being added
            //so a switch statement should be good and possibly faster than if/else
            switch(spellIndex)
            {
                case 0:
                    spellBook.castSpell(spellBook.spells["conjure baked goods"]);
                    break;
                
                case 1:
                    spellBook.castSpell(spellBook.spells["hand of fate"]);
                    break;
                
                case 2:
                    spellBook.castSpell(spellBook.spells["stretch time"]);
                    break;
                
                case 3:
                    spellBook.castSpell(spellBook.spells["spontaneous edifice"]);
                    break;
                
                case 4:
                    spellBook.castSpell(spellBook.spells['haggler\'s charm']);
                    break;

                case 5:
                    spellBook.castSpell(spellBook.spells["summon crafty pixies"]);
                    break;

                case 6:
                    spellBook.castSpell(spellBook.spells['gambler\'s fever dream']);
                    break;

                case 7:
                    spellBook.castSpell(spellBook.spells['resurrect abomination']);
                    break;
                
                case 8:
                    spellBook.castSpell(spellBook.spells['diminish ineptitude']);
                    break;
            }
        }
        
    }

    //another helper function. Can also just use a switch case instead;
    SpellCaster.autoCastBakedGoods = function()
    {
        if(SpellCaster.config.autoBakedGoods == true)
        {
            // var spellBook = SpellCaster.getMiniGame();

            // if(spellBook.magic == spellBook.magicM)
            // {
                // SpellCaster.castBakedGoods();
                // console.log("Baked goods has been cast");
            // }
            SpellCaster.castSpecificSpell(0);
        }
        else
        {
            console.log("Baked goods isn't being autocast");
        }  
    }

    SpellCaster.autoCastHandOfFate = function()
    {
        if(SpellCaster.config.autoHandOfFate == true)
        {
            SpellCaster.castSpecificSpell(1);
            console.log("Hand of fate has been cast");
        }
        else
        {
            console.log("hands of fate isn't being autocast");
        }
    }
    
    SpellCaster.autoCastStretchTime = function()
    {
        if(SpellCaster.config.autoStretchTime == true)
        {
            SpellCaster.castSpecificSpell(2);
            console.log("stretch time has been cast");
        }
        else
        {
            console.log("stretch time isn't being autocast");
        }
    }

    SpellCaster.autoCastSpontaneousEdifice = function()
    {
        if(SpellCaster.config.autoSpontaneousEdifice == true)
        {
            SpellCaster.castSpecificSpell(3);
            console.log("spontaneous edifice has been cast");
        }
        else
        {
            console.log("spontaneous edifice isn't being autocast");
        }
    }

    SpellCaster.autoCastHagglerCharm = function()
    {
        if(SpellCaster.config.autoSpontaneousEdifice == true)
        {
            SpellCaster.castSpecificSpell(4);
            console.log("haggler's charm has been cast");
        }
        else
        {
            console.log("haggler's charm isn't being autocast");
        }
    }

    SpellCaster.autoCastSummonCraftyPixies = function()
    {
        if(SpellCaster.config.autoSummonCraftyPixies == true)
        {
            SpellCaster.castSpecificSpell(5);
            console.log("summon crafty pixies has been cast");
        }
        else
        {
            console.log("summon crafty pixies isn't being autocast");
        }
    }

    SpellCaster.autoCastGamblerFeverDream = function()
    {
        if(SpellCaster.config.autoGamblerFeverDream == true)
        {
            SpellCaster.castSpecificSpell(6);
            console.log("Gambler's fever dream has been cast");
        }
        else
        {
            console.log("Gambler's fever dream isn't being autocast");
        }
    }

    SpellCaster.autoCastResurrectAbomination = function()
    {
        if(SpellCaster.config.autoReserrectAbomination == true)
        {
            SpellCaster.castSpecificSpell(7);
            console.log("resurrect abomination has been cast");
        }
        else
        {
            console.log("resurrect abomination isn't being autocast");
        }
    }

    SpellCaster.autoCastDiminishIneptitude = function()
    {
        if(SpellCaster.config.autoDiminishIneptitude == true)
        {
            SpellCaster.castSpecificSpell(8);
            console.log("diminish ineptitude has been cast");
        }
        else
        {
            console.log("diminish ineptitude isn't being autocast");
        }
    }

    //provides desciption/option/info of what the mod is doing
    SpellCaster.getMenuString = function()
    {
        let menu = CCSE.MenuHelper;
        
        var spellCostAt = SpellCaster.allSpellCosts();

        var str ='<div class="listing">I, Miss Madeleine Merlin, will automatically cast spells for you. \t<3 I am only able to cast "Conjure Baked Goods" for now please wait for further ups. :( </div>';
        
        str += menu.Header("Magic Amount") +
        '<div class="listing"> \r ' + SpellCaster.showMagic() + '</div>';

        str += menu.Header("Spell Cost list") +
        '<div class="listing"> \r I am checking the cost of \"Conjure Baked Goods\" which is: ' + spellCostAt[0] + '</div>' +
        '<div class="listing"> \r I am checking the cost of \"Force the Hand of Fate\" which is: ' + spellCostAt[1] + '</div>' +
        '<div class="listing"> \r I am checking the cost of \"Stretch Time\" which is: ' + spellCostAt[2] + '</div>' +
        '<div class="listing"> \r I am checking the cost of \"Spontaneous Edifice\" which is: ' + spellCostAt[3] + '</div>' +
        '<div class="listing"> \r I am checking the cost of \"Haggler\'s Charm\" which is: ' + spellCostAt[4] + '</div>' +
        '<div class="listing"> \r I am checking the cost of \"Summon Crafty Pixies\" which is: ' + spellCostAt[5] + '</div>' +
        '<div class="listing"> \r I am checking the cost of \"Gambler\'s Fever Dream\" which is: ' + spellCostAt[6] + '</div>' + 
        '<div class="listing"> \r I am checking the cost of \"Resurrect Abomination\" which is: ' + spellCostAt[7] + '</div>' + 
        '<div class="listing"> \r I am checking the cost of \"Dimish Ineptitude\" which is: ' + spellCostAt[8] + '</div>';

        str += menu.Header("Baked Goods") +
        '<div class="listing"> Cast baked goods '+ menu.ActionButton("SpellCaster.castSpecificSpell(0);", "conjure baked goods") + '</div>';
        
        //Note: keep arg 1 and 2 as seperate names from other toggleButtons (args start from 0). It screws with other buttons.
        str += menu.Header("Auto Cast") +
        '<div class="listing"> Auto cast baked goods ' + menu.ToggleButton(SpellCaster.config,'autoBakedGoods','castBakedGoods', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';

        str += '<div class="listing"> Auto cast hands of fate ' + menu.ToggleButton(SpellCaster.config,'autoHandOfFate','castHandOfFate', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast stretch time ' + menu.ToggleButton(SpellCaster.config,'autoStretchTime','castStretchTime', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast spontaneous edifice ' + menu.ToggleButton(SpellCaster.config,'autoSpontaneousEdifice','castSpontaneousEdifice', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast haggler\'s charm  ' + menu.ToggleButton(SpellCaster.config,'autoCastHagglerCharm','castHagglerCharm', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast summon crafty pixies ' + menu.ToggleButton(SpellCaster.config,'autoSummonCraftyPixies','castSummonCraftyPixies', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast gambler\'s fever dream ' + menu.ToggleButton(SpellCaster.config,'autoGamblerFeverDream','castGamblerFeverDream', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast reserrect abomination ' + menu.ToggleButton(SpellCaster.config,'autoReserrectAbomination','ReserrectAbomination', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        str += '<div class="listing"> Auto cast diminish ineptitude ' + menu.ToggleButton(SpellCaster.config,'autoDiminishIneptitude','castDiminishIneptitude', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
        return str;
    }

    //comfirms the the mod version and registers it.
    if(CCSE.ConfirmGameVersion(SpellCaster.name, SpellCaster.version, SpellCaster.GameVersion))
    {
        Game.registerMod(SpellCaster.name, SpellCaster);
    } 
}

//check whether the mod(s) has been launched
if(!SpellCaster.isloaded)
{
    if(CCSE && CCSE.isloaded)
    {
        SpellCaster.launch();
    }
    else
    {
        if(!CCSE)
            var CCSE = {};
        if(!CCSE.postLoadHooks)
        CCSE.postLoadHooks = [];
        CCSE.postLoadHooks.push(SpellCaster.launch);
    }
}
