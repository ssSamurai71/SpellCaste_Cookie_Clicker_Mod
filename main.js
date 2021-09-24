//Samurai71 mod

//define the mod name,versions, the var for it, 
if(SpellCaster === undefined) 
    var SpellCaster = {};
SpellCaster.name = 'SpellCaster Madeleine Merlin';
SpellCaster.version = '0.5';
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

        SpellCaster.autoCastSpellZeroFunction();
        CCSE.postLoadHooks.push(SpellCaster.launch.autoCastSpellZeroFunction);
    }

    SpellCaster.defaultConfig = function()
    {
        return{
            autoCastSpellZero : false
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

    }

    SpellCaster.save = function()
    {
        return JSON.stringify(SpellCaster.config);
    }

    SpellCaster.load = function(str)
    {
        var config = JSON.parse(str);
        
        SpellCaster.config.autoCastSpellZero = config.autoCastSpellZero;
    }

    //general idea for getting cost need to generalize it.
    // SpellCaster.bakedGoodsCost = function()
    // {
    //     var spellBook = Game.Objects["Wizard tower"].minigame;
    //     var spellCost = spellBook.getSpellCost(spellBook.spells["conjure baked goods"]);

    //     return spellCost;
    // }

    SpellCaster.allSpellCosts = function()
    {
        //have the wizard minigame in the function
        var spellBook = Game.Objects["Wizard tower"].minigame;
        
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
        var spellBook = Game.Objects["Wizard tower"].minigame;
        // how to acces total magic and current magic
        // var totalMagic = spellBook.magicM; magicM is total
        // var currentMagic = spellBook.magic; 

        var str = "The current amount of magic I can use is: " + Math.floor(spellBook.magic) + "\r The total amount of magic is " + spellBook.magicM;
        
        return str;
    }

    //Just click and a helper function (MAYBE). Definetly a prototype for understanding
    SpellCaster.castSpellZero = function()
    {
        var spellBook = Game.Objects["Wizard tower"].minigame;

        var spellZeroCost = SpellCaster.allSpellCosts();

        if(spellBook.magic > spellZeroCost[0])
        {
            spellBook.castSpell(spellBook.spells["conjure baked goods"]);
        }

    }

    SpellCaster.autoCastSpellZeroFunction = function()
    {
        if(SpellCaster.autoCastSpellZero == true)
        {
            var spellBook = Game.Objects["Wizard tower"].minigame;

            var spellZeroCost = SpellCaster.allSpellCosts();

            if(spellBook.magic == spellBook.magicM)
            {
                while(spellBook.magic > spellZeroCost[0])
                {
                    Game.push(SpellCaster.castSpellZero());
                }
            }
        }  
    }

    //provides desciption/ option/ info of what the mod is doing
    SpellCaster.getMenuString = function()
    {
        let menu = CCSE.MenuHelper;
        
        var spellCostAt = SpellCaster.allSpellCosts();

        var str ='<div class="listing">I, Miss Madeleine Merlin, will automatically cast spells for you. \t<3 I am currently in trainning so I can\'t cast anything right. :( </div>';
        
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
        '<div class="listing"> Cast baked goods '+ menu.ActionButton("SpellCaster.castSpellZero();", "conjure baked goods") + '</div>';
        
        str += menu.Header("Auto Cast") +
        '<div class="listing"> Auto cast baked goods' + menu.ToggleButton(SpellCaster.config,'autoCastSpellZero','autoCast', 'Auto cast ON', 'Auto cast OFF', "SpellCaster.toggle") + '</div>';
        
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
        //CCSE.postLoadHooks.push(SpellCaster.launch.autoCastSpellZeroFunction);
        
    }
}
